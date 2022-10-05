import { debounce } from "lodash";
import React, { useCallback, useEffect, useRef, useState } from "react";
import useSongInfo from "../hooks/useSongInfo";
import useSpotify from "../hooks/useSpotify";

function ProgressBar() {
  const spotifyApi = useSpotify();
  const songInfo = useSongInfo();

  const [progress, setProgress] = useState(0);
  // Manual Progress used to differentiate between
  // polling updates vs. user input updates
  const [manualProgress, setManualProgress] = useState(0);
  const ref = useRef(false);

  // Begin Progress Polling on initial Render
  useEffect(() => {
    if (!ref.current) {
      ref.current = true;
      return;
    }

    setInterval(() => {
      // Update Progress Bar
      spotifyApi.getMyCurrentPlaybackState().then((data) => {
        const progress = data.body?.progress_ms;
        setProgress(progress);
      });
    }, 1000);
  }, []);

  // extra manualProgress state used for debounce call.
  useEffect(() => {
    if (manualProgress > 0 && manualProgress < songInfo?.duration_ms) {
      debouncedSeekProgress(manualProgress);
    }
  }, [manualProgress]);

  const debouncedSeekProgress = useCallback(
    debounce((manualProgress) => {
      spotifyApi.seek(manualProgress).catch((err) => {
        console.log(err);
      });
    }, 200),
    []
  );

  function handleChange(e) {
    setManualProgress(Number(e.target.value));
    setProgress(Number(e.target.value));
  }

  return (
    <input
      className="w-56 h-[20px]"
      type="range"
      value={progress}
      min={0}
      max={songInfo?.duration_ms}
      onChange={handleChange}
    />
  );
}

export default ProgressBar;
