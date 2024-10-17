import React, { useState, useEffect } from "react";

// Définition du type Transaction
interface Transaction {
  id: string;
  amount: number;
  description: string;
  createdAt: string; // Assurez-vous que c'est bien une chaîne de caractères représentant une date
  // Ajoutez d'autres propriétés si nécessaire
}

interface MonthlyProps {
  transactions: Transaction[];
  onSelectMonth: (month: string) => void;
}

export default function Monthly({ transactions, onSelectMonth }: MonthlyProps) {
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);

  useEffect(() => {
    const months = extractUniqueMonths(transactions);
    setAvailableMonths(months);
  }, [transactions]);

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onSelectMonth(event.target.value);
  };

  return (
    <div>
      <select
        className="bg-customColor-700 text-gray-600 px-5 py-2 rounded-xl"
        onChange={handleMonthChange}
      >
        <option value="">Sélectionnez un mois</option>
        {availableMonths.map((month) => (
          <option key={month} value={month}>
            {month}
          </option>
        ))}
      </select>
    </div>
  );
}

function extractUniqueMonths(transactions: Transaction[]): string[] {
  const months = transactions.map((transaction) => {
    const date = new Date(transaction.createdAt);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  });
  return Array.from(new Set(months)).sort().reverse();
}
