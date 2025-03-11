/// <reference types="vitest" />

import React, { ReactNode } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PageArticleAdmin from "@/app/DashboardAdministrateur/articles/page";
import { useCategories } from "@/app/DashboardAdministrateur/hooks/useCategories";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// ✅ Mock des hooks next-auth et next/navigation
vi.mock("next-auth/react", () => ({
  useSession: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// ✅ Mock du hook useCategories
vi.mock("@/app/DashboardAdministrateur/hooks/useCategories", () => ({
  useCategories: vi.fn(),
}));

// ✅ Mock du composant Select
vi.mock("@/components/ui/select", () => ({
  Select: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  SelectTrigger: ({ children, ...props }: { children: ReactNode }) => (
    <div {...props} data-testid="select-trigger">
      {children}
    </div>
  ),
  SelectValue: ({ placeholder }: { placeholder: string }) => (
    <span>{placeholder}</span>
  ),
  SelectContent: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  SelectItem: ({
    children,
    value,
    ...props
  }: {
    children: ReactNode;
    value: string;
  }) => (
    <div {...props} data-testid={`select-item-${value}`}>
      {children}
    </div>
  ),
}));

// ✅ Mock de l'appel `fetch`
global.fetch = vi.fn();

describe("PageArticleAdmin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirige vers /login si l'utilisateur n'est pas connecté", () => {
    (useSession as vi.Mock).mockReturnValue({
      data: null,
      status: "unauthenticated",
    });
    const mockRouter = useRouter();

    render(<PageArticleAdmin />);

    expect(mockRouter.push).toHaveBeenCalledWith("/login");
  });

  it("redirige vers /unauthorized si l'utilisateur n'est pas administrateur", () => {
    (useSession as vi.Mock).mockReturnValue({
      data: { user: { role: ["UTILISATEUR"] } },
      status: "authenticated",
    });
  
    (useCategories as vi.Mock).mockReturnValue({
      categories: [],
      loading: false,
      error: null,
    });
  
    const mockRouter = useRouter();
    render(<PageArticleAdmin />);
    expect(mockRouter.push).toHaveBeenCalledWith("/unauthorized");
  });
  

  it("affiche les articles après sélection d'une catégorie", async () => {
    (useSession as vi.Mock).mockReturnValue({
      data: { user: { id_utilisateur: "user1", role: ["ADMINISTRATEUR"] } },
      status: "authenticated",
    });

    (useCategories as vi.Mock).mockReturnValue({
      categories: [{ id_categorie: "1", nomCategorie: "Catégorie 1" }],
      loading: false,
      error: null,
    });

    (global.fetch as vi.Mock).mockResolvedValueOnce({
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
    fireEvent.click(screen.getByTestId("select-item-1"));

    await waitFor(() => {
      screen.debug(); // Affiche le DOM actuel dans la console
      expect(screen.getByText("Article 1")).toBeInTheDocument();
      expect(screen.getByText("Article 2")).toBeInTheDocument();
    });
  });
});
