import "./globals.css";

// Définir les types pour les props
interface RootLayoutProps {
  children: React.ReactNode; // Utilise React.ReactNode pour le type des enfants
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fr">
      <body className="flex">
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
