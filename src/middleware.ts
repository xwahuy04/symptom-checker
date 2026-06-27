// src/middleware.ts
// Ref: https://supabase.com/docs/guides/auth/server-side/nextjs#protecting-routes
import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Ref: https://supabase.com/docs/guides/auth/server-side/nextjs#updating-cookies
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // 1. Auth Guard — redirect ke /login kalau belum login
  if (!user && (pathname.startsWith("/user") || pathname.startsWith("/admin"))) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("error", "auth_required")
    return NextResponse.redirect(url)
  }

  // 2. Role-based access control (SRS FR-01 Kriteria #2 & DDD §6.1)
  if (user) {
    const role = user.user_metadata?.role ?? "user"

    // Admin route — hanya admin
    if (pathname.startsWith("/admin") && role !== "admin") {
      const url = request.nextUrl.clone()
      url.pathname = "/user"
      return NextResponse.redirect(url)
    }

    // User route — hanya user biasa (admin diarahkan ke /admin)
    if (pathname.startsWith("/user") && role === "admin") {
      const url = request.nextUrl.clone()
      url.pathname = "/admin"
      return NextResponse.redirect(url)
    }
  }

  // 3. Redirect user yang sudah login dari /login & /register
  if (user && (pathname === "/login" || pathname === "/register")) {
    const role = user.user_metadata?.role ?? "user"
    const url = request.nextUrl.clone()
    url.pathname = role === "admin" ? "/admin" : "/user"
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

// Ref: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}