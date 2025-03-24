import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // If no token exists, redirect to the login page
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const { pathname } = req.nextUrl;

  // Restrict ADMINISTRATEUR routes
  if (
    pathname.startsWith("/DashboardAdministrateur") &&
    token.role !== "ADMINISTRATEUR"
  ) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // Restrict UTILISATEUR routes
  if (
    pathname.startsWith("/DashboardUtilisateur") &&
    token.role !== "UTILISATEUR"
  ) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // Restrict MODERATEUR routes
  if (
    pathname.startsWith("/DashboardModerateur") &&
    token.role !== "MODERATEUR"
  ) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/DashboardAdministrateur/:path*",
    "/DashboardUtilisateur/:path*",
    "/DashboardModerateur/:path*",
  ],
};
