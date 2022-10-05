import React, { useCallback, useEffect, useState } from "react";
import { VolumeOffIcon, VolumeUpIcon } from "@heroicons/react/outline/esm";

import useSpotify from "../../hooks/useSpotify";
import { useRecoilValue } from "recoil";
import { currentTrackIdState } from "../../atoms/songAtom";
import { debounce } from "lodash";

function VolumeSlider() {
  const spotifyApi = useSpotify();

  const currentTrackId = useRecoilValue(currentTrackIdState);
  const [volume, setVolume] = useState(50);

  // Initial Render, set Volume to 50
  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      setVolume(50);
    }
  }, []);

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncedAdjustVolume(volume);
    }
  }, [volume]);

  const debouncedAdjustVolume = useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume).catch((err) => {
        console.log(err);
      });
    }, 200),
    []
  );

  return (
    <div className="flex items-center space-x-3 md:spacex-4 justify-end pr-5">
      {volume <= 0 ? (
        <VolumeOffIcon className="button" />
      ) : (
        <VolumeUpIcon onClick={() => setVolume(0)} className="button" />
      )}

      <input
        className="w-24"
        type="range"
        value={volume}
        min={0}
        max={100}
        onChange={(e) => setVolume(Number(e.target.value))}
      />
    </div>
  );
}

export default VolumeSlider;
