import React from "react";
import { describe, it, expect, beforeEach, vi, Mock } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CategorySelect from "@/app/components/CategorySelect";
import { useCategories } from "@/app/DashboardAdministrateur/hooks/useCategories";

vi.mock("@/app/DashboardAdministrateur/hooks/useCategories", () => ({
  useCategories: vi.fn(),
}));

describe("CategorySelect", () => {
  beforeEach(() => {
    (useCategories as unknown as Mock).mockReturnValue({
      categories: [
        { id_categorie: "cat1", nomCategorie: "Catégorie 1" },
        { id_categorie: "cat2", nomCategorie: "Catégorie 2" },
      ],
      loading: false,
      error: null,
    });
  });

  it("affiche un message de chargement si loading est true", () => {
    (useCategories as unknown as Mock).mockReturnValueOnce({
      categories: [],
      loading: true,
      error: null,
    });
    render(<CategorySelect onCategoryChange={vi.fn()} />);
    expect(
      screen.getByText("Chargement des catégories...")
    ).toBeInTheDocument();
  });

  it("affiche un message d'erreur en cas d'erreur", () => {
    (useCategories as unknown as Mock).mockReturnValueOnce({
      categories: [],
      loading: false,
      error: "Erreur test",
    });
    render(<CategorySelect onCategoryChange={vi.fn()} />);
    expect(screen.getByText(/Erreur:/)).toBeInTheDocument();
  });

  it("affiche les options de catégories et déclenche onCategoryChange", () => {
    const onCategoryChange = vi.fn();
    render(<CategorySelect onCategoryChange={onCategoryChange} />);
  
    // Utilise getByRole pour récupérer le bouton select
    const selectTrigger = screen.getByRole("combobox");
    fireEvent.click(selectTrigger);
  
    // Vérifie que les options sont affichées
    const option = screen.getByText("Catégorie 1");
    fireEvent.click(option);
  
    // Vérifie que le callback a été appelé avec la bonne valeur
    expect(onCategoryChange).toHaveBeenCalledWith("cat1");
  });
  
});
