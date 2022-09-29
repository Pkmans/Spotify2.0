import React from "react";
import { getProviders, signIn } from "next-auth/react";

function login({ providers }) {
  return (
    <div className="flex flex-col items-center bg-black min-h-screen w-full justify-center">
      <img
        className="w-1/3 mb-8"
        src="https://cdn2.downdetector.com/static/uploads/logo/Spotify_Logo_RGB_Green.png"
      />
      {Object.values(providers).map((provider) => (
        <div key={provider.id}>
          <button
            className="bg-[#18D860] text-black p-4 rounded-full hover:bg-[#0a9f43] hover:scale-[1.02]
          transition transform duration-150 ease-in-out"
            onClick={() => signIn(provider.id, { callbackUrl: "/" })}
          >
            Login with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
}

export default login;

export async function getServerSideProps() {
  const providers = await getProviders();

  return {
    props: { providers },
  };
}
