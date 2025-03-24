import { z } from "zod";

// Schéma de validation pour Utilisateur
export const utilisateurSchema = z.object({
  email: z.string().email("Email invalide"),
  motDePasse: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  creeLe: z.string().optional(),

  nom: z.string().min(2, "Le nom doit avoir au moins 2 caractères").optional(),
  prenom: z
    .string()
    .min(2, "Le prénom doit avoir au moins 2 caractères")
    .optional(),
  adresse: z.string().min(5, "Adresse trop courte").optional(),
  ville: z.string().min(2, "Ville trop courte").optional(),
  nomUtilisateur: z
    .string()
    .min(4, "Le nom d'utilisateur doit contenir au moins 4 caractères")
    .optional(),
  telephone: z
    .string()
    .regex(/^\+?[0-9.\s\-()]{10,20}$/, "Numéro de téléphone invalide")
    .optional()
    .or(z.literal("")), // autorise les chaînes vides
  image: z.union([z.string().url("Image invalide"), z.literal("")]).optional(),
  description: z.string().optional(),
  modifie_le: z.string().optional(),
  nomRole: z.string().default("UTILISATEUR").optional(),
});
