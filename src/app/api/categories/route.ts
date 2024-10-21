import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Liste prédéfinie des catégories
const predefinedCategories = [
  "Loisirs & vacances",
  "Alimentation & restaurants",
  "Achats & Shopping",
  "Logement",
  "Santé",
  "Transports",
];

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Non autorisé, aucun token" },
      { status: 401 }
    );
  }

  try {
    // Vérification du token (vous pouvez garder cette partie si vous voulez vous assurer que seuls les utilisateurs authentifiés peuvent accéder aux catégories)
    await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET || "super_secret_key_123")
    );

    // Renvoyer la liste prédéfinie des catégories
    return NextResponse.json(predefinedCategories);
  } catch (error) {
    return NextResponse.json(
      {
        message: "Erreur lors de la récupération des catégories",
        error: String(error),
      },
      { status: 500 }
    );
  }
}
