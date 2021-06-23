import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Peer from "../../utils/Peer";

export interface Peers {
  peers: Peer[];
}

const initialState: Peers = {
  peers: [],
};

export const peersSlice = createSlice({
  name: "Swift",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    addPeer: (state, action: PayloadAction<Peer>) => {
      state.peers.push(action.payload);
      console.log("Peer added", state.peers);
    },
    removePeer: (state, action: PayloadAction<Peer>) => {
      const peer = action.payload;
      state.peers = state.peers.filter((p) => p.id !== peer.id);
      console.log("Peer Removed", state.peers);
    },
    addTrack: (
      state,
      action: PayloadAction<{ track: MediaStreamTrack; peer: Peer }>
    ) => {
      console.log("Peer AddTrack");
    },
  },
});

export const { addPeer, removePeer } = peersSlice.actions;

export default peersSlice.reducer;
