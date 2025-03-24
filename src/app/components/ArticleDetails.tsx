// "use client";

// import React, { FormEvent, useEffect, useState } from "react";
// import { Button } from "@/app/components/ui/button";
// import EvaluationForm from "@/app/components/EvaluationArticle";
// import UpvoteButton from "@/app/components/upVoteButton";
// import { useCommentaires } from "@/app/DashboardAdministrateur/hooks/useCommentaires";

// interface ArticleDetailsProps {
//   selectedCategory: string | null;
//   article: any; // Idéalement, créer une interface pour "Article"
//   moyenneEvaluations: number | null;
//   onDeselectArticle: () => void;
//   onRefetchMoyenne: (catId: string, artId: string) => void;
//   utilisateurId?: string;
// }

// const ArticleDetails: React.FC<ArticleDetailsProps> = ({
//   selectedCategory,
//   article,
//   moyenneEvaluations,
//   onDeselectArticle,
//   onRefetchMoyenne,
//   utilisateurId,
// }) => {
//   // État local pour l’édition
//   const [editTitre, setEditTitre] = useState("");
//   const [editContenu, setEditContenu] = useState("");

//   // Hooks commentaires
//   const {
//     commentaires,
//     loading: loadingCommentaires,
//     error: errorCommentaires,
//     fetchCommentaires,
//     postCommentaire,
//     updateCommentaire,
//     deleteCommentaire,
//   } = useCommentaires(
//     article ? article.categorie_id : "",
//     article ? article.id_article : ""
//   );

//   // Pré-remplissage des champs
//   useEffect(() => {
//     if (article) {
//       setEditTitre(article.titre);
//       setEditContenu(article.contenu);
//       fetchCommentaires();
//     }
//   }, [article, fetchCommentaires]);

//   // Mise à jour de l'article
//   const handleUpdateArticle = async (e: FormEvent) => {
//     e.preventDefault();
//     if (!article || !selectedCategory) return;
//     try {
//       const res = await fetch(
//         `/api/categories/${selectedCategory}/articles/${article.id_article}`,
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             titre: editTitre,
//             contenu: editContenu,
//             miseAjourLe: new Date().toISOString(),
//             utilisateur_id: article.utilisateur_id,
//           }),
//         }
//       );
//       if (!res.ok) throw new Error("La mise à jour de l'article a échoué");
//       // Retour à la liste ou simple confirmation
//       onDeselectArticle();
//     } catch (error) {
//       console.error("Erreur lors de la mise à jour de l'article :", error);
//     }
//   };

//   // Gestion du nouveau commentaire
//   const [newComment, setNewComment] = useState({ contenu: "" });
//   const handlePostComment = async (e: FormEvent) => {
//     e.preventDefault();
//     if (!newComment.contenu.trim()) return;
//     await postCommentaire(newComment.contenu);
//     setNewComment({ contenu: "" });
//   };

//   // Gestion de l'édition d'un commentaire
//   const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
//   const [editCommentContent, setEditCommentContent] = useState("");

//   const handleEditComment = (commentaireId: string, contenu: string) => {
//     setEditingCommentId(commentaireId);
//     setEditCommentContent(contenu);
//   };

//   const handleUpdateComment = async (commentaireId: string) => {
//     await updateCommentaire({
//       id_commentaire: commentaireId,
//       contenu: editCommentContent,
//     });
//     setEditingCommentId(null);
//     setEditCommentContent("");
//   };

//   if (!article) return null;

//   return (
//     <div className="p-4 mt-4 border rounded-md bg-white">
//       <h2 className="text-2xl mb-2">{article.titre}</h2>
//       <p>{article.contenu}</p>
//       <p className="text-xs text-gray-500">
//         Publié le {new Date(article.creeLe).toLocaleDateString()}
//       </p>

//       {/* Affichage de la moyenne */}
//       <p className="mt-2 font-semibold">
//         Moyenne des évaluations :{" "}
//         {moyenneEvaluations !== null
//           ? moyenneEvaluations.toFixed(1)
//           : "Pas encore évalué"}
//       </p>

//       <Button onClick={onDeselectArticle} className="mt-4">
//         Retour aux articles
//       </Button>

