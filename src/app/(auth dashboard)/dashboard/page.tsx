"use client";
import { useState, useEffect } from "react";
import TotalBalance from "@/components/TotalBalance";
import TotalMonthExpense from "@/components/TotalMonthExpense";
import TotalIncome from "@/components/TotalMonthIncome";
import { DashboardChart } from "@/components/ui/LineChart";
import Loading from "@/components/Loading";

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
    <main className="min-h-screen p-4 flex flex-col">
      <p className="text-white text-3xl font-normal mb-6">Aperçu</p>
      <div className="flex gap-4">
        <TotalBalance />
        <TotalIncome />
        <TotalMonthExpense />
      </div>
      <div>
        <DashboardChart />
      </div>
    </main>
  );
}
