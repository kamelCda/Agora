"use client";
import { useState, useEffect } from "react";

export interface Article {
  id_article: string;
  titre: string;
  contenu: string;
  categorie_id: string;
  utilisateur_id: string;
  creeLe: string;
}

export function useArticles() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Récupère les articles d'une catégorie donnée
  const fetchArticles = async (categoryId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/categories/${categoryId}/articles`);
      if (!res.ok) {
        throw new Error("La récupération des articles a échoué");
      }
      const data = await res.json();
      // On s'assure ici de vider la liste avant de charger la nouvelle
      setArticles(data.articles ?? data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Une erreur inconnue est survenue"
      );
    } finally {
      setLoading(false);
    }
  };

  // Lors du changement de catégorie, on recharge les articles
  useEffect(() => {
    if (selectedCategory) {
      fetchArticles(selectedCategory);
    } else {
      // Réinitialisation de la liste quand aucune catégorie n'est sélectionnée
      setArticles([]);
    }
  }, [selectedCategory]);

  // (Les fonctions deleteArticle, updateArticle, addArticle restent inchangées)

  return {
    articles,
    loading,
    error,
    selectedCategory,
    setSelectedCategory,
    selectedArticle,
    setSelectedArticle,
    fetchArticles,
  };
}
