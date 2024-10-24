import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  console.log("Début de la fonction POST");

  try {
    const { email, password } = await req.json();
    console.log("Email reçu:", email);

    if (!email || !password) {
      return NextResponse.json(
        { message: "Un mail et un mot de passe sont requis!" },
        { status: 400 }
      );
    }

    console.log("Tentative de connexion à la base de données");
    const user = await prisma.user.findUnique({ where: { email } });
    console.log("Utilisateur trouvé:", user ? "Oui" : "Non");

    if (!user) {
      return NextResponse.json(
        { message: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Informations de connexion invalides" },
        { status: 401 }
      );
    }

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "super_secret_key_123"
    );
    const token = await new SignJWT({ userId: user.id })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(secret);

    const response = NextResponse.json({
      message: "Connexion réussie!",
      isAuthenticated: true,
    });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60,
      path: "/",
      sameSite: "lax",
    });

    console.log("Cookie défini:", response.cookies.get("token"));
    return response;
  } catch (error) {
    console.error("Erreur détaillée:", error);
    return NextResponse.json(
      { message: "Erreur lors de la connexion", error: String(error) },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
