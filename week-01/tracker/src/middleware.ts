import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const basicAuth = request.headers.get("authorization");
  const url = request.nextUrl;

  // Check for mode requests via query params
  const requestAuth = url.searchParams.get("auth") !== null;
  const requestDemo = url.searchParams.get("demo") !== null;

  // If requesting demo mode, set session cookie and redirect with session param
  if (requestDemo) {
    const response = NextResponse.redirect(new URL("/?session=start", request.url));
    // Session cookie (no maxAge) - expires when browser closes
    response.cookies.set("mode", "demo", { path: "/" });
    return response;
  }

  // If requesting auth mode, check credentials
  if (requestAuth) {
    if (basicAuth) {
      const authValue = basicAuth.split(" ")[1];
      const [user, pwd] = atob(authValue).split(":");

      const validUser = process.env.BASIC_AUTH_USER || "admin";
      const validPassword = process.env.BASIC_AUTH_PASSWORD || "password";

      if (user === validUser && pwd === validPassword) {
        const response = NextResponse.redirect(new URL("/?session=start", request.url));
        // Session cookie - expires when browser closes
        response.cookies.set("mode", "authenticated", { path: "/" });
        return response;
      }
    }

    // Auth requested but not provided or invalid - prompt
    return new NextResponse("Authentication required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Omnissiah Protocol"',
      },
    });
  }

  // Let all other requests through - Tracker component handles splash display
  // Cookie is only used for data persistence, not for skipping splash
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
