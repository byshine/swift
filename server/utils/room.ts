import Peer from './peer'

class Room {

    name: String
    peers: Peer[]
    capacity: Number

    constructor(name: String, peers: Peer[] = [], capacity: Number = 2) {
        this.name = name
        this.peers = peers
        this.capacity = capacity
    }

    getName() {
        return this.name
    }

    getPeers() {
        return this.peers
    }

    addPeer(peer: Peer) {
        return this.peers.push(peer)
    }

    removePeer(peer: Peer) {
        const id = peer.id
        const index = this.peers.findIndex(p => p.id === id)
        if (index > -1) {
            this.peers = this.peers.slice(index, index+1)
        }
    }

    getPeer(peer: Peer) {
        const id = peer.id
        return this.peers.find(p => p.id === id)
    }

    getNumPeers() {
        return this.peers.length;
    }


}

export default Room