//       {/* Formulaire d’évaluation */}
//       <EvaluationForm
//         categorieId={article.categorie_id}
//         articleId={article.id_article}
//         onEvaluationDone={() =>
//           onRefetchMoyenne(article.categorie_id, article.id_article)
//         }
//       />

//       {/* Formulaire de mise à jour de l'article */}
//       <form onSubmit={handleUpdateArticle} className="mt-4">
//         <div className="mb-4">
//           <label className="block text-sm font-medium">Titre</label>
//           <input
//             type="text"
//             value={editTitre}
//             onChange={(e) => setEditTitre(e.target.value)}
//             className="mt-1 block w-full border rounded-md p-2"
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-sm font-medium">Contenu</label>
//           <textarea
//             value={editContenu}
//             onChange={(e) => setEditContenu(e.target.value)}
//             className="mt-1 block w-full border rounded-md p-2"
//             required
//           />
//         </div>
//         <Button type="submit">Mettre à jour l'article</Button>
//       </form>

//       {/* Section Commentaires */}
//       <h3 className="text-xl mt-6 mb-4">Commentaires :</h3>
//       {loadingCommentaires && <p>Chargement des commentaires...</p>}
//       {errorCommentaires && (
//         <p className="text-red-500">Erreur: {errorCommentaires}</p>
//       )}

//       {commentaires.map((commentaire) => (
//         <div
//           key={commentaire.id_commentaire}
//           className="p-2 border mb-2 rounded-md"
//         >
//           {editingCommentId === commentaire.id_commentaire ? (
//             <>
//               <textarea
//                 value={editCommentContent}
//                 onChange={(e) => setEditCommentContent(e.target.value)}
//                 className="w-full border rounded-md p-2 mb-2"
//               />
//               <div className="flex gap-2">
//                 <Button
//                   onClick={() =>
//                     handleUpdateComment(commentaire.id_commentaire)
//                   }
//                 >
//                   Sauvegarder
//                 </Button>
//                 <Button
//                   variant="destructive"
//                   onClick={() => setEditingCommentId(null)}
//                 >
//                   Annuler
//                 </Button>
//               </div>
//             </>
//           ) : (
//             <>
//               <p className="mb-1">{commentaire.contenu}</p>
//               <div className="flex items-center gap-2">
//                 <UpvoteButton
//                   categorieId={article.categorie_id}
//                   articleId={article.id_article}
//                   commentaireId={commentaire.id_commentaire}
//                   utilisateurId={utilisateurId}
//                   initialUpvotes={commentaire.upvotes.length}
//                 />
//                 <Button
//                   onClick={() =>
//                     handleEditComment(
//                       commentaire.id_commentaire,
//                       commentaire.contenu
//                     )
//                   }
//                   size="sm"
//                 >
//                   Modifier
//                 </Button>
//                 <Button
//                   variant="destructive"
//                   onClick={() => deleteCommentaire(commentaire.id_commentaire)}
//                   size="sm"
//                 >
//                   Supprimer
//                 </Button>
//               </div>
//             </>
//           )}
//         </div>
//       ))}

//       {/* Formulaire d'ajout d'un nouveau commentaire */}
//       <form onSubmit={handlePostComment} className="mt-4">
//         <textarea
//           value={newComment.contenu}
//           onChange={(e) => setNewComment({ contenu: e.target.value })}
//           placeholder="Ajouter un commentaire..."
//           className="w-full border rounded-md p-2 mb-2"
//           required
//         />
//         <Button type="submit">Ajouter le commentaire</Button>
//       </form>
//     </div>
//   );
// };

// export default ArticleDetails;



/************************************* */




"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { Button } from "@/app/components/ui/button";
import EvaluationForm from "@/app/components/EvaluationArticle";
import UpvoteButton from "@/app/components/upVoteButton";
import { useCommentaires } from "@/app/DashboardAdministrateur/hooks/useCommentaires";

interface ArticleDetailsProps {
  selectedCategory: string | null;
  article: any; // Idéalement, créer une interface pour \"Article\"
  moyenneEvaluations: number | null;
  onDeselectArticle: () => void;
  onRefetchMoyenne: (catId: string, artId: string) => void;
  utilisateurId?: string;
}

