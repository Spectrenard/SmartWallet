"use client";

import React, { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

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

export const description = "An interactive line chart";

const chartConfig = {
  views: {
    label: "Page Views",
  },
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-3))",
  },
  expenses: {
    label: "Expenses",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

// Ajoutez cette définition de type en haut du fichier ou importez-la si elle est définie ailleurs
type Transaction = {
  createdAt: string;
  amount: number;
};

export function DashboardChart() {
  const [transactionsState, setTransactionsState] = useState<Transaction[]>([]);
  const [chartData, setChartData] = useState<
    { date: string; revenue: number; expenses: number }[]
  >([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/transactions");
        const data = await response.json();
        setTransactionsState(data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des transactions:",
          error
        );
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    const aggregatedData = transactionsState.reduce(
      (
        acc: Record<
          string,
          { date: string; revenue: number; expenses: number }
        >,
        transaction
      ) => {
        const date = new Date(transaction.createdAt).toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "numeric",
          }
        );

        if (!acc[date]) {
          acc[date] = { date, revenue: 0, expenses: 0 };
        }

        if (transaction.amount > 0) {
          acc[date].revenue += transaction.amount;
        } else {
          acc[date].expenses += Math.abs(transaction.amount);
        }

        return acc;
      },
      {} as Record<string, { date: string; revenue: number; expenses: number }>
    );

    setChartData(Object.values(aggregatedData));
  }, [transactionsState]);

  return (
    <Card className="bg-customColor-800 border-customColor-400">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b border-customColor-600 p-0 sm:flex-row">
        <div className="flex flex-1 text-customColor-100 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle className="font-normal">Aperçu de votre année</CardTitle>
          <CardDescription className="text-customColor-400">
            Toutes vos transactions sous forme de graphique
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6 border-customColor-600">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full border-customColor-600"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} stroke="var(--customColor-600)" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Line
              dataKey="revenue"
              type="monotone"
              stroke="var(--color-revenue)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="expenses"
              type="monotone"
              stroke="var(--color-expenses)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
