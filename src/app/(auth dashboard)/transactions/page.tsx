"use client";
import { useState, useEffect } from "react";
import TransactionsComponent from "@/components/Transactions";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import Loading from "@/components/Loading";

export default function Transactions() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/transactions");
        const data = await response.json();
      } catch (error) {
        console.error("Erreur lors du chargement des transactions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <main className="min-h-screen sm:p-4 flex flex-col">
      <h1 className="text-white text-2xl md:text-3xl font-medium mb-4 md:mb-6">
        Gérez vos transactions
      </h1>
      <TransactionsComponent />
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        className="!bottom-4 sm:!bottom-8"
        toastClassName="!bg-customColor-400 !text-white !rounded-lg !shadow-lg !p-4"
        bodyClassName="!text-sm !font-medium"
      />
    </main>
  );
}
