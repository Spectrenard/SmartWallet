import TotalBalance from "@/components/TotalBalance";

export default function Home() {
  return (
    <main className="min-h-screen  p-4 flex flex-col ">
      <p className="text-white text-3xl font-normal mb-6 ">Aperçu</p>
      <TotalBalance />
    </main>
  );
}
