"use client";

import React, { useState } from "react";
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
import Monthly from "@/components/MonthlyView";

interface ChartData {
  category: string;
  amount: number;
}

interface TransactionChartProps {
  chartDataArray: ChartData[];
  chartConfig: ChartConfig;
  transactions: Transaction[];
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
  transactions,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  const handleMonthSelect = (month: string) => {
    setSelectedMonth(month);
    // Ici, vous pouvez filtrer les données du graphique en fonction du mois sélectionné
    // et mettre à jour chartDataArray si nécessaire
  };

  const filteredData = chartDataArray
    .filter((entry) => entry.amount < 0)
    .map((entry) => ({
      ...entry,
      amount: Math.abs(entry.amount),
    }))
    .sort((a, b) => b.amount - a.amount);

  return (
    <div className="bg-customColor-800 text-white rounded-lg p-10">
      <div className="flex justify-between">
        <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-100">
          Graphique des Dépenses
        </h3>
        <Monthly
          transactions={transactions}
          onSelectMonth={handleMonthSelect}
        />
      </div>
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
    </div>
  );
};

export default TransactionChart;
