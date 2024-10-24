import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const protectedRoutes = ["/dashboard", "/transactions", "/budgets"];

export async function middleware(req: NextRequest) {
  console.log("Middleware appelé pour:", req.nextUrl.pathname);
  const token = req.cookies.get("token")?.value;

  const isProtectedRoute = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute && !token) {
    console.log("Redirection vers /login car pas de token");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (token) {
    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || "super_secret_key_123"
      );
      const { payload } = await jwtVerify(token, secret);
      console.log("Token vérifié avec succès, payload:", payload);
      return NextResponse.next();
    } catch (error) {
      console.error("Erreur de vérification du token:", error);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/transactions/:path*", "/budgets/:path*"],
};
