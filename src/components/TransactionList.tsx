import React from "react";
import { Trash, Pencil } from "lucide-react";

interface Transaction {
  id: number;
  amount: number;
  category: string;
  createdAt: string;
}

interface CategoryConfig {
  [key: string]: { color: string; icon: React.ReactNode };
}

interface TransactionsListProps {
  transactions: Transaction[];
  categoryConfig: CategoryConfig;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: number) => void;
}

const TransactionsList: React.FC<TransactionsListProps> = ({
  transactions,
  categoryConfig,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="max-h-[400px] overflow-y-auto max-lg:max-h-[285px]">
      {transactions.length === 0 ? (
        <p className="text-center text-gray-400">
          Aucune transaction trouvée pour le mois actuel.
        </p>
      ) : (
        transactions
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .map((transaction) => {
            const amountColor =
              transaction.amount < 0 ? "text-red-700" : "text-emerald-600";
            const { color, icon } = categoryConfig[transaction.category];

            return (
              <div
                key={transaction.id}
                className="flex justify-between items-center p-4 mb-2 bg-customColor-700 rounded-lg shadow-md transition-shadow duration-300 hover:shadow-lg"
              >
                <div className="flex items-center w-full">
                  {icon && <span className={`${color} mr-2`}>{icon}</span>}
                  <span
                    className={`font-normal text-lg lg:text-sm ${color} flex-1`}
                  >
                    {transaction.category}
                  </span>
                  <span
                    className={`text-xl ${amountColor} text-center w-2/4 lg:text-lg`}
                  >
                    {transaction.amount.toFixed(2)}€
                  </span>
                  <div className="flex items-center">
                    <button
                      onClick={() => onEdit(transaction)}
                      className="text-customColor-300 hover:bg-blue-500 hover:text-white p-2 rounded transition duration-300 mr-2"
                      title="Modifier la transaction"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onDelete(transaction.id)}
                      className="text-customColor-300 hover:bg-red-500 hover:text-white p-2 rounded transition duration-300"
                      title="Supprimer la transaction"
                    >
                      <Trash className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
      )}
    </div>
  );
};

export default TransactionsList;
