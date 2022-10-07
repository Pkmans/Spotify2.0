import { debounce } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import { currentTrackIdState, isPlayingState } from "../../atoms/songAtom";
import useSongInfo from "../../hooks/useSongInfo";
import useSpotify from "../../hooks/useSpotify";
import { millisToMinutesAndSeconds } from "../../lib/timeConverter";
import useInterval from "../../hooks/useInterval";

function ProgressBar() {
  const spotifyApi = useSpotify();
  const songInfo = useSongInfo();

  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [progress, setProgress] = useState(0);
  const [manualProgress, setManualProgress] = useState(0);
  const isPlaying = useRecoilValue(isPlayingState);
  const [manualUpdate, setManualUpdate] = useState(false);

  // Get initial song progress
  useEffect(() => {
    getCurrentProgress();
  }, []);

  useInterval(
    () => {
      getCurrentProgress();
    },
    isPlaying && !manualUpdate ? 1000 : null
  );

  function getCurrentProgress() {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      const progress = data.body?.progress_ms;
      setProgress(progress);

      // If progress is 0, skipToNext or skipToPrevious might have been called
      if (progress < 5000) {
        spotifyApi.getMyCurrentPlayingTrack().then((data) => {
          if (data.body?.item.id !== currentTrackId) {
            setCurrentTrackId(data.body?.item.id);
          }
        });
      }
    });
  }

  // - Extra manualProgress state used for debounce call to prevent infinite re-renders
  // - Differentiate between polling updates vs. user input updates
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

  // Update progress bar when user drags slider
  function handleChange(e) {
    setManualUpdate(true);

    setManualProgress(Number(e.target.value));
    setProgress(Number(e.target.value));

    setTimeout(() => {
      console.log("timeout");
      setManualUpdate(false);
    }, 200);
  }

  return (
    <div className="flex w-[100%] items-center">
      <p className="mr-2 text-sm"> {millisToMinutesAndSeconds(progress)}</p>

      <input
        className="w-[100%] h-[20px]"
        type="range"
        value={progress}
        min={0}
        max={songInfo?.duration_ms}
        onChange={handleChange}
      />

      <p className="ml-2 text-sm">
        {millisToMinutesAndSeconds(songInfo?.duration_ms)}
      </p>
    </div>
  );
}

export default ProgressBar;
