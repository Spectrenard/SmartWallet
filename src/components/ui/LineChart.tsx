"use client";

import React, { useEffect, useState } from "react";
import {
  CartesianGrid,
  XAxis,
  Bar,
  BarChart,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A multiple bar chart";

const chartConfig = {
  revenu: {
    label: "Revenu",
  },

  dépenses: {
    label: "Dépenses",
  },
} satisfies ChartConfig;

export function DashboardChart() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/transactions");
        const transactions = await response.json();

        interface Transaction {
          createdAt: string;
          amount: number;
        }

        interface MonthlyData {
          [key: string]: {
            month: string;
            revenu: number;
            dépenses: number;
          };
        }

        const monthlyData = transactions.reduce(
          (acc: MonthlyData, transaction: Transaction) => {
            const date = new Date(transaction.createdAt);
            const month = date.toLocaleString("default", { month: "long" });
            const year = date.getFullYear();
            const key = `${month} ${year}`;

            if (!acc[key]) {
              acc[key] = { month: key, revenu: 0, dépenses: 0 };
            }

            if (transaction.amount > 0) {
              acc[key].revenu += transaction.amount;
            } else {
              acc[key].dépenses += Math.abs(transaction.amount);
            }

            return acc;
          },
          {}
        );

        setChartData(Object.values(monthlyData));
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    }

    fetchData();
  }, []);

  return (
    <Card className="w-full h-full bg-customColor-800 border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-customColor-300">
          Revenus et Dépenses Mensuels
        </CardTitle>
        <CardDescription className="text-customColor-400">
          Affichage des revenus et dépenses par mois
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} stroke="#202020" />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={{ stroke: "#202020" }}
                tickFormatter={(value) => value.slice(0, 3)}
                stroke="#202020"
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar dataKey="revenu" fill="hsl(207, 90%, 54%)" radius={4} />
              <Bar dataKey="dépenses" fill="hsl(10, 70%, 50%)" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
