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
  const [isOpen, setIsOpen] = useState(false);

  const fetchTransactions = useCallback(async () => {
    if (!isActive) return;
    try {
      const response = await fetch("/api/transactions");
      const data = await response.json();
      console.log("Fetched transactions: ", data); // Log pour voir les transactions récupérées
      setTransactions(data);

      // Extraction des mois uniques
      const uniqueMonths = Array.from(
        new Set(
          data.map((transaction: TransactionChart) =>
            format(new Date(transaction.createdAt), "yyyy-MM")
          )
        )
      ).sort((a, b) => {
        const dateA = new Date(`${a}-01T00:00:00`);
        const dateB = new Date(`${b}-01T00:00:00`);
        return isBefore(dateB, dateA) ? -1 : 1;
      }) as string[];

      setMonths(uniqueMonths);

      // Assurer que selectedMonth est dans les mois récupérés
      if (!uniqueMonths.includes(selectedMonth)) {
        setSelectedMonth(uniqueMonths[0]);
        console.log("Selected month updated to: ", uniqueMonths[0]); // Log pour voir le mois sélectionné
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
    console.log("Month selected: ", event.target.value); // Log pour déboguer la sélection du mois
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
    <div className="bg-customColor-800 text-white rounded-lg p-4 md:p-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-0 text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-100">
          Graphique des Dépenses
        </h3>
        <div className="relative w-full md:w-auto">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="bg-customColor-700 text-customColor-300 p-2 rounded outline-none w-full md:w-auto text-base md:text-sm h-10 md:h-auto"
          >
            {(() => {
              const dateString = `${selectedMonth}-01T00:00:00`;
              const parsedDate = Date.parse(dateString);

              // Vérification si la date est valide
              if (!isNaN(parsedDate)) {
                return format(new Date(parsedDate), "MMMM yyyy", {
                  locale: fr,
                });
              } else {
                console.error("Date invalide:", dateString); // Log pour débogage
                return "Date invalide";
              }
            })()}
          </button>

          {isOpen && (
            <div className="absolute z-10 w-full mt-1 bg-customColor-400 rounded-md shadow-lg">
              {months.map((month) => (
                <button
                  key={month}
                  type="button"
                  onClick={() => {
                    setSelectedMonth(month);
                    setIsOpen(false);
                    console.log("Month changed to: ", month); // Log pour voir les changements de mois
                  }}
                  className="block w-full px-4 py-2 text-left hover:bg-customColor-600"
                >
                  {format(new Date(`${month}-01T00:00:00`), "MMMM yyyy", {
                    locale: fr,
                  })}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {filteredTransactions.length === 0 ? (
        <p className="text-center text-white mt-4">
          Aucune transaction pour ce mois.
        </p>
      ) : (
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300} className="mt-4">
            <BarChart
              data={filteredData}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
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
