import { Device } from "mediasoup-client";
import { RtpCapabilities } from "mediasoup-client/lib/types";

export default class DeviceHelper {
  device: Device;
  audioStream: MediaStream | null = null;
  videoStream: MediaStream | null = null;
  constructor() {
    this.device = new Device();
  }

  getDevice() {
    return this.device;
  }

  async loadDevice(routerRtpCapabilities: RtpCapabilities) {
    await this.device.load({ routerRtpCapabilities });
    return this.device;
  }

  setAudioStream(stream: MediaStream) {
    this.audioStream = stream;
  }

  setVideoStream(stream: MediaStream) {
    this.videoStream = stream;
  }

  getAudioStream() {
    return this.audioStream;
  }

  getVideoStream() {
    return this.videoStream;
  }
}
