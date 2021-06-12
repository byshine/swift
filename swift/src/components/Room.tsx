import { useRef, useEffect } from "react";

const Room = (props: {
  micStream: null | MediaStream;
  videoStream: null | MediaStream;
}) => {
  const video = useRef<HTMLVideoElement | null>(null);

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
  return (
    <div>
      <video
        className="rounded-xl"
        ref={video}
        autoPlay={true}
        playsInline={true}
        muted={true}
      ></video>
    </div>
  );
};

export default Room;
