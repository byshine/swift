import { Socket } from "socket.io";
import { Worker, RtpParameters, Router, RtpCodecCapability} from "mediasoup/lib/types";
import MediaSoupHelper from './utils/MediaSoupHelper'
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

io.on('connection', (socket: Socket) => {

    socket.on('getRouterRtpCapabilities', (data, callback) => {
      callback(mediaSoupRouter.rtpCapabilities)
    }); 
})


