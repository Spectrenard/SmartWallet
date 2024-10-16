"use client";
import { useState } from "react";
import Link from "next/link";
import { Home, ArrowUpDown, ChartPie, ReceiptEuro } from "lucide-react";
import Logout from "./ui/LogoutBtn";

export function Sidebar() {
  const [activeLink, setActiveLink] = useState<string>("dashboard");

  const handleLinkClick = (link: string) => {
    setActiveLink(link);
  };

  return (
    <aside className="bg-customColor-800 text-white min-h-screen w-72 flex flex-col rounded-r-2xl shadow-lg fixed">
      <div className="flex items-center pl-7 h-16 border-gray-700 rounded-t-lg">
        <h1 className="text-3xl font-extrabold tracking-tight font-audiowide text-gray-200">
          SmartWallet
        </h1>
      </div>

      <nav className="flex-1 p-4 rounded-b-lg">
        <ul className="flex flex-col gap-4">
          <li>
            <Link
              href="/dashboard"
              className={`flex items-center gap-2 p-3 rounded-md transition-all duration-200 ${
                activeLink === "dashboard"
                  ? "bg-emerald-600"
                  : "hover:bg-emerald-600"
              }`}
              onClick={() => handleLinkClick("dashboard")}
            >
              <Home className="h-5 w-5" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/budgets"
              className={`flex items-center gap-2 p-3 rounded-md transition-all duration-200 ${
                activeLink === "budgets"
                  ? "bg-emerald-600"
                  : "hover:bg-emerald-600"
              }`}
              onClick={() => handleLinkClick("budgets")}
            >
              <ArrowUpDown className="h-5 w-5" />
              Budgets
            </Link>
          </li>
          <li>
            <Link
              href="/transactions"
              className={`flex items-center gap-2 p-3 rounded-md transition-all duration-200 ${
                activeLink === "transactions"
                  ? "bg-emerald-600"
                  : "hover:bg-emerald-600"
              }`}
              onClick={() => handleLinkClick("transactions")}
            >
              <ChartPie className="h-5 w-5" />
              Transactions
            </Link>
          </li>
          <li>
            <Link
              href="/abonnements"
              className={`flex items-center gap-2 p-3 rounded-md transition-all duration-200 ${
                activeLink === "abonnements"
                  ? "bg-emerald-600"
                  : "hover:bg-emerald-600"
              }`}
              onClick={() => handleLinkClick("abonnements")}
            >
              <ReceiptEuro className="h-5 w-5" />
              Abonnements
            </Link>
          </li>
        </ul>
      </nav>

      <div className="p-4 border-gray-700">
        <Logout />
      </div>
    </aside>
  );
}
