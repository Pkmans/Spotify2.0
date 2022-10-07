import React from "react";
import { useRecoilState } from "recoil";
import Lottie from "lottie-react";

import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSpotify from "../hooks/useSpotify";
import { millisToMinutesAndSeconds } from "../lib/timeConverter";
import audioBarAnimation from "../lib/audioBarAnimation.json";

function Song({ playlist, track, order, likedSongs }) {
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

  // map through likedSongs to get array of track uris
  const uris = likedSongs?.items.map((track) => track.track.uri);

  function playSong() {
    setCurrentTrackId(track.track.id);
    setIsPlaying(true);
    if (likedSongs) {
      spotifyApi.play({
        uris,
        offset: { uri: track.track.uri },
      });
    } else {
      spotifyApi.play({
        context_uri: playlist.uri,
        offset: { uri: track.track.uri },
      });
    }
  }

  return (
    <div
      className="songs grid grid-cols-12 md:grid-cols-2 text-gray-400 px-5 py-1.5 hover:bg-gray-800 rounded-md cursor-pointer"
      onClick={playSong}
    >
      <div className="flex items-center space-x-4 pr-5 col-span-11 md:col-auto">
        {/* Show Audio Bar if song playing, otherwise Track # */}
        {currentTrackId === track.track.id ? (
          isPlaying ? (
            <Lottie
              animationData={audioBarAnimation}
              className="shrink-0"
              style={{ width: 25 }}
              loop={true}
            />
          ) : (
            <p className={"w-[25px] text-right shrink-0 text-green-500"}>
              {order + 1}
            </p>
          )
        ) : (
          <p className={"w-[25px] text-right shrink-0"}>{order + 1}</p>
        )}

        <img
          className="ml-2.5 w-10 h-10"
          src={track.track.album.images?.[0]?.url}
        />

        {/* Track name Green if song playing */}
        <div className="truncate">
          <p
            className={
              currentTrackId === track.track.id
                ? "text-green-500 truncate"
                : "text-white truncate"
            }
          >
            {track.track.name}
          </p>
          <p className="truncate">{track.track.artists[0].name}</p>
        </div>
      </div>

      {/* Album Name & Duration */}
      <div className="hidden md:flex items-center justify-between ml-auto md:ml-0 ">
        <p className="hidden md:inline truncate pr-5">
          {track.track.album.name}
        </p>
        <p>{millisToMinutesAndSeconds(track.track.duration_ms)}</p>
      </div>

      <p className="md:hidden col-span-1 justify-end items-center flex">
        {millisToMinutesAndSeconds(track.track.duration_ms)}
      </p>
    </div>
  );
}

export default Song;
