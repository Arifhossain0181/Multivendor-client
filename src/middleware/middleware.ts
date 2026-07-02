
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
const ROLE_ROUTES = {
  ADMIN: "/admin",
  SELLER: "/seller",
  USER: "/",
};

export function middleware(request: NextRequest) { 
    const { pathname } = request.nextUrl;
  //backend theke tkne ana
  const token = request.cookies.get("accessToken")?.value;
  const userRole = request.cookies.get("userRole")?.value;

  // Protected routes
  const isDashboardRoute =
    pathname.startsWith("/admin") || pathname.startsWith("/seller");
  const isCartOrCheckout =
    pathname.startsWith("/cart") || pathname.startsWith("/checkout");
     const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/register");
    const isProtectedRoute = isDashboardRoute || isCartOrCheckout;

  if(!token && isProtectedRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }
    if (token && !userRole && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Role based access control
  if (token && userRole) {
    // seller jodi admin route e access korte chay
    if (pathname.startsWith("/admin") && userRole !== "ADMIN") {
      return NextResponse.redirect(
        new URL(userRole === "ADMIN" ? "/admin" : "/", request.url),
      );
    }
    if (pathname.startsWith("/seller") && userRole !== "SELLER") {
      return NextResponse.redirect(
        new URL(userRole === "ADMIN" ? "/admin" : "/", request.url),
      );
    }
    // Cart/Checkout  USER (customer)
    if (isCartOrCheckout && userRole !== "USER") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
      if (userRole === "ADMIN")
        return NextResponse.redirect(new URL("/admin", request.url));
      if (userRole === "SELLER")
        return NextResponse.redirect(new URL("/seller", request.url));
      return NextResponse.redirect(new URL("/", request.url));
    }
    if(isAuthRoute){
      const  destination= ROLE_ROUTES[userRole as keyof typeof ROLE_ROUTES] || "/";
      return NextResponse.redirect(new URL(destination, request.url));
    }
  }
  return NextResponse.next();
}
export const config = {
  matcher: [
    '/admin/:path*',
    '/seller/:path*',
    '/cart/:path*',
    '/checkout/:path*',
    '/login',
    '/register',
  ],
};