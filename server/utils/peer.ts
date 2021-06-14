import { Transport, Producer, Consumer, DtlsParameters, RtpParameters, MediaKind } from "mediasoup/lib/types"

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

    setRoomName(roomName: string) {
        this.roomName = roomName
    }

    getRoomName() {
        return this.roomName
    }
    
    addTransport(transport: Transport) {
        this.transports.set(transport.id, transport)
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

}