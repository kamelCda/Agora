// "use client";
// import { useState } from "react";

// export interface Commentaire {
//   id_commentaire: string;
//   contenu: string;
//   upvotes: number[];
//   // Vous pouvez ajouter d’autres propriétés si nécessaire
// }

// export function useCommentaires(categorieId: string, articleId: string) {
//   const [commentaires, setCommentaires] = useState<Commentaire[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Récupère tous les commentaires pour un article donné
//   const fetchCommentaires = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetch(
//         `/api/categories/${categorieId}/articles/${articleId}/commentaires`
//       );
//       if (!res.ok) {
//         throw new Error("Erreur lors de la récupération des commentaires");
//       }
//       const data = await res.json();
//       // On suppose ici que l’API renvoie soit { commentaires: [...] } soit directement un tableau
//       setCommentaires(data.commentaires ?? data);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Erreur inconnue");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Ajoute un nouveau commentaire via POST
//   const postCommentaire = async (contenu: string) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetch(
//         `/api/categories/${categorieId}/articles/${articleId}/commentaires`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ contenu }),
//         }
//       );
//       if (!res.ok) {
//         throw new Error("Erreur lors de l'ajout du commentaire");
//       }
//       const data = await res.json();
//       // On suppose que l’API renvoie { commentaire: { … } }
//       setCommentaires((prev) => [...prev, data.commentaire]);
//       return data.commentaire;
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Erreur inconnue");
//       return null;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Met à jour un commentaire via PUT
//   const updateCommentaire = async (
//     updatedComment: Partial<Commentaire> & Pick<Commentaire, "id_commentaire">
//   ) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetch(
//         `/api/categories/${categorieId}/articles/${articleId}/commentaires/${updatedComment.id_commentaire}`,
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(updatedComment),
//         }
//       );
//       if (!res.ok) {
//         throw new Error("Erreur lors de la mise à jour du commentaire");
//       }
//       const data = await res.json();
//       console.log("data " + data);
//       setCommentaires((prev) =>
//         prev.map((comment) =>
//           comment.id_commentaire === data.commentaire.id_commentaire
//             ? data.commentaire
//             : comment
//         )
//       );
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Erreur inconnue");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Supprime un commentaire via DELETE
//   const deleteCommentaire = async (commentaireId: string) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetch(
//         `/api/categories/${categorieId}/articles/${articleId}/commentaires/${commentaireId}`,
//         {
//           method: "DELETE",
//         }
//       );
//       if (!res.ok) {
//         throw new Error("Erreur lors de la suppression du commentaire");
//       }
//       setCommentaires((prev) =>
//         prev.filter((comment) => comment.id_commentaire !== commentaireId)
//       );
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Erreur inconnue");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     commentaires,
//     loading,
//     error,
//     fetchCommentaires,
//     postCommentaire,
//     updateCommentaire,
//     deleteCommentaire,
//   };
// }

/******************************************* */

"use client";
import { useState, useCallback } from "react";

export interface Commentaire {
  id_commentaire: string;
  contenu: string;
  upvotes: number[];
  // Add other properties if necessary
}

export function useCommentaires(categorieId: string, articleId: string) {
  const [commentaires, setCommentaires] = useState<Commentaire[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all comments for a given article
  const fetchCommentaires = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/categories/${categorieId}/articles/${articleId}/commentaires`
      );
      if (!res.ok) {
        throw new Error("Erreur lors de la récupération des commentaires");
      }
      const data = await res.json();
      // Assume the API returns either { commentaires: [...] } or a direct array
      setCommentaires(data.commentaires ?? data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, [categorieId, articleId]);

  // Add a new comment via POST
  const postCommentaire = useCallback(
    async (contenu: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/categories/${categorieId}/articles/${articleId}/commentaires`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contenu }),
          }
        );
        if (!res.ok) {
          throw new Error("Erreur lors de l'ajout du commentaire");
        }
        const data = await res.json();
        // Assume the API returns { commentaire: { … } }
        setCommentaires((prev) => [...prev, data.commentaire]);
        return data.commentaire;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [categorieId, articleId]
  );

  // Update a comment via PUT
  const updateCommentaire = useCallback(
    async (
      updatedComment: Partial<Commentaire> & Pick<Commentaire, "id_commentaire">
    ) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/categories/${categorieId}/articles/${articleId}/commentaires/${updatedComment.id_commentaire}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedComment),
          }
        );
        if (!res.ok) {
          throw new Error("Erreur lors de la mise à jour du commentaire");
        }
        const data = await res.json();
        console.log("data", data);
        setCommentaires((prev) =>
          prev.map((comment) =>
            comment.id_commentaire === data.commentaire.id_commentaire
              ? data.commentaire
              : comment
          )
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    },
    [categorieId, articleId]
  );

  // Delete a comment via DELETE
  const deleteCommentaire = useCallback(
    async (commentaireId: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/categories/${categorieId}/articles/${articleId}/commentaires/${commentaireId}`,
          {
            method: "DELETE",
          }
        );
        if (!res.ok) {
          throw new Error("Erreur lors de la suppression du commentaire");
        }
        setCommentaires((prev) =>
          prev.filter((comment) => comment.id_commentaire !== commentaireId)
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    },
    [categorieId, articleId]
  );

  return {
    commentaires,
    loading,
    error,
    fetchCommentaires,
    postCommentaire,
    updateCommentaire,
    deleteCommentaire,
  };
}
