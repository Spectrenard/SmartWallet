"use client";
import { useState, useEffect } from "react";
import TotalBalance from "@/components/TotalBalance";
import TotalMonthExpense from "@/components/TotalMonthExpense";
import TotalIncome from "@/components/TotalMonthIncome";
import { DashboardChart } from "@/components/ui/LineChart";
import Loading from "@/components/Loading";
import ProgressBar from "@/components/ProgressBar";
import RecentTransactions from "@/components/RecentTransactions";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/transactions");
        if (!response.ok) {
          throw new Error("La requête a échoué");
        }
        const data = await response.json();
        setTransactions(data);
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
    <main className="min-h-screen p-2 sm:p-4 flex flex-col gap-2 sm:gap-4 md:gap-6">
      <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-normal">
        Aperçu
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
        <TotalBalance />
        <TotalIncome />
        <TotalMonthExpense />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-4 md:gap-6">
        <div className="bg-customColor-800 rounded-lg shadow-md p-2 sm:p-3 md:p-4">
          <h2 className="text-customColor-300 text-base sm:text-lg md:text-xl mb-2 sm:mb-3 md:mb-4">
            Transactions récentes
          </h2>
          <RecentTransactions transactions={transactions} />
        </div>
        <div className="bg-customColor-800 rounded-lg shadow-md p-2 sm:p-3 md:p-4">
          <h2 className="text-base sm:text-lg md:text-xl mb-2 sm:mb-3 md:mb-4 text-customColor-300">
            État des budgets
          </h2>
          <div className="flex justify-center">
            <ProgressBar />
          </div>
        </div>
      </div>

      <div className="bg-customColor-800 rounded-lg shadow-md max-sm:mt-6 p-2 sm:p-3 md:p-4">
        <h2 className="text-customColor-300 text-base sm:text-lg md:text-xl mb-2 sm:mb-3 md:mb-4">
          Graphique des dépenses
        </h2>
        <div className="w-full max-w-4xl flex justify-center items-center mx-auto">
          <DashboardChart />
        </div>
      </div>
    </main>
  );
}
