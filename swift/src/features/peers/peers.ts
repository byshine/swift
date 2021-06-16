import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Transport, Producer, Consumer } from "mediasoup-client/lib/types";

export interface Peer {
  id: string;
  name: string;
  transports?: Map<string, Transport>;
  producers?: Map<string, Producer>;
  consumers?: Map<string, Consumer>;
  roomName?: string;
}

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
  },
});

export const { addPeer } = peersSlice.actions;

export default peersSlice.reducer;
