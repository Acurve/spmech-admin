import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(req: NextRequest) {
    const token = req.cookies.get("token")?.value
    const { pathname } = req.nextUrl

    const isLogin = pathname === "/login"

    if (!token && !isLogin) {
        return NextResponse.redirect(new URL("/login", req.url))
    }

    if (token && isLogin) {
        return NextResponse.redirect(new URL("/", req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}