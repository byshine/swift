import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setJoined } from "../features/swift/swift";
const Preview = (props: {
  micStream: null | MediaStream;
  videoStream: null | MediaStream;
}) => {
  const video = useRef<HTMLVideoElement | null>(null);
  const [loaded, setLoaded] = useState<Boolean>(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (video.current !== null) {
      video.current.srcObject = props.videoStream;

      if (props.micStream !== null) {
        const videoStream = video.current.srcObject as MediaStream;
        const audioTracks = props.micStream.getAudioTracks();
        audioTracks.map((audioTrack: MediaStreamTrack) => {
          if (videoStream !== null) {
            videoStream.addTrack(audioTrack);
          }
          return true;
        });
      }
    }
  });

  const handlePlaying = () => {
    setLoaded(true);
  };

  const joinRoom = () => {
    dispatch(setJoined(true));
  };

  return (
    <motion.div
      animate={{ opacity: 1, transition: { duration: 1 } }}
      initial={{ opacity: 0 }}
      className="text-gray-300 text-xl"
    >
      {!loaded && <div className="text-center">Loading...</div>}
      <video
        className="rounded-xl"
        ref={video}
        autoPlay={true}
        playsInline={true}
        muted={true}
        onPlaying={handlePlaying}
      ></video>

      <div className="flex justify-center">
        <button
          onClick={joinRoom}
          className="mt-10 bg-white inline-block mx-auto px-4 py-2 rounded-md text-gray-800 cursor-pointer"
        >
          Join Room
        </button>
      </div>
    </motion.div>
  );
};

export default Preview;
