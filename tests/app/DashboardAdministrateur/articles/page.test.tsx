/// <reference types="vitest" />

import React from "react";
import { describe, it, expect, beforeEach, vi, Mock } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

const mockRouterPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
}));

vi.mock("next-auth/react", () => ({
  useSession: vi.fn(),
}));

vi.mock("@/app/DashboardAdministrateur/hooks/useCategories", () => ({
  useCategories: vi.fn(),
}));

vi.mock("@/components/ui/select", () => ({
  Select: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectTrigger: ({ children, ...props }: { children: React.ReactNode }) => (
    <div {...props} data-testid="select-trigger">
      {children}
    </div>
  ),
  SelectValue: ({ placeholder }: { placeholder: string }) => <span>{placeholder}</span>,
  SelectContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectItem: ({ children, value }: { children: React.ReactNode; value: string }) => (
    <div data-testid={`select-item-${value}`}>{children}</div>
  ),
}));

import PageArticleAdmin from "@/app/DashboardAdministrateur/articles/page";
import { useCategories } from "@/app/DashboardAdministrateur/hooks/useCategories";
import { useSession } from "next-auth/react";

global.fetch = vi.fn();

describe("PageArticleAdmin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirige vers /login si l'utilisateur n'est pas connecté", () => {
    (useSession as Mock).mockReturnValue({
      data: null,
      status: "unauthenticated",
    });

    render(<PageArticleAdmin />);
    expect(mockRouterPush).toHaveBeenCalledWith("/login");
  });

  it("redirige vers /unauthorized si l'utilisateur n'est pas administrateur", () => {
    (useSession as Mock).mockReturnValue({
      data: { user: { role: ["UTILISATEUR"] } },
      status: "authenticated",
    });

    render(<PageArticleAdmin />);
    expect(mockRouterPush).toHaveBeenCalledWith("/unauthorized");
  });

  it("affiche les articles après sélection d'une catégorie", async () => {
    (useSession as Mock).mockReturnValue({
      data: { user: { id_utilisateur: "user1", role: ["ADMINISTRATEUR"] } },
      status: "authenticated",
    });

    (useCategories as Mock).mockReturnValue({
      categories: [{ id_categorie: "1", nomCategorie: "Catégorie 1" }],
      loading: false,
      error: null,
    });

    (global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        articles: [
          {
            id_article: "1",
            titre: "Article 1",
            contenu: "Contenu 1",
            creeLe: "2023-01-01T00:00:00Z",
          },
          {
            id_article: "2",
            titre: "Article 2",
            contenu: "Contenu 2",
            creeLe: "2023-02-01T00:00:00Z",
          },
        ],
      }),
    });

    render(<PageArticleAdmin />);

    fireEvent.click(screen.getByTestId("select-trigger"));

    await waitFor(() => {
      expect(screen.getByTestId("select-item-1")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("select-item-1"));

    await waitFor(() => {
      screen.debug();
      expect(screen.getByText("Article 1")).toBeInTheDocument();
      expect(screen.getByText("Article 2")).toBeInTheDocument();
    });
  });
});
