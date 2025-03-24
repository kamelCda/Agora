import { useState, useEffect } from "react";
import {
  useUsersBannis,
  User,
} from "@/app/DashboardAdministrateur/hooks/useUsers";

/**
 * Hook Admin qui étend les fonctionnalités de useUsersBannis :
 * possibilité de bannir ET de supprimer un utilisateur.
 */
export function useUsersAdmin() {
  const { users: initialUsers, loading, error } = useUsersBannis();
  const [users, setUsers] = useState<User[]>(initialUsers);

  // Synchroniser l'état local avec l'état initial provenant du hook
  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  /**
   * Bannis un utilisateur sans le supprimer
   */
  const banUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/utilisateurs/${userId}/banni`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Impossible de bannir l’utilisateur");
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id_utilisateur === userId ? { ...user, banni: true } : user
        )
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
    }
  };

  /**
   * Supprime un utilisateur définitivement
   */
  const deleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/utilisateurs/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Impossible de supprimer l’utilisateur");
      }

      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id_utilisateur !== userId)
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
    }
  };

  return { users, loading, error, banUser, deleteUser };
}
