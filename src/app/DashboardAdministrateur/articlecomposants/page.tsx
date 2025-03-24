"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import CategorySelect from "@/app/components/CategorySelect";
import ArticlesList from "@/app/components/ArticlesList";
import ArticleDetails from "@/app/components/ArticleDetails";
import CreateArticleForm from "@/app/components/CreateArticleForm";

import { useArticles } from "@/app/DashboardAdministrateur/hooks/useArticles";

const PageArticleAdmin = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [moyenneEvaluations, setMoyenneEvaluations] = useState<number | null>(
    null
  );

  const utilisateurId = session?.user.id_utilisateur;

  // Utilisation complète du hook useArticles
  const {
    articles,
    loading,
    error,
    fetchArticlesPerso,
    fetchMoyenneEvaluations,
  } = useArticles();

  // Vérification du rôle ADMIN
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

  // Chargement articles lors du changement de catégorie
  const handleCategoryChange = async (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedArticle(null);
    await fetchArticlesPerso(categoryId);
  };

  // Chargement détails article
  const handleArticleClick = async (articleId: string) => {
    if (!selectedCategory) return;
    try {
      const res = await fetch(
        `/api/categories/${selectedCategory}/articles/${articleId}`
      );
      if (!res.ok) throw new Error("Échec récupération article");
      const data = await res.json();
      setSelectedArticle(data.article || null);

      const moyenne = await fetchMoyenneEvaluations(
        selectedCategory,
        articleId
      );
      setMoyenneEvaluations(moyenne !== undefined ? moyenne : null);
    } catch (error) {
      console.error("Erreur récupération article :", error);
    }
  };

  // Rafraîchir moyenne après évaluation
  const handleRefetchMoyenne = async (
    categorieId: string,
    articleId: string
  ) => {
    const moy = await fetchMoyenneEvaluations(categorieId, articleId);
    setMoyenneEvaluations(moy);
  };

  // Suppression article depuis PageArticleAdmin (centralisé)
  const handleDeleteArticle = async (
    articleId: string,
    categorieId: string
  ) => {
    if (confirm("Confirmer la suppression ?")) {
      try {
        const res = await fetch(
          `/api/categories/${categorieId}/articles/${articleId}`,
          { method: "DELETE" }
        );
        if (!res.ok) throw new Error("Échec suppression article");
        await fetchArticlesPerso(categorieId);
      } catch (error) {
        console.error("Erreur suppression article :", error);
      }
    }
  };

  if (status === "loading") return <p>Chargement de la session...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Articles par Catégorie</h1>

      <CategorySelect onCategoryChange={handleCategoryChange} />

      {loading && <p>Chargement des articles...</p>}
      {error && <p className="text-red-500">Erreur : {error}</p>}

      {!selectedArticle ? (
        <>
          <ArticlesList
            articles={articles}
            selectedCategory={selectedCategory}
            onArticleClick={handleArticleClick}
            onRefetchMoyenne={handleRefetchMoyenne}
            onDeleteArticle={(article) =>
              handleDeleteArticle(article.id_article, article.categorie_id)
            }
          />
          <CreateArticleForm
            selectedCategory={selectedCategory}
            utilisateurId={utilisateurId}
          />
        </>
      ) : (
        <ArticleDetails
          selectedCategory={selectedCategory}
          article={selectedArticle}
          moyenneEvaluations={moyenneEvaluations}
          onDeselectArticle={() => setSelectedArticle(null)}
          onRefetchMoyenne={handleRefetchMoyenne}
          utilisateurId={utilisateurId}
        />
      )}
    </div>
  );
};

export default PageArticleAdmin;
