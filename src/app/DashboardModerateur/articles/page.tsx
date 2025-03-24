"use client";

import { useEffect, useState, FormEvent } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Hooks persos
import { useCategories } from "@/app/DashboardAdministrateur/hooks/useCategories";
import {
  useArticles,
  Article,
} from "@/app/DashboardAdministrateur/hooks/useArticles";
import { useCommentaires } from "@/app/DashboardAdministrateur/hooks/useCommentaires";

// Composants UI
import { Card, CardContent } from "@/app/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/app/components/ui/select";
import { Button } from "@/app/components/ui/button";
import UpvoteButton from "@/app/components/upVoteButton";

// ⬇️ Le composant d’évaluation (nouvel import)
import EvaluationForm from "@/app/components/EvaluationArticle";

interface CommentaireForm {
  contenu: string;
}

const PageArticleModerateur = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // 1) Vérification de la session et du rôle moderateur
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
      return;
    }
    const roles = session.user.role;
    if (!roles.includes("MODERATEUR")) {
      router.push("/unauthorized");
      return;
    }
  }, [session, status, router]);

  // 2) Récupération des catégories
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  // 3) Récupération et gestion des articles via le hook
  const {
    articles,
    loading,
    error,
    selectedCategory,
    setSelectedCategory,
    selectedArticle,
    setSelectedArticle,
    addArticle,
    moyenneEvaluations,
    fetchMoyenneEvaluations,
    // ⬇️ IMPORTANT : On récupère la fonction fetchArticles
    fetchArticles,
  } = useArticles();

  // 4) ID utilisateur
  const utilisateurId = session?.user.id_utilisateur;

  // 5) Hook pour les commentaires (activé uniquement si un article est sélectionné)
  const {
    commentaires,
    loading: loadingCommentaires,
    error: errorCommentaires,
    fetchCommentaires,
    postCommentaire,
    updateCommentaire,
    deleteCommentaire,
  } = useCommentaires(
    selectedArticle ? selectedArticle.categorie_id : "",
    selectedArticle ? selectedArticle.id_article : ""
  );

  // Quand on sélectionne un article, on charge directement ses commentaires
  useEffect(() => {
    if (selectedArticle) {
      fetchCommentaires();
    }
  }, [selectedArticle, fetchCommentaires]);

  // 6) Gestion manuelle du changement de catégorie
  //    On appelle "fetchArticles" ici pour pointer sur "/articles"
  const handleCategoryChange = async (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedArticle(null);
    // Appel MANUEL à la fonction pour charger les articles
    await fetchArticles(categoryId);
  };

  // 7) Récupération du détail d’un article et de sa moyenne
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

  const handleArticleClick = (articleId: string) => {
    fetchArticleDetails(articleId);
  };

  // ---------------------------------------------------------
  // Gestion des commentaires (ajout, édition, suppression)
  // ---------------------------------------------------------
  const [newComment, setNewComment] = useState<CommentaireForm>({
    contenu: "",
  });
  const handlePostComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!newComment.contenu.trim()) return;
    await postCommentaire(newComment.contenu);
    setNewComment({ contenu: "" });
  };

  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentContent, setEditCommentContent] = useState("");

  const handleEditComment = (commentaireId: string, contenu: string) => {
    setEditingCommentId(commentaireId);
    setEditCommentContent(contenu);
  };

  const handleUpdateComment = async (commentaireId: string) => {
    await updateCommentaire({
      id_commentaire: commentaireId,
      contenu: editCommentContent,
    });
    setEditingCommentId(null);
    setEditCommentContent("");
  };

  // ---------------------------------------------------------
  // Gestion des articles (suppression, édition, création)
  // ---------------------------------------------------------
  const [editTitre, setEditTitre] = useState("");
  const [editContenu, setEditContenu] = useState("");

  // Préremplir le formulaire d'édition quand un article est sélectionné
  useEffect(() => {
    if (selectedArticle) {
      setEditTitre(selectedArticle.titre);
      setEditContenu(selectedArticle.contenu);
    }
  }, [selectedArticle]);

  // Suppression d'un article
  const handleDeleteArticle = async (article: Article) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
      try {
        const res = await fetch(
          `/api/categories/${article.categorie_id}/articles/${article.id_article}`,
          { method: "DELETE" }
        );
        if (!res.ok) throw new Error("La suppression de l'article a échoué");
        // Mettez à jour la liste si nécessaire (par ex. refetch ou remove localement)
      } catch (error) {
        console.error("Erreur lors de la suppression de l'article :", error);
      }
    }
  };

  // Édition / Mise à jour d'un article
  const handleUpdateArticle = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedArticle || !selectedCategory) return;
    try {
      const res = await fetch(
        `/api/categories/${selectedCategory}/articles/${selectedArticle.id_article}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            titre: editTitre,
            contenu: editContenu,
            miseAjourLe: new Date().toISOString(),
            utilisateur_id: selectedArticle.utilisateur_id,
          }),
        }
      );
      if (!res.ok) throw new Error("La mise à jour de l'article a échoué");
      // On pourrait recharger l'article ou mettre à jour localement
      setSelectedArticle(null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'article :", error);
    }
  };

  // Création d'un nouvel article
  const [newTitre, setNewTitre] = useState("");
  const [newContenu, setNewContenu] = useState("");

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
      // Mise à jour du state local
      addArticle(data.article);
      setNewTitre("");
      setNewContenu("");
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'article :", error);
    }
  };

  // ---------------------------------------------------------
  // Rendu / UI
  // ---------------------------------------------------------
  if (status === "loading") {
    return <p>Chargement de la session...</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Articles par Catégorie</h1>

      {/* Chargement / Erreur Catégories */}
      {categoriesLoading && <p>Chargement des catégories...</p>}
      {categoriesError && (
        <p className="text-red-500">Erreur: {categoriesError}</p>
      )}

      {/* Sélection de la catégorie */}
      {categories.length > 0 && (
        <Select onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full mb-4">
            <SelectValue placeholder="Choisissez une catégorie" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem
                key={category.id_categorie}
                value={category.id_categorie}
              >
                {category.nomCategorie}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Chargement / Erreur Articles */}
      {loading && <p>Chargement des articles...</p>}
      {error && <p className="text-red-500">Erreur: {error}</p>}

      {/* Liste d'articles si aucun article n'est sélectionné */}
      {!selectedArticle ? (
        // <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="grid grid-cols-1 gap-4">
          {articles.map((article: Article) => (
            <Card key={article.id_article} className="p-4">
              <CardContent>
                <h2
                  className="text-xl font-semibold mb-2 cursor-pointer"
                  onClick={() => handleArticleClick(article.id_article)}
                >
                  {article.titre}
                </h2>
                <p className="text-sm mb-2">{article.contenu}</p>
                <p className="text-xs text-gray-500">
                  Publié le {new Date(article.creeLe).toLocaleDateString()}
                </p>

                {/* Supprimer */}
                <div className="mt-2 flex gap-2">
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteArticle(article)}
                  >
                    Supprimer
                  </Button>
                </div>

                {/* Formulaire d’évaluation */}
                <EvaluationForm
                  categorieId={article.categorie_id}
                  articleId={article.id_article}
                  onEvaluationDone={() =>
                    fetchMoyenneEvaluations(
                      article.categorie_id,
                      article.id_article
                    )
                  }
                />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        // Sinon, détails de l'article sélectionné
        <div className="p-4 mt-4 border rounded-md bg-white shadow-lg">
          <h2 className="text-2xl mb-2">{selectedArticle.titre}</h2>
          <p>{selectedArticle.contenu}</p>
          <p className="text-xs text-gray-500">
            Publié le {new Date(selectedArticle.creeLe).toLocaleDateString()}
          </p>

          {/* Affichage de la moyenne */}
          <p className="mt-2 font-semibold">
            Moyenne des évaluations :{" "}
            {moyenneEvaluations !== null
              ? moyenneEvaluations.toFixed(1)
              : "Pas encore évalué"}
          </p>

          <Button onClick={() => setSelectedArticle(null)} className="mt-4">
            Retour aux articles
          </Button>

          {/* Formulaire de mise à jour de l'article */}
          <form
            onSubmit={handleUpdateArticle}
            className="mt-4 shadow-lg p-4 border rounded-md bg-white"
          >
            <div className="mb-4">
              <label className="block text-sm font-medium">Titre</label>
              <input
                type="text"
                value={editTitre}
                onChange={(e) => setEditTitre(e.target.value)}
                className="mt-1 block w-full p-2 border-none focus:ring-0 focus:outline-none bg-transparent"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Contenu</label>
              <textarea
                value={editContenu}
                onChange={(e) => setEditContenu(e.target.value)}
                className="mt-1 block w-full p-2 border-none focus:ring-0 focus:outline-none bg-transparent"
                required
              />
            </div>
            <Button type="submit">Mettre à jour article</Button>
          </form>

          {/* Section Commentaires */}
          <h3 className="text-xl mt-6 mb-4">Commentaires :</h3>
          {loadingCommentaires && <p>Chargement des commentaires...</p>}
          {errorCommentaires && (
            <p className="text-red-500">Erreur: {errorCommentaires}</p>
          )}
          {commentaires.map((commentaire) => (
            <div
              key={commentaire.id_commentaire}
              className="p-2 border mb-2 rounded-md"
            >
              {editingCommentId === commentaire.id_commentaire ? (
                <>
                  <textarea
                    value={editCommentContent}
                    onChange={(e) => setEditCommentContent(e.target.value)}
                    className="mt-1 block w-full p-2 border-none focus:ring-0 focus:outline-none bg-transparent"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() =>
                        handleUpdateComment(commentaire.id_commentaire)
                      }
                    >
                      Sauvegarder
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => setEditingCommentId(null)}
                    >
                      Annuler
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p className="mb-1">{commentaire.contenu}</p>
                  <div className="flex items-center gap-2">
                    <UpvoteButton
                      categorieId={selectedArticle.categorie_id}
                      articleId={selectedArticle.id_article}
                      commentaireId={commentaire.id_commentaire}
                      utilisateurId={utilisateurId}
                      initialUpvotes={commentaire.upvotes.length}
                    />
                    <Button
                      onClick={() =>
                        handleEditComment(
                          commentaire.id_commentaire,
                          commentaire.contenu
                        )
                      }
                      size="sm"
                    >
                      Modifier
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() =>
                        deleteCommentaire(commentaire.id_commentaire)
                      }
                      size="sm"
                    >
                      Supprimer
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}

          {/* Formulaire d'ajout d'un nouveau commentaire */}
          <form
            onSubmit={handlePostComment}
            className="mt-4 shadow-lg p-4 border rounded-md bg-white"
          >
            <textarea
              value={newComment.contenu}
              onChange={(e) => setNewComment({ contenu: e.target.value })}
              placeholder="Ajouter un commentaire..."
              className="w-full rounded-md p-2 mb-2"
              required
            />
            <Button type="submit">Ajouter le commentaire</Button>
          </form>
        </div>
      )}

      {/* Formulaire d'ajout d'un nouvel article */}
      {selectedCategory && !selectedArticle && (
        <div className="mt-8 p-4 border rounded-md bg-gray-50 shadow-lg">
          <h2 className="text-2xl mb-4">Ajouter un nouvel article</h2>
          <form onSubmit={handleAddArticle}>
            <div className="mb-4">
              <label className="block text-sm font-medium">Titre</label>
              <input
                type="text"
                value={newTitre}
                onChange={(e) => setNewTitre(e.target.value)}
                className="mt-1 block w-full rounded-md p-2"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Contenu</label>
              <textarea
                value={newContenu}
                onChange={(e) => setNewContenu(e.target.value)}
                className="mt-1 block w-full rounded-md p-2"
                required
              />
            </div>
            <Button type="submit">Ajouter article</Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PageArticleModerateur;
