import { Fragment, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/store";
import { loadDevice, deviceHelper } from "../features/device/device";
const Permissions = () => {
  const [started, setStarted] = useState(false);
  const [queryAudio, setQueryAudio] = useState<Boolean | null>(null);
  const [queryVideo, setQueryVideo] = useState<Boolean | null>(null);

  //const joined = useSelector((state: RootState) => state.swift.joined);
  const deviceLoaded = useSelector((state: RootState) => state.device.loaded);

  const dispatch = useDispatch();
  dispatch(loadDevice());

  /*
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
  */
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

  const Funnel = () => {
    if (!started) {
      return <Disclaimer />;
    } else if (!deviceLoaded) {
      return <div>Configuring settings...</div>;
    } else if (queryAudio === null) {
      return <QueryAudio />;
    } else if (queryVideo === null) {
      return <div>Test Video</div>;
    } else {
      return <div>Test</div>;
    }
  };

  const QueryAudio = () => {
    useEffect(() => {
      async function askPermissions() {
        await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setQueryAudio(true);
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
        await navigator.mediaDevices.getUserMedia({
          video: true,
        });
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
