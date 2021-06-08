import { Fragment, useState } from "react";
import { motion } from "framer-motion";
const Permissions = () => {
  const [mic, setMic] = useState(false);
  const [vid, setVideo] = useState(false);
  const [complete, setComplete] = useState(false);

  const start = async () => {
    setMic(true);
    const micStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    setMic(false);
    setVideo(true);
    const vidStream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
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

  const Done = () => {
    return (
      <Fragment>
        <motion.div
          animate={{ opacity: 1, transition: { duration: 1 } }}
          initial={{ opacity: 0 }}
          className="text-gray-300 text-xl"
        >
          Thank you for permissions
        </motion.div>
      </Fragment>
    );
  };

  return (
    <div className="bg-gray-800 fixed inset-0 flex justify-center items-center font-serif">
      <div className="flex flex-col items-center justify-center">
        {!complete && !mic && !vid && <Disclaimer />}
        {!complete && mic && !vid && <MicPermissions />}
        {!complete && !mic && vid && <VidPermissions />}
        {complete && <Done />}
      </div>
    </div>
  );
};

export default Permissions;
