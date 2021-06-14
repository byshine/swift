import React from "react";
import { init } from "../utils/ws";

class Room extends React.Component {
  async componentDidMount() {
    await init();
  }
  render() {
    return <div>Room</div>;
  }
}

export default Room;
