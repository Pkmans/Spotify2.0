import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ChevronDownIcon } from "@heroicons/react/outline/esm";
import {shuffle} from 'lodash';
import { useRecoilState, useRecoilValue } from "recoil";

import { playlistIdState, playlistState } from "../atoms/playlistAtom";
import useSpotify from '../hooks/useSpotify';

const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
]

function Center() {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [color, setColor] = useState(null);
  const playlistId = useRecoilValue(playlistIdState);  
  const [playlist, setPlaylist] = useRecoilState(playlistState);

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [playlistId])

  useEffect(() => {
    spotifyApi.getPlaylist(playlistId)
      .then(data => {
      setPlaylist(data.body)
    })
      .catch(err => {
        console.log('Something went wrong!', err);
      }) 
  }, [spotifyApi, playlistId])

  return (
    <div className="flex-grow">
      <header className="absolute top-5 right-8">
        <div
          className="flex items-center space-x-3 bg-black text-white 
          opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2"
        >
          <img className="rounded-full w-10 h-10" src={session?.user.image} />
          <h2>{session?.user.name}</h2>
          <ChevronDownIcon className="w-5 h-5" />
        </div>
      </header>
      <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}>
        {/* <img src={session?.}> */}
      </section>
    </div>
  );
}

export default Center;
