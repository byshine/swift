import { Device } from "mediasoup-client";
import { RtpCapabilities } from "mediasoup-client/lib/types";

export default class DeviceHelper {
  device: Device;
  constructor() {
    this.device = new Device();
  }

  getDevice() {
    return this.device;
  }

  async loadDevice(routerRtpCapabilities: RtpCapabilities) {
    return this.device.load({ routerRtpCapabilities });
  }
}
