"use client";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import Cookies from "js-cookie";

export default function Logout() {
  const router = useRouter();

  const handleLogout = () => {
    // Ajoutez un log pour voir tous les cookies
    console.log("Tous les cookies : ", document.cookie);

    // Vérifiez si le cookie existe avant de le supprimer
    const token = Cookies.get("token");
    if (token) {
      console.log("Token trouvé : ", token);
      Cookies.remove("token", { path: "/" });
      console.log("Token supprimé avec succès.");
    } else {
      console.log("Aucun token trouvé.");
    }

    router.push("login");
  };

  return (
    <Button
      className="bg-customColor-500 text-white hover:bg-red-700 transation duration-300"
      onClick={handleLogout}
    >
      Se déconnecter
    </Button>
  );
}
