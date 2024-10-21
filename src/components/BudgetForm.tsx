"use client";
import { useState, useEffect } from "react";
import { Euro } from "lucide-react";
import Btn from "./ui/animated-subscribe-button";

export default function BudgetForm() {
  const [categories, setCategories] = useState<string[]>([]);
  const [budgets, setBudgets] = useState<{ [key: string]: number }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoriesAndBudgets = async () => {
      try {
        setIsLoading(true);
        const categoriesResponse = await fetch("/api/categories");
        const budgetsResponse = await fetch("/api/budgets");

        if (!categoriesResponse.ok || !budgetsResponse.ok) {
          throw new Error("Erreur lors de la récupération des données");
        }

        const categoriesData = await categoriesResponse.json();
        const budgetsData = await budgetsResponse.json();

        setCategories(categoriesData);

        // Convertir les budgets en objet avec la catégorie comme clé
        const budgetsObject = budgetsData.reduce(
          (
            acc: { [key: string]: number },
            budget: { category: string; amount: number }
          ) => {
            acc[budget.category] = budget.amount;
            return acc;
          },
          {}
        );

        setBudgets(budgetsObject);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoriesAndBudgets();
  }, []);

  const handleBudgetChange = (category: string, value: number) => {
    setBudgets((prev) => ({ ...prev, [category]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus(null);
    setError(null);

    try {
      const budgetsArray = Object.entries(budgets).map(
        ([category, amount]) => ({
          category,
          amount: Number(amount),
        })
      );

      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(budgetsArray),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Erreur lors de l'enregistrement des budgets"
        );
      }

      setSubmitStatus("Budgets enregistrés avec succès");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors de l'enregistrement"
      );
    }
  };

  if (isLoading)
    return (
      <div className="text-white text-center">Chargement des données...</div>
    );
  if (error)
    return <div className="text-red-500 text-center">Erreur : {error}</div>;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-customColor-800 p-8 rounded-lg shadow-lg max-w-2xl mx-auto"
    >
      <h2 className="text-white text-xl mb-6 text-center">
        Fixez vos budgets par catégorie
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((category) => (
          <div
            key={category}
            className="bg-customColor-700 px-2 py-4 rounded-lg"
          >
            <label
              htmlFor={`budget-${category}`}
              className="text-white text-lg font-medium block mb-2"
            >
              {category}
            </label>
            <div className="relative">
              <input
                type="number"
                placeholder="0"
                id={`budget-${category}`}
                value={budgets[category] || ""}
                onChange={(e) =>
                  handleBudgetChange(category, Number(e.target.value))
                }
                className="w-full p-2 pl-8 rounded bg-customColor-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <Euro
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-emerald-500"
                size={20}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="text-center pt-6">
        <Btn text="Valider" />
      </div>
      {submitStatus && (
        <p className="text-green-500 text-center mt-4">{submitStatus}</p>
      )}
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </form>
  );
}
