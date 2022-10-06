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
      className={mobile ? ("absolute top-0 bg-black text-gray-400 p-5 text-sm border-r border-gray-900 h-screen overflow-y-scroll scrollbar-hide max-w-[50%] sm:inline-flex") :
      ("text-gray-500 p-5 text-xs lg:text-sm border-r border-gray-900 h-screen overflow-y-scroll scrollbar-hide w-[18rem] hidden sm:inline-flex")}
    >
      <div className="w-full">
        <div className={mobile ? "space-y-3 pb-4" : "space-y-3 pb-28"}>
          <button className="flex items-center space-x-2 hover:text-white w-full">
            <HomeIcon className="w-5 h-5" />
            <p>Home</p>
          </button>
          <button className="flex items-center space-x-2 hover:text-white w-full">
            <SearchIcon className="w-5 h-5" />
            <p>Search</p>
          </button>
          <button className="flex items-center space-x-2 hover:text-white w-full">
            <LibraryIcon className="w-5 h-5" />
            <p>Your Library</p>
          </button>
          <hr className="border-gray-800" />

          <button className="flex items-center space-x-2 hover:text-white w-full">
            <PlusCircleIcon className="w-5 h-5" />
            <p  className="truncate">Create Playlist</p>
          </button>
          <button className="flex items-center space-x-2 hover:text-white w-full">
            <HeartIcon className="w-5 h-5" />
            <p className="truncate">Liked Songs</p>
          </button>
          <button className="flex items-center space-x-2 hover:text-white w-full">
            <RssIcon className="w-5 h-5" />
            <p className="truncate">Your Episodes</p>
          </button>
          <hr className="border-gray-800" />

          {playlists.map((playlist) => (
            <p
              key={playlist.id}
              onClick={() => setPlaylistId(playlist.id)}
              className="cursor-pointer hover:text-white truncate"
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
