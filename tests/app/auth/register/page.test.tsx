// register.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import RegisterPage from "@/app/auth/register/page";
import { useRouter } from "next/navigation";

// Mock de useRouter de Next.js
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock de fetch global
global.fetch = vi.fn();

describe("RegisterPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("affiche le formulaire d'inscription avec tous les champs requis", () => {
    render(<RegisterPage />);

    expect(screen.getByLabelText("Nom")).toBeInTheDocument();
    expect(screen.getByLabelText("Prénom")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Mot de passe")).toBeInTheDocument();
    expect(screen.getByLabelText("Ville")).toBeInTheDocument();
    expect(screen.getByLabelText("Adresse")).toBeInTheDocument();
    expect(screen.getByLabelText("Nom d'utilisateur")).toBeInTheDocument();
  });

  it("affiche un message d'erreur si l'inscription échoue", async () => {
    (global.fetch as vi.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Erreur lors de l'inscription" }),
    });

    render(<RegisterPage />);

    fireEvent.change(screen.getByLabelText("Nom"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText("Prénom"), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Mot de passe"), {
      target: { value: "password" },
    });
    fireEvent.change(screen.getByLabelText("Ville"), {
      target: { value: "Paris" },
    });
    fireEvent.change(screen.getByLabelText("Adresse"), {
      target: { value: "123 Rue Exemple" },
    });
    fireEvent.change(screen.getByLabelText("Nom d'utilisateur"), {
      target: { value: "johndoe" },
    });

    fireEvent.click(screen.getByRole("button", { name: "S'inscrire" }));

    await waitFor(() => {
      expect(
        screen.getByText("Erreur lors de l'inscription")
      ).toBeInTheDocument();
    });
  });

  it("redirige vers la page de connexion après une inscription réussie", async () => {
    const mockRouter = useRouter();

    (global.fetch as vi.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    render(<RegisterPage />);

    fireEvent.change(screen.getByLabelText("Nom"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText("Prénom"), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Mot de passe"), {
      target: { value: "password" },
    });
    fireEvent.change(screen.getByLabelText("Ville"), {
      target: { value: "Paris" },
    });
    fireEvent.change(screen.getByLabelText("Adresse"), {
      target: { value: "123 Rue Exemple" },
    });
    fireEvent.change(screen.getByLabelText("Nom d'utilisateur"), {
      target: { value: "johndoe" },
    });

    fireEvent.click(screen.getByRole("button", { name: "S'inscrire" }));

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith("/auth/login");
    });
  });
});
