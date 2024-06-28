import React from "react";
import Webcam from "react-webcam";

export default function Camera({
  audio,
  height,
  width,
  screenshotFormat,
  videoConstraints
}) {
  return (
    <Webcam
      audio={audio}
      height={height}
      screenshotFormat={screenshotFormat}
      width={width}
      videoConstraints={videoConstraints}
    >
      {({ getScreenshot }) => (
        <button
          onClick={() => {
            const imageSrc = getScreenshot();
          }}
        >
          Capture photo
        </button>
      )}
    </Webcam>
  );
}

Camera.defaultProps = {
  audio: false,
  height: 720,
  width: 720,
  screenshotFormat: "image/jpeg",
  videoConstraints: {
    width: 1280,
    height: 720,
    facingMode: "user"
  }
};
