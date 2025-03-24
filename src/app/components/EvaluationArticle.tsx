"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";

interface EvaluationProps {
  categorieId: string;
  articleId: string;
  onEvaluationDone?: () => void; // callback si on veut rafraîchir l'affichage
}

export default function EvaluationForm({
  categorieId,
  articleId,
  onEvaluationDone,
}: EvaluationProps) {
  const [valeur, setValeur] = useState<number>(5); // Note par défaut
  const { data: session, status } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Vérifie que l'utilisateur est bien connecté (session OK)
    if (!session?.user?.id_utilisateur) {
      console.error("Vous devez être connecté pour évaluer un article.");
      return;
    }
    /********NOTIFCIATION A EFFECTUER A L UTILISATEUR APRES EVALUATION************* */
    try {
      const res = await fetch(
        `/api/categories/${categorieId}/articles/${articleId}/evaluations`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            utilisateur_id: session.user.id_utilisateur,
            valeur,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Erreur lors de l’envoi de l’évaluation");
      }

      // On notifie le parent qu’on a fini, si un callback est fourni
      if (onEvaluationDone) onEvaluationDone();
    } catch (error) {
      console.error("Erreur EvaluationForm:", error);
      // Gérer l’erreur (affichage, etc.)
    }
  };

  // Cas 1: la session est encore en cours de chargement
  if (status === "loading") {
    return <p>Chargement de la session...</p>;
  }

  // Cas 2: l'utilisateur n'est pas connecté
  if (!session) {
    return <p>Vous devez être connecté pour évaluer cet article.</p>;
  }

  // Cas 3: l'utilisateur est connecté, on affiche le formulaire
  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <label className="mr-2">Votre note :</label>
      <select
        value={valeur}
        onChange={(e) => setValeur(Number(e.target.value))}
        className="border rounded px-2 py-1 mr-2"
      >
        <option value={1}>1 étoile</option>
        <option value={2}>2 étoiles</option>
        <option value={3}>3 étoiles</option>
        <option value={4}>4 étoiles</option>
        <option value={5}>5 étoiles</option>
      </select>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-1 rounded"
      >
        Évaluer
      </button>
    </form>
  );
}
