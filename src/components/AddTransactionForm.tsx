// AddTransactionForm.tsx
import React from "react";
import { toast } from "react-toastify";
import Btn from "./ui/animated-subscribe-button";

interface AddTransactionFormProps {
  amount: string;
  setAmount: (amount: string) => void;
  category: string;
  setCategory: (category: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>, amount: number) => void;
}

const AddTransactionForm: React.FC<AddTransactionFormProps> = ({
  amount,
  setAmount,
  category,
  setCategory,
  handleSubmit,
}) => {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formattedAmount = parseFloat(amount.replace(",", ".")); // Remplace la virgule par un point
    handleSubmit(e, formattedAmount); // Passe le montant formaté à la fontion de soumission

    // Affiche une notification de succès
    toast.success("Transaction ajoutée avec succès !", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };
  return (
    <div className="bg-customColor-800 rounded-lg p-6 mb-10 max-w-2xl w-full">
      <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-100">
        Ajouter un montant
      </h2>
      <form onSubmit={onSubmit} className="flex flex-col md:flex-row gap-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Montant"
          required
          className="p-2 rounded bg-customColor-700 text-gray-500 flex-1 placeholder-gray-400 placeholder-opacity-100 focus:outline-none focus:ring-2 focus:ring-customColor-500"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 rounded bg-customColor-700 text-gray-500 flex-1 md:max-w-xs focus:outline-none focus:ring-2 focus:ring-customColor-500"
        >
          <option
            className="bg-customcolor-700 text-gray-300"
            value=""
            disabled
          >
            Choisir une catégorie
          </option>
          <option value="Salaire">Salaire</option>
          <option value="Loisirs & vacances">Loisirs & vacances</option>
          <option value="Alimentation & restaurants">
            Alimentation & restaurants
          </option>
          <option value="Achats & Shopping">Achats & Shopping</option>
          <option value="Logement">Logement</option>
          <option value="Santé">Santé</option>
          <option value="Transports">Transports</option>
          <option value="Autre">Autre</option>
        </select>
        <Btn text="Ajouter" />
      </form>
    </div>
  );
};

export default AddTransactionForm;
