import React, { useState } from "react";
import TransactionList from "./TransactionList";
import TransactionChart from "./TransactionChart";
import ConfirmationModal from "./ConfirmationModal";
import EditTransactionModal from "./EditTransactionModal";

interface Transaction {
  id: number;
  amount: number;
  category: string;
  createdAt: string;
}

interface CategoryConfig {
  [key: string]: { color: string; icon: React.ReactNode };
}

interface ChartConfig {
  [key: string]: { label: string; color: string };
}

interface TransactionsMainProps {
  transactions: Transaction[];
  categoryConfig: CategoryConfig;
  handleDelete: (id: number) => void;
  handleEdit: (id: number, amount: number, category: string) => void;
  onTransactionAdded: (transaction: Transaction) => void;
}

const TransactionsMain: React.FC<TransactionsMainProps> = ({
  transactions,
  categoryConfig,
  handleDelete,
  handleEdit,
  onTransactionAdded,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<number | null>(
    null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] =
    useState<Transaction | null>(null);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.createdAt);
    return (
      transactionDate.getMonth() === currentMonth &&
      transactionDate.getFullYear() === currentYear
    );
  });

  const chartData = filteredTransactions.reduce((acc, transaction) => {
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

  const chartTransactions: TransactionChart[] = filteredTransactions.map(
    (transaction) => ({
      ...transaction,
      id: transaction.id.toString(),
    })
  );

  return (
    <div className="flex flex-row-reverse gap-6 max-md:flex max-md:flex-col">
      <div className="bg-customColor-800 rounded-lg p-10 w-1/2">
        <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-100">
          Aperçu
        </h2>
        <TransactionList
          transactions={filteredTransactions}
          categoryConfig={categoryConfig}
          onEdit={handleEditClick}
          onDelete={handleDeleteWithConfirmation}
        />
      </div>

      <div className="w-2/3">
        <TransactionChart
          chartDataArray={chartDataArray}
          chartConfig={chartConfig}
          // Supprimez ou commentez cette ligne si elle n'est pas nécessaire
          // transactions={chartTransactions}
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

export default TransactionsMain;
