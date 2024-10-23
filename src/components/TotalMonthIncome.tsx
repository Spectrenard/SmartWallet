"use client";
import React, { useEffect, useState } from "react";

interface Transaction {
  id: number;
  amount: number;
  category: string;
  createdAt: string;
}

const TotalMonthIncome: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalMonthIncome, setTotalMonthIncome] = useState<number>(0);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/transactions");
        const data: Transaction[] = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des transactions:",
          error
        );
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const income = transactions
      .filter((transaction) => {
        const transactionDate = new Date(transaction.createdAt);
        const transactionMonth = transactionDate.getMonth();
        const transactionYear = transactionDate.getFullYear();
        return (
          transaction.amount > 0 &&
          transactionMonth === currentMonth &&
          transactionYear === currentYear
        );
      })
      .reduce((acc, transaction) => acc + transaction.amount, 0);

    setTotalMonthIncome(income);
  }, [transactions]);

  return (
    <div className="bg-customColor-800 rounded-lg p-4 sm:p-6 mb-4 sm:mb-10 w-full">
      <h1 className="text-lg sm:text-xl mb-2 sm:mb-4 text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-100">
        Revenu total du mois
      </h1>
      <p className="text-2xl sm:text-3xl text-white">
        {totalMonthIncome.toLocaleString("fr-FR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
        €
      </p>
    </div>
  );
};

export default TotalMonthIncome;
