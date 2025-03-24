import React from "react";
import { describe, it, expect, beforeEach, vi, Mock } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UpvoteButton from "@/app/components/upVoteButton";
import { useSession } from "next-auth/react";

// On se moque du hook useSession
vi.mock("next-auth/react", () => ({
  useSession: vi.fn(),
}));

describe("UpvoteButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("affiche le bouton avec le nombre d'upvotes initial", () => {
    (useSession as Mock).mockReturnValue({
      data: { user: { id: "user1" } },
    });
    render(
      <UpvoteButton
        categorieId="cat1"
        articleId="art1"
        commentaireId="c1"
        initialUpvotes={10}
      />
    );
    // On interroge le bouton via son rôle et un texte qui contient "Upvotes"
    const button = screen.getByRole("button", { name: /Upvotes/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("👍 10 Upvotes");
  });

  it("incrémente le nombre d'upvotes lors du clic si la requête est réussie", async () => {
    (useSession as Mock).mockReturnValue({
      data: { user: { id: "user1" } },
    });
    global.fetch = vi.fn().mockResolvedValue({ ok: true });
    render(
      <UpvoteButton
        categorieId="cat1"
        articleId="art1"
        commentaireId="c1"
        initialUpvotes={5}
      />
    );
    const button = screen.getByRole("button", { name: /Upvotes/i });
    fireEvent.click(button);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    // Le nombre d'upvotes passe de 5 à 6 et le bouton devient désactivé
    expect(button).toHaveTextContent("👍 6 Upvotes");
    expect(button).toBeDisabled();
  });

  it("affiche un message d'erreur en cas d'erreur de la requête", async () => {
    (useSession as Mock).mockReturnValue({
      data: { user: { id: "user1" } },
    });
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Test error message" }),
    });
    render(
      <UpvoteButton
        categorieId="cat1"
        articleId="art1"
        commentaireId="c1"
        initialUpvotes={5}
      />
    );
    const button = screen.getByRole("button", { name: /Upvotes/i });
    fireEvent.click(button);
    await waitFor(() =>
      expect(screen.getByText("Test error message")).toBeInTheDocument()
    );
  });

  it("empêche plusieurs votes successifs", async () => {
    (useSession as Mock).mockReturnValue({
      data: { user: { id: "user1" } },
    });
    global.fetch = vi.fn().mockResolvedValue({ ok: true });
    render(
      <UpvoteButton
        categorieId="cat1"
        articleId="art1"
        commentaireId="c1"
        initialUpvotes={5}
      />
    );
    const button = screen.getByRole("button", { name: /Upvotes/i });
    fireEvent.click(button);
    // Un second clic ne doit pas déclencher un autre appel
    fireEvent.click(button);
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
  });

  it("désactive le bouton si l'utilisateur n'est pas authentifié", () => {
    (useSession as Mock).mockReturnValue({
      data: null,
    });
    render(
      <UpvoteButton
        categorieId="cat1"
        articleId="art1"
        commentaireId="c1"
        initialUpvotes={5}
      />
    );
    const button = screen.getByRole("button", { name: /Upvotes/i });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("title", "Connectez-vous pour voter");
  });
});
