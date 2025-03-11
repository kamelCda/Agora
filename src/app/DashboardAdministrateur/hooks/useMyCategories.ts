"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export interface Category {
  id_categorie: string;
  nomCategorie: string;
}

export function useMyCategories() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Vérification de la session et des rôles (ADMINISTRATEUR ou MODERATEUR)
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
      return;
    }
    const roles = session.user.role;

    if (!roles.includes("ADMINISTRATEUR") && !roles.includes("MODERATEUR")) {
      router.push("/unauthorized");
      return;
    }
  }, [session, status, router]);

  // Récupérer les catégories associées à l'utilisateur authentifié via la route spécifique
  const fetchCategories = async () => {
    if (!session || !session.user.id_utilisateur) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/utilisateurs/${session.user.id_utilisateur}/mesCategories`
      );
      if (!res.ok) throw new Error("Échec de la récupération des catégories");
      const data = await res.json();
      console.log("data de l'utilisateur :" + data);
      setCategories(data.mescategories ?? []);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Une erreur inconnue s'est produite");
      }
    } finally {
      setLoading(false);
    }
  };

  // Ajouter une nouvelle catégorie via la route spécifique pour l'utilisateur connecté
  const addCategory = async (name: string) => {
    if (!session || !session.user.id_utilisateur) {
      setError("Utilisateur non authentifié");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/utilisateurs/${session.user.id_utilisateur}/mesCategories`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nomCategorie: name }),
        }
      );
      if (!res.ok) throw new Error("Échec de l'ajout de la catégorie");
      const data = await res.json();
      const createdCategory = data.categorie;
      setCategories((prev) => [...prev, createdCategory]);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Une erreur inconnue s'est produite");
      }
    } finally {
      setLoading(false);
    }
  };

  // Supprimer une catégorie
  const deleteCategory = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Échec de la suppression de la catégorie");
      setCategories((prev) =>
        prev.filter((category) => category.id_categorie !== id)
      );
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Une erreur inconnue s'est produite");
      }
    } finally {
      setLoading(false);
    }
  };

  // Chargement des catégories dès que la session est authentifiée et validée
  useEffect(() => {
    if (status === "authenticated" && session) {
      fetchCategories();
    }
  }, [session, status]);

  return {
    categories,
    loading,
    error,
    addCategory,
    deleteCategory,
  };
}
