"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import { PieChart, Pie, Label } from "recharts";
import { InfoIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
export const description = "Graphique en donut des budgets par catégorie";
interface BudgetData {
  category: string;
  amount: number;
  fill?: string;
}
const categoryColors: { [key: string]: string } = {
  "Loisirs & vacances": "#eab308",
  "Alimentation & restaurants": "#f97316",
  "Achats & Shopping": "#a855f7",
  Logement: "#0ea5e9",
  Santé: "#ef4444",
  Transports: "#6366f1",
  Autre: "#94a3b8",
};
export function DonutChart() {
  const [chartData, setChartData] = useState<BudgetData[]>([]);
  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await fetch("/api/budgets");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des budgets");
        }
        const budgets: BudgetData[] = await response.json();
        setChartData(
          budgets.map((budget) => ({
            category: budget.category,
            amount: budget.amount,
            fill: categoryColors[budget.category] || "#94a3b8",
          }))
        );
      } catch (error) {
        console.error("Erreur lors de la récupération des budgets:", error);
      }
    };
    fetchBudgets();
  }, []);
  const totalBudget = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.amount, 0);
  }, [chartData]);
  const chartConfig: ChartConfig = React.useMemo(() => {
    return chartData.reduce(
      (config, item) => {
        config[item.category] = {
          label: item.category,
          color: item.fill,
        };
        return config;
      },
      { visitors: { label: "Montant" } } as ChartConfig
    );
  }, [chartData]);
  return (
    <Card className="flex flex-col bg-customColor-800 border-none shadow-none">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-customColor-300  text-md">
          Répartition des budgets
        </CardTitle>
        <CardDescription className="text-customColor-400">
          Par catégorie
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="category"
              innerRadius={70}
              outerRadius={100}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-white text-4xl font-bold"
                        >
                          {totalBudget.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 28}
                          className="fill-white text-xl"
                        >
                          €
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm pt-6">
        <div className="flex items-center gap-2 font-medium leading-none text-customColor-300">
          <InfoIcon className="h-4 w-4" /> Budget total pour toutes les
          catégories
        </div>
        <div className="leading-none text-customColor-400">
          Cliquez sur une catégorie pour voir les détails
        </div>
      </CardFooter>
    </Card>
  );
}
