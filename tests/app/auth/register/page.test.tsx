// register.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import RegisterPage from "@/app/auth/register/page";
import { useRouter } from "next/navigation";

// Mock router
const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));


// Mock global fetch
global.fetch = vi.fn();

describe("RegisterPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockClear();
  });

  it("affiche le formulaire d'inscription avec tous les champs requis", () => {
    render(<RegisterPage />);

    expect(screen.getByLabelText(/^nom$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^prenom$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^mot de passe$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^telephone$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^ville$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^adresse$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^nom d'utilisateur$/i)).toBeInTheDocument();
  });

  it("affiche un message d'erreur si l'inscription échoue", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Erreur serveur" }),
    });

    render(<RegisterPage />);

    fireEvent.change(screen.getByLabelText(/^nom$/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText(/^prenom$/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^mot de passe$/i), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText(/^telephone$/i), {
      target: { value: "0123456789" },
    });
    fireEvent.change(screen.getByLabelText(/^ville$/i), {
      target: { value: "Paris" },
    });
    fireEvent.change(screen.getByLabelText(/^adresse$/i), {
      target: { value: "10 rue Exemple" },
    });
    fireEvent.change(screen.getByLabelText(/^nom d'utilisateur$/i), {
      target: { value: "john_doe" },
    });

    fireEvent.click(screen.getByRole("button", { name: /S'inscrire/i }));

    await waitFor(() => {
      expect(screen.getByText("Erreur serveur")).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("redirige vers la page de connexion après une inscription réussie", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    render(<RegisterPage />);

    fireEvent.change(screen.getByLabelText(/^nom$/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText(/^prenom$/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^mot de passe$/i), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText(/^telephone$/i), {
      target: { value: "0123456789" },
    });
    fireEvent.change(screen.getByLabelText(/^ville$/i), {
      target: { value: "Paris" },
    });
    fireEvent.change(screen.getByLabelText(/^adresse$/i), {
      target: { value: "123 Rue Exemple" },
    });
    fireEvent.change(screen.getByLabelText(/^nom d'utilisateur$/i), {
      target: { value: "john_doe" },
    });

    fireEvent.click(screen.getByRole("button", { name: /S'inscrire/i }));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/auth/login");
    });

    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
