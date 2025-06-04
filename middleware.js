/* eslint-disable */

import { NextResponse } from "next/server";

const publicRoutes = [
  /^\/login$/,
  /^\/registro$/,
  /^\/confirmar_conta$/,
  /^\/conta_confirmada$/,
];

export const config = {
  matcher: ["/((?!api|_next/static|va/|favicon|manifest).*)"],
};

async function middleware(req) {
  const token = req.cookies.get("sessionToken")?.value;

  const isPublic = publicRoutes.some((regex) =>
    regex.test(req.nextUrl.pathname),
  );

  if (!isPublic && !token)
    return NextResponse.redirect(new URL("/login", req.nextUrl.origin));

  if (isPublic && token)
    return NextResponse.redirect(new URL("/client", req.nextUrl.origin));

  return NextResponse.next();
}

export default middleware;
