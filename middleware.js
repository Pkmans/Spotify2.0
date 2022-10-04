import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  console.log('middle ware function called.');

  // Token will exist if user is logged in
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const validToken = token && Date.now() < token.accessTokenExpires;
  
  const { pathname } = req.nextUrl;

  // Allow requests if the following is true
  // 1. It's a request for next-auth session & provider fetching
  // 2. if token exists
  if (pathname.includes("/api/auth") || validToken) {
    return NextResponse.next();
  }

  // Redirect to login if don't have token AND are requesting a protected route
  if (!validToken && pathname !== "/login") {
    const url = req.nextUrl.clone();
    url.pathname = "/login";

    return NextResponse.redirect(url);
  }
}

// Fixes Unexpected Token '<' bug
export const config = {
  matcher: "/",
};