const ArticleDetails: React.FC<ArticleDetailsProps> = ({
  selectedCategory,
  article,
  moyenneEvaluations,
  onDeselectArticle,
  onRefetchMoyenne,
  utilisateurId,
}) => {
  // État local pour l’édition
  const [editTitre, setEditTitre] = useState("");
  const [editContenu, setEditContenu] = useState("");

  // Hooks commentaires
  const {
    commentaires,
    loading: loadingCommentaires,
    error: errorCommentaires,
    fetchCommentaires,
    postCommentaire,
    updateCommentaire,
    deleteCommentaire,
  } = useCommentaires(
    article ? article.categorie_id : "",
    article ? article.id_article : ""
  );

  // Pré-remplissage des champs
  useEffect(() => {
    if (article) {
      setEditTitre(article.titre);
      setEditContenu(article.contenu);
      fetchCommentaires();
    }
  }, [article, fetchCommentaires]);

  // Mise à jour de l'article
  const handleUpdateArticle = async (e: FormEvent) => {
    e.preventDefault();
    if (!article || !selectedCategory) return;
    try {
      const res = await fetch(
        `/api/categories/${selectedCategory}/articles/${article.id_article}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            titre: editTitre,
            contenu: editContenu,
            miseAjourLe: new Date().toISOString(),
            utilisateur_id: article.utilisateur_id,
          }),
        }
      );
      if (!res.ok) throw new Error("La mise à jour de l'article a échoué");
      onDeselectArticle();
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'article :", error);
    }
  };

  // Gestion du nouveau commentaire
  const [newComment, setNewComment] = useState({ contenu: "" });
  const handlePostComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!newComment.contenu.trim()) return;
    await postCommentaire(newComment.contenu);
    setNewComment({ contenu: "" });
  };

  // Gestion de l'édition d'un commentaire
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

  if (!article) return null;

  return (
    <div className="p-4 mt-4 border rounded-md bg-white">
      <h2 className="text-2xl mb-2">{article.titre}</h2>
      <p>{article.contenu}</p>
      <p className="text-xs text-gray-500">
        Publié le {new Date(article.creeLe).toLocaleDateString()}
      </p>

      <p className="mt-2 font-semibold">
        Moyenne des évaluations :{" "}
        {moyenneEvaluations !== null
          ? moyenneEvaluations.toFixed(1)
          : "Pas encore évalué"}
      </p>

      <Button onClick={onDeselectArticle} className="mt-4">
        Retour aux articles
      </Button>

      <EvaluationForm
        categorieId={article.categorie_id}
        articleId={article.id_article}
        onEvaluationDone={() =>
          onRefetchMoyenne(article.categorie_id, article.id_article)
        }
      />

      <form onSubmit={handleUpdateArticle} className="mt-4">
        <div className="mb-4">
          <label htmlFor="titre" className="block text-sm font-medium">
            Titre
          </label>
          <input
            id="titre"
            type="text"
            value={editTitre}
            onChange={(e) => setEditTitre(e.target.value)}
            className="mt-1 block w-full border rounded-md p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="contenu" className="block text-sm font-medium">
            Contenu
          </label>
          <textarea
            id="contenu"
            value={editContenu}
            onChange={(e) => setEditContenu(e.target.value)}
            className="mt-1 block w-full border rounded-md p-2"
            required
          />
        </div>
        <Button type="submit">Mettre à jour l'article</Button>
      </form>

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
                id="edition-commentaire"
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
                  categorieId={article.categorie_id}
                  articleId={article.id_article}
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
                  onClick={() => deleteCommentaire(commentaire.id_commentaire)}
                  size="sm"
                >
                  Supprimer
                </Button>
              </div>
            </>
          )}
        </div>
      ))}

      <form onSubmit={handlePostComment} className="mt-4">
        <textarea
          id="nouveau-commentaire"
          value={newComment.contenu}
          onChange={(e) => setNewComment({ contenu: e.target.value })}
          placeholder="Ajouter un commentaire..."
          className="w-full border rounded-md p-2 mb-2"
          required
        />
        <Button type="submit">Ajouter le commentaire</Button>
      </form>
    </div>
  );
};

export default ArticleDetails;