"use client";
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";

type RootLayoutProps = {
  children: React.ReactNode; // Définir le type pour les enfants
};

export default function RootLayout({ children }: RootLayoutProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="flex bg-gradient-to-br bg-customColor-900 min-h-screen">
      <Sidebar />
      <main className={`flex-1 p-6 ${isMobile ? "ml-0" : "ml-72"}`}>
        {children}
      </main>
    </div>
  );
}
