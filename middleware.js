import { NextResponse } from "next/server";

const privateRoutes = [
  /^\/$/,
  /^\/agendamento$/,
  /^\/configuracoes$/,
  /^\/historico$/,
];

const publicRoutes = [
  /^\/login$/,
  /^\/registro$/,
  /^\/confirmar_conta$/,
  /^\/conta_confirmada$/,
];

export const config = {
  runtime: "nodejs",
  matcher: ["/((?!api|_next/static|va/|favicon|manifest).*)"],
};

async function middleware(req) {
  const reqPath = req.nextUrl.pathname;
  const token = req.cookies.get("sessionToken")?.value;

  const user = await getUser(token, req.nextUrl.origin);

  const [isPrivate, isPublic] = getPathType(reqPath);

  const { redirectRoute, clearCookies } = getInfoToResponse(
    isPrivate,
    isPublic,
    user,
    token,
  );

  if (!redirectRoute) return NextResponse.next();

  const res = NextResponse.redirect(new URL(redirectRoute, req.nextUrl.origin));

  if (clearCookies) {
    res.cookies.set("sessionToken", "", {
      expires: new Date(0),
      path: "/",
    });
  }

  return res;
}

async function getUser(token, baseUrl) {
  if (!token) return null;
  const res = await fetch(new URL(`/api/v1/sessions?token=${token}`, baseUrl));

  return res.status === 200 && (await res.json());
}

function getPathType(reqPath) {
  return [
    privateRoutes.some((regex) => regex.test(reqPath)),
    publicRoutes.some((regex) => regex.test(reqPath)),
  ];
}

function getInfoToResponse(isPrivate, isPublic, user, token) {
  let redirectRoute, clearCookies;

  if (isPublic && user) {
    redirectRoute = "/";
  }

  if (isPrivate && !user) {
    redirectRoute = "/login";
    if (token) clearCookies = true;
  }

  return { redirectRoute, clearCookies };
}

export default middleware;
