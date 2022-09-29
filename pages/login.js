import React from "react";
import { getProviders } from "next-auth/react";

function login({ providers }) {
// console.log(Object.values(providers));

  return (
    <div>
      {/* <img
        className="w-1/3 mb-5"
        src="https://www.scdn.co/i/_global/open-graph-default.png"
      />
      {providers.map(provider => {
        <button>Login to ${provider.name}</button>
      })} */}
      login page
    </div>
  );
}

export default login;

// export async function getServerSideProps() {
//   const providers = await getProviders();

//   return {
//     props: { providers },
//   };
// }
