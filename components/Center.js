import React, { useState, useEffect } from "react";
import { shuffle } from "lodash";
import { useRecoilState, useRecoilValue } from "recoil";

import { playlistIdState, playlistState } from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";
import Songs from "./Songs";
import { millisToHoursAndMinutesAndSeconds } from "../lib/timeConverter";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import OutsideAlerter from "../hooks/outsideAlerter";
import { useWindowSize } from "../lib/getWindowSize";
import ProfileButton from "./ProfileButton";

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
  const [playlist, setPlaylist] = useRecoilState(playlistState);
  const [playlistDuration, setPlaylistDuration] = useState(0);
  const { width } = useWindowSize();

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

  // console.log(playlist);

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
        <section
          className={`center-header flex items-end space-x-7 bg-gradient-to-b to-[#0e0e0e] ${color} text-white p-8 pt-24`}
        >
          <img
            className="shadow-2xl lg:w-[12.5rem] lg:h-[12.5rem] md:w-[10.5rem] md:h-[10.5rem] 
          w-[11rem] h-[11rem]"
            src={playlist?.images?.[0].url}
          />
          <div className="content">
            <p className="playlist-text text-sm">PLAYLIST</p>
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold mb-4">
              {playlist?.name}
            </h1>
            <p className="text-gray-400 text-sm md:text-base xl:text-lg mb-2">
              {playlist?.description}
            </p>
            <div className="flex space-x-2 text-sm flex-wrap">
              <p className="font-bold">{playlist?.owner.display_name}</p>
              <p>∙</p>
              <p>{playlist?.followers.total} likes</p>
              <p>∙</p>
              <p>{playlist?.tracks.total} songs</p>
              <p>∙</p>
              <p className="text-gray-400">
                {millisToHoursAndMinutesAndSeconds(playlistDuration)}
              </p>
            </div>
          </div>
        </section>

        <div>
          <Songs playlist={playlist} />
        </div>
      </div>
      {/* </div> */}
    </div>
  );
}

export default Center;
