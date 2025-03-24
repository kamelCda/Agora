// login.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import LoginPage from "@/app/auth/login/page";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SessionProvider } from "next-auth/react";

// Définition d'un spy global pour push
const push = vi.fn();

vi.mock("next-auth/react", () => ({
  useSession: vi.fn(),
  signIn: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push, // On retourne le même push à chaque appel
  }),
}));

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirige vers le bon tableau de bord en fonction du rôle", async () => {
    // Simulation d'une session authentifiée avec rôle ADMINISTRATEUR
    (useSession as Mock).mockReturnValue({
      data: { user: { role: ["ADMINISTRATEUR"] } },
      status: "authenticated",
    });

    render(<LoginPage />);
    // Attendre que la redirection soit déclenchée
    await waitFor(() => {
      expect(push).toHaveBeenCalledWith("/DashboardAdministrateur");
    });
  });

  it("affiche un message d'erreur si l'utilisateur n'est pas reconnu", () => {
    (useSession as Mock).mockReturnValue({
      data: { user: { role: ["UNKNOWN_ROLE"] } },
      status: "authenticated",
    });

    render(<LoginPage />);
    expect(screen.getByText("Utilisateur non reconnu")).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });

  it("affiche un message d'erreur si la connexion échoue", async () => {
    (useSession as Mock).mockReturnValue({
      data: null,
      status: "unauthenticated",
    });

    (signIn as Mock).mockResolvedValue({
      ok: false,
      error: "Identifiants invalides",
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Mot de passe/i), {
      target: { value: "password" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Se connecter/i }));

    await waitFor(() => {
      expect(screen.getByText("Identifiants invalides")).toBeInTheDocument();
    });
  });

  it("n'affiche rien pendant le chargement de la session", () => {
    (useSession as Mock).mockReturnValue({
      data: null,
      status: "loading",
    });

    render(<LoginPage />);
    expect(screen.queryByText("Connexion")).not.toBeInTheDocument();
  });
  it("redirige vers la page d'inscription lorsqu'on clique sur S'inscrire", async () => {
    // Session explicitement non authentifiée
    (useSession as Mock).mockReturnValue({
      data: null,
      status: "unauthenticated",
    });
  
    render(<LoginPage />);
  
    const inscriptionLink = await screen.findByRole("link", { name: /s'inscrire/i });
    expect(inscriptionLink).toHaveAttribute("href", "/auth/register");
  });
  
  });

