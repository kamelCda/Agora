import { useState, useEffect } from "react";

export interface User {
  id: string;
}
/**
 * Hook permettant la récupération des utilisateurs et la gestion
 * du bannissement (sans suppression).
 * Utilisable par un modérateur.
 */
export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);

  // Récupération initiale de la liste des utilisateurs
  useEffect(() => {
    fetch("/api/utilisateurs")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des utilisateurs");
        }
        return response.json();
      })
      .then((data) => setUsers(data))
      .catch((error) => {
        console.error(error);
      });
  }, []);

  /**
   * Bannis un utilisateur sans le supprimer
   */
  const banUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/utilisateurs/${userId}/bannis`, {
        method: "POST", // ou PUT selon votre API
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Impossible de bannir l’utilisateur");
      }

      // Met à jour l’état local : on modifie le champ 'isBanned' dans la liste
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, isBanned: true } : user
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  return {
    users,
    banUser,
  };
}
