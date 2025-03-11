import { z } from "zod";

// Schéma de validation pour Utilisateur
export const utilisateurSchema = z.object({
  nom: z.string().min(2, "Le nom doit avoir au moins 2 caractères"),
  prenom: z.string().min(2, "Le prénom doit avoir au moins 2 caractères"),
  adresse: z.string().min(5, "Adresse trop courte"),
  telephone: z
    .string()
    .regex(/^\+?[0-9.\s\-()]{10,20}$/, "Numéro de téléphone invalide")
    .optional()
    .or(z.literal("")), // Allows empty strings for optional telephone
  email: z.string().email("Email invalide"),
  motDePasse: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  ville: z.string().min(2, "Ville trop courte"),
  nomUtilisateur: z
    .string()
    .min(4, "Le nom d'utilisateur doit contenir au moins 4 caractères"), // Updated to 4 characters
  image: z.union([z.string().url("Image invalide"), z.literal("")]).optional(), // Optional image field allows empty strings and valid URLs
  description: z.string().optional(),
  creeLe: z.string().optional(),
  modifie_le: z.string().optional(),
  nomRole: z.string().default("UTILISATEUR").optional(),
});
