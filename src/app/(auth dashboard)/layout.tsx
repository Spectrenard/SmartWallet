import { Sidebar } from "@/components/dashboard";

type RootLayoutProps = {
  children: React.ReactNode; // Définir le type pour les enfants
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="flex bg-gradient-to-br bg-customColor-900  min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 ml-72">{children}</main>
    </div>
  );
}
