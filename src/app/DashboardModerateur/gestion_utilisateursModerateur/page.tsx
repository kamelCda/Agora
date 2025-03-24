"use client";
import React, { useState } from "react";
import { useUsersBannis } from "@/app/DashboardAdministrateur/hooks/useUsers";
import { Input } from "@/app/components/ui/input";
import { Card, CardContent, CardHeader } from "@/app/components/ui/card";

export default function PageUtilisateursBannis() {
  const { users, loading, error } = useUsersBannis();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter((user) =>
    user.nomUtilisateur.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Utilisateurs Bannis</h2>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Rechercher un utilisateur banni..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
          {error && <p className="text-red-500">{error}</p>}
          {loading ? (
            <p>Chargement...</p>
          ) : (
            <ul className="space-y-2">
              {filteredUsers.map((user) => (
                <li
                  key={user.id_utilisateur}
                  className="flex justify-between items-center"
                >
                  <span>{user.nomUtilisateur}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
