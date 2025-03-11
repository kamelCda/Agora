import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      id_utilisateur: string;
      email: string;
      nom: string;
      prenom: string;
      role: string[];
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    id_utilisateur: string;
    email: string;
    nom: string;
    prenom: string;
    role: string[];
  }
}

declare module "next-themes" {
  export * from "next-themes/dist/types";
}
