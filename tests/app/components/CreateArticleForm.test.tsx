import React from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateArticleForm from "@/app/components/CreateArticleForm";
import { useArticles } from "@/app/DashboardAdministrateur/hooks/useArticles";
import { vi, Mock } from "vitest";

vi.mock("@/app/DashboardAdministrateur/hooks/useArticles", () => ({
  useArticles: vi.fn(),
}));

describe("CreateArticleForm", () => {
  const mockAddArticle = vi.fn();

  beforeEach(() => {
    (useArticles as unknown as Mock).mockReturnValue({
      addArticle: mockAddArticle,
    });
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        article: {
          id_article: "1",
          titre: "Nouveau article",
          contenu: "Contenu",
          creeLe: new Date().toISOString(),
          categorie_id: "cat1",
        },
      }),
    });
  });

  it("ne rend pas le formulaire si selectedCategory est null", () => {
    const { container } = render(
      <CreateArticleForm selectedCategory={null} utilisateurId="user1" />
    );
    expect(container.firstChild).toBeNull();
  });

  it("soumet le formulaire, appelle addArticle et réinitialise les champs", async () => {
    render(<CreateArticleForm selectedCategory="cat1" utilisateurId="user1" />);
    const titreInput = screen.getByLabelText("Titre");
    const contenuInput = screen.getByLabelText("Contenu");

    fireEvent.change(titreInput, { target: { value: "Test titre" } });
    fireEvent.change(contenuInput, { target: { value: "Test contenu" } });

    const submitButton = screen.getByText("Ajouter l'article");
    fireEvent.click(submitButton);

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(mockAddArticle).toHaveBeenCalled();
    expect(titreInput).toHaveValue("");
    expect(contenuInput).toHaveValue("");
  });
});
