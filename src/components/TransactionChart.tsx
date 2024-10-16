"use client";

import React from "react";
import { Bar, BarChart, XAxis, YAxis, Cell } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface ChartData {
  category: string;
  amount: number;
}

interface TransactionChartProps {
  chartDataArray: ChartData[];
  chartConfig: ChartConfig;
}

const getColorByCategory = (category: string) => {
  switch (category) {
    case "Salaire":
      return "#16A34A"; // Vert plus foncé
    case "Loisirs & vacances":
      return "#EAB308"; // Jaune plus foncé
    case "Alimentation & restaurants":
      return "#F97316"; // Orange plus foncé
    case "Achats & Shopping":
      return "#9333EA"; // Violet plus foncé
    case "Logement":
      return "#0EA5E9"; // Bleu ciel plus foncé
    case "Santé":
      return "#F87171"; // Rouge plus foncé
    case "Transports":
      return "#4F46E5"; // Indigo plus foncé
    case "Autre":
      return "#6B7280"; // Gris plus foncé
    default:
      return "#F59E0B"; // Couleur par défaut plus foncée
  }
};

const TransactionChart: React.FC<TransactionChartProps> = ({
  chartDataArray,
  chartConfig,
}) => {
  return (
    <div className=" bg-customColor-800 text-white rounded-lg p-10">
      <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-100">
        Graphique des Transactions
      </h3>
      <ChartContainer config={chartConfig}>
        <BarChart
          width={500}
          height={300}
          data={chartDataArray}
          layout="vertical"
          margin={{ left: 50 }}
        >
          <YAxis
            dataKey="category"
            type="category"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            style={{ fontSize: "12px", color: "#fff" }}
            width={50}
          />
          <XAxis dataKey="amount" type="number" hide />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Bar dataKey="amount" layout="vertical" radius={5}>
            {chartDataArray.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getColorByCategory(entry.category)}
              />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default TransactionChart;
