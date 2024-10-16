import TransactionsComponent from "@/components/Transactions";

export default function Transactions() {
  return (
    <main className="min-h-screen  p-4 flex flex-col ">
      <h1 className="text-white text-3xl font-medium mb-6">
        Gérez vos transactions
      </h1>
      <TransactionsComponent />
    </main>
  );
}
