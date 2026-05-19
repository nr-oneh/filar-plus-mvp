import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PROTECTED = ["/dashboard", "/programa", "/seguimiento", "/perfil"]
const ADMIN_PATHS = ["/admin"]
const AUTH_ONLY = ["/login"]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // NextAuth v5 session cookie
  const sessionToken =
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value

  const isProtected = PROTECTED.some((p) => pathname.startsWith(p))
  const isAdmin = ADMIN_PATHS.some((p) => pathname.startsWith(p))
  const isAuthOnly = AUTH_ONLY.some((p) => pathname.startsWith(p))

  if ((isProtected || isAdmin) && !sessionToken) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (isAuthOnly && sessionToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/webhooks).*)"],
}
