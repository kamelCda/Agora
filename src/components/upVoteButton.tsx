// import { useSession } from "next-auth/react";
// import { useState } from "react";

// type UpvoteButtonProps = {
//   categorieId: string;
//   articleId: string;
//   commentaireId: string;
//   utilisateurId?: string;
//   initialUpvotes: number;
// };

// const UpvoteButton: React.FC<UpvoteButtonProps> = ({
//   categorieId,
//   articleId,
//   commentaireId,
//   initialUpvotes,
// }) => {
//   const [upvotes, setUpvotes] = useState(initialUpvotes);
//   const [hasVoted, setHasVoted] = useState(false);
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const { data: session } = useSession();

//   const handleUpvote = async () => {
//     if (hasVoted || !session?.user?.id) return;

//     try {
//       const response = await fetch(
//         `/api/categories/${categorieId}/articles/${articleId}/commentaires/${commentaireId}/upvote`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             commentaire_id: commentaireId,
//             utilisateur_id: session.user.id,
//           }),
//         }
//       );

//       if (response.ok) {
//         setUpvotes((prev) => prev + 1);
//         setHasVoted(true);
//         setErrorMessage(null); // Réinitialise le message d'erreur en cas de succès
//       } else {
//         const error = await response.json();
//         setErrorMessage(
//           error.error || "Une erreur est survenue lors de l'upvote."
//         );
//       }
//     } catch (error) {
//       setErrorMessage("Erreur réseau lors de l'upvote.");
//     }
//   };

//   return (
//     <div>
//       <button
//         onClick={handleUpvote}
//         className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
//           hasVoted
//             ? "bg-gray-300 cursor-not-allowed"
//             : "bg-blue-500 text-white hover:bg-blue-600"
//         }`}
//         disabled={hasVoted || !session?.user?.id}
//         title={
//           hasVoted
//             ? "Vous avez déjà voté"
//             : !session?.user?.id
//             ? "Connectez-vous pour voter"
//             : "Cliquez pour voter"
//         }
//       >
//         👍 {upvotes} Upvotes
//       </button>
//       {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
//     </div>
//   );
// };

// export default UpvoteButton;

//CONFIGURATION CI DESSUS BONNE

import { useSession } from "next-auth/react";
import { useState } from "react";

type UpvoteButtonProps = {
  categorieId: string;
  articleId: string;
  commentaireId: string;
  utilisateurId?: string;
  initialUpvotes?: number; // Made optional
};

const UpvoteButton: React.FC<UpvoteButtonProps> = ({
  categorieId,
  articleId,
  commentaireId,
  initialUpvotes = 0, // Default to 0 if not provided
}) => {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [hasVoted, setHasVoted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { data: session } = useSession();

  const handleUpvote = async () => {
    if (hasVoted || !session?.user?.id) return;

    try {
      const response = await fetch(
        `/api/categories/${categorieId}/articles/${articleId}/commentaires/${commentaireId}/upvote`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            commentaire_id: commentaireId,
            utilisateur_id: session.user.id,
          }),
        }
      );

      if (response.ok) {
        setUpvotes((prev) => prev + 1);
        setHasVoted(true);
        setErrorMessage(null);
      } else {
        const error = await response.json();
        setErrorMessage(
          error.error || "Une erreur est survenue lors de l'upvote."
        );
      }
    } catch (error) {
      setErrorMessage("Erreur réseau lors de l'upvote.");
    }
  };

  return (
    <div>
      <button
        onClick={handleUpvote}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
          hasVoted
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
        disabled={hasVoted || !session?.user?.id}
        title={
          hasVoted
            ? "Vous avez déjà voté"
            : !session?.user?.id
            ? "Connectez-vous pour voter"
            : "Cliquez pour voter"
        }
      >
        👍 {upvotes} Upvotes
      </button>
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
    </div>
  );
};

export default UpvoteButton;
