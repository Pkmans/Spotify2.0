import React from "react";

function BurgerMenu({ toggleSideBar }) {
  return (
    <button
      type="button"
      class="text-slate-100 hover:text-slate-300 bg-transparent inline-flex"
      onClick={toggleSideBar}
    >
        <svg width="40" height="auto" viewBox="0 0 25 25">
          <path
            d="M5 6h14M5 12h14M5 18h14"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>

      {/* <img src="https://image-links.s3.amazonaws.com/menu.png"/> */}
    </button>
  );
}

export default BurgerMenu;
