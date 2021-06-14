import Room from './room'
import Peer from './peer'
import { runInThisContext } from 'vm'
export default class Rooms {

    rooms: Map<string, Room>

    constructor() {
        rooms: new Map()
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

        if (room.getNumPeers() === 0) {
            this.rooms.delete(roomName)
        }


    }
}