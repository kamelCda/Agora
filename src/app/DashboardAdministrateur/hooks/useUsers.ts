import { useState, useEffect } from "react";

export interface User {
  id_utilisateur: string;
  nomUtilisateur: string;
  banni: boolean;
}

export function useUsersBannis() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/utilisateurs/bannis")
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Erreur lors de la récupération des utilisateurs bannis"
          );
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          throw new Error("Les données reçues ne sont pas un tableau.");
        }
      })
      .catch((error: unknown) => {
        const err = error as Error;
        console.error(err);
        setError(err.message);
        setUsers([]);
      })

      .finally(() => setLoading(false));
  }, []);

  return { users, loading, error };
}
