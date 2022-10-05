import React, { useEffect, useState } from "react";
import {
  FastForwardIcon,
  PauseIcon,
  RewindIcon,
  PlayIcon,
} from "@heroicons/react/solid/esm";
import {
  RefreshIcon,
  SwitchHorizontalIcon,
} from "@heroicons/react/outline/esm";
import { useRecoilState } from "recoil";

import useSpotify from "../../hooks/useSpotify";
import { currentTrackIdState, isPlayingState } from "../../atoms/songAtom";
import useSongInfo from "../../hooks/useSongInfo";

function Buttons() {
  const spotifyApi = useSpotify();
  const songInfo = useSongInfo();

  const [shuffle, setShuffle] = useState(false);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);

  // Initial Render, fetch if Music is currently already playing
  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      if (!songInfo) {
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data.body?.is_playing);
        });
      }
    }
  }, []);

  // Play or Pause Track
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

  // Go to Previous Track in Playlist
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

  // Go to Next Track in Playlist
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

  function updateCurrentSong() {
    spotifyApi.getMyCurrentPlayingTrack().then((data) => {
      setCurrentTrackId(data.body?.item.id);
    });

    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      setIsPlaying(data.body?.is_playing);
    });
  }

  // Toggle Shuffle of playlist
  function toggleShuffle() {
    spotifyApi.setShuffle(!shuffle).catch((err) => {
      console.log(err);
    });
    setShuffle((prev) => !prev);
  }

  return (
    <div className="flex space-x-5 items-center justify-center">
      <SwitchHorizontalIcon
        className={shuffle ? "button text-green-500" : "button"}
        onClick={toggleShuffle}
      />
      <RewindIcon onClick={skipToPrevious} className="button" />
      {isPlaying ? (
        <PauseIcon onClick={handlePlayPause} className="button w-10 h-10" />
      ) : (
        <PlayIcon onClick={handlePlayPause} className="button w-10 h-10" />
      )}
      <FastForwardIcon onClick={skipToNext} className="button" />
      <RefreshIcon className="button" />
    </div>
  );
}

export default Buttons;
