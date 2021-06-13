import { Fragment, useState } from "react";
import { motion } from "framer-motion";
//import { setMicStream, setVideoStream } from "../features/swift/swift";
import Preview from "../components/Preview";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/store";
import Room from "../components/Room";
import { loadDevice, deviceHelper } from "../features/device/device";
const Permissions = () => {
  const [mic, setMic] = useState(false);
  const [vid, setVideo] = useState(false);
  const [complete, setComplete] = useState(false);
  const [micStream, setMicStream] = useState<null | MediaStream>(null);
  const [videoStream, setVideoStream] = useState<null | MediaStream>(null);

  const joined = useSelector((state: RootState) => state.swift.joined);
  const deviceState = useSelector((state: RootState) => state.device);

  const dispatch = useDispatch();
  dispatch(loadDevice());

  const start = async () => {
    console.log("loaded?", deviceState);
    console.log(deviceHelper.getDevice());
    setMic(true);
    const micStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    setMicStream(micStream);
    setMic(false);
    setVideo(true);
    const vidStream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    setVideoStream(vidStream);
    setVideo(false);

    setComplete(true);
  };

  const Disclaimer = () => {
    return (
      <Fragment>
        <div className="text-gray-300 text-xl">
          We will ask permissions for your microphone & video
        </div>
        <button
          onClick={start}
          className="bg-gray-300 mt-5 px-4 py-2 rounded-sm"
        >
          Get Started
        </button>
      </Fragment>
    );
  };

  const MicPermissions = () => {
    return (
      <Fragment>
        <motion.div
          animate={{ opacity: 1, transition: { duration: 1 } }}
          initial={{ opacity: 0 }}
          className="text-gray-300 text-xl"
        >
          Asking microphone permissions..
        </motion.div>
      </Fragment>
    );
  };

  const VidPermissions = () => {
    return (
      <Fragment>
        <motion.div
          animate={{ opacity: 1, transition: { duration: 1 } }}
          initial={{ opacity: 0 }}
          className="text-gray-300 text-xl"
        >
          Asking video permissions..
        </motion.div>
      </Fragment>
    );
  };

  const variant = {
    show: {
      opacity: 1,
      transition: {
        duration: 1,
      },
    },
    hide: {
      opacity: 0,
    },
  };

  return (
    <motion.div
      variants={variant}
      animate="show"
      initial="hide"
      className="bg-gray-800 fixed inset-0 flex justify-center items-center font-serif"
    >
      <div className="flex flex-col items-center justify-center">
        Loaded? {JSON.stringify(deviceState.loaded)}
        {!joined && !complete && !mic && !vid && <Disclaimer />}
        {!joined && !complete && mic && !vid && <MicPermissions />}
        {!joined && !complete && !mic && vid && <VidPermissions />}
        {!joined && complete && (
          <Preview micStream={micStream} videoStream={videoStream} />
        )}
        {joined && (
          <Room micStream={micStream} videoStream={videoStream}></Room>
        )}
      </div>
    </motion.div>
  );
};

export default Permissions;
