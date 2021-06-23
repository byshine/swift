import { Fragment, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/store";
import {
  loadDevice,
  queryAudio,
  queryVideo,
  deviceHelper,
} from "../features/device/device";
import { setJoined } from "../features/swift/swift";
import Room from "../components/Room";
const Permissions = () => {
  const [started, setStarted] = useState(false);
  const device = useSelector((state: RootState) => state.device);
  const joined = useSelector((state: RootState) => state.swift.joined);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadDevice());
  }, [dispatch]);

  const Disclaimer = () => {
    return (
      <Fragment>
        <div className="text-gray-300 text-xl">
          We will ask permissions for your microphone & video
        </div>
        <button
          onClick={() => {
            setStarted(true);
          }}
          className="bg-gray-300 mt-5 px-4 py-2 rounded-sm"
        >
          Get Started
        </button>
      </Fragment>
    );
  };

  const Preview = () => {
    return (
      <div className="flex flex-col items-center justify-center">
        <video muted={true} playsInline={true} autoPlay={true}></video>
        <button
          onClick={() => {
            dispatch(setJoined(true));
          }}
          className="bg-gray-100 text-gray-800 text-xl px-4 py-2 rounded-md"
        >
          Join Room
        </button>
      </div>
    );
  };

  const Funnel = () => {
    if (!started) {
      return <Disclaimer />;
    } else if (!device.loaded) {
      return <div>Configuring settings...</div>;
    } else if (device.queryAudio === null) {
      return <QueryAudio />;
    } else if (device.queryVideo === null) {
      return <QueryVideo />;
    } else if (!joined) {
      return <Preview />;
    } else {
      return <Room />;
    }
  };

  const QueryAudio = () => {
    useEffect(() => {
      async function askPermissions() {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        dispatch(queryAudio(true));
        deviceHelper.setAudioStream(stream);
      }
      askPermissions();
    });
    return (
      <div className="text-gray-300 text-xl">
        Asking microphone permissions..
      </div>
    );
  };

  const QueryVideo = () => {
    useEffect(() => {
      async function askPermissions() {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        dispatch(queryVideo(true));
        deviceHelper.setVideoStream(stream);
      }

      askPermissions();
    });
    return (
      <div className="text-gray-300 text-xl">Asking video permissions..</div>
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
        <Funnel />
      </div>
    </motion.div>
  );
};

export default Permissions;
