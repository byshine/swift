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
        this.peers = this.peers.filter(p => p.id !== id)
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