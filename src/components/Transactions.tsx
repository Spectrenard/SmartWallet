"use client";
import { useEffect, useState } from "react";
import AddTransactionForm from "./AddTransactionForm";
import TransactionsMain from "../components/TransactionMain";

interface Transaction {
  id: number;
  amount: number;
  category: string;
  createdAt: string;
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

export default function Transactions() {
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

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [amount, setAmount] = useState<string>("");
  const [category, setCategory] = useState<string>("");

  const fetchTransactions = async () => {
    const res = await fetch("/api/transactions");
    const data: Transaction[] = await res.json();
    if (Array.isArray(data)) {
      setTransactions(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: parseFloat(amount), category }),
    });
    if (res.ok) {
      fetchTransactions();
      setAmount("");
      setCategory("");
    } else {
      console.error("Erreur lors de la création de la transaction");
    }
  };

  const handleDelete = async (id: number) => {
    const res = await fetch("/api/transactions", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      fetchTransactions();
    } else {
      console.error("Erreur lors de la suppression de la transaction");
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleEdit = async (id: number, amount: number, category: string) => {
    const res = await fetch("/api/transactions", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, amount, category }),
    });
    if (res.ok) {
      fetchTransactions();
    } else {
      console.error("Erreur lors de la modification de la transaction");
    }
  };

  const handleAddTransaction = (
    newTransaction: Omit<Transaction, "id" | "createdAt">
  ) => {
    setTransactions((prevTransactions) => [
      ...prevTransactions,
      {
        ...newTransaction,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      },
    ]);
  };
  return (
    <main className="min-h-screen flex flex-col mt-7 text-white">
      <div className="max-w-xl">
        <AddTransactionForm
          amount={amount}
          setAmount={setAmount}
          category={category}
          setCategory={setCategory}
          handleSubmit={handleSubmit}
          onTransactionAdded={handleAddTransaction}
        />
      </div>

      <TransactionsMain
        transactions={transactions}
        categoryConfig={categoryStyleConfig}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        onTransactionAdded={handleAddTransaction}
      />
    </main>
  );
}
