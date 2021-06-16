import { io, Socket } from "socket.io-client";
import { deviceHelper } from "../features/device/device";
import { store } from "../app/store";
import { addPeer } from "../features/peers/peers";
import { Device } from "mediasoup-client";
import { Transport } from "mediasoup-client/lib/Transport";
interface SocketPromise extends Socket {
  emitPromise?: Function;
}

const emitPromise = function (socket: Socket) {
  return function request(type: string, data = {}) {
    return new Promise((resolve) => {
      socket.emit(type, data, resolve);
    });
  };
};

export const init = async () => {
  const socket: SocketPromise = io("https://localhost:4000");
  socket.emitPromise = emitPromise(socket);

  socket.on("connect", () => {
    console.log("Connected");
  });

  socket.on("connect_error", (error) => {
    console.error(error);
  });

  socket.on("peer.joined", (peer) => {
    console.log("Peer joined", peer);
    store.dispatch(addPeer({ id: peer.id }));
  });

  const roomName = window.location.pathname;
  socket.emitPromise("joinRoom", roomName);

  const device = deviceHelper.getDevice();

  const transport = await socket.emitPromise("createProducerTransport", {
    forceTcp: false,
    rtpCapabilities: device.rtpCapabilities,
  });

  const producerTransport = device.createSendTransport(transport);

  producerTransport.on(
    "connect",
    async ({ dtlsParameters }, callback, errback) => {
      if (!socket.emitPromise) {
        return;
      }
      socket
        .emitPromise("connectProducerTransport", {
          dtlsParameters,
          id: producerTransport.id,
        })
        .then(callback)
        .catch(errback);
    }
  );

  producerTransport.on(
    "produce",
    async ({ kind, rtpParameters }, callback, errback) => {
      console.log("Produce");
      if (!socket.emitPromise) {
        return;
      }
      console.log("Produce ID", producerTransport.id);
      const { id } = await socket.emitPromise("produce", {
        id: producerTransport.id,
        kind,
        rtpParameters,
      });

      callback({ id });
    }
  );

  producerTransport.on("connectionstatechange", (state) => {
    switch (state) {
      case "connecting":
        console.log("Producer connecting", state);
        break;
      case "connected":
        console.log("Connected! Add stream to video here");
        break;
      case "failed":
        console.log("Producer failed");
        producerTransport.close();
        break;
      default:
        break;
    }
  });

  const videoStream = deviceHelper.getVideoStream();

  if (videoStream) {
    const track = videoStream.getVideoTracks()[0];
    const params = { track };
    const videoProducer = await producerTransport.produce(params);
  }

  const audioStream = deviceHelper.getAudioStream();
  if (audioStream) {
    const track = audioStream.getAudioTracks()[0];
    const params = { track };
    const audioProducer = await producerTransport.produce(params);
  }

  const consumerData = await socket.emitPromise("createConsumerTransport");
  const consumerTransport = device.createRecvTransport(consumerData);

  consumerTransport.on("connect", ({ dtlsParameters }, callback, errback) => {
    if (!socket.emitPromise) {
      return;
    }
    socket
      .emitPromise("connectConsumerTransport", {
        id: consumerTransport.id,
        dtlsParameters,
      })
      .then(callback)
      .catch(errback);
  });

  consumerTransport.on("connectionstatechange", async (state) => {
    switch (state) {
      case "connecting":
        console.log("Consumer transport connecting");
        break;

      case "connected":
        console.log("Consumer transport connected");
        break;

      case "failed":
        console.log("Consumer transport failed");
        transport.close();
        break;
      default:
        break;
    }
  });

  async function consume(
    transport: Transport,
    device: Device,
    producer_id: string
  ) {
    if (!socket.emitPromise) {
      return;
    }
    const { rtpCapabilities } = device;
    const data = await socket.emitPromise("consume", {
      producer_id,
      consumer_transport_id: transport.id,
      rtpCapabilities,
    });
    const { producerId, id, kind, rtpParameters } = data;

    const consumer = await transport.consume({
      id,
      producerId,
      kind,
      rtpParameters,
    });
    const stream = new MediaStream();
    stream.addTrack(consumer.track);
    return stream;
  }
};
