import { ClockIcon } from "@heroicons/react/outline/esm";
import React from "react";
import Song from "./Song";

function Songs({ playlist }) {
  return (
    <div className="py-4 px-8 pb-28 text-white">

      <div className="sticky top-0 bg-black">
        <div className="grid grid-cols-2 text-gray-400 px-5 py-1.5 text-sm">
          <div className="flex items-center space-x-3">
            <p>#</p>
            <p>TITLE</p>
          </div>
          <div className="flex items-center justify-between ml-auto md:ml-0">
            <p>ALBUM</p>
            <ClockIcon className="w-5 h-5" />
          </div>
        </div>
        <hr className="mb-4 border-gray-800" />
      </div>

      {playlist?.tracks.items.map((track, i) => (
        <Song key={track.track.id} track={track} order={i} />
      ))}
    </div>
  );
}

export default Songs;
