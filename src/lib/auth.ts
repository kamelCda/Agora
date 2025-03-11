import { PrismaClient, Role } from "@prisma/client";
import { NextAuthOptions, User } from "next-auth"; // ✅ Importer le type User
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
        // ✅ Spécifier le type User
        if (!credentials?.email || !credentials?.password) return null;
        const { email, password } = credentials;
        const utilisateur = await prisma.utilisateur.findFirst({
          where: { email: credentials.email },
          include: { affectations: { include: { role: true } } },
        });

        if (!utilisateur) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          utilisateur.motDePasse
        );
        if (!isValid) return null;

        return {
          id: utilisateur.id_utilisateur, // ✅ Correction pour NextAuth
          id_utilisateur: utilisateur.id_utilisateur,
          email: utilisateur.email,
          nom: utilisateur.nom,
          prenom: utilisateur.prenom,
          role: utilisateur.affectations.map((r) => r.role.nomRole), // Récupération des rôles
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          id_utilisateur: token.id_utilisateur as string,
          email: token.email as string,
          nom: token.nom as string,
          prenom: token.prenom as string,
          role: token.role as string[],
        };
      }
      return session;
    },
    async jwt({ token, user }) {
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
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
};
