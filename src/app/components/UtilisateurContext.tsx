"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

type UtilisateurContextType = {
  utilisateurId: string | null;
};

const UtilisateurContext = createContext<UtilisateurContextType>({
  utilisateurId: null,
});

export const UtilisateurProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [utilisateurId, setUtilisateurId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUtilisateur = async () => {
      const response = await fetch(`/api/utilisateurs/${utilisateurId}`);
      const data = await response.json();
      setUtilisateurId(data.utilisateur_id);
    };

    fetchUtilisateur();
  }, []);

  return (
    <UtilisateurContext.Provider value={{ utilisateurId }}>
      {children}
    </UtilisateurContext.Provider>
  );
};

export const useUtilisateur = () => useContext(UtilisateurContext);
