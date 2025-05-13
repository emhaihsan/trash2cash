import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  console.log("Middleware path:", pathname, "URL:", request.url);
  
  // Check if the path starts with /dashboard
  const isDashboardPath = pathname.startsWith("/dashboard");
  
  // Get the token from the session
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  console.log("Token exists:", !!token);

  // If the user is not authenticated and trying to access dashboard
  if (isDashboardPath && !token) {
    // Redirect to the login page without callbackUrl to avoid issues in production
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If the user is authenticated and trying to access the login page
  if (pathname === "/" && token) {
    // Redirect to the dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /fonts (inside public)
     * 4. /examples (inside public)
     * 5. all root files inside public (favicon.ico, robots.txt, etc.)
     */
    "/((?!api|_next|fonts|examples|[\\w-]+\\.\\w+).*)",
  ],
};
