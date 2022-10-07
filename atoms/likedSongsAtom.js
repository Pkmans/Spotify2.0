import {atom} from "recoil";

export const showLikedSongsState = atom({
    key: "showLikedSongsState",
    default: false
})

export const likedSongsState = atom({
   key: "likedSongsState",
   default: null
})