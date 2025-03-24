import React from "react";
import UpvoteButton from "@/app/components/upVoteButton";

type Commentaire = {
  id_commentaire: string;
  contenu: string;
  upvotes: number;
  utilisateurId: string;
  article_id: string;
  categorie_id: string;
};

type CommentairesListProps = {
  commentaires: Commentaire[];
};

const CommentairesList: React.FC<CommentairesListProps> = ({
  commentaires,
}) => {
  const sortedCommentaires = commentaires.sort((a, b) => b.upvotes - a.upvotes);

  return (
    <div className="space-y-4">
      {sortedCommentaires.map((commentaire) => (
        <div
          key={commentaire.id_commentaire}
          className="p-4 border rounded-md shadow-sm bg-white"
        >
          <p className="mb-2">{commentaire.contenu}</p>
          <UpvoteButton
            commentaireId={commentaire.id_commentaire}
            utilisateurId={commentaire.utilisateurId}
            initialUpvotes={commentaire.upvotes}
            categorieId={commentaire.categorie_id}
            articleId={commentaire.article_id}
          />
        </div>
      ))}
    </div>
  );
};

export default CommentairesList;
