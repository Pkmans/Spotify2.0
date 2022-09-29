import {
  RefreshIcon,
  SwitchHorizontalIcon,
  VolumeOffIcon,
} from "@heroicons/react/outline/esm";
import {
  FastForwardIcon,
  PauseIcon,
  RewindIcon,
  PlayIcon,
  VolumeUpIcon,
} from "@heroicons/react/solid/esm";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSpotify from "../hooks/useSpotify";
import useSongInfo from "../hooks/useSongInfo";
import { debounce } from "lodash";

function Player() {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50);

  const songInfo = useSongInfo();

  // console.log(songInfo);

  function handlePlayPause() {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body?.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
      } else {
        spotifyApi.play();
        setIsPlaying(true);
      }
    });
  }

  const debouncedAdjustVolume = useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume).catch((err) => {});
    }, 250),
    []
  );

  function fetchCurrentSong() {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        // console.log("Now playing: " + data.body?.item.name);
        // console.log(data);
        setCurrentTrackId(data.body?.item.id);
      });

      spotifyApi.getMyCurrentPlaybackState().then((data) => {
        setIsPlaying(data.body?.is_playing);
      });
    }
  }

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();
      setVolume(50);
    }
  }, [currentTrackIdState, spotifyApi, session]);

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncedAdjustVolume(volume);
    }
  }, [volume]);

  return (
    <div
      className="h-20 bg-gradient-to-b from-black to-gray-900 text-gray-400
      grid grid-cols-3 text-xs md:text-base px-2 md:px-8"
    >
      {/* Left */}
      <div className="flex items-center space-x-5">
        <img
          className="hidden md:inline w-12 h-12"
          src={songInfo?.album.images[0].url}
          alt=""
        />
        <div className="">
          <h3 className="text-white">{songInfo?.album.name}</h3>
          <p>{songInfo?.album.artists[0].name}</p>
        </div>
      </div>

      {/* Center */}
      <div className="flex space-x-5 items-center justify-center">
        <SwitchHorizontalIcon className="button" />
        <RewindIcon
          //  onClick={() => spotifyApi.skipToPrevious()}
          className="button"
        />
        {isPlaying ? (
          <PauseIcon onClick={handlePlayPause} className="button w-10 h-10" />
        ) : (
          <PlayIcon onClick={handlePlayPause} className="button w-10 h-10" />
        )}
        <FastForwardIcon
          //  onClick={() => spotifyApi.skipToNext()}
          className="button"
        />
        <RefreshIcon className="button" />
      </div>

      {/* Right */}
      <div className="flex items-center space-x-3 md:spacex-4 justify-end pr-5">
        {volume <= 0 ? (
          <VolumeOffIcon className="button" />
        ) : (
          <VolumeUpIcon onClick={() => setVolume(0)} className="button" />
        )}

        <input
          className="w-14 md:w-28"
          type="range"
          value={volume}
          min={0}
          max={100}
          onChange={(e) => setVolume(Number(e.target.value))}
        />
      </div>
    </div>
  );
}

export default Player;