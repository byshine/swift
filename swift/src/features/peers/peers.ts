import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Peer from "../../utils/Peer";

const peers: Peer[] = [];

const initialState = {
  peer_ids: [] as string[],
};

export const peersSlice = createSlice({
  name: "Swift",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    addPeer: (state, action: PayloadAction<Peer>) => {
      peers.push(action.payload);
      state.peer_ids.push(action.payload.id);
    },
    removePeer: (state, action: PayloadAction<Peer>) => {
      const peer = action.payload;
      state.peer_ids = state.peer_ids.filter((id) => id !== peer.id);
    },
  },
});

export const { addPeer, removePeer } = peersSlice.actions;

export default peersSlice.reducer;
