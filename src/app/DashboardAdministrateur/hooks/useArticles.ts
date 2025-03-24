"use client";
import { useState, useEffect, useCallback } from "react";

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

  // Nouveau state pour la moyenne
  const [moyenneEvaluations, setMoyenneEvaluations] = useState<number | null>(
    null
  );

  // Récupère les articles personnels d'une catégorie donnée
  const fetchArticlesPerso = async (categoryId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/categories/${categoryId}/mesArticles/`);
      if (!res.ok) throw new Error("La récupération des articles a échoué");
      const data = await res.json();
      setArticles(data.mesarticles ?? data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Une erreur inconnue est survenue"
      );
    } finally {
      setLoading(false);
    }
  };

  // Récupère les articles  d'une catégorie donnée
  const fetchArticles = async (categoryId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/categories/${categoryId}/articles/`);
      if (!res.ok) throw new Error("La récupération des articles a échoué");
      const data = await res.json();
      setArticles(data.articles ?? data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Une erreur inconnue est survenue"
      );
    } finally {
      setLoading(false);
    }
  };

  // Chargement automatique quand selectedCategory change
  // useEffect(() => {
  //   if (selectedCategory) {
  //     fetchArticlesPerso(selectedCategory);
  //   }
  // }, [selectedCategory]);

  // --------------------------------
  // LECTURE : récupérer UN article précis
  // --------------------------------
  const fetchOneArticle = useCallback(
    async (categoryId: string, articleId: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/categories/${categoryId}/articles/${articleId}`
        );
        if (!res.ok) {
          throw new Error("Erreur lors de la récupération d'un article");
        }
        const data = await res.json();
        // data.article
        setSelectedArticle(data.article);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Supprimer un article
  const deleteArticle = async (article: Article) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/categories/${article.categorie_id}/articles/${article.id_article}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("La suppression de l'article a échoué");
      setArticles((prev) =>
        prev.filter((a) => a.id_article !== article.id_article)
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Une erreur inconnue est survenue"
      );
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour un article
  const updateArticle = async (
    updatedArticle: Partial<Article> &
      Pick<Article, "id_article" | "categorie_id">
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
      if (!res.ok) throw new Error("La mise à jour de l'article a échoué");
      const updatedFromServer = await res.json();
      setArticles((prev) =>
        prev.map((a) =>
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

  // Ajouter un nouvel article dans le state local
  const addArticle = (newArticle: Article) => {
    setArticles((prevArticles) => [...prevArticles, newArticle]);
  };

  // 1) Nouveau : fonction pour récupérer la moyenne d’évaluation d’un article
  // Nouveau fetchMoyenneEvaluations avec retour explicite
  const fetchMoyenneEvaluations = async (
    categorieId: string,
    articleId: string
  ): Promise<number | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/categories/${categorieId}/articles/${articleId}/evaluations/moyenne`
      );
      if (!res.ok) {
        throw new Error("Erreur lors de la récupération de la moyenne");
      }
      const data = await res.json();
      const moyenne = data.moyenne !== undefined ? data.moyenne : null;

      setMoyenneEvaluations(moyenne); // conserve le state si besoin
      return moyenne; // ajoute ce retour explicite
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Une erreur inconnue est survenue"
      );
      setMoyenneEvaluations(null); // réinitialise en cas d'erreur
      return null; // retourne null en cas d'erreur
    } finally {
      setLoading(false);
    }
  };

  return {
    articles,
    selectedArticle,
    selectedCategory,
    loading,
    error,
    moyenneEvaluations, // <--- on l’exporte
    setSelectedCategory,
    setSelectedArticle,
    fetchArticlesPerso,
    fetchArticles,
    deleteArticle,
    updateArticle,
    addArticle,
    fetchOneArticle,
    fetchMoyenneEvaluations, // <--- on l’exporte aussi
  };
}
