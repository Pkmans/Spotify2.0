import React from "react";
import { useRecoilState } from "recoil";
import Lottie from "lottie-react";

import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSpotify from "../hooks/useSpotify";
import { millisToMinutesAndSeconds } from "../lib/timeConverter";
import audioBarAnimation from "../lib/audioBarAnimation.json";

function Song({ playlist, track, order }) {
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

  // console.log('playlist:', playlist);

  function playSong() {
    console.log(track);
    setCurrentTrackId(track.track.id);
    setIsPlaying(true);
    spotifyApi.play({
      context_uri: playlist.uri,
      offset: { uri: track.track.uri },
    });
  }

  return (
    <div
      className="songs grid grid-cols-2 text-gray-400 px-5 py-1.5 hover:bg-gray-800 rounded-md cursor-pointer"
      onClick={playSong}
    >
      <div className="flex items-center space-x-4">
        <div className="grid grid-cols-3 items-center">
          {currentTrackId === track.track.id ? (
            <Lottie
              animationData={audioBarAnimation}
              style={{ width: 25 }}
              loop={true}
            />
          ) : (
            <p className="col-span-1 text-right ">{order + 1}</p>
          )}

          <img className="col-span-2 ml-2.5 w-10 h-10" src={track.track.album.images?.[0]?.url} />
        </div>

        <div className="w-44 md:w-58 lg:w-64">
          <p
            className={
              currentTrackId === track.track.id
                ? "text-green-500 truncate"
                : "text-white truncate"
            }
          >
            {track.track.name}
          </p>
          <p className="truncate ">{track.track.artists[0].name}</p>
        </div>
      </div>

      <div className="flex items-center justify-between ml-auto md:ml-0">
        <p className="hidden md:inline truncate">{track.track.album.name}</p>
        <p className="pl-6">
          {millisToMinutesAndSeconds(track.track.duration_ms)}
        </p>
      </div>
    </div>
  );
}

export default Song;
