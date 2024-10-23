import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { message: "Un mail et un mot de passe sont requis!" },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

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

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "24h" }
    );

    const response = NextResponse.json({ message: "Connexion réussie!" });
    response.cookies.set("token", token, {
      httpOnly: false,
      maxAge: 24 * 60 * 60,
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Erreur de connexion", error);
    return NextResponse.json(
      { message: "Erreur lors de la connexion", error: String(error) },
      { status: 500 }
    );
  }
}
