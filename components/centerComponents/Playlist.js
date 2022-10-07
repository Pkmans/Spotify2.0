import React from "react";

import { millisToHoursAndMinutesAndSeconds } from "../../lib/timeConverter";
import Songs from "../Songs";

function Playlist({ color, playlist, playlistDuration }) {

  return (
    <>
      <section
        className={`center-header flex items-end space-x-7 bg-gradient-to-b to-[#0e0e0e] ${color} text-white p-8 pt-24`}
      >
        <img
          className="album-image shadow-2xl lg:w-[12.5rem] lg:h-[12.5rem] md:w-[10.5rem] md:h-[10.5rem] 
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
    </>
  );
}

export default Playlist;
