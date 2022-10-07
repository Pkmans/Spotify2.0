import { ClockIcon } from "@heroicons/react/outline/esm";
import React from "react";
import Song from "./Song";

function Songs({ playlist, likedSongs }) {

  return (
    <div className="py-4 px-8 pb-28 text-white bg-[#0e0e0e]">
      <div className="grid grid-cols-2 text-gray-400 px-5 py-1.5 text-sm">
        <div className="flex items-center space-x-3">
          <p>#</p>
          <p>TITLE</p>
        </div>
        <div className="flex items-center justify-between ml-auto md:ml-0">
          <p className="hidden md:inline">ALBUM</p>
          <ClockIcon className="w-5 h-5" />
        </div>
      </div>
      <hr className="mb-4 border-gray-800" />

      {playlist?.tracks.items.map((track, i) => (
        <Song
          key={track.track.id}
          playlist={playlist}
          track={track}
          order={i}
        />
      ))}

      

      {likedSongs?.items.map((track, i) => (
        <Song
          key={track.track.id}
          likedSongs={likedSongs}
          track={track}
          order={i}
        />
      ))}
    </div>
  );
}

export default Songs;
