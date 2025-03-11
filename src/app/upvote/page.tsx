"use client";
import { useState } from "react";

type UpvoteButtonProps = {
  commentaireId: string;
  utilisateurId: string;
  initialUpvotes: number;
};

const UpvoteButton: React.FC<UpvoteButtonProps> = ({
  commentaireId,
  utilisateurId,
  initialUpvotes,
}) => {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [hasVoted, setHasVoted] = useState(false);

  const handleUpvote = async () => {
    if (hasVoted) return;

    try {
      const response = await fetch("/api/commentaires/upvote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commentaire_id: commentaireId,
          utilisateur_id: utilisateurId,
        }),
      });

      if (response.ok) {
        setUpvotes((prev) => prev + 1);
        setHasVoted(true);
      } else {
        const error = await response.json();
        console.error("Erreur :", error.error);
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  };

  return (
    <button
      onClick={handleUpvote}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
        hasVoted ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-600"
      }`}
      disabled={hasVoted}
    >
      👍 {upvotes} Upvotes
    </button>
  );
};

export default UpvoteButton;
