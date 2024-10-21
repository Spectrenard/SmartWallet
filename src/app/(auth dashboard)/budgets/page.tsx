"use client";
import BudgetForm from "@/components/BudgetForm";
import Loading from "@/components/Loading";

export default function Budgets() {
  return (
    <main className="min-h-screen p-4 flex flex-col">
      <h1 className="text-white text-3xl font-medium mb-6">
        Gérez vos budgets
      </h1>
      <div className="p-2 max-w-xl rounded-lg">
        <BudgetForm />
      </div>
    </main>
  );
}
