import React, { useState, useEffect } from "react";
import { shuffle } from "lodash";
import { useRecoilState, useRecoilValue } from "recoil";

import { playlistIdState, playlistState } from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";
import Songs from "./Songs";
import {
  millisToHoursAndMinutesAndSeconds,
} from "../lib/timeConverter";
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

function Center() {
  const spotifyApi = useSpotify();
  const [color, setColor] = useState(null);
  const playlistId = useRecoilValue(playlistIdState);
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

  console.log(playlist);


  return (
    <div className="flex-grow h-screen overflow-y-scroll">
      <ProfileButton />

      <section
        className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}
      >
        <img
          className="w-[12.5rem] h-[12.5rem] shadow-2xl"
          src={playlist?.images?.[0].url}
        />
        <div className="">
          <p className="text-sm">PLAYLIST</p>
          <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold mb-4">
            {playlist?.name}
          </h1>
          <p className="text-gray-400 text-xs md:text-sm xl:text-base mb-2">
            {playlist?.description}
          </p>
          <div className="flex space-x-2 text-xs flex-wrap">
            <p>{playlist?.owner.display_name}</p>
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
  );
}

export default Center;
