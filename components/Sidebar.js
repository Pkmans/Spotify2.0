import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  HomeIcon,
  SearchIcon,
  LibraryIcon,
  PlusCircleIcon,
  RssIcon,
} from "@heroicons/react/outline/esm";
import useSpotify from "../hooks/useSpotify";
import { useRecoilState } from "recoil";

import { playlistIdState, playlistState } from "../atoms/playlistAtom";
import { likedSongsState, showLikedSongsState } from "../atoms/likedSongsAtom";

function Sidebar({ mobile }) {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [playlists, setPlaylists] = useState([]);
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);
  const [showLikedSongs, setShowLikedSongs] = useRecoilState(showLikedSongsState);
  const [likedSongs, setLikedSongs] = useRecoilState(likedSongsState);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      // Get User's Playlists
      spotifyApi.getUserPlaylists({ limit: 40 }).then((data) => {
        console.log(data.body);
        setPlaylists(data.body.items);
      });
    }

    // Get User's Liked Songs
    spotifyApi
      .getMySavedTracks({ limit: 50 })
      .then((data) => {
        console.log(data);
        setLikedSongs(data.body);
      })
      .catch((err) => {
        console.log("Something went wrong!", err);
      });
  }, [session, spotifyApi]);

  return (
    <div
      style={mobile && { zIndex: 1 }}
      className={
        mobile
          ? "absolute top-0 bg-black font-semibold text-gray-400 p-5 text-sm border-r border-gray-900 h-screen overflow-y-scroll scrollbar-hide max-w-[50%] sm:inline-flex"
          : "font-semibold text-gray-500 p-5 text-xs lg:text-sm border-r border-gray-900 h-screen overflow-y-scroll scrollbar-hide max-w-[12rem] lg:max-w-[15rem] hidden sm:inline-flex"
      }
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
            <p className="truncate">Create Playlist</p>
          </button>
          <button className="flex items-center space-x-2 hover:text-white w-full" onClick={() => {setShowLikedSongs(true); setPlaylist(null);}}>
            <div className="w-5 h-5 rounded-sm overflow-hidden">
            <img className="scale-150 " src="https://image-links1.s3.us-west-2.amazonaws.com/liked-songs-300.png" />

            </div>
            
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
              onClick={() => {setPlaylistId(playlist.id); setShowLikedSongs(false)}}
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
