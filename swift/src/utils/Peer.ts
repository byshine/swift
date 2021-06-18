import { Transport, Producer } from "mediasoup-client/lib/types";

export default class Peer {
  id: string;
  name: string;
  transports: Map<string, Transport>;
  producers: Map<string, Producer>;
  roomName: string;
  mediaStream: MediaStream;

  constructor(id: string, name: string, roomName: string) {
    this.id = id;
    this.name = name;
    this.transports = new Map();
    this.producers = new Map();
    this.roomName = roomName;
    this.mediaStream = new MediaStream();
  }

  addTrack(track: MediaStreamTrack) {
    this.mediaStream.addTrack(track);
  }

  setMediaStream(mediaStream: MediaStream) {
    this.mediaStream = mediaStream;
  }

  getMediaStream() {
    return this.mediaStream;
  }

  setRoomName(roomName: string) {
    this.roomName = roomName;
  }

  getRoomName() {
    return this.roomName;
  }

  addTransport(transport: Transport) {
    this.transports.set(transport.id, transport);
  }

  addProducerTransport(producer: Producer) {
    this.producers.set(producer.id, producer);
  }
}
