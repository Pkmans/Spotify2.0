import {getSession, useSession} from 'next-auth/react';

import Center from "../components/Center";
import Sidebar from "../components/Sidebar";
import Player from "../components/Player";


export default function Home() {
  const {data: session} = useSession();
  // console.log('home page session is', session);

  return (
    <div className='bg-black h-screen overflow-hidden'>      
      <main className="flex">
        <Sidebar />
        <Center />
      </main>
      <div className='sticky bottom-0'>
        <Player />
      </div>
    </div>
  )
}

// Get Session before client renders 
export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: { session }
  }
}