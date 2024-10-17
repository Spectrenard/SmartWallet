"use client";
import React, { useEffect, useState } from "react";

interface Transaction {
  id: number;
  amount: number;
  category: string;
}

const TotalBalance: React.FC = () => {
  const [transactionsState, setTransactionsState] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/transactions"); // Remplacez par l'URL de votre API
        const data = await response.json();
        setTransactionsState(data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des transactions:",
          error
        );
      }
    };

    fetchTransactions();
  }, []);

  const totalBalance = transactionsState.reduce(
    (acc, transaction) => acc + transaction.amount,
    0
  );

  return (
    <div className="bg-emerald-700 rounded-lg p-6 mb-10 w-full  shadow-lg">
      <h2 className="text-md font-light text-gray-300">Solde total</h2>
      <div className="mt-4">
        <p className="text-3xl font-bold text-white">
          {totalBalance.toLocaleString("fr-FR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
          €
        </p>
      </div>
    </div>
  );
};

export default TotalBalance;
