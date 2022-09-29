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

import { useWindowSize } from "../lib/getWindowSize";
import ProgressBar from "./ProgressBar";

function Player() {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [shuffle, setShuffle] = useState(false);
  const [volume, setVolume] = useState(50);
  const { width } = useWindowSize();

  const songInfo = useSongInfo();

  // console.log("song info is", songInfo);

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

  function updateCurrentSong() {
    spotifyApi.getMyCurrentPlayingTrack().then((data) => {
      setCurrentTrackId(data.body?.item.id);
    });

    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      setIsPlaying(data.body?.is_playing);
    });
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

  function skipToPrevious() {
    fetch("https://api.spotify.com/v1/me/player/previous", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
      },
    }).then(() => {
      updateCurrentSong();
    });
  }

  function skipToNext() {
    fetch("https://api.spotify.com/v1/me/player/next", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
      },
    }).then((data) => {
      console.log(data);
      updateCurrentSong();
    });
  }

  function toggleShuffle() {
    spotifyApi.setShuffle(!shuffle);
    setShuffle((prev) => !prev);
  }

  return (
    <>
      {width <= 639 ? (
        <div className="bg-gradient-to-b from-black to-gray-900 text-gray-400 text-xs md:text-base pt-3 px-2 md:px-8">
          <div className="grid grid-cols-2">
            {/* Left */}
            <div className="flex items-center space-x-5 pl-5">
              <img
                className="w-9 h-9"
                src={songInfo?.album.images[0].url}
                alt=""
              />
              <div>
                <h3 className="text-white">{songInfo?.name}</h3>
                <p>{songInfo?.album.artists[0].name}</p>
              </div>
            </div>

            {/* Right */}
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
          </div>

          {/* Bottom */}
          <div className="grid grid-rows-2 justify-center">
            {/* Center */}
            <div className="flex space-x-5 items-center justify-center">
              <SwitchHorizontalIcon
                className={shuffle ? "button text-green-500" : "button"}
                onClick={toggleShuffle}
              />
              <RewindIcon onClick={skipToPrevious} className="button" />
              {isPlaying ? (
                <PauseIcon
                  onClick={handlePlayPause}
                  className="button w-10 h-10"
                />
              ) : (
                <PlayIcon
                  onClick={handlePlayPause}
                  className="button w-10 h-10"
                />
              )}
              <FastForwardIcon onClick={skipToNext} className="button" />
              <RefreshIcon className="button" />
            </div>

            <ProgressBar />
          </div>
        </div>
      ) : (
        <div>
          <div
            className=" bg-gradient-to-b from-black to-gray-900 text-gray-400
      grid grid-cols-3 text-xs md:text-base py-2 px-2 md:px-8"
          >
            {/* Left */}
            <div className="flex items-center space-x-5">
              <img
                className="hidden md:inline w-12 h-12"
                src={songInfo?.album.images[0].url}
                alt=""
              />
              <div className="">
                <h3 className="text-white">{songInfo?.name}</h3>
                <p>{songInfo?.album.artists[0].name}</p>
              </div>
            </div>

            <div className="grid items-center justify-center">
              {/* Center */}
              <div className="flex space-x-5 items-center justify-center">
                <SwitchHorizontalIcon
                  className="button"
                  onClick={toggleShuffle}
                />
                <RewindIcon onClick={skipToPrevious} className="button" />
                {isPlaying ? (
                  <PauseIcon
                    onClick={handlePlayPause}
                    className="button w-10 h-10"
                  />
                ) : (
                  <PlayIcon
                    onClick={handlePlayPause}
                    className="button w-10 h-10"
                  />
                )}
                <FastForwardIcon onClick={skipToNext} className="button" />
                <RefreshIcon className="button" />
              </div>

              <ProgressBar />
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
        </div>
      )}
    </>
  );
}

export default Player;
