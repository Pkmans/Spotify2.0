import React from "react";
import { useWindowSize } from "../lib/getWindowSize";

import BurgerMenu from "./BurgerMenu";
import ProfileButton from "./ProfileButton";

function Navbar({toggleSideBar, color}) {
  const { width } = useWindowSize();

  console.log(color);

  return (
    <header
      className={
        width <= 570
          ? `sticky top-0 profile-button flex justify-between p-2 bg-black`
          : `profile-button flex justify-end p-3 bg-${color}` 
      }
    >
      {width <= 570 && <BurgerMenu toggleSideBar={toggleSideBar}/>}
      <ProfileButton />
    </header>
  );
}

export default Navbar;
