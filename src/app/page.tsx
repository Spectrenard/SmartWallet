"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-r from-black to-slate-900 text-white flex flex-col items-center justify-center p-4 sm:p-8">
      <header className="mb-8 sm:mb-16 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold drop-shadow-lg">
          SmartWallet
        </h1>
        <p className="mt-2 sm:mt-4 text-lg sm:text-xl md:text-2xl font-bold">
          L'outil ultime pour gérer vos finances de manière simple et efficace
        </p>
      </header>

      <main className="text-center max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
        <p className="mb-6 sm:mb-8 text-base sm:text-lg leading-relaxed">
          Que vous souhaitiez garder un œil sur vos sorties d'argent ou
          planifier de grands projets, SmartWallet est là pour vous accompagner.
        </p>

        <button
          onClick={() => router.push("/login")}
          className="px-4 sm:px-6 py-2 sm:py-3 bg-emerald-600 text-white font-semibold rounded-full hover:bg-emerald-800 transition duration-300 ease-in-out shadow-lg text-sm sm:text-base"
        >
          Se connecter à SmartWallet
        </button>
      </main>
    </div>
  );
}
