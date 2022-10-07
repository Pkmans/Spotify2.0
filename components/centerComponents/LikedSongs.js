import { useSession } from "next-auth/react";
import React from "react";
import { useRecoilValue } from "recoil";
import { likedSongsState } from "../../atoms/likedSongsAtom";
import Songs from "../Songs";

function LikedSongs() {
  const { data: session } = useSession();
  const likedSongs = useRecoilValue(likedSongsState);

  return (
    <>
      <section
        className={`center-header flex items-end space-x-7 bg-gradient-to-b to-[#0e0e0e] from-violet-800 text-white p-8 pt-24`}
      >
        <img
          className="album-image shadow-2xl lg:w-[12.5rem] lg:h-[12.5rem] md:w-[10.5rem] md:h-[10.5rem] 
          w-[11rem] h-[11rem]"
          src="https://image-links1.s3.us-west-2.amazonaws.com/liked-songs-300.png"
        />
        <div className="content">
          <p className="playlist-text text-sm">PLAYLIST</p>
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-6">
            Liked Songs
          </h1>
          <div className="flex space-x-2 text-sm flex-wrap items-center">
            <img className="rounded-full w-6 h-6" src={session?.user.image} />
            <p className="font-bold">{session?.user.name}</p>
            <p>∙</p>
            <p>{likedSongs?.total} songs</p>
          </div>
        </div>
      </section>

      <div>
        <Songs likedSongs={likedSongs} />
      </div>
    </>
  );
}

export default LikedSongs;
