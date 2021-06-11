import { motion } from "framer-motion";
import { useRef, useEffect } from "react";
const Preview = (props: {
  micStream: null | MediaStream;
  videoStream: null | MediaStream;
}) => {
  console.log("State", props.micStream, props.videoStream);
  const video = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (video.current !== null) {
      video.current.srcObject = props.videoStream;

      if (props.micStream !== null) {
        const videoStream = video.current.srcObject;
        const audioTracks = props.micStream.getAudioTracks();
        audioTracks.map((audioTrack) => {
          if (videoStream !== null) {
            videoStream.addTrack(audioTrack);
          }
          return true;
        });
      }
    }
  });

  return (
    <motion.div
      animate={{ opacity: 1, transition: { duration: 1 } }}
      initial={{ opacity: 0 }}
      className="text-gray-300 text-xl"
    >
      Thank you for permissions
      <video
        className="rounded-xl"
        ref={video}
        autoPlay={true}
        playsInline={true}
        muted={true}
      ></video>
      <div className="flex justify-center">
        <p className="mt-10 bg-white inline-block mx-auto px-4 py-2 rounded-md text-gray-800">
          Join Room
        </p>
      </div>
    </motion.div>
  );
};

export default Preview;
