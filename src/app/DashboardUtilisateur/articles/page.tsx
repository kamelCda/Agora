"use client";

import { useEffect, useState, FormEvent } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCategories } from "@/app/DashboardAdministrateur/hooks/useCategories";
import {
  useArticles,
  Article,
} from "@/app/DashboardAdministrateur/hooks/useArticles";
import { useCommentaires } from "@/app/DashboardAdministrateur/hooks/useCommentaires";
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

interface CommentaireForm {
  contenu: string;
}

const PageArticle = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Vérification de la session et des rôles
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
      return;
    }
    const roles = session.user.role;
    if (!roles.includes("UTILISATEUR")) {
      router.push("/unauthorized");
      return;
    }
  }, [session, status, router]);

  // Récupération des catégories et articles
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  const {
    articles,
    loading,
    error,
    selectedCategory,
    setSelectedCategory,
    selectedArticle,
    setSelectedArticle,
    addArticle,
  } = useArticles();

  // Identifiant utilisateur validé
  const utilisateurId = session?.user.id_utilisateur;
  console.log(utilisateurId);

  // Hook pour les commentaires, activé uniquement si un article est sélectionné
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

  // Chargement des commentaires dès qu'un article est sélectionné
  useEffect(() => {
    if (selectedArticle) {
      fetchCommentaires();
    }
  }, [selectedArticle]);

  // Récupère les détails d’un article via la route imbriquée
  const fetchArticleDetails = async (articleId: string) => {
    if (!selectedCategory) return;
    try {
      const res = await fetch(
        `/api/categories/${selectedCategory}/articles/${articleId}`
      );
      if (!res.ok) throw new Error("La récupération de l'article a échoué");
      const data = await res.json();
      setSelectedArticle(data.article || null);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'article :", error);
    }
  };

  const handleArticleClick = (articleId: string) => {
    fetchArticleDetails(articleId);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedArticle(null);
  };

  // États et gestion du formulaire d'ajout d'un commentaire
  const [newComment, setNewComment] = useState<CommentaireForm>({
    contenu: "",
  });
  const handlePostComment = async (e: FormEvent) => {
    e.preventDefault();
    if (newComment.contenu.trim() === "") return;
    await postCommentaire(newComment.contenu);
    setNewComment({ contenu: "" });
  };

  // Pour la modification d'un commentaire
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

  // Gestion des articles (ajout, suppression, mise à jour)
  const [editTitre, setEditTitre] = useState("");
  const [editContenu, setEditContenu] = useState("");
  const [newTitre, setNewTitre] = useState("");
  const [newContenu, setNewContenu] = useState("");

  // Suppression d'un article
  const handleDeleteArticle = async (article: Article) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
      try {
        const res = await fetch(
          `/api/categories/${article.categorie_id}/articles/${article.id_article}`,
          { method: "DELETE" }
        );
        if (!res.ok) throw new Error("La suppression de l'article a échoué");
        // Mettez à jour la liste des articles selon votre hook
      } catch (error) {
        console.error("Erreur lors de la suppression de l'article :", error);
      }
    }
  };

  // Mise à jour d'un article
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
      const data = await res.json();
      setSelectedArticle(null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'article :", error);
    }
  };

  // Ajout d'un nouvel article
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
      addArticle(data.article);
      setNewTitre("");
      setNewContenu("");
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'article :", error);
    }
  };

  if (status === "loading") {
    return <p>Chargement de la session...</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Articles par Catégorie</h1>

      {categoriesLoading && <p>Chargement des catégories...</p>}
      {categoriesError && (
        <p className="text-red-500">Erreur: {categoriesError}</p>
      )}

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

      {loading && <p>Chargement des articles...</p>}
      {error && <p className="text-red-500">Erreur: {error}</p>}

      {/* Affichage de la liste des articles */}
      {!selectedArticle ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                <div className="mt-2 flex gap-2">
                  {/* BOUTON DE SUPPRESSION ARTICLE DESACTIVE POUR L UTILISATEUR  */}
                  {/* <Button
                    variant="destructive"
                    onClick={() => handleDeleteArticle(article)}
                  >
                    Supprimer
                  </Button> */}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        // Détail et édition de l'article sélectionné, incluant la gestion des commentaires
        <div className="p-4 mt-4 border rounded-md bg-white">
          <h2 className="text-2xl mb-2">{selectedArticle.titre}</h2>
          <p>{selectedArticle.contenu}</p>
          <p className="text-xs text-gray-500">
            Publié le {new Date(selectedArticle.creeLe).toLocaleDateString()}
          </p>
          <Button
            onClick={() => {
              setSelectedArticle(null);
            }}
            className="mt-4"
          >
            Retour aux articles
          </Button>

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
                    className="w-full border rounded-md p-2 mb-2"
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
                      // On affiche le nombre d'upvotes en comptant le tableau d'upvotes
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
          <form onSubmit={handlePostComment} className="mt-4">
            <textarea
              value={newComment.contenu}
              onChange={(e) => setNewComment({ contenu: e.target.value })}
              placeholder="Ajouter un commentaire..."
              className="w-full border rounded-md p-2 mb-2"
              required
            />
            <Button type="submit">Ajouter le commentaire</Button>
          </form>
        </div>
      )}

      {/* Formulaire d'ajout d'un nouvel article */}
      {/* DESACTIVE POUR L'UTILISATEUR  */}
      {/* {selectedCategory && !selectedArticle && (
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
      )} */}
    </div>
  );
};

export default PageArticle;
