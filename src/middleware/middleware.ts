
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const ROLE_HOME = {
  ADMIN: "/admin",
  SELLER: "/seller",
  USER: "/",
} as const

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("accessToken")?.value
  const userRole = request.cookies.get("userRole")?.value as
    | keyof typeof ROLE_HOME
    | undefined

  const isAdminRoute = pathname.startsWith("/admin")
  const isSellerRoute = pathname.startsWith("/seller")
  const isUserDashboardRoute = pathname.startsWith("/dashboard")
  const isCartOrCheckout =
    pathname.startsWith("/cart") || pathname.startsWith("/checkout")
  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/register")
  const isProtectedRoute =
    isAdminRoute || isSellerRoute || isUserDashboardRoute || isCartOrCheckout

  if (!token && isProtectedRoute) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (token && !userRole && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (token && userRole) {
    const home = ROLE_HOME[userRole] ?? "/"

    if (isAdminRoute && userRole !== "ADMIN") {
      return NextResponse.redirect(new URL(home, request.url))
    }

    if (isSellerRoute && userRole !== "SELLER") {
      return NextResponse.redirect(new URL(home, request.url))
    }

    if (isUserDashboardRoute && userRole !== "USER") {
      return NextResponse.redirect(new URL(home, request.url))
    }

    if (isCartOrCheckout && userRole !== "USER") {
      return NextResponse.redirect(new URL(home, request.url))
    }

    if (isAuthRoute) {
      return NextResponse.redirect(new URL(home, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/seller/:path*",
    "/dashboard/:path*",
    "/cart/:path*",
    "/checkout/:path*",
    "/login",
    "/register",
  ],
}