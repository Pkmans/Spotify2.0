import {
  RefreshIcon,
  SwitchHorizontalIcon,
} from "@heroicons/react/outline/esm";
import {
  FastForwardIcon,
  PauseIcon,
  RewindIcon,
  PlayIcon,
  VolumeUpIcon,
} from "@heroicons/react/solid/esm";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSpotify from "../hooks/useSpotify";
import useSongInfo from "../hooks/useSongInfo";

function Player() {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50);

  const songInfo = useSongInfo();

  console.log(songInfo);

  function handleVolume(e) {
    setVolume(e.target.value);
  }

  function handlePlayPause() {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data?.body.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
      } else {
        spotifyApi.play();
        setIsPlaying(true);
      }
    });
  }

  function fetchCurrentSong() {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        console.log("Now playing: " + data?.body.item.name);
        console.log(data);
        setCurrentTrackId(data?.body.item.id);
      });

      spotifyApi.getMyCurrentPlaybackState().then((data) => {
        setIsPlaying(data?.body.is_playing);
      });
    }
  }

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();
      setVolume(50);
    }
  }, [currentTrackIdState, spotifyApi, session]);

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
        <VolumeUpIcon className="button" />
        <input
          className="w-14 md:w-28"
          type="range"
          value={volume}
          min={0}
          max={100}
          onChange={handleVolume}
        />
      </div>
    </div>
  );
}

export default Player;
