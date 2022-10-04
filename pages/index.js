import { getSession, useSession } from "next-auth/react";

import Center from "../components/Center";
import Sidebar from "../components/Sidebar";
import Player from "../components/Player";
import { useState } from "react";
import { useWindowSize } from "../lib/getWindowSize";
import BurgerMenu from "../components/BurgerMenu";

export default function Home() {
  const { data: session } = useSession();
  const [showNav, setShowNav] = useState(false);
  const { width } = useWindowSize();

  function toggleSideBar() {
    setShowNav((prev) => !prev);
  }

  // console.log('home page session is', session);

  return (
    <div className="bg-black h-screen overflow-hidden">
        {/* {width <= 570 && <BurgerMenu toggleSideBar={toggleSideBar} />} */}
      <main className="flex">
        <Sidebar mobile={showNav} />
        <Center />
      </main>
      <div className="sticky bottom-0">
        <Player />
      </div>
    </div>
  );
}

// Get Session before client renders
export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: { session },
  };
}
