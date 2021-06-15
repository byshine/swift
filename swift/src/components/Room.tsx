import React from "react";
import { init } from "../utils/ws";
import { connect } from "react-redux";
import { RootState } from "../app/store";
import { Peer } from "../features/peers/peers";

interface Props {
  peers: Peer[];
}

class Room extends React.Component<Props> {
  constructor(props: any) {
    super(props);
    console.log("Props", props);
  }
  async componentDidMount() {
    await init();
    console.log("Context", this.context);
  }
  render() {
    return <div>Room {JSON.stringify(this.props.peers)}</div>;
  }
}

function mapStateToProps(state: RootState) {
  return { peers: state.peers.peers };
}

export default connect(mapStateToProps)(Room);
