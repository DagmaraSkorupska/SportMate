import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const token = request.cookies.get("sb-access-token")?.value;

  // Jeśli brak tokena, a ścieżka NIE prowadzi do /auth
  if (!token && !url.pathname.startsWith("/auth")) {
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
