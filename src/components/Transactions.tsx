"use client";
import { useEffect, useState } from "react";
import AddTransactionForm from "./AddTransactionForm"; // Importer le composant
import TransactionsList from "../components/TransactionList"; // Importer le composant

import {
  Bookmark,
  Briefcase,
  Bus,
  Cross,
  House,
  ShoppingBasket,
  TreePalm,
  Utensils,
} from "lucide-react";
import TotalIncome from "./TotalMonthIncome";
import TotalExpense from "./TotalMonthExpense";

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
    Salaire: { color: "text-white", icon: <Briefcase /> },
    "Loisirs & vacances": { color: "text-white", icon: <TreePalm /> },
    "Alimentation & restaurants": {
      color: "text-white",
      icon: <Utensils />,
    },
    "Achats & Shopping": {
      color: "text-white",
      icon: <ShoppingBasket />,
    },
    Logement: {
      color: "text-white",
      icon: <House />,
    },
    Santé: {
      color: "text-white",
      icon: <Cross />,
    },
    Transports: {
      color: "text-white",
      icon: <Bus />,
    },
    Autre: { color: "text-white", icon: <Bookmark /> },
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

  return (
    <main className="min-h-screen flex flex-col mt-7 text-white">
      <div className="flex gap-6">
        <AddTransactionForm
          amount={amount}
          setAmount={setAmount}
          category={category}
          setCategory={setCategory}
          handleSubmit={handleSubmit}
        />
        <TotalIncome />
        <TotalExpense />
      </div>
      <TransactionsList
        transactions={transactions}
        categoryConfig={categoryStyleConfig}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
      />
    </main>
  );
}
