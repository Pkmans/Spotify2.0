import React, { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import {
  HomeIcon,
  SearchIcon,
  LibraryIcon,
  PlusCircleIcon,
  HeartIcon,
  RssIcon,
} from "@heroicons/react/outline/esm";
import useSpotify from "../hooks/useSpotify";
import { useRecoilState } from "recoil";

import { playlistIdState } from "../atoms/playlistAtom";

function Sidebar({mobile}) {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [playlists, setPlaylists] = useState([]);
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then((data) => {
        setPlaylists(data.body.items);
      });
    }
  }, [session, spotifyApi]);

  

  return (
    <div
      style={mobile && {zIndex: 1}}
      className={mobile ? ("absolute top-0 bg-black text-gray-400 p-5 text-xs lg:text-sm border-r border-gray-900 h-screen overflow-y-scroll scrollbar-hide max-w-[50%] sm:inline-flex") :
      ("text-gray-500 p-5 text-xs lg:text-sm border-r border-gray-900 h-screen overflow-y-scroll scrollbar-hide sm:max-w-[10rem] md:max-w-[12rem] lg:max-w-[15rem] hidden sm:inline-flex")}
    >
      <div>
        <div className={mobile ? "space-y-3 pb-4" : "space-y-3 pb-28"}>
          <button className="flex items-center space-x-2 hover:text-white">
            <HomeIcon className="w-5 h-5" />
            <p>Home</p>
          </button>
          <button className="flex items-center space-x-2 hover:text-white">
            <SearchIcon className="w-5 h-5" />
            <p>Search</p>
          </button>
          <button className="flex items-center space-x-2 hover:text-white">
            <LibraryIcon className="w-5 h-5" />
            <p>Your Library</p>
          </button>
          <hr className="border-gray-800" />

          <button className="flex items-center space-x-2 hover:text-white">
            <PlusCircleIcon className="w-5 h-5" />
            <p>Create Playlist</p>
          </button>
          <button className="flex items-center space-x-2 hover:text-white">
            <HeartIcon className="w-5 h-5" />
            <p>Liked Songs</p>
          </button>
          <button className="flex items-center space-x-2 hover:text-white">
            <RssIcon className="w-5 h-5" />
            <p>Your Episodes</p>
          </button>
          <hr className="border-gray-800" />

          {playlists.map((playlist) => (
            <p
              key={playlist.id}
              onClick={() => setPlaylistId(playlist.id)}
              className="cursor-pointer hover:text-white"
            >
              {playlist.name}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
