// CommentairesList.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import CommentairesList from "../../src/components/CommentairesList";
import { describe, expect, it, vi } from "vitest";

// Mock du composant UpvoteButton
vi.mock("../../src/app/upvote/page", () => ({
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
      },
      {
        id_commentaire: "2",
        contenu: "Deuxième commentaire",
        upvotes: 20,
        utilisateurId: "user2",
      },
      {
        id_commentaire: "3",
        contenu: "Troisième commentaire",
        upvotes: 15,
        utilisateurId: "user3",
      },
    ];

    render(<CommentairesList commentaires={commentaires} />);

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
      },
    ];

    render(<CommentairesList commentaires={commentaires} />);

    const upvoteButton = screen.getByTestId("upvote-button");
    expect(upvoteButton).toHaveTextContent("Upvotes: 5");
  });
});
