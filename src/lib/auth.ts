import { PrismaClient } from "@prisma/client";
import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) return null;

        const utilisateur = await prisma.utilisateur.findFirst({
          where: { email: credentials.email },
          include: {
            affectations: { include: { role: true } },
          },
        });

        if (!utilisateur) return null;

        // Vérification du mot de passe avec bcrypt
        const isValid = await bcrypt.compare(
          credentials.password,
          utilisateur.motDePasse
        );
        if (!isValid) return null;

        // On retourne l'objet User attendu par NextAuth
        return {
          id: utilisateur.id_utilisateur,
          id_utilisateur: utilisateur.id_utilisateur,
          email: utilisateur.email,
          nom: utilisateur.nom!,
          prenom: utilisateur.prenom!,
          role: utilisateur.affectations.map((r) => r.role.nomRole), // Tableau de rôles
        };
      },
    }),
  ],
  session: { strategy: "jwt" },

  // Les callbacks :
  callbacks: {
    /**
     * 1) Lecture du token et relecture BDD pour fournir une session à jour.
     */
    async session({ session, token }) {
      // On ne relit la BDD que si on a un id_utilisateur dans le token
      if (token?.id_utilisateur) {
        // Récupérer l'utilisateur à chaque requête pour s'assurer d'avoir
        // les données et rôles à jour.
        const utilisateur = await prisma.utilisateur.findUnique({
          where: { id_utilisateur: token.id_utilisateur as string },
          include: { affectations: { include: { role: true } } },
        });

        if (utilisateur) {
          session.user = {
            id: utilisateur.id_utilisateur,
            id_utilisateur: utilisateur.id_utilisateur,
            email: utilisateur.email,
            nom: utilisateur.nom ?? "",
            prenom: utilisateur.prenom ?? "",
            // Convertir la liste d'affectations en liste de noms de rôle
            role: utilisateur.affectations.map((r) => r.role.nomRole),
          };
        }
      }

      return session;
    },

    /**
     * 2) Alimenter le token JWT au login (et éviter de le perdre).
     */
    async jwt({ token, user }) {
      // Au moment de la connexion, 'user' est défini, donc on alimente le token
      if (user) {
        token.id = user.id;
        token.id_utilisateur = user.id_utilisateur;
        token.email = user.email;
        token.nom = user.nom;
        token.prenom = user.prenom;
        token.role = user.role;
      }
      return token;
    },
  },

  // Pages de redirection
  pages: {
    signIn: "/login",
  },
};
