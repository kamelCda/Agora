import React from "react";
import { describe, it, expect, beforeEach, vi, Mock } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ArticleDetails from "@/app/components/ArticleDetails";
import { useCommentaires } from "@/app/DashboardAdministrateur/hooks/useCommentaires";
import { SessionProvider } from "next-auth/react";

// On se moque du hook useCommentaires
vi.mock("@/app/DashboardAdministrateur/hooks/useCommentaires", () => ({
  useCommentaires: vi.fn(),
}));

// On se moque des composants enfants EvaluationForm et UpvoteButton
vi.mock("@/components/EvaluationArticle", () => ({
  default: () => <div>EvaluationFormMock</div>,
}));
vi.mock("@/components/upVoteButton", () => ({
  default: () => <div>UpvoteButtonMock</div>,
}));

// Mock complet de la session conforme aux types attendus par NextAuth
const mockSession = {
  expires: "2025-03-14T00:00:00.000Z",
  user: {
    id: "user-id-123",
    id_utilisateur: "123",
    email: "user@example.com",
    nom: "Doe",
    prenom: "John",
    role: ["user"],
  },
};

describe("ArticleDetails", () => {
  const mockFetchCommentaires = vi.fn();
  const mockPostCommentaire = vi.fn();
  const mockUpdateCommentaire = vi.fn();
  const mockDeleteCommentaire = vi.fn();

  beforeEach(() => {
    (useCommentaires as unknown as Mock).mockReturnValue({
      commentaires: [
        { id_commentaire: "c1", contenu: "Commentaire 1", upvotes: [] },
      ],
      loading: false,
      error: null,
      fetchCommentaires: mockFetchCommentaires,
      postCommentaire: mockPostCommentaire,
      updateCommentaire: mockUpdateCommentaire,
      deleteCommentaire: mockDeleteCommentaire,
    });
  });

  const article = {
    id_article: "1",
    titre: "Titre de l'article",
    contenu: "Contenu de l'article",
    creeLe: new Date().toISOString(),
    categorie_id: "cat1",
    utilisateur_id: "user1",
  };

  it("ne rend rien si aucun article n'est fourni", () => {
    const { container } = render(
      <SessionProvider session={mockSession}>
        <ArticleDetails
          selectedCategory="cat1"
          article={null}
          moyenneEvaluations={null}
          onDeselectArticle={vi.fn()}
          onRefetchMoyenne={vi.fn()}
        />
      </SessionProvider>
    );
    expect(container.firstChild).toBeNull();
  });

  it("affiche les détails de l'article et pré-remplit les champs du formulaire", () => {
    render(
      <SessionProvider session={mockSession}>
        <ArticleDetails
          selectedCategory="cat1"
          article={article}
          moyenneEvaluations={4.5}
          onDeselectArticle={vi.fn()}
          onRefetchMoyenne={vi.fn()}
        />
      </SessionProvider>
    );
    expect(screen.getByText(article.titre)).toBeInTheDocument();
    expect(screen.getByDisplayValue(article.titre)).toBeInTheDocument();
    expect(screen.getByDisplayValue(article.contenu)).toBeInTheDocument();
  });

  it("appelle fetchCommentaires au montage", () => {
    render(
      <SessionProvider session={mockSession}>
        <ArticleDetails
          selectedCategory="cat1"
          article={article}
          moyenneEvaluations={null}
          onDeselectArticle={vi.fn()}
          onRefetchMoyenne={vi.fn()}
        />
      </SessionProvider>
    );
    expect(mockFetchCommentaires).toHaveBeenCalled();
  });

  it("gère la soumission de la mise à jour de l'article", async () => {
    const onDeselectArticle = vi.fn();
    global.fetch = vi.fn().mockResolvedValue({ ok: true });
    render(
      <SessionProvider session={mockSession}>
        <ArticleDetails
          selectedCategory="cat1"
          article={article}
          moyenneEvaluations={null}
          onDeselectArticle={onDeselectArticle}
          onRefetchMoyenne={vi.fn()}
        />
      </SessionProvider>
    );

    // Modification des champs
    const titreInput = screen.getByDisplayValue(article.titre);
    fireEvent.change(titreInput, { target: { value: "Nouveau titre" } });
    const contenuInput = screen.getByDisplayValue(article.contenu);
    fireEvent.change(contenuInput, { target: { value: "Nouveau contenu" } });

    // Soumission du formulaire
    const updateButton = screen.getByText("Mettre à jour l'article");
    fireEvent.click(updateButton);

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(onDeselectArticle).toHaveBeenCalled();
  });

  it("gère l'ajout d'un nouveau commentaire", async () => {
    render(
      <SessionProvider session={mockSession}>
        <ArticleDetails
          selectedCategory="cat1"
          article={article}
          moyenneEvaluations={null}
          onDeselectArticle={vi.fn()}
          onRefetchMoyenne={vi.fn()}
        />
      </SessionProvider>
    );
    const commentTextarea = screen.getByPlaceholderText(
      "Ajouter un commentaire..."
    );
    fireEvent.change(commentTextarea, {
      target: { value: "Nouveau commentaire" },
    });
    const addCommentButton = screen.getByText("Ajouter le commentaire");
    fireEvent.click(addCommentButton);
    await waitFor(() =>
      expect(mockPostCommentaire).toHaveBeenCalledWith("Nouveau commentaire")
    );
  });

  it("gère l'édition et la mise à jour d'un commentaire", async () => {
    render(
      <SessionProvider session={mockSession}>
        <ArticleDetails
          selectedCategory="cat1"
          article={article}
          moyenneEvaluations={null}
          onDeselectArticle={vi.fn()}
          onRefetchMoyenne={vi.fn()}
        />
      </SessionProvider>
    );
  
    // Clique sur le bouton "Modifier"
    const editButton = screen.getByText("Modifier");
    fireEvent.click(editButton);
  
    // Utilise getByDisplayValue pour cibler précisément le textarea de l'édition
    const textarea = screen.getByDisplayValue("Commentaire 1");
    fireEvent.change(textarea, { target: { value: "Commentaire modifié" } });
  
    // Clique sur le bouton "Sauvegarder"
    const saveButton = screen.getByText("Sauvegarder");
    fireEvent.click(saveButton);
  
    await waitFor(() =>
      expect(mockUpdateCommentaire).toHaveBeenCalledWith({
        id_commentaire: "c1",
        contenu: "Commentaire modifié",
      })
    );
  });
  

  it("gère la suppression d'un commentaire", async () => {
    render(
      <SessionProvider session={mockSession}>
        <ArticleDetails
          selectedCategory="cat1"
          article={article}
          moyenneEvaluations={null}
          onDeselectArticle={vi.fn()}
          onRefetchMoyenne={vi.fn()}
        />
      </SessionProvider>
    );
    const deleteButton = screen.getByText("Supprimer");
    fireEvent.click(deleteButton);
    await waitFor(() =>
      expect(mockDeleteCommentaire).toHaveBeenCalledWith("c1")
    );
  });
});
