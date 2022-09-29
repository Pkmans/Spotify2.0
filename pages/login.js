import React from "react";
import { getProviders, signIn } from "next-auth/react";

function login({ providers }) {
  return (
    <div className="flex flex-col items-center bg-black min-h-screen w-full justify-center">
      <img
        className="w-1/3 mb-8"
        src="https://www.scdn.co/i/_global/open-graph-default.png"
      />
      {Object.values(providers).map((provider) => (
        <div key={provider.id}>
          <button className="bg-[#18D860] text-white p-5 rounded-lg" 
            onClick={() => signIn(provider.id, {callbackUrl: "/"})}
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
