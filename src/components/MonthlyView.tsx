import React, { useState, useEffect } from "react";

// Définition du type Transaction
interface TransactionMonth {
  id: string;
  amount: number;
  description: string;
  createdAt: string;
}

interface MonthlyProps {
  transactions: TransactionMonth[];
  onSelectMonth: (month: string) => void;
}

export default function Monthly({ transactions, onSelectMonth }: MonthlyProps) {
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  useEffect(() => {
    const months = extractUniqueMonths(transactions);
    setAvailableMonths(months);

    // Sélectionner automatiquement le mois courant
    const currentMonth = new Date().toISOString().slice(0, 7);
    if (months.includes(currentMonth)) {
      setSelectedMonth(currentMonth);
      onSelectMonth(currentMonth);
    }
  }, [transactions, onSelectMonth]);

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = event.target.value;
    setSelectedMonth(newMonth);
    onSelectMonth(newMonth);
  };

  return (
    <div>
      <select
        className="bg-customColor-700 text-gray-600 px-5 py-2 rounded-xl focus:ring-0 outline-none"
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

function extractUniqueMonths(transactions: TransactionMonth[]): string[] {
  const months = transactions.map((transaction) => {
    const date = new Date(transaction.createdAt);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  });
  return Array.from(new Set(months)).sort().reverse();
}
