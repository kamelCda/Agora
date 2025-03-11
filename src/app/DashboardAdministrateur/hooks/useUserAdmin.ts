import { useState } from "react";
import { useUsers } from "./useUsers";
import { User } from "next-auth";
/**
 * Hook Admin qui étend les fonctionnalités de useUsers :
 * possibilité de bannir ET de supprimer un utilisateur.
 */
export function useUsersAdmin() {
  // On réutilise la logique du hook de base (useUsers)
  // afin d'avoir la liste des users et la méthode banUser.
  const { users, banUser } = useUsers();

  // Dans ce cas précis, on a besoin d'accéder et de mettre à jour
  // la liste users localement, donc on la copie dans un état interne:
  // (optionnel : on peut aussi modifier le hook useUsers
  // pour exposer setUsers si besoin)
  const [localUsers, setLocalUsers] = useState(users);

  // Met à jour localUsers si users change dans useUsers
  // (ex: après un bannissement)
  if (localUsers !== users) {
    setLocalUsers(users);
  }

  /**
   * Supprime un utilisateur (ban + suppression définitive)
   */
  const deleteUser = async (userId:string) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Impossible de supprimer l’utilisateur");
      }

      // Met à jour l’état local pour refléter la suppression
      setLocalUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== userId)
      );
    } catch (error) {
      console.error(error);
    }
  };

  return {
    users: localUsers,
    banUser,
    deleteUser,
  };
}
