import { Socket } from "socket.io";
import { Worker, Router } from "mediasoup/lib/types";
import { Request, Response } from 'express'
import MediaSoupHelper from './utils/MediaSoupHelper'
import Peer from "./utils/peer";
import Room from "./utils/room";
import Rooms from './utils/rooms'
const config = require('./config')
const mediasoup = require('mediasoup')
const express = require('express')
const app = express()
const https = require('https');
const fs = require('fs');
const path = require('path');
const options = {
  key: fs.readFileSync(path.join(__dirname + '/ssl/server.key'), 'utf-8'),
  cert: fs.readFileSync(path.join(__dirname + '/ssl/server.crt'), 'utf-8')
};



let worker: Worker;
let mediaSoupRouter: Router;
const mediaSoupHelper = new MediaSoupHelper()

async function setUpWorker() {
  const worker = await mediaSoupHelper.createWorker({
    logLevel: config.mediasoup.worker.logLevel,
    logTags: config.mediasoup.worker.logTags,
    rtcMinPort: config.mediasoup.worker.rtcMinPort,
    rtcMaxPort: config.mediasoup.worker.rtcMaxPort,
  });

  worker.on('died', () => {
    console.error('mediasoup worker died, exiting in 2 seconds... [pid:%d]', worker.pid);
    setTimeout(() => process.exit(1), 2000);
  });
  return worker;
}

async function setUpRouter(worker: Worker, mediaCodecs: any) {
  return await mediaSoupHelper.createRouter({ mediaCodecs, worker })
}

(async () => {
  worker = await setUpWorker();
  const mediaCodecs = config.mediasoup.router.mediaCodecs;
  mediaSoupRouter = await setUpRouter(worker, mediaCodecs )
})()



const httpsServer = https.createServer(options, app)
const io = require("socket.io")(httpsServer, {
  cors: {
    origin: "http://localhost",
    methods: ["GET", "POST"]
  } 
});


httpsServer.listen(4000, () => {
    console.log('listening https ' + '4000')
})

app.get('/api/router/capabilities/', (req: Request, res: Response) => {
  return res.send(mediaSoupRouter.rtpCapabilities)
})


const rooms = new Rooms();

io.on('connection', (socket: Socket) => {

  
    const peer = new Peer(socket.id, socket.id)

    socket.on('disconnect', () => {
      console.log("Disconnected")
      const roomName = peer.getRoomName()
      console.log("Room Name", roomName)
      rooms.leaveRoom(roomName, peer)
      console.log("Rooms", rooms)
      
    })

    socket.on('getRouterRtpCapabilities', (data, callback) => {
      callback(mediaSoupRouter.rtpCapabilities)
    }); 

    socket.on('joinRoom', (roomName) => {
      console.log("Join Room initiated", roomName)
      rooms.joinRoom(roomName, peer)
      peer.setRoomName(roomName)
      console.log("Rooms", rooms)
    })
})


