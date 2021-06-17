import { io, Socket } from "socket.io-client";
import { deviceHelper } from "../features/device/device";
import { store } from "../app/store";
import { addPeer, Peer } from "../features/peers/peers";
import { Device } from "mediasoup-client";
import { Transport, Producer } from "mediasoup-client/lib/types";

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
        roomName,
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
  ): Promise<MediaStreamTrack | null> {
    if (!socket.emitPromise) {
      return Promise.reject(null);
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
    return consumer.track;
  }

  let peers = await socket.emitPromise("room.getPeers", {
    roomName,
  });
  peers = peers.filter((p: Peer) => p.id !== socket.id);
  for (let i = 0; i < peers.length; i++) {
    const peer_id = peers[i].id;
    const producers = await socket.emitPromise("peer.getProducers", {
      roomName,
      peer_id,
    });

    let stream = null;
    if (producers.length > 0) {
      stream = new MediaStream();
      for (let k = 0; k < producers.length; k++) {
        const track = await consume(consumerTransport, device, producers[k]);
        if (track) {
          stream.addTrack(track);
        }
      }
    }
  }

  socket.on("peer.producer", (data) => {
    console.log("peer joined", data);
  });
};
