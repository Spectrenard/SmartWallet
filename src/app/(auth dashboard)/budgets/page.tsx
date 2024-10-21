"use client";
import BudgetForm from "@/components/BudgetForm";
import Loading from "@/components/Loading";
import { DonutChart } from "@/components/ui/PieChart";

export default function Budgets() {
  return (
    <main className="min-h-screen p-4 flex flex-col">
      <h1 className="text-white text-3xl font-medium mb-6">
        Gérez vos budgets
      </h1>
      <div className="flex flex-row mx-auto gap-6">
        <div className="p-2 max-w-xl rounded-lg">
          <BudgetForm />
        </div>
        <div>
          <DonutChart />
        </div>
      </div>
    </main>
  );
}
