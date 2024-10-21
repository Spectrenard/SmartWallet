// /api/transactions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { jwtVerify } from "jose";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Non autorisé, aucun token" },
      { status: 401 }
    );
  }

  try {
    const { amount, category } = await req.json();

    // Validation des données
    if (typeof amount !== "number" || !category) {
      return NextResponse.json(
        { message: "Données invalides" },
        { status: 400 }
      );
    }

    // Décoder le token pour obtenir le userId
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET || "super_secret_key_123")
    );
    const userId = Number(payload.userId); // Assurez-vous que userId est un nombre

    // Créer la transaction
    const transaction = await prisma.transaction.create({
      data: {
        amount,
        category,
        userId, // Lier la transaction à l'utilisateur
      },
    });

    return NextResponse.json({
      message: "Transaction créée avec succès",
      transaction,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Erreur lors de la création de la transaction",
        error: String(error),
      },
      { status: 500 }
    );
  }
}
export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Non autorisé, aucun token" },
      { status: 401 }
    );
  }

  try {
    // Décoder le token pour obtenir le userId
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET || "super_secret_key_123")
    );
    const userId = Number(payload.userId); // Assurez-vous que userId est un nombre

    // Récupérer les transactions pour cet utilisateur
    const transactions = await prisma.transaction.findMany({
      where: { userId },
    });

    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json(
      {
        message: "Erreur lors de la récupération des transactions",
        error: String(error),
      },
      { status: 500 }
    );
  }
}
export async function DELETE(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Non autorisé, aucun token" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    console.log("Body reçu:", body);

    let id = body.id;
    console.log("ID reçu:", id);

    // Convertir l'ID en nombre si c'est une chaîne
    if (typeof id === "string") {
      id = parseInt(id, 10);
    }

    // Vérification que l'ID est un nombre valide
    if (typeof id !== "number" || isNaN(id)) {
      return NextResponse.json(
        { message: "ID de transaction invalide" },
        { status: 400 }
      );
    }

    // Décoder le token pour obtenir le userId
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET || "super_secret_key_123")
    );
    const userId = payload.userId;
    console.log("UserID:", userId);

    // Vérifier si la transaction appartient à l'utilisateur
    const transaction = await prisma.transaction.findUnique({ where: { id } });
    console.log("Transaction trouvée:", transaction);

    if (!transaction) {
      return NextResponse.json(
        { message: "Transaction non trouvée" },
        { status: 404 }
      );
    }

    if (transaction.userId !== userId) {
      return NextResponse.json(
        { message: "Non autorisé à supprimer cette transaction" },
        { status: 403 }
      );
    }

    // Supprimer la transaction
    await prisma.transaction.delete({ where: { id } });

    return NextResponse.json({ message: "Transaction supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
    return NextResponse.json(
      {
        message: "Erreur lors de la suppression de la transaction",
        error: String(error),
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Non autorisé, aucun token" },
      { status: 401 }
    );
  }

  try {
    const { id, amount, category } = await req.json();

    // Vérification des données
    if (typeof id !== "number" || (amount && typeof amount !== "number")) {
      return NextResponse.json(
        { message: "Données invalides" },
        { status: 400 }
      );
    }

    // Décoder le token pour obtenir le userId
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET || "super_secret_key_123")
    );
    const userId = payload.userId;

    // Vérifier si la transaction appartient à l'utilisateur
    const transaction = await prisma.transaction.findUnique({ where: { id } });
    if (!transaction || transaction.userId !== userId) {
      return NextResponse.json(
        { message: "Transaction non trouvée ou non autorisée" },
        { status: 404 }
      );
    }

    // Mettre à jour la transaction
    const updatedTransaction = await prisma.transaction.update({
      where: { id },
      data: {
        amount: amount || transaction.amount,
        category: category || transaction.category,
      },
    });

    return NextResponse.json({
      message: "Transaction mise à jour avec succès",
      updatedTransaction,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Erreur lors de la mise à jour de la transaction",
        error: String(error),
      },
      { status: 500 }
    );
  }
}
