import React from "react";
import { init } from "../utils/ws";
import { connect } from "react-redux";
import { RootState } from "../app/store";
import Peer from "../utils/Peer";

interface Props {
  peers: Peer[];
}

class Room extends React.Component<Props> {
  async componentDidMount() {
    await init();
    console.log(this.props.peers);
  }
  render() {
    return <div>Room {JSON.stringify(this.props.peers)}</div>;
  }
}

function mapStateToProps(state: RootState) {
  return { peers: state.peers.peers };
}

export default connect(mapStateToProps)(Room);
