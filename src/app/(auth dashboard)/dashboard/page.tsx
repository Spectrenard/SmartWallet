import TotalBalance from "@/components/TotalBalance";
import TotalMonthExpense from "@/components/TotalMonthExpense";
import TotalIncome from "@/components/TotalMonthIncome";

export default function Home() {
  return (
    <main className="min-h-screen  p-4 flex flex-col ">
      <p className="text-white text-3xl font-normal mb-6 ">Aperçu</p>
      <div className="flex gap-4">
        <TotalBalance />
        <TotalIncome />
        <TotalMonthExpense />
      </div>
    </main>
  );
}
