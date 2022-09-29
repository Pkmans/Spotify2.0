import React from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSpotify from "../hooks/useSpotify";

import { millisToMinutesAndSeconds } from "../lib/timeConverter";

function Song({ track, order }) {
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState); 

  function playSong(){
    // console.log("Playing song");
    setCurrentTrackId(track.track.id);
    setIsPlaying(true);
    spotifyApi.play({
        uris: [track.track.uri],
    })
  }

  return (
    <div className="grid grid-cols-2 text-gray-400 px-5 py-1.5 hover:bg-gray-800 rounded-md cursor-pointer"
        onClick={playSong}
    >
      <div className="flex items-center space-x-4">
        <p>{order + 1}</p>
        <img className="w-10 h-10" src={track.track.album.images[0].url} />
        <div>
          <p className="text-white w-36 lg:w-64 truncate">{track.track.name}</p>
          <p className="w-40">{track.track.artists[0].name}</p>
        </div>
      </div>

      <div className="flex items-center justify-between ml-auto md:ml-0">
        <p className="w-42 hidden md:inline truncate">{track.track.album.name}</p>
        <p className="pl-6">{millisToMinutesAndSeconds(track.track.duration_ms)}</p>
      </div>
    </div>
  );
}

export default Song;
