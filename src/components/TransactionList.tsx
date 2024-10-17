// TransactionsList.tsx
import React, { useState } from "react";
import { Trash, Pencil } from "lucide-react";
import TransactionChart from "./TransactionChart";
import ConfirmationModal from "./ConfirmationModal"; // Nouveau composant à créer
import EditTransactionModal from "./EditTransactionModal"; // Nouveau composant à créer

interface Transaction {
  id: number;
  amount: number;
  category: string;
  createdAt: string;
}

interface CategoryConfig {
  [key: string]: { color: string; icon: JSX.Element };
}

interface ChartConfig {
  [key: string]: { label: string; color: string };
}

interface TransactionsListProps {
  transactions: Transaction[];
  categoryConfig: CategoryConfig;
  handleDelete: (id: number) => void;
  handleEdit: (id: number, amount: number, category: string) => void; // Nouvelle prop
}

const TransactionsList: React.FC<TransactionsListProps> = ({
  transactions,
  categoryConfig,
  handleDelete,
  handleEdit,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<number | null>(
    null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] =
    useState<Transaction | null>(null);

  // Préparer les données pour le graphique
  const chartData = transactions.reduce((acc, transaction) => {
    if (!acc[transaction.category]) {
      acc[transaction.category] = {
        category: transaction.category,
        amount: 0,
        fill: categoryConfig[transaction.category]?.color || "#000",
      };
    }
    acc[transaction.category].amount += transaction.amount;
    return acc;
  }, {} as Record<string, { category: string; amount: number; fill: string }>);

  const chartDataArray = Object.values(chartData);

  const chartConfig = Object.keys(categoryConfig).reduce((acc, key) => {
    acc[key] = {
      label: key,
      color: categoryConfig[key].color,
    };
    return acc;
  }, {} as ChartConfig);

  const handleDeleteWithConfirmation = (id: number) => {
    setTransactionToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (transactionToDelete !== null) {
      handleDelete(transactionToDelete);
    }
    setIsModalOpen(false);
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
  };

  const handleEditClick = (transaction: Transaction) => {
    setTransactionToEdit(transaction);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (id: number, amount: number, category: string) => {
    handleEdit(id, amount, category);
    setIsEditModalOpen(false);
  };

  return (
    <div className="flex flex-row-reverse gap-6   max-md:flex max-md:flex-col ">
      {/* Section des transactions */}
      <div className="bg-customColor-800 rounded-lg p-10 w-1/2">
        <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-100">
          Aperçu
        </h2>
        <div className="max-h-[400px] overflow-y-auto max-lg:max-h-[285px]">
          {transactions.length === 0 ? (
            <p className="text-center text-gray-400">
              Aucune transaction trouvée.
            </p>
          ) : (
            transactions
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
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
                          onClick={() => handleEditClick(transaction)}
                          className="text-customColor-300 hover:bg-blue-500 hover:text-white p-2 rounded transition duration-300 mr-2"
                          title="Modifier la transaction"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteWithConfirmation(transaction.id)
                          }
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
      </div>

      {/* Section du graphique */}
      <div className="w-2/3">
        <TransactionChart
          chartDataArray={chartDataArray}
          chartConfig={chartConfig}
          transactions={transactions}
        />
      </div>

      {isModalOpen && (
        <ConfirmationModal
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          message="Êtes-vous sûr de vouloir supprimer cette transaction ?"
        />
      )}

      {isEditModalOpen && transactionToEdit && (
        <EditTransactionModal
          transaction={transactionToEdit}
          onSubmit={handleEditSubmit}
          onCancel={() => setIsEditModalOpen(false)}
          categoryConfig={categoryConfig}
        />
      )}
    </div>
  );
};

export default TransactionsList;
