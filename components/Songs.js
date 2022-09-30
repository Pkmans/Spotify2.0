import React from "react";
import Song from "./Song";

function Songs({ playlist }) {
  return (
    <div className="py-4 px-8 pb-28 text-white">
      {playlist?.tracks.items.map((track, i) => (
        <Song key={track.track.id} track={track} order={i}/>
      ))}
    </div>
  );
}

export default Songs;
