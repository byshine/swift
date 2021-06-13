import { io, Socket } from "socket.io-client";

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

export const init = () => {
  const socket: SocketPromise = io("https://localhost:4000");
  socket.emitPromise = emitPromise(socket);
  // Narrow
  if (!socket.emitPromise) {
    return;
  }

  socket.on("connect", async () => {
    console.log("Connected");
  });
};
