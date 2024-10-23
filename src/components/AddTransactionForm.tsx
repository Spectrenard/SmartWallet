// AddTransactionForm.tsx
import React, { useState } from "react";
import { toast } from "react-toastify";
import Btn from "./ui/animated-subscribe-button";
import { Transaction } from "../types";

interface AddTransactionFormProps {
  amount: string;
  setAmount: (amount: string) => void;
  category: string;
  setCategory: (category: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onTransactionAdded: (newTransaction: Transaction) => void;
}

const AddTransactionForm: React.FC<AddTransactionFormProps> = ({
  amount,
  setAmount,
  category,
  setCategory,
  handleSubmit,
  onTransactionAdded,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formattedAmount = parseFloat(amount.replace(",", "."));
    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: formattedAmount, category }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Nouvelle transaction créée:", data.transaction);
        onTransactionAdded(data.transaction);
        setAmount("");
        setCategory("");
        toast.success("Transaction ajoutée avec succès !");
      } else {
        throw new Error("Erreur lors de l'ajout de la transaction");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de la transaction:", error);
      toast.error("Erreur lors de l'ajout de la transaction");
    }
  };

  const categories = [
    "Salaire",
    "Loisirs & vacances",
    "Alimentation & restaurants",
    "Achats & Shopping",
    "Logement",
    "Santé",
    "Transports",
    "Autre",
  ];

  return (
    <div className="bg-customColor-800 rounded-lg p-4 md:p-6 mb-6 md:mb-10 w-full">
      <h2 className="text-lg md:text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-100">
        Ajouter un montant
      </h2>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Montant"
          required
          className="p-2 rounded bg-customColor-700 text-gray-500 w-full placeholder-gray-400 placeholder-opacity-100 focus:outline-none focus:ring-2 focus:ring-customColor-500"
        />
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded bg-customColor-700 text-gray-500 w-full text-left focus:outline-none focus:ring-2 focus:ring-customColor-500"
          >
            {category || "Choisir une catégorie"}
          </button>
          {isOpen && (
            <div className="absolute z-10 w-full mt-1 bg-customColor-400 rounded-md shadow-lg">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setCategory(cat);
                    setIsOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-left hover:bg-customColor-600"
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
        <Btn text="Ajouter" />
      </form>
    </div>
  );
};

export default AddTransactionForm;
