import React, { useState } from "react";
import Btn from "./ui/animated-subscribe-button";

type Transaction = {
  id: number;
  amount: number;
  category: string;
};

type CategoryConfigEdit = Record<
  string,
  { color: string; icon: React.ReactNode }
>;

interface EditTransactionModalProps {
  transaction: Transaction;
  onSubmit: (id: number, amount: number, category: string) => void;
  onCancel: () => void;
  categoryConfig: CategoryConfigEdit;
}

const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
  transaction,
  onSubmit,
  onCancel,
  categoryConfig,
}) => {
  const [amount, setAmount] = useState(transaction.amount.toString());
  const [category, setCategory] = useState(transaction.category);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(transaction.id, parseFloat(amount), category);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-customColor-800 rounded-lg p-6 max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4 text-gray-100">
          Modifier la transaction
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="amount" className="block mb-2 text-gray-300">
              Montant
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 bg-customColor-700 rounded text-gray-100"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="category" className="block mb-2 text-gray-300">
              Catégorie
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 bg-customColor-700 rounded text-gray-100"
              required
            >
              {Object.keys(categoryConfig).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-between space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-white rounded hover:bg-gray-600 transition duration-300"
            >
              Annuler
            </button>
            <Btn text="Enregistrer" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTransactionModal;
