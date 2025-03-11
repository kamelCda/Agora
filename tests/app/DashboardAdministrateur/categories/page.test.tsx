// categorieAdminPage.test.tsx
/// <reference types="vitest" />

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import CategorieAdminPage from "@/app/DashboardAdministrateur/categories/page";
import { useCategories } from "@/app/DashboardAdministrateur/hooks/useCategories";

// Mock du hook useCategories
vi.mock("@/app/DashboardAdministrateur/hooks/useCategories", () => ({
  useCategories: vi.fn(),
}));

describe("CategorieAdminPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("affiche les catégories filtrées par le terme de recherche", () => {
    (useCategories as vi.Mock).mockReturnValue({
      categories: [
        { id_categorie: "1", nomCategorie: "sql" },
        { id_categorie: "2", nomCategorie: "javascript" },
        { id_categorie: "3", nomCategorie: "react" },
      ],
      loading: false,
      error: null,
      addCategory: vi.fn(),
      deleteCategory: vi.fn(),
    });

    render(<CategorieAdminPage />);

    const searchInput = screen.getByPlaceholderText("Search categories...");

    fireEvent.change(searchInput, { target: { value: "Sci" } });

    expect(screen.getByText("sql")).toBeInTheDocument();
    expect(screen.queryByText("javascript")).not.toBeInTheDocument();
    expect(screen.queryByText("react")).not.toBeInTheDocument();
  });

  it("ajoute une nouvelle catégorie lorsqu'on clique sur 'Add'", async () => {
    const addCategoryMock = vi.fn();

    (useCategories as vi.Mock).mockReturnValue({
      categories: [],
      loading: false,
      error: null,
      addCategory: addCategoryMock,
      deleteCategory: vi.fn(),
    });

    render(<CategorieAdminPage />);

    const input = screen.getByPlaceholderText("New category name");
    fireEvent.change(input, { target: { value: "Nouvelle Catégorie" } });

    const addButton = screen.getByRole("button", { name: /Add/i });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(addCategoryMock).toHaveBeenCalledWith("Nouvelle Catégorie");
    });
  });

  it("supprime une catégorie lorsqu'on clique sur 'Delete'", async () => {
    const deleteCategoryMock = vi.fn();

    (useCategories as vi.Mock).mockReturnValue({
      categories: [{ id_categorie: "1", nomCategorie: "Tech" }],
      loading: false,
      error: null,
      addCategory: vi.fn(),
      deleteCategory: deleteCategoryMock,
    });

    render(<CategorieAdminPage />);

    const deleteButton = screen.getByRole("button", { name: /Delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(deleteCategoryMock).toHaveBeenCalledWith("1");
    });
  });

  it("affiche un message d'erreur si le hook renvoie une erreur", () => {
    (useCategories as vi.Mock).mockReturnValue({
      categories: [],
      loading: false,
      error: "Erreur de chargement",
      addCategory: vi.fn(),
      deleteCategory: vi.fn(),
    });

    render(<CategorieAdminPage />);
    expect(screen.getByText("Erreur de chargement")).toBeInTheDocument();
  });

  it("affiche un indicateur de chargement lorsqu'en cours de chargement", () => {
    (useCategories as vi.Mock).mockReturnValue({
      categories: [],
      loading: true,
      error: null,
      addCategory: vi.fn(),
      deleteCategory: vi.fn(),
    });

    render(<CategorieAdminPage />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
