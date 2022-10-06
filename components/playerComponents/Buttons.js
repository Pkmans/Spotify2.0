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
import { BiShuffle } from "react-icons/bi";
import { MdRepeat, MdRepeatOne } from "react-icons/md";
import { useRecoilState } from "recoil";

import useSpotify from "../../hooks/useSpotify";
import { currentTrackIdState, isPlayingState } from "../../atoms/songAtom";
import useSongInfo from "../../hooks/useSongInfo";

function Buttons() {
  const spotifyApi = useSpotify();
  const songInfo = useSongInfo();

  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState("off");
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);

  // Initial Render
  useEffect(() => {
    // fetch if Music is currently already playing
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      if (!songInfo) {
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data.body?.is_playing);
        });
      }
    }

    // Set existing Spotify Shuffle State & Repeat Mode
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      console.log(data);
      setShuffle(data.body?.shuffle_state);
      setRepeat(data.body?.repeat_state);
    });
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
      fetchUpdatedSong();
    });
  }

  // Go to Next Track in Playlist
  function skipToNext() {
    fetch("https://api.spotify.com/v1/me/player/next", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
      },
    }).then(() => {
      fetchUpdatedSong();
    });
  }

  function fetchUpdatedSong() {
    spotifyApi
      .getMyCurrentPlayingTrack()
      .then((data) => {
        setCurrentTrackId(data.body?.item.id);
      })
  }

  // Toggle Shuffle of playlist
  function toggleShuffle() {
    spotifyApi.setShuffle(!shuffle).catch((err) => {
      console.log(err);
    });
    setShuffle((prev) => !prev);
  }

  function toggleRepeat() {
    if (repeat === "off") {
      spotifyApi.setRepeat("context");
      setRepeat("context");
    } else if (repeat === "context") {
      spotifyApi.setRepeat("track");
      setRepeat("track");
    } else if (repeat === "track") {
      spotifyApi.setRepeat("off");
      setRepeat("off");
    }
  }

  return (
    <div className="flex space-x-5 items-center justify-center">
      <BiShuffle
        className={shuffle ? "button text-green-500" : "button"}
        onClick={toggleShuffle}
      />
      <RewindIcon onClick={skipToPrevious} className="button" />
      {isPlaying ? (
        <PauseIcon onClick={handlePlayPause} className="button w-10 h-10 text-gray-200" />
      ) : (
        <PlayIcon onClick={handlePlayPause} className="button w-10 h-10 text-gray-200" />
      )}
      <FastForwardIcon onClick={skipToNext} className="button" />

      {repeat === "off" && (
        <MdRepeat className="button" onClick={toggleRepeat} />
      )}
      {repeat === "context" && (
        <MdRepeat className="button text-green-500" onClick={toggleRepeat} />
      )}
      {repeat === "track" && (
        <MdRepeatOne className="button text-green-500" onClick={toggleRepeat} />
      )}

    </div>
  );
}

export default Buttons;
