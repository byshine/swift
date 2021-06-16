import Room from './room'
import Peer from './peer'
export default class Rooms {

    rooms: Map<string, Room>

    constructor() {
        this.rooms = new Map()
    }

    getRoom(roomName: string) {
        return this.rooms.get(roomName)
    }

    joinRoom(roomName: string, peer: Peer) {
        if (this.rooms.has(roomName)) {
            const room = this.rooms.get(roomName)
            if (room) {
                room.addPeer(peer)
            }
        } else {
            const room = new Room(roomName);
            this.rooms.set(roomName, room);
            room.addPeer(peer)
        }
    }

    leaveRoom(roomName: string, peer: Peer) {
        
        if (!this.rooms.has(roomName)) {
            return false
        }

        const room = this.rooms.get(roomName)
        

        if (!room) {
            return false
        }

        room.removePeer(peer)
        console.log("Room", room)


        if (room.getNumPeers() === 0) {
            this.rooms.delete(roomName)
        }

    }
}