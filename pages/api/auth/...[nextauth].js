import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import spotifyApi, { LOGIN_URL } from "../../../lib/spotify";

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token) {
  try {
    spotifyApi.setAccessToken(token.accessToken);
    spotifyApi.setRefreshToken(token.refreshToken);

    const { body: refreshedToken } = await spotifyApi.refreshAccessToken();
    console.log("REFRESHED TOKEN IS: ", refreshedToken);

    return {
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000, // = 1 hour as 3600 returns from spotify API
      refreshToken: refreshedToken.refresh_token ?? token.refreshToken, // Fall back to old refresh token if no new one came back
    };
  } catch (error) {
    console.log(error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_SPOTIFY_ID,
      clientSecret: process.env.NEXT_PUBLIC_SPOTIFY_SECRET,
      authorization: LOGIN_URL,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account, user }) {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpires: Date.now() + account.expires_at * 1000,
        };
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < token.accessTokenExpires) {
        console.log("EXISTING ACCESS TOKEN IS STILL VALID");
        return token;
      }

      // Access token has expired, try to update it
      console.log("ACCESS TOKEN IS EXPIRED, REFRESHING...");
      return await refreshAccessToken(token);
    },
  },
  async session({ session, token }) {
    session.user.username = token.user.username;
    session.user.accessToken = token.accessToken;
    session.user.refreshToken = token.refreshToken;
    session.error = token.error;

    return session;
  },
};
export default NextAuth(authOptions);
