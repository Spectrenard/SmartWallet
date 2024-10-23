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
    <div className="max-h-[400px] overflow-y-auto sm:max-h-[285px] md:max-h-[350px] lg:max-h-[400px]">
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
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 sm:p-4 mb-2 bg-customColor-700 rounded-lg shadow-md transition-shadow duration-300 hover:shadow-lg"
              >
                <div className="flex items-center w-full mb-2 sm:mb-0">
                  {icon && (
                    <span className={`${color} mr-2 text-lg sm:text-base`}>
                      {icon}
                    </span>
                  )}
                  <span
                    className={`font-normal text-base sm:text-sm ${color} flex-1`}
                  >
                    {transaction.category}
                  </span>
                </div>
                <div className="flex items-center justify-between w-full sm:w-auto">
                  <span
                    className={`text-lg sm:text-base ${amountColor} mr-2 sm:mr-4`}
                  >
                    {transaction.amount.toFixed(2)}€
                  </span>
                  <div className="flex items-center">
                    <button
                      onClick={() => onEdit(transaction)}
                      className="text-customColor-300 hover:bg-blue-500 hover:text-white p-2 rounded transition duration-300 mr-2"
                      title="Modifier la transaction"
                    >
                      <Pencil className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button
                      onClick={() => onDelete(transaction.id)}
                      className="text-customColor-300 hover:bg-red-500 hover:text-white p-2 rounded transition duration-300"
                      title="Supprimer la transaction"
                    >
                      <Trash className="w-4 h-4 sm:w-5 sm:h-5" />
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
