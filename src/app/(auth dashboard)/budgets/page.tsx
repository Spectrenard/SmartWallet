"use client";
import BudgetForm from "@/components/BudgetForm";
import Loading from "@/components/Loading";
import { DonutChart } from "@/components/ui/PieChart";
import { useState, useEffect } from "react";
import { ArrowUpCircle, ArrowDownCircle, Euro } from "lucide-react";

export default function Budgets() {
  const [isLoading, setIsLoading] = useState(true);
  const [budgetSummary, setBudgetSummary] = useState({
    total: 0,
    highestCategory: "",
    lowestCategory: "",
  });

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await fetch("/api/budgets");
        if (!response.ok) {
          throw new Error("La requête a échoué");
        }
        const data = await response.json();
        // Calculer le résumé des budgets
        const total = data.reduce(
          (sum: number, budget: any) => sum + budget.amount,
          0
        );
        const sortedBudgets = [...data].sort((a, b) => b.amount - a.amount);
        setBudgetSummary({
          total,
          highestCategory: sortedBudgets[0]?.category || "",
          lowestCategory:
            sortedBudgets[sortedBudgets.length - 1]?.category || "",
        });
      } catch (error) {
        console.error("Erreur lors du chargement des budgets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBudgets();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <main className="sm:p-4 flex flex-col gap-6">
      <h1 className="text-white text-2xl sm:text-3xl font-medium mb-2">
        Gérez vos budgets
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
        <div className="bg-customColor-800 p-3 sm:p-4 rounded-lg flex items-center">
          <Euro className="text-emerald-500 mr-2 sm:mr-4 w-6 h-6 sm:w-8 sm:h-8" />
          <div>
            <p className="text-customColor-400 text-sm sm:text-base">
              Budget total
            </p>
            <p className="text-white text-lg sm:text-xl lg:text-2xl">
              {budgetSummary.total.toFixed(2)} €
            </p>
          </div>
        </div>
        <div className="bg-customColor-800 p-3 sm:p-4 rounded-lg flex items-center">
          <ArrowUpCircle className="text-red-500 mr-2 sm:mr-4 w-6 h-6 sm:w-8 sm:h-8" />
          <div>
            <p className="text-customColor-400 text-sm sm:text-base">
              Budget le plus élevé
            </p>
            <p className="text-white text-lg sm:text-xl lg:text-2xl">
              {budgetSummary.highestCategory}
            </p>
          </div>
        </div>
        <div className="bg-customColor-800 p-3 sm:p-4 rounded-lg flex items-center">
          <ArrowDownCircle className="text-blue-500 mr-2 sm:mr-4 w-6 h-6 sm:w-8 sm:h-8" />
          <div>
            <p className="text-customColor-400 text-sm sm:text-base">
              Budget le plus bas
            </p>
            <p className="text-white text-lg sm:text-xl lg:text-2xl">
              {budgetSummary.lowestCategory}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-customColor-800 p-4 sm:p-6 rounded-lg shadow-lg">
          <h2 className="text-lg sm:text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-100">
            Définir vos budgets
          </h2>
          <BudgetForm />
        </div>
        <div className="bg-customColor-800 p-4 sm:p-6 rounded-lg shadow-lg">
          <h2 className="text-lg sm:text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-100">
            Aperçu
          </h2>
          <DonutChart />
        </div>
      </div>
    </main>
  );
}
