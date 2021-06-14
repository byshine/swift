import { io, Socket } from "socket.io-client";
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
};
