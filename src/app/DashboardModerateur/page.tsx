"use client";
import React from "react";
import { useSession } from "next-auth/react";

export default function DashboardModerateur() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Chargement...</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Dashboard Moderateur</h1>
      <p>Bienvenue, {session?.user.nom} !</p>
      <div className="accueil col-flex flex"></div>

      Intégrez ici les composants spécifiques au dashboard moderateur
    </div>
  );
}
