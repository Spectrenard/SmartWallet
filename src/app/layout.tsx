import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

// Définir les types pour les props
interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="flex bg-customColor-800 sm:bg-transparent">
        <main className="flex-1">{children}</main>
        <Analytics />
      </body>
    </html>
  );
}
