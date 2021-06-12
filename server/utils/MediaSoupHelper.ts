const mediasoup = require('mediasoup')
import { Worker, WorkerLogLevel, WorkerLogTag, WorkerSettings  } from "mediasoup/lib/types";

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
    
}