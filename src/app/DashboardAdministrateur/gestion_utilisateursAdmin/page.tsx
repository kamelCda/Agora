"use client";
import React, { useState } from "react";
import { useUsersAdmin } from "@/app/DashboardAdministrateur/hooks/useUserAdmin";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader } from "@/app/components/ui/card";
import { useSession } from "next-auth/react";

export default function PageUtilisateursBannis() {
  const { users, loading, error, deleteUser } = useUsersAdmin();
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter((user) =>
    user.nomUtilisateur.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isAdmin = session?.user?.role?.includes("ADMINISTRATEUR");

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
                  {isAdmin && (
                    <Button
                      variant="destructive"
                      onClick={() => deleteUser(user.id_utilisateur)}
                    >
                      Supprimer
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
