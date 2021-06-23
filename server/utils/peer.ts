import { Transport, Producer, Consumer, DtlsParameters, RtpParameters, MediaKind, RtpCapabilities } from "mediasoup/lib/types"

export default class Peer {

    id: string
    name: string
    transports: Map<string, Transport> 
    producers: Map<string, Producer> 
    consumers: Map<string, Consumer> 
    roomName: string
    
    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
        this.transports = new Map();
        this.producers = new Map();
        this.consumers = new Map();
    }

    close() {
        this.transports.forEach(transport => transport.close())
    }

    setRoomName(roomName: string) {
        this.roomName = roomName
    }

    getRoomName() {
        return this.roomName
    }
    
    addTransport(transport: Transport) {
        this.transports.set(transport.id, transport)
    }

    addProducerTransport(producer: Producer) {
        this.producers.set(producer.id, producer)
    }

    addConsumerTransport(consumer: Consumer) {
        this.consumers.set(consumer.id, consumer)
    }

    async connectTransport(transport_id: string, dtlsParameters: DtlsParameters) {
        if (!this.transports.has(transport_id)) {
            return
        }

        const transport = this.transports.get(transport_id);
        if (transport) {
            return await transport.connect({
                dtlsParameters
            });
        }
        return false;
    }

    async createProducer(producerTransportId: string, rtpParameters: RtpParameters, kind: MediaKind) {
        const transport = this.transports.get(producerTransportId)
        if (!transport) {
            return false;
        }

        const producer = await transport.produce({
            kind,
            rtpParameters
        })

        this.producers.set(producer.id, producer)

        producer.on('transportclose', function() {
            console.log(`---producer transport close--- name: ${this.name} consumer_id: ${producer.id}`)
            producer.close()
            this.producers.delete(producer.id)
            
        }.bind(this))

        return producer
    }

    async createConsumer(consumer_transport_id: string, producer_id: string, rtpCapabilities: RtpCapabilities) {
        let consumerTransport = this.transports.get(consumer_transport_id)

        if (!consumerTransport) {
            return false
        }

        let consumer : Consumer | null = null
        try {
            consumer = await consumerTransport.consume({
                producerId: producer_id,
                rtpCapabilities,
                paused: false //producer.kind === 'video',
            });
        } catch (error) {
            console.error('consume failed', error);
            return;
        }

        if (!consumer) {
            return false
        }

        if (consumer.type === 'simulcast') {
            await consumer.setPreferredLayers({
                spatialLayer: 2,
                temporalLayer: 2
            });
        }

        this.consumers.set(consumer.id, consumer)

        consumer.on('transportclose', function() {
            if (!consumer) {
                return false
            }
            console.log(`---consumer transport close--- name: ${this.name} consumer_id: ${consumer.id}`)
            this.consumers.delete(consumer.id)
        }.bind(this))

        

        return {
            consumer,
            params: {
                producerId: producer_id,
                id: consumer.id,
                kind: consumer.kind,
                rtpParameters: consumer.rtpParameters,
                type: consumer.type,
                producerPaused: consumer.producerPaused
            }
        }
    }


}