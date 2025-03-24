"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Composants découpés
import CategorySelect from "@/app/components/CategorySelect";
import ArticlesList from "@/app/components/ArticlesList";
import ArticleDetails from "@/app/components/ArticleDetails";
import CreateArticleForm from "@/app/components/CreateArticleForm";

// Hooks
import {
  Article,
  useArticles,
} from "@/app/DashboardAdministrateur/hooks/useArticles";

const PageArticleAdmin = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Vérification de la session et des rôles
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
      return;
    }
    const roles = session.user.role;
    if (!roles.includes("ADMINISTRATEUR")) {
      router.push("/unauthorized");
      return;
    }
  }, [session, status, router]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const {
    // Éléments de useArticles
    articles,
    loading,
    error,
    moyenneEvaluations,
    fetchMoyenneEvaluations,
    fetchArticlesPerso,
  } = useArticles();

  // ID utilisateur
  const utilisateurId = session?.user.id_utilisateur;

  // Gestion du changement de catégorie
  const handleCategoryChange = async (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedArticle(null);
    // On va chercher les articles "perso" de cette catégorie
    await fetchArticlesPerso(categoryId);
  };

  // Au clic sur un article, on récupère les détails
  const fetchArticleDetails = async (articleId: string) => {
    if (!selectedCategory) return;
    try {
      const res = await fetch(
        `/api/categories/${selectedCategory}/articles/${articleId}`
      );
      if (!res.ok) throw new Error("La récupération de l'article a échoué");
      const data = await res.json();
      setSelectedArticle(data.article || null);

      // Récupération de la moyenne
      await fetchMoyenneEvaluations(selectedCategory, articleId);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'article :", error);
    }
  };

  // Pour recalculer la moyenne une fois l’évaluation finie
  const handleRefetchMoyenne = async (catId: string, articleId: string) => {
    await fetchMoyenneEvaluations(catId, articleId);
  };

  if (status === "loading") {
    return <p>Chargement de la session...</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Articles par Catégorie</h1>

      {/* Sélecteur de catégorie */}
      <CategorySelect onCategoryChange={handleCategoryChange} />

      {/* Gestion des erreurs / chargement global des articles */}
      {loading && <p>Chargement des articles...</p>}
      {error && <p className="text-red-500">Erreur: {error}</p>}

      {!selectedArticle ? (
        <>
          {/* Liste des articles */}
          <ArticlesList
            articles={articles}
            onArticleClick={(articleId) => fetchArticleDetails(articleId)}
            onRefetchMoyenne={handleRefetchMoyenne}
            selectedCategory={selectedCategory}
            onDeleteArticle={() => {}}
          />

          {/* Formulaire de création d’article */}
          {selectedCategory && (
            <CreateArticleForm
              selectedCategory={selectedCategory}
              utilisateurId={utilisateurId}
              //addArticle={addArticle}
            />
          )}
        </>
      ) : (
        // Détails d’un article
        <ArticleDetails
          article={selectedArticle}
          onDeselectArticle={() => setSelectedArticle(null)}
          selectedCategory={selectedCategory}
          moyenneEvaluations={moyenneEvaluations}
          onRefetchMoyenne={handleRefetchMoyenne}
          utilisateurId={utilisateurId}
        />
      )}
    </div>
  );
};

export default PageArticleAdmin;
