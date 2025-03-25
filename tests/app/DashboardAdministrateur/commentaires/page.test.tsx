// commentaireAdminPage.test.tsx
/// <reference types="vitest" />

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import CommentaireAdminPage from "@/app/DashboardAdministrateur/commentaires/page";
import { useParams } from "next/navigation";
import { useUtilisateur } from "@/app/components/UtilisateurContext";

// Mock des hooks
vi.mock("next/navigation", () => ({
  useParams: vi.fn(),
}));

vi.mock("@/app/contexts/page", () => ({
  useUtilisateur: vi.fn(),
}));

// Mock du fetch global
global.fetch = vi.fn();

describe("CommentaireAdminPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("affiche l'ID du commentaire dans le titre", () => {
    (useParams as Mock).mockReturnValue({ commentaire_id: "123" });
    (useUtilisateur as Mock).mockReturnValue({ utilisateurId: "user1" });

    render(<CommentaireAdminPage />);
    expect(screen.getByText("Commentaire : 123")).toBeInTheDocument();
  });

  it("affiche un bouton d'upvote lorsque l'utilisateur est connecté", () => {
    (useParams as Mock).mockReturnValue({ commentaire_id: "123" });
    (useUtilisateur as Mock).mockReturnValue({ utilisateurId: "user1" });

    render(<CommentaireAdminPage />);
    expect(screen.getByRole("button", { name: /Upvote/i })).toBeInTheDocument();
  });

  it("affiche un message de chargement si l'utilisateurId est manquant", () => {
    (useParams as Mock).mockReturnValue({ commentaire_id: "123" });
    (useUtilisateur as Mock).mockReturnValue({ utilisateurId: null });

    render(<CommentaireAdminPage />);
    expect(screen.getByText("Chargement...")).toBeInTheDocument();
  });

  it("envoie une requête d'upvote lorsqu'on clique sur le bouton", async () => {
    (useParams as Mock).mockReturnValue({ commentaire_id: "123" });
    (useUtilisateur as Mock).mockReturnValue({ utilisateurId: "user1" });

    (global.fetch as Mock).mockResolvedValueOnce({ ok: true });

    render(<CommentaireAdminPage />);
    const button = screen.getByRole("button", { name: /Upvote/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/utilisateurs/user1/commentaires/upvote",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            commentaire_id: "123",
            utilisateur_id: "user1",
          }),
        }
      );
    });
  });

  it("affiche une erreur si la requête d'upvote échoue", async () => {
    console.error = vi.fn(); // Empêche l'affichage de l'erreur dans la console

    (useParams as Mock).mockReturnValue({ commentaire_id: "123" });
    (useUtilisateur as Mock).mockReturnValue({ utilisateurId: "user1" });

    (global.fetch as Mock).mockResolvedValueOnce({ ok: false });

    render(<CommentaireAdminPage />);
    const button = screen.getByRole("button", { name: /Upvote/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith("Erreur lors de l'upvote");
    });
  });
});
