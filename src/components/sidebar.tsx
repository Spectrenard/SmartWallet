"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Home, ArrowUpDown, ChartPie, Menu } from "lucide-react";
import Logout from "./ui/LogoutBtn";

export function Sidebar() {
  const [activeLink, setActiveLink] = useState<string>("dashboard");
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLinkClick = (link: string) => {
    setActiveLink(link);
    if (isMobile) setIsOpen(false);
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {isMobile && (
        <nav className="fixed top-0 left-0 right-0 bg-customColor-800 text-white h-16 flex items-center justify-between px-4 z-50">
          <Link href="/dashboard">
            <h1 className="text-2xl font-extrabold tracking-tight font-audiowide text-gray-200 cursor-pointer">
              SmartWallet
            </h1>
          </Link>
          <div className="flex items-center">
            <Logout />
            <button
              onClick={toggleSidebar}
              className="p-2 bg-customColor-700 rounded-md"
            >
              <Menu className="h-6 w-6 text-white" />
            </button>
          </div>
        </nav>
      )}
      <aside
        className={`bg-customColor-800 text-white min-h-screen w-72 flex flex-col rounded-r-2xl shadow-lg fixed transition-all duration-300 ease-in-out ${
          isOpen ? "left-0" : "-left-72"
        } ${isMobile ? "z-40 top-16" : "top-0"}`}
      >
        {!isMobile && (
          <h1 className="text-2xl font-extrabold tracking-tight font-audiowide text-gray-200 p-4">
            SmartWallet
          </h1>
        )}
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
          </ul>
        </nav>

        {!isMobile && (
          <div className="p-4 border-gray-700">
            <Logout />
          </div>
        )}
      </aside>
    </>
  );
}
