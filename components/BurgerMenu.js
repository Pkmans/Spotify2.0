import React from "react";

function BurgerMenu({ toggleSideBar }) {
  return (
    <button
      type="button"
      className="text-slate-100 hover:text-slate-300 bg-transparent inline-flex"
      onClick={toggleSideBar}
    >
        <svg width="40" height="40" viewBox="0 0 25 25">
          <path
            d="M5 6h14M5 12h14M5 18h14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
    </button>
  );
}

export default BurgerMenu;
