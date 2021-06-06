import { io } from "socket.io-client";

export const init = () => {
  console.log("Hello World", io);
  const socket = io("https://localhost:4000");
  console.log(socket);

  socket.on("connect", async () => {
    console.log("Connected");
  });
};
