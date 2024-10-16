"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-r from-black to-slate-900 text-white flex flex-col items-center justify-center">
      <header className="mb-16 text-center">
        <h1 className="text-6xl font-bold drop-shadow-lg">SmartWallet</h1>
        <p className="mt-4 text-xl font-bold">
          L'outil ultime pour gérer vos finances de manière simple et efficace
        </p>
      </header>

      <main className="text-center max-w-2xl">
        <p className="mb-8 text-lg leading-relaxed">
          Que vous souhaitiez garder un œil sur vos sorties d'argent ou
          planifier de grands projets, SmartWallet est là pour vous accompagner.
        </p>

        <button
          onClick={() => router.push("/login")}
          className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-full hover:bg-emerald-800  transition duration-300 ease-in-out shadow-lg"
        >
          Se connecter à SmartWallet
        </button>
      </main>
    </div>
  );
}
