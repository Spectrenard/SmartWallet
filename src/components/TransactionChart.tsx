"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Cell,
  LabelList,
  ResponsiveContainer,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { format, isBefore } from "date-fns";
import { fr } from "date-fns/locale";

interface ChartData {
  category: string;
  amount: number;
}

interface TransactionChart {
  id: string;
  amount: number;
  category: string;
  createdAt: string; // transaction date in ISO format
}

interface TransactionMonth extends TransactionChart {
  description: string;
}

interface TransactionChartProps {
  chartDataArray: ChartData[];
  chartConfig: ChartConfig;
}

const getColorByCategory = (category: string) => {
  const colors = {
    Salaire: "#22c55e",
    "Loisirs & vacances": "#eab308",
    "Alimentation & restaurants": "#f97316",
    "Achats & Shopping": "#a855f7",
    Logement: "#0ea5e9",
    Santé: "#ef4444",
    Transports: "#6366f1",
    Autre: "#94a3b8",
  };
  return colors[category as keyof typeof colors] || "#f59e0b";
};

const TransactionChart: React.FC<TransactionChartProps> = ({
  chartDataArray,
  chartConfig,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string>(
    format(new Date(), "yyyy-MM")
  );
  const [transactions, setTransactions] = useState<TransactionChart[]>([]);
  const [months, setMonths] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);

  const fetchTransactions = useCallback(async () => {
    if (!isActive) return;
    try {
      const response = await fetch("/api/transactions");
      const data = await response.json();
      setTransactions(data);
      const uniqueMonths = Array.from(
        new Set(
          data.map((transaction: TransactionChart) =>
            format(new Date(transaction.createdAt), "yyyy-MM")
          )
        )
      ).sort((a, b) => {
        const dateA = new Date(`${a}-01`);
        const dateB = new Date(`${b}-01`);
        return isBefore(dateB, dateA) ? -1 : 1;
      }) as string[];
      setMonths(uniqueMonths);
      if (!uniqueMonths.includes(selectedMonth)) {
        setSelectedMonth(uniqueMonths[0]);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des transactions:", error);
    }
  }, [isActive, selectedMonth]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    const intervalId = setInterval(fetchTransactions, 5000); // Rafraîchir toutes les 30 secondes

    const handleVisibilityChange = () => {
      setIsActive(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchTransactions]);

  const handleMonthSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(event.target.value);
  };

  // Filtrer les transactions par mois sélectionné
  const filteredTransactions = transactions.filter(
    (transaction) =>
      format(new Date(transaction.createdAt), "yyyy-MM") === selectedMonth
  );

  // Modifier cette partie pour regrouper les transactions par catégorie
  const filteredData = filteredTransactions
    .filter((entry) => entry.amount < 0)
    .reduce((acc, entry) => {
      const existingCategory = acc.find(
        (item) => item.category === entry.category
      );
      if (existingCategory) {
        existingCategory.amount += Math.abs(entry.amount);
      } else {
        acc.push({
          category: entry.category,
          amount: Math.abs(entry.amount),
        });
      }
      return acc;
    }, [] as { category: string; amount: number }[])
    .sort((a, b) => b.amount - a.amount);

  return (
    <div className="bg-customColor-800 text-white rounded-lg p-10">
      <div className="flex justify-between">
        <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-100">
          Graphique des Dépenses
        </h3>
        <select
          value={selectedMonth}
          onChange={handleMonthSelect}
          className="bg-customColor-700 text-customColor-300 p-2 rounded outline-none"
        >
          {months.map((month) => (
            <option key={month} value={month}>
              {format(new Date(`${month}-01`), "MMMM yyyy", { locale: fr })}
            </option>
          ))}
        </select>
      </div>
      {filteredTransactions.length === 0 ? (
        <p className="text-center text-white mt-4">
          Aucune transaction pour ce mois.
        </p>
      ) : (
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={filteredData}
              layout="vertical"
              margin={{ top: 20, right: 30, bottom: 5 }}
            >
              <YAxis
                dataKey="category"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                style={{ fontSize: "12px", fill: "#ffffff" }}
                width={120}
              />
              <XAxis type="number" hide={true} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="amount" layout="vertical" radius={5}>
                {filteredData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getColorByCategory(entry.category)}
                  />
                ))}
                <LabelList
                  dataKey="amount"
                  position="right"
                  formatter={(value: number) => `${value} €`}
                  style={{ fontSize: "12px" }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      )}
    </div>
  );
};

export default TransactionChart;
