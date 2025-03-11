// login.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import LoginPage from "@/app/auth/login/page";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

vi.mock("next-auth/react", () => ({
  useSession: vi.fn(),
  signIn: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirige vers le bon tableau de bord en fonction du rôle", () => {
    const mockRouter = useRouter();

    (useSession as vi.Mock).mockReturnValue({
      data: { user: { role: ["ADMINISTRATEUR"] } },
      status: "authenticated",
    });

    render(<LoginPage />);
    expect(mockRouter.push).toHaveBeenCalledWith("/DashboardAdministrateur");
  });

  it("affiche un message d'erreur si l'utilisateur n'est pas reconnu", () => {
    const mockRouter = useRouter();

    (useSession as vi.Mock).mockReturnValue({
      data: { user: { role: ["UNKNOWN_ROLE"] } },
      status: "authenticated",
    });

    render(<LoginPage />);
    expect(screen.getByText("Utilisateur non reconnu")).toBeInTheDocument();
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it("affiche un message d'erreur si la connexion échoue", async () => {
    (useSession as vi.Mock).mockReturnValue({
      data: null,
      status: "unauthenticated",
    });

    (signIn as vi.Mock).mockResolvedValue({
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
    (useSession as vi.Mock).mockReturnValue({ data: null, status: "loading" });

    render(<LoginPage />);
    expect(screen.queryByText("Connexion")).not.toBeInTheDocument();
  });

  it("redirige vers la page d'inscription lorsqu'on clique sur S'inscrire", () => {
    render(<LoginPage />);
    const inscriptionLink = screen.getByText("S'inscrire");
    expect(inscriptionLink).toHaveAttribute("href", "/auth/register");
  });
});
