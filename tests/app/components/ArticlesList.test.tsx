import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ArticlesList from "@/app/components/ArticlesList";
import { SessionProvider } from "next-auth/react";
import { Article } from "@/app/DashboardAdministrateur/hooks/useArticles";

const mockSession = {
  expires: "2025-03-14T00:00:00.000Z",
  user: {
    id: "user-id-123",
    id_utilisateur: "123",
    email: "user@example.com",
    nom: "Doe",
    prenom: "John",
    role: ["ADMINISTRATEUR"],
  },
};

const mockArticles: Article[] = [
  {
    id_article: "1",
    titre: "Article 1",
    contenu: "Contenu de l'article 1",
    creeLe: new Date("2025-03-18").toISOString(),
    categorie_id: "cat1",
    utilisateur_id: ""
  },
];

describe("ArticlesList", () => {
  const onArticleClick = vi.fn();
  const onRefetchMoyenne = vi.fn();
  const onDeleteArticle = vi.fn();

  it("affiche les articles correctement", () => {
    render(
      <SessionProvider session={mockSession}>
        <ArticlesList
          selectedCategory="cat1"
          articles={mockArticles}
          onArticleClick={onArticleClick}
          onRefetchMoyenne={onRefetchMoyenne}
          onDeleteArticle={onDeleteArticle}
        />
      </SessionProvider>
    );

    expect(screen.getByText("Article 1")).toBeInTheDocument();
    expect(screen.getByText("Contenu de l'article 1")).toBeInTheDocument();
    expect(screen.getByText("Publié le 18/03/2025")).toBeInTheDocument();
    expect(screen.getByText("Supprimer")).toBeInTheDocument();
  });

  it("appelle onArticleClick lors du clic sur le titre", () => {
    render(
      <SessionProvider session={mockSession}>
        <ArticlesList
          selectedCategory="cat1"
          articles={mockArticles}
          onArticleClick={onArticleClick}
          onRefetchMoyenne={onRefetchMoyenne}
          onDeleteArticle={onDeleteArticle}
        />
      </SessionProvider>
    );

    fireEvent.click(screen.getByText("Article 1"));
    expect(onArticleClick).toHaveBeenCalledWith("1");
  });

  it("appelle onDeleteArticle lors du clic sur Supprimer", () => {
    render(
      <SessionProvider session={mockSession}>
        <ArticlesList
          selectedCategory="cat1"
          articles={mockArticles}
          onArticleClick={onArticleClick}
          onRefetchMoyenne={onRefetchMoyenne}
          onDeleteArticle={onDeleteArticle}
        />
      </SessionProvider>
    );

    fireEvent.click(screen.getByText("Supprimer"));
    expect(onDeleteArticle).toHaveBeenCalledWith(mockArticles[0]);
  });

  it("demande de sélectionner une catégorie si aucune n'est choisie", () => {
    render(
      <SessionProvider session={mockSession}>
        <ArticlesList
          selectedCategory={null}
          articles={[]}
          onArticleClick={onArticleClick}
          onRefetchMoyenne={onRefetchMoyenne}
          onDeleteArticle={onDeleteArticle}
        />
      </SessionProvider>
    );

    expect(
      screen.getByText("Veuillez sélectionner une catégorie")
    ).toBeInTheDocument();
  });
});
