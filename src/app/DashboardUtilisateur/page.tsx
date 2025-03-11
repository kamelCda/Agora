"use client";

import { useSession } from "next-auth/react";

export default function DashboardUtilisateur() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Chargement...</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Dashboard utilisateur</h1>
      <p>Bienvenue, {session?.user.nom} !</p>
      <div className="accueil col-flex flex"></div>

      {/* Intégrez ici les composants spécifiques au dashboard formateur */}
    </div>
  );
}
