"use client";
import { useState, useEffect } from "react";
import TransactionsComponent from "@/components/Transactions";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import { ToastContainer } from "react-toastify";
import Loading from "@/components/Loading";

export default function Transactions() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuler un chargement
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <main className="min-h-screen p-4 flex flex-col">
      <h1 className="text-white text-3xl font-medium mb-6">
        Gérez vos transactions
      </h1>
      <TransactionsComponent />
      <ToastContainer />
    </main>
  );
}
