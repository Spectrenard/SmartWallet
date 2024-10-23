import React from "react";

interface Transaction {
  id: number;
  amount: number;
  category: string;
  createdAt: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

type Category =
  | "Salaire"
  | "Transports"
  | "Loisirs & vacances"
  | "Alimentation & restaurants"
  | "Achats & Shopping"
  | "Logement"
  | "Santé"
  | "Autre";

const categoryStyleConfig: Record<
  Category,
  { color: string; icon: JSX.Element }
> = {
  Salaire: { color: "text-white", icon: <span>💼</span> },
  "Loisirs & vacances": { color: "text-white", icon: <span>🏝️</span> },
  "Alimentation & restaurants": {
    color: "text-white",
    icon: <span>🍽️</span>,
  },
  "Achats & Shopping": {
    color: "text-white",
    icon: <span>🛍️</span>,
  },
  Logement: {
    color: "text-white",
    icon: <span>🏠</span>,
  },
  Santé: {
    color: "text-white",
    icon: <span>⚕️</span>,
  },
  Transports: {
    color: "text-white",
    icon: <span>🚌</span>,
  },
  Autre: { color: "text-white", icon: <span>🔖</span> },
};

const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
}) => {
  // Trier les transactions par date de création, du plus récent au plus ancien
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="max-h-[200px] sm:max-h-[400px] overflow-y-auto">
      {sortedTransactions.length === 0 ? (
        <p className="text-center text-gray-400">Aucune transaction récente.</p>
      ) : (
        sortedTransactions.map((transaction) => {
          const amountColor =
            transaction.amount < 0 ? "text-red-700" : "text-emerald-600";
          const { icon } =
            categoryStyleConfig[transaction.category as Category] ||
            categoryStyleConfig.Autre;

          return (
            <div
              key={transaction.id}
              className="flex justify-between items-center p-3 sm:p-6 mb-2 bg-customColor-700 rounded-lg shadow-md"
            >
              <div className="flex items-center flex-1">
                <span className="mr-2">{icon}</span>
                <span className="font-normal text-xs sm:text-sm text-white">
                  {transaction.category}
                </span>
              </div>
              <span className={`text-sm sm:text-md ${amountColor}`}>
                {transaction.amount.toFixed(2)}€
              </span>
            </div>
          );
        })
      )}
    </div>
  );
};

export default RecentTransactions;
