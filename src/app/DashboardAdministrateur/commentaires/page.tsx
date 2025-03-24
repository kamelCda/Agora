"use client"
import { useUtilisateur } from "@/app/contexts/page";
import { useParams } from "next/navigation";

const CommentaireAdminPage = () => {
  const { commentaire_id } = useParams();
  const { utilisateurId } = useUtilisateur();

  const handleUpvote = async () => {
    if (!commentaire_id || !utilisateurId) return;

    const response = await fetch(`/api/utilisateurs/${utilisateurId}/commentaires/upvote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commentaire_id, utilisateur_id: utilisateurId }),
    });

    if (response.ok) {
      console.log("Upvote réussi");
    } else {
      console.error("Erreur lors de l'upvote");
    }
  };

  return (
    <div>
      <h1>Commentaire : {commentaire_id}</h1>
      {utilisateurId ? (
        <button
          onClick={handleUpvote}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Upvote
        </button>
      ) : (
        <p>Chargement...</p>
      )}
    </div>
  );
};

export default CommentaireAdminPage;
