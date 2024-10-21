import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { jwtVerify } from "jose";

const prisma = new PrismaClient();

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
    const userId = Number(payload.userId);

    const budgets = await prisma.budget.findMany({
      where: { userId },
    });
    return NextResponse.json(budgets);
  } catch (error) {
    console.error("Erreur lors de la récupération des budgets:", error);
    return NextResponse.json(
      { message: "Erreur lors de la récupération des budgets" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Non autorisé, aucun token" },
      { status: 401 }
    );
  }

  try {
    const budgets = await req.json();

    // Décoder le token pour obtenir le userId
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET || "super_secret_key_123")
    );
    const userId = Number(payload.userId);

    const updatedBudgets = await Promise.all(
      budgets.map(async (budget: { category: string; amount: number }) => {
        // D'abord, on cherche si un budget existe déjà pour cette catégorie et cet utilisateur
        const existingBudget = await prisma.budget.findFirst({
          where: {
            userId: userId,
            category: budget.category,
          },
        });

        if (existingBudget) {
          // Si le budget existe, on le met à jour
          return prisma.budget.update({
            where: { id: existingBudget.id },
            data: { amount: budget.amount },
          });
        } else {
          // Si le budget n'existe pas, on le crée
          return prisma.budget.create({
            data: {
              userId,
              category: budget.category,
              amount: budget.amount,
            },
          });
        }
      })
    );

    return NextResponse.json({
      message: "Votre budget à été mis à jour avec succès",
      budgets: updatedBudgets,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour des budgets:", error);
    return NextResponse.json(
      {
        message: "Erreur lors de la mise à jour des budgets",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
