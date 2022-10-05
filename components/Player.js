import React from "react";

import { useWindowSize } from "../lib/getWindowSize";
import ProgressBar from "./ProgressBar";
import TrackInfo from "./playerComponents/TrackInfo";
import Buttons from "./playerComponents/Buttons";
import VolumeSlider from "./playerComponents/VolumeSlider";

function Player() {
  const { width } = useWindowSize();

  return (
    <>
      {width <= 639 ? (
        <div className="bg-gradient-to-b from-black to-gray-900 text-gray-400 text-xs md:text-base pt-3 pb-2 px-2 md:px-8">
          <div className="grid grid-cols-2">
            <TrackInfo />
            <VolumeSlider />
          </div>

          <div className="grid items-center justify-center">
            <Buttons />
            <ProgressBar />
          </div>
        </div>
      ) : (
        <div
          className=" bg-gradient-to-b from-black to-gray-900 text-gray-400
      grid grid-cols-3 text-xs md:text-base py-2 px-2 md:px-8"
        >
          <TrackInfo />

          <div className="grid items-center justify-center">
            <Buttons />
            <ProgressBar />
          </div>

          <VolumeSlider />
        </div>
      )}
    </>
  );
}

export default Player;
