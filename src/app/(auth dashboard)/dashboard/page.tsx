"use client";
import { useState, useEffect } from "react";
import TotalBalance from "@/components/TotalBalance";
import TotalMonthExpense from "@/components/TotalMonthExpense";
import TotalIncome from "@/components/TotalMonthIncome";
import { DashboardChart } from "@/components/ui/LineChart";
import Loading from "@/components/Loading";
import { DonutChart } from "@/components/ui/PieChart";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/transactions");
        if (!response.ok) {
          throw new Error("La requête a échoué");
        }
      } catch (error) {
        console.error("Erreur lors du chargement des transactions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <main className="min-h-screen p-4 flex flex-col gap-6">
      <h1 className="text-white text-3xl font-normal">Aperçu</h1>

      <div className="grid grid-cols-3 gap-4">
        <TotalBalance />
        <TotalIncome />
        <TotalMonthExpense />
      </div>

      <div className="flex gap-4 h-64">
        <div className="flex-1">
          <DashboardChart />
        </div>

        <div className="flex-1">
          <DonutChart />
        </div>
      </div>
    </main>
  );
}
