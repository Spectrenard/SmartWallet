"use client";
import BudgetForm from "@/components/BudgetForm";
import Loading from "@/components/Loading";
import { DonutChart } from "@/components/ui/PieChart";
import { useState, useEffect } from "react";
import { ArrowUpCircle, ArrowDownCircle, Euro } from "lucide-react";
import ProgressBar from "@/components/ProgressBar";

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
    <main className="p-4 flex flex-col gap-6">
      <h1 className="text-white text-3xl font-medium mb-2">
        Gérez vos budgets
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-customColor-800 p-4 rounded-lg  flex items-center">
          <Euro className="text-emerald-500 mr-4" size={32} />
          <div>
            <p className="text-customColor-400">Budget total</p>
            <p className="text-white text-2xl ">
              {budgetSummary.total.toFixed(2)} €
            </p>
          </div>
        </div>
        <div className="bg-customColor-800 p-4 rounded-lg  flex items-center">
          <ArrowUpCircle className="text-red-500 mr-4" size={32} />
          <div>
            <p className="text-customColor-400">Budget la plus élevée</p>
            <p className="text-white text-xl ">
              {budgetSummary.highestCategory}
            </p>
          </div>
        </div>
        <div className="bg-customColor-800 p-4 rounded-lg  flex items-center">
          <ArrowDownCircle className="text-blue-500 mr-4" size={32} />
          <div>
            <p className="text-customColor-400">Budget la plus basse</p>
            <p className="text-white text-xl ">
              {budgetSummary.lowestCategory}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-customColor-800 p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl  mb-4 text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-100">
            Définir vos budgets
          </h1>
          <BudgetForm />
        </div>
        <div className="bg-customColor-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl  mb-4 text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-100">
            Aperçu
          </h2>
          <DonutChart />
        </div>
      </div>
    </main>
  );
}
