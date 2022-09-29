import React, { useEffect, useState } from "react";
import useSpotify from "../hooks/useSpotify";

function ProgressBar() {
  const spotifyApi = useSpotify();
  const [trackProgress, setTrackProgress] = useState(0);

    // useEffect(() => {
    //     setInterval(() => {
    //         updateProgress();
    //     }, 500);
    // }, [])

  function updateProgress() {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      const progress = Math.floor(
        (data.body?.progress_ms / data.body?.item.duration_ms) * 100
      );
      setTrackProgress(progress);
    });
  }
    

  return (
    <input
      className="w-56 h-[20px]"
      type="range"
      value={trackProgress}
      min={0}
      max={100}
      onChange={(e) => setTrackProgress(e.target.value)}
    />
  );
}

export default ProgressBar;
