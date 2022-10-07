import React, { useState, useEffect } from "react";
import { shuffle } from "lodash";
import { useRecoilState, useRecoilValue } from "recoil";

import { playlistIdState, playlistState } from "../atoms/playlistAtom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import OutsideAlerter from "../hooks/OutsideAlerter";
import { useWindowSize } from "../lib/getWindowSize";
import ProfileButton from "./ProfileButton";
import { showLikedSongsState } from "../atoms/likedSongsAtom";
import Playlist from "./centerComponents/Playlist";
import LikedSongs from "./centerComponents/LikedSongs";
import useSpotify from "../hooks/useSpotify";

const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
];

function Center({ showSideBar, toggleSideBar }) {
  const spotifyApi = useSpotify();
  const [color, setColor] = useState(null);
  const playlistId = useRecoilValue(playlistIdState);
  const { width } = useWindowSize();

  const showLikedSongs = useRecoilValue(showLikedSongsState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);
  const [playlistDuration, setPlaylistDuration] = useState(0);

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [playlistId]);

  useEffect(() => {
    let playlistDur = 0;
    playlist?.tracks.items.forEach((item) => {
      playlistDur += item.track.duration_ms;
    });

    setPlaylistDuration(playlistDur);
  }, [playlist]);

  useEffect(() => {
    spotifyApi
      .getPlaylist(playlistId)
      .then((data) => {
        setPlaylist(data.body);
      })
      .catch((err) => {
        console.log("Something went wrong!", err);
      });
  }, [spotifyApi, playlistId]);

  return (
    <div
      className={
        showSideBar
          ? "flex-grow h-screen"
          : "flex-grow h-screen overflow-y-scroll "
      }
    >
      {width <= 639 ? (
        <Navbar toggleSideBar={toggleSideBar} color={color} />
      ) : (
        <div className="absolute top-5 right-5">
          <ProfileButton />
        </div>
      )}

      {showSideBar && (
        <OutsideAlerter toggleSideBar={toggleSideBar}>
          <Sidebar mobile={showSideBar} />
        </OutsideAlerter>
      )}

      <div className={showSideBar ? "blur-sm" : ""}>
        {showLikedSongs ? (
          <LikedSongs />
        ) : (
          <Playlist color={color} playlist={playlist} playlistDuration={playlistDuration}/>
        )}
      </div>

    </div>
  );
}

export default Center;
