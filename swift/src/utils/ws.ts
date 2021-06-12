import { io, Socket } from "socket.io-client";
import { Device } from "mediasoup-client";
import { RtpCapabilities } from "mediasoup-client/lib/types";

const emitPromise = function (socket: Socket) {
  return function request(type: string, data = {}) {
    return new Promise((resolve) => {
      socket.emit(type, data, resolve);
    });
  };
};

interface SocketPromise extends Socket {
  emitPromise?: Function;
}
let device: Device;

export const init = () => {
  const socket: SocketPromise = io("https://localhost:4000");
  socket.emitPromise = emitPromise(socket);

  socket.on("connect", async () => {
    console.log("Connected");
    //Narrow
    if (!socket.emitPromise) {
      return;
    }

    device = new Device();
    const routerRtpCapabilities = await socket.emitPromise(
      "getRouterRtpCapabilities"
    );
    await device.load({ routerRtpCapabilities });
    console.log("Device loaded", device);
  });
};
