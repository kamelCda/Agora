


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
      // On s'assure ici que la réponse contient bien les articles
      setArticles(data.articles ?? data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Une erreur inconnue est survenue"
      );
    } finally {
      setLoading(false);
    }
  };

  // Lors du changement de catégorie sélectionnée, on recharge les articles
  useEffect(() => {
    if (selectedCategory) {
      fetchArticles(selectedCategory);
    }
  }, [selectedCategory]);

  // Supprime un article en utilisant l'API dans le bon endpoint
  const deleteArticle = async (article: Article) => {
    setLoading(true);
    setError(null);
    try {
      await fetch(
        `/api/categories/${article.categorie_id}/articles/${article.id_article}`,
        { method: "DELETE" }
      );
      setArticles((prevArticles) =>
        prevArticles.filter((a) => a.id_article !== article.id_article)
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Une erreur inconnue est survenue"
      );
    } finally {
      setLoading(false);
    }
  };

  // Met à jour un article via l'API en ciblant le endpoint correspondant
  // On attend ici que updatedArticle contienne au minimum l'id de l'article et l'id de la catégorie
  const updateArticle = async (
    updatedArticle: Partial<Article> & Pick<Article, "id_article" | "categorie_id">
  ) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/categories/${updatedArticle.categorie_id}/articles/${updatedArticle.id_article}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedArticle),
        }
      );
      if (!res.ok) {
        throw new Error("La mise à jour de l'article a échoué");
      }
      const updatedFromServer = await res.json();
      setArticles((prevArticles) =>
        prevArticles.map((a) =>
          a.id_article === updatedFromServer.id_article ? updatedFromServer : a
        )
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Une erreur inconnue est survenue"
      );
    } finally {
      setLoading(false);
    }
  };

  // Ajoute un article à la liste actuelle
  const addArticle = (newArticle: Article) => {
    setArticles((prevArticles) => [...prevArticles, newArticle]);
  };

  return {
    articles,
    loading,
    error,
    selectedCategory,
    setSelectedCategory,
    selectedArticle,
    setSelectedArticle,
    fetchArticles,
    deleteArticle,
    updateArticle,
    addArticle,
  };
}

