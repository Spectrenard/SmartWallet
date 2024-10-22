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
  createdAt: string; // Utilisation de createdAt au lieu de date
}

const ProgressBar: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

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

  const isCurrentMonth = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  };

  const calculateSpent = (category: string) => {
    return Math.abs(
      transactions
        .filter((t) => t.category === category && isCurrentMonth(t.createdAt))
        .reduce((sum, t) => sum + t.amount, 0)
    );
  };

  const getProgressColor = (percentage: number) => {
    if (percentage < 50) return "bg-emerald-600";
    if (percentage < 75) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="p-6 space-y-4 rounded-lg w-full bg-customColor-800 max-w-2xl text-white">
      <h1 className="font-bold text-customColor-300 pb-6">
        États actuel de vos budgets
      </h1>
      {budgets.map((budget) => {
        const spent = calculateSpent(budget.category);
        const percentage = Math.min((spent / budget.amount) * 100, 100);
        const progressColor = getProgressColor(percentage);

        return (
          <div
            key={budget.id}
            className="w-full relative"
            onMouseEnter={() => setHoveredCategory(budget.category)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <div className="flex justify-between items-center mb-1 text-xs font-medium">
              <span>{budget.category}</span>
              <span>
                {spent.toFixed(2)}€ / {budget.amount}€
              </span>
            </div>
            <div className="w-full bg-customColor-500 rounded-full h-6">
              <div
                className={`h-full rounded-full transition-all duration-300 ${progressColor}`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            {hoveredCategory === budget.category && (
              <div className="absolute left-0 -top-6 bg-white text-black px-2 py-1 rounded shadow-md text-xs">
                Reste: {(budget.amount - spent).toFixed(2)}€
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProgressBar;
