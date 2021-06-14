import { Transport, Producer, Consumer } from "mediasoup/lib/types"

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

}