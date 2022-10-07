import { getSession } from "next-auth/react";

import Center from "../components/Center";
import Sidebar from "../components/Sidebar";
import Player from "../components/Player";
import { useState } from "react";

export default function Home() {
  const [showSideBar, setShowSideBar] = useState(false);

  function toggleSideBar() {
    setShowSideBar((prev) => !prev);
  }

  return (
    <div className="bg-black h-screen overflow-hidden">
      <main className="flex">
        <Sidebar />
        <Center showSideBar={showSideBar} toggleSideBar={toggleSideBar} />
      </main>
      <div
        className={showSideBar ? "sticky bottom-0 blur-sm" : "sticky bottom-0"}
      >
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
