import React, { useEffect } from "react";
import { useRecoilState } from "recoil";

import { currentTrackIdState } from "../../atoms/songAtom";
import useSongInfo from "../../hooks/useSongInfo";
import useSpotify from "../../hooks/useSpotify";

function TrackInfo() {
  const spotifyApi = useSpotify();
  const songInfo = useSongInfo();

  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);

  // Initial Render, fetch Current Spotify Song
  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      // Fetch Current Song
      if (!songInfo) {
        spotifyApi.getMyCurrentPlayingTrack().then((data) => {
          setCurrentTrackId(data.body?.item.id);
        });
      }
    }
  }, []);


  return (
    <div className="flex items-center space-x-5">
      <img className="w-11 h-11" src={songInfo?.album.images[0].url} alt="" />
      <div>
        <h3 className="text-white">{songInfo?.name}</h3>
        <p className="text-sm">{songInfo?.album.artists[0].name}</p>
      </div>
    </div>
  );
}

export default TrackInfo;
