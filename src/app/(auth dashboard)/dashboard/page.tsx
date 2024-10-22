"use client";
import { useState, useEffect } from "react";
import TotalBalance from "@/components/TotalBalance";
import TotalMonthExpense from "@/components/TotalMonthExpense";
import TotalIncome from "@/components/TotalMonthIncome";
import { DashboardChart } from "@/components/ui/LineChart";
import Loading from "@/components/Loading";
import ProgressBar from "@/components/ProgressBar";

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TotalBalance />
        <TotalIncome />
        <TotalMonthExpense />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
        <div className="lg:col-span-2 bg-customColor-800 rounded-lg shadow-md p-4 ">
          <div className="max-w-2xl flex justify-center items-center mx-auto">
            <DashboardChart />
          </div>
        </div>
        <div className="lg:col-span-1 bg-customColor-800 rounded-lg shadow-md p-4">
          <ProgressBar />
        </div>
      </div>
    </main>
  );
}
