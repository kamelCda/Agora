"use client";
import React, { useState } from "react";
import { useMyCategories } from "@/app/DashboardAdministrateur/hooks/useMyCategories";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card, CardContent, CardHeader } from "@/app/components/ui/card";

export default function CategorieAdminPage() {
  const { categories, loading, error, addCategory, deleteCategory } =
    useMyCategories();

  const [searchTerm, setSearchTerm] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");

  const filteredCategories = categories.filter((category) =>
    category.nomCategorie.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCategory = () => {
    if (newCategoryName.trim() !== "") {
      addCategory(newCategoryName);
      setNewCategoryName("");
    }
  };

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Categories Management</h2>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <Input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
            <Input
              type="text"
              placeholder="New category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="w-full"
            />
            <Button onClick={handleAddCategory} disabled={loading}>
              Add
            </Button>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul className="space-y-2">
              {filteredCategories.map((category) => (
                <li
                  key={category.id_categorie}
                  className="flex justify-between"
                >
                  <span>{category.nomCategorie}</span>
                  <Button
                    onClick={() => deleteCategory(category.id_categorie)}
                    variant="destructive"
                    disabled={loading}
                  >
                    Delete
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
