import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import EvaluationForm from "@/app/components/EvaluationArticle";
import { SessionProvider } from "next-auth/react";

beforeEach(() => {
  vi.clearAllMocks();
});

// Cas 1 : La session est en cours de chargement
describe("EvaluationForm - Session en cours de chargement", () => {
  it("affiche un message de chargement", () => {
    vi.spyOn(require("next-auth/react"), "useSession").mockReturnValue({
      data: null,
      status: "loading",
    });
    render(
      <SessionProvider session={null}>
        <EvaluationForm categorieId="cat1" articleId="art1" />
      </SessionProvider>
    );
    expect(screen.getByText("Chargement de la session...")).toBeInTheDocument();
  });
});

// Cas 2 : L'utilisateur n'est pas connecté
describe("EvaluationForm - Utilisateur non connecté", () => {
  it("affiche un message invitant à se connecter", () => {
    vi.spyOn(require("next-auth/react"), "useSession").mockReturnValue({
      data: null,
      status: "unauthenticated",
    });
    render(
      <SessionProvider session={null}>
        <EvaluationForm categorieId="cat1" articleId="art1" />
      </SessionProvider>
    );
    expect(
      screen.getByText("Vous devez être connecté pour évaluer cet article.")
    ).toBeInTheDocument();
  });
});

// Cas 3 : L'utilisateur est connecté
describe("EvaluationForm - Utilisateur connecté", () => {
  it("affiche le formulaire et soumet l'évaluation", async () => {
    const mockSession = {
      expires: "2025-03-14T00:00:00.000Z",
      user: {
        id: "user1",
        id_utilisateur: "123",
        email: "user@example.com",
        nom: "Doe",
        prenom: "John",
        role: ["UTILISATEUR"],
        name: "John Doe",
        image: null,
      },
    };

    vi.spyOn(require("next-auth/react"), "useSession").mockReturnValue({
      data: mockSession,
      status: "authenticated",
    });

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });

    const onEvaluationDone = vi.fn();

    render(
      <SessionProvider session={mockSession}>
        <EvaluationForm
          categorieId="cat1"
          articleId="art1"
          onEvaluationDone={onEvaluationDone}
        />
      </SessionProvider>
    );

    // Vérifie que le select est rendu avec la valeur par défaut "5"
    const select = screen.getByRole("combobox");
    expect(select).toHaveValue("5");

    // Modification de la note, par exemple à "4"
    fireEvent.change(select, { target: { value: "4" } });
    expect(select).toHaveValue("4");

    // Soumission du formulaire
    const button = screen.getByRole("button", { name: "Évaluer" });
    fireEvent.click(button);

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    // Vérification que fetch a été appelé avec les bons paramètres
    expect(global.fetch).toHaveBeenCalledWith(
      `/api/categories/cat1/articles/art1/evaluations`,
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          utilisateur_id: "123",
          valeur: 4,
        }),
      })
    );

    // Vérification que le callback onEvaluationDone a été appelé
    expect(onEvaluationDone).toHaveBeenCalled();
  });
});
