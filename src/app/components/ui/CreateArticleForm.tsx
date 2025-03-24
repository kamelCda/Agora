"use client";

import React, { FormEvent, useState } from "react";
import { Button } from "@/app/components/ui/button";
import { useArticles } from "@/app/DashboardAdministrateur/hooks/useArticles";

interface CreateArticleFormProps {
  selectedCategory: string | null;
  utilisateurId?: string;
}

const CreateArticleForm: React.FC<CreateArticleFormProps> = ({
  selectedCategory,
  utilisateurId,
}) => {
  const [newTitre, setNewTitre] = useState("");
  const [newContenu, setNewContenu] = useState("");
  const { addArticle } = useArticles();

  const handleAddArticle = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) {
      alert("Veuillez d'abord sélectionner une catégorie");
      return;
    }
    try {
      const res = await fetch(`/api/categories/${selectedCategory}/articles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titre: newTitre,
          contenu: newContenu,
          creeLe: new Date().toISOString(),
          utilisateur_id: utilisateurId,
          categorie_id: selectedCategory,
        }),
      });
      if (!res.ok) throw new Error("L'ajout de l'article a échoué");
      const data = await res.json();

      // Mise à jour de la liste locale
      addArticle(data.article);

      // Reset du formulaire
      setNewTitre("");
      setNewContenu("");
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'article :", error);
    }
  };

  if (!selectedCategory) {
    return null; // On n’affiche pas le formulaire tant qu’aucune catégorie n’est sélectionnée
  }

  return (
    <div className="mt-8 p-4 border rounded-md bg-gray-50">
      <h2 className="text-2xl mb-4">Ajouter un nouvel article</h2>
      <form onSubmit={handleAddArticle}>
        <div className="mb-4">
          <label className="block text-sm font-medium">Titre</label>
          <input
            type="text"
            value={newTitre}
            onChange={(e) => setNewTitre(e.target.value)}
            className="mt-1 block w-full border rounded-md p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Contenu</label>
          <textarea
            value={newContenu}
            onChange={(e) => setNewContenu(e.target.value)}
            className="mt-1 block w-full border rounded-md p-2"
            required
          />
        </div>
        <Button type="submit">Ajouter l'article</Button>
      </form>
    </div>
  );
};

export default CreateArticleForm;
