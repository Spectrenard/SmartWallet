import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Jwt } from "jsonwebtoken";
import { jwtVerify } from "jose";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const budgets = await prisma.budget.findMany();
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
  try {
    const budgets = await req.json();
    const userId = 1; // À remplacer par la logique d'authentification réelle

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
      message: "Budgets mis à jour avec succès",
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
