"use client";
import { useState, useEffect } from "react";
import Loading from "@/components/Loading";

export default function Budgets() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuler un chargement
    setTimeout(() => {
      setIsLoading(false);
    }, 10);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return <div>budgets</div>;
}
