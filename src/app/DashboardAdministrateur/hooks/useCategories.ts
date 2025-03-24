"use client";
import { useState, useEffect } from "react";

export interface category {
  id_categorie: string;
  nomCategorie: string;
}

export function useCategories() {
  const [categories, setCategories] = useState<category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all categories from the API
  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(data.categories ?? []);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  // Ajout de nouvelle Catégorie
  const addCategory = async (name: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nomCategorie: name }),
      });
      if (!res.ok) throw new Error("Failed to add category");
      const data = await res.json();
      //extrait l'objet actuel
      const createdCategory = data.categorie;

      setCategories((prevCategories) => [...prevCategories, createdCategory]);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  // Effacer une Category
  const deleteCategory = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete category");
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.id_categorie !== id)
      );
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    addCategory,
    deleteCategory,
  };
}
