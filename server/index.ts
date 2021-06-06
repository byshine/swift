import { createSecretKey } from "crypto";
import { Socket } from "socket.io";

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

io.on('connection', (socket: Socket) => {
    console.log("Connected")
})


