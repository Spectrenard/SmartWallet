"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const MIN_PASSWORD_LENGTH = 6; // Longueur minimale pour le mot de passe
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expression régulière pour l'email

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage(""); // Réinitialise le message de succès à chaque soumission

    if (!EMAIL_REGEX.test(email)) {
      setError("Veuillez entrer un email valide");
      setLoading(false);
      return;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(
        `Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères.`
      );
      setLoading(false);
      return;
    }

    const passwordComplexityRegex =
      /^(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&*\-\_])/;
    if (!passwordComplexityRegex.test(password)) {
      setError(
        "Le mot de passe doit contenir au moins une majuscule, un chiffre et un symbole."
      );
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setSuccessMessage("Inscription réussie ! Redirection...");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
      console.log("Inscription réussie :", data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur s'est produite lors de l'inscription.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-black to-slate-900 text-white flex flex-col items-center justify-center p-4 sm:p-8">
      <h1 className="text-3xl sm:text-4xl mb-4 sm:mb-6 font-bold">
        Inscription
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 bg-opacity-80 p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md backdrop-blur-md"
      >
        {error && <p className="text-red-400 mb-4 text-center">{error}</p>}
        {successMessage && (
          <p className="text-green-400 mb-4 text-center">{successMessage}</p>
        )}
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
            required
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
          {loading ? "Chargement..." : "S'inscrire"}
        </button>
      </form>
      <p className="mt-4 text-xs sm:text-sm">
        Déjà un compte ?{" "}
        <a href="/login" className="text-blue-300 hover:underline">
          Connexion
        </a>
      </p>
    </div>
  );
};

export default Register;
