import React, { useEffect, useState } from "react";

interface Budget {
  id: number;
  category: string;
  amount: number;
}

interface Transaction {
  id: number;
  category: string;
  amount: number;
}

const ProgressBar: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const budgetsResponse = await fetch("/api/budgets");
        const transactionsResponse = await fetch("/api/transactions");

        if (!budgetsResponse.ok || !transactionsResponse.ok) {
          throw new Error("Erreur lors de la récupération des données");
        }

        const budgetsData = await budgetsResponse.json();
        const transactionsData = await transactionsResponse.json();

        setBudgets(budgetsData);
        setTransactions(transactionsData);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      }
    };

    fetchData();
  }, []);

  const calculateSpent = (category: string) => {
    return Math.abs(
      transactions
        .filter((t) => t.category === category)
        .reduce((sum, t) => sum + t.amount, 0)
    );
  };

  return (
    <div className="max-w-2xl space-y-4">
      {budgets.map((budget) => {
        const spent = calculateSpent(budget.category);
        const percentage = Math.min((spent / budget.amount) * 100, 100);

        return (
          <div key={budget.id} className="w-full text-white">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">{budget.category}</span>
              <span className="text-sm font-medium">
                {spent.toFixed(2)}€ / {budget.amount}€
              </span>
            </div>
            <div className="max-w-2xl h-7 bg-gray-200 rounded-full">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProgressBar;
