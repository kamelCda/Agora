import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import CommentairesList from "@/app/components/CommentairesList";
import { describe, expect, it, vi } from "vitest";
import { SessionProvider } from "next-auth/react";

// Mock complet de la session
const mockSession = {
  expires: "2025-03-14T00:00:00.000Z",
  user: {
    id: "user-id-123",
    id_utilisateur: "123",
    email: "user@example.com",
    nom: "Doe",
    prenom: "John",
    role: ["user"],
  },
};

// Mock du composant UpvoteButton
vi.mock("../../src/app/components/upVoteButton", () => ({
  default: ({ initialUpvotes }: { initialUpvotes: number }) => (
    <button data-testid="upvote-button">Upvotes: {initialUpvotes}</button>
  ),
}));

describe("CommentairesList", () => {
  it("devrait afficher les commentaires triés par upvotes", () => {
    const commentaires = [
      {
        id_commentaire: "1",
        contenu: "Premier commentaire",
        upvotes: 10,
        utilisateurId: "user1",
        commentaire_id: "comment1",
        article_id: "article1",
        categorie_id: "categorie1",
      },
      {
        id_commentaire: "1",
        contenu: "Premier commentaire",
        upvotes: 10,
        utilisateurId: "user2",
        commentaire_id: "comment1",
        article_id: "article1",
        categorie_id: "categorie1",
      },
      {
        id_commentaire: "2",
        contenu: "Deuxième commentaire",
        upvotes: 20,
        utilisateurId: "user3",
        commentaire_id: "comment1",
        article_id: "article1",
        categorie_id: "categorie1",
      },
      {
        id_commentaire: "3",
        contenu: "Troisième commentaire",
        upvotes: 15,
        utilisateurId: "user4",
        commentaire_id: "comment1",
        article_id: "article1",
        categorie_id: "categorie1",
      },
    ];

    render(
      <SessionProvider session={mockSession}>
        <CommentairesList commentaires={commentaires} />
      </SessionProvider>
    );

    // On s'attend à ce que les commentaires soient triés par upvotes décroissants
    const displayedComments = screen.getAllByText(/commentaire/i);
    expect(displayedComments[0]).toHaveTextContent("Deuxième commentaire");
    expect(displayedComments[1]).toHaveTextContent("Troisième commentaire");
    expect(displayedComments[2]).toHaveTextContent("Premier commentaire");
  });

  it("devrait afficher le bouton de vote avec les upvotes initiaux", () => {
    const commentaires = [
      {
        id_commentaire: "1",
        contenu: "Commentaire avec upvotes",
        upvotes: 5,
        utilisateurId: "user1",
        commentaire_id: "comment1",
        article_id: "article1",
        categorie_id: "categorie1",
      },
    ];

    render(
      <SessionProvider session={mockSession}>
        <CommentairesList commentaires={commentaires} />
      </SessionProvider>
    );

    const upvoteButton = screen.getByTestId("upvote-button");
    expect(upvoteButton).toHaveTextContent(/5 Upvotes/);
  });
});
