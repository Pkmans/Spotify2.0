import React from "react";
import { useWindowSize } from "../lib/getWindowSize";

import BurgerMenu from "./BurgerMenu";
import ProfileButton from "./ProfileButton";

function Navbar({toggleSideBar}) {
  const { width } = useWindowSize();


  return (
    <header
      className={
        width <= 639
          ? `sticky top-0 profile-button flex justify-between p-2 pt-1 pb-1 bg-gray-800`
          : `profile-button flex justify-end p-2 bg-gray-800` 
      }
    >
      {width <= 639 && <BurgerMenu toggleSideBar={toggleSideBar}/>}
      <ProfileButton />
    </header>
  );
}

export default Navbar;
