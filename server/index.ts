import { Socket } from "socket.io";
import { Worker, Router, DtlsParameters, PipeTransport } from "mediasoup/lib/types";
import { Request, Response } from 'express'
import MediaSoupHelper from './utils/MediaSoupHelper'
import Peer from "./utils/peer";
import Rooms from './utils/rooms'
const config = require('./config')
const express = require('express')
const app = express()
const https = require('https');
const fs = require('fs');
const path = require('path');
const cors = require('cors')
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


app.use(cors())
const httpsServer = https.createServer(options, app)
const io = require("socket.io")(httpsServer, {
  cors: {
    origin: "*",
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

    const peer = new Peer(socket.id, socket.id);

    socket.on('disconnect', () => {
      const roomName = peer.getRoomName()
      socket.to(roomName).emit('peer.leaveRoom', peer)
      peer.close();
      socket.leave(roomName)
      rooms.leaveRoom(roomName, peer)
    })

    socket.on('getRouterRtpCapabilities', (data, callback) => {
      callback(mediaSoupRouter.rtpCapabilities)
    }); 

    socket.on('joinRoom', (roomName) => {
      socket.join(roomName)
      rooms.joinRoom(roomName, peer)
      peer.setRoomName(roomName)
      socket.to(roomName).emit('peer.joinRoom', peer)
    })

    socket.on('createProducerTransport', async (data, callback) => {
      const { transport, params } = await mediaSoupHelper.createWebRtcTransport(mediaSoupRouter);
      peer.addTransport(transport)
      callback(params)
    });

    type ConnectProducer = {
      id: string,
      dtlsParameters: DtlsParameters
    }

    socket.on('connectProducerTransport', async ({ id, dtlsParameters }: ConnectProducer, callback) => {
      const result = await peer.connectTransport(id, dtlsParameters)
      console.log("Connect Result", result)
      callback();
    });

    socket.on('produce', async (data, callback) => {
      const {id, kind, rtpParameters, roomName} = data;
      const producer = await peer.createProducer(id, rtpParameters, kind)
      if (producer) {
        callback({ id: producer.id });
        console.log("Produce ID", id)
        socket.to(roomName).emit('peer.producer', { producer_id: producer.id, peer_id: peer.id } )
      }
      
      //socket.broadcast.emit('peer.produce', { producer_id: producer.id, peer_id: peer_id});
    });

    socket.on('createConsumerTransport', async (data, callback) => {
      const { transport, params } = await mediaSoupHelper.createWebRtcTransport(mediaSoupRouter);
      peer.addTransport(transport)
      callback(params);
    });

    socket.on('connectConsumerTransport', async ({ id, dtlsParameters }, callback) => {
      await peer.connectTransport(id, dtlsParameters)
      callback();
    });

    socket.on('consume', async (data, callback) => {
      const { producer_id, consumer_transport_id, rtpCapabilities } = data;
      const consumer = await peer.createConsumer(consumer_transport_id, producer_id,  rtpCapabilities)
      if (consumer) {
        callback(consumer.params);
      } else {
        callback(false)
      }
    });

    socket.on('room.getPeers', async(data, callback) => {
      const { roomName } = data;
      const room = rooms.getRoom(roomName)
      if (!room) {
        callback([])
        return;
      }
      callback(room.getPeers())
    })

    socket.on('peer.getProducers', async(data, callback) => {
      
      const { roomName, peer_id } = data;
      const room = rooms.getRoom(roomName)
      if (!room) {
        callback([])
        return;
      }
      console.log("Room", room)
      console.log("peerid", peer_id)
      const peer = room.getPeer(peer_id)
      if (!peer) {
        callback([])
        return;
      }
    
      callback(Array.from(peer.producers.values()).map(p => p.id))
    })


})








