"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        router.push("/dashboard");
      } else {
        const data = await response.json();
        setError(data.message || "La connexion a échoué. Veuillez réessayer.");
      }
    } catch (err) {
      setError("Une erreur s'est produite lors de la connexion.");
      console.error("Erreur de connexion:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-black to-slate-900 text-white flex flex-col items-center justify-center py-8">
      <h1 className="text-4xl mb-6 font-bold">Connexion</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 bg-opacity-80 p-8 rounded-lg shadow-lg w-full max-w-sm backdrop-blur-md"
      >
        {error && <p className="text-red-400 mb-4 text-center">{error}</p>}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-semibold" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:border-emerald-600 focus:ring-0"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            className="block mb-2 text-sm font-semibold"
            htmlFor="password"
          >
            Mot de passe
          </label>
          <input
            type="password"
            id="password"
            className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:border-emerald-600 focus:ring-0"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className={`w-full py-2 rounded-md text-white transition duration-300 ${
            loading ? "bg-gray-600" : "bg-emerald-700 hover:bg-emerald-800"
          }`}
          disabled={loading}
        >
          {loading ? "Chargement..." : "Se connecter"}
        </button>
      </form>
      <p className="mt-4 text-sm">
        Pas encore de compte ?{" "}
        <a href="/register" className="text-blue-300 hover:underline">
          Inscription
        </a>
      </p>
    </div>
  );
};

export default Login;
