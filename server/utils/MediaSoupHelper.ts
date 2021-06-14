const mediasoup = require('mediasoup')
import { Worker, WorkerLogLevel, WorkerLogTag, WorkerSettings, Router  } from "mediasoup/lib/types";
const config = require('../config')


export default class MediaSoupHelper {

    async createWorker(opts: WorkerSettings) {
        return await mediasoup.createWorker(opts);
    }

    async createRouter(opts: {
        worker: Worker
        mediaCodecs: any
    }) {
        return await opts.worker.createRouter({ mediaCodecs: opts.mediaCodecs })
    }

    async createWebRtcTransport(mediasoupRouter: Router) {
        const {
          maxIncomingBitrate,
          initialAvailableOutgoingBitrate
        } = config.mediasoup.webRtcTransport;
      
        const transport = await mediasoupRouter.createWebRtcTransport({
          listenIps: config.mediasoup.webRtcTransport.listenIps,
          enableUdp: true,
          enableTcp: true,
          preferUdp: true,
          initialAvailableOutgoingBitrate,
        });
        if (maxIncomingBitrate) {
          try {
            await transport.setMaxIncomingBitrate(maxIncomingBitrate);
          } catch (error) {
          }
        }
        return {
          transport,
          params: {
            id: transport.id,
            iceParameters: transport.iceParameters,
            iceCandidates: transport.iceCandidates,
            dtlsParameters: transport.dtlsParameters
          },
        };
      }
    
}