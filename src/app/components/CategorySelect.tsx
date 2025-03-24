"use client";

import React from "react";
import { useCategories } from "@/app/DashboardAdministrateur/hooks/useCategories";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/app/components/ui/select";

interface CategorySelectProps {
  onCategoryChange: (categoryId: string) => void;
}

const CategorySelect: React.FC<CategorySelectProps> = ({
  onCategoryChange,
}) => {
  const { categories, loading, error } = useCategories();

  if (loading) return <p>Chargement des catégories...</p>;
  if (error) return <p className="text-red-500">Erreur: {error}</p>;

  return (
    <Select onValueChange={onCategoryChange}>
      <SelectTrigger className="w-full mb-4">
        <SelectValue placeholder="Choisissez une catégorie" />
      </SelectTrigger>
      <SelectContent>
        {categories.map((category) => (
          <SelectItem key={category.id_categorie} value={category.id_categorie}>
            {category.nomCategorie}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CategorySelect;
