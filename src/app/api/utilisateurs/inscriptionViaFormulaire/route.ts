// import bcrypt from "bcrypt";

// import { PrismaClient } from "@prisma/client";
// import { NextResponse } from "next/server";
// import { z } from "zod";
// import { utilisateurSchema } from "@/lib/validation";
// const prisma = new PrismaClient();

// export async function POST(req: Request) {
//   try {
//     /******************************************* */

//     // Parse et validation du body avec le schéma Zod
//     const body = utilisateurSchema.parse(await req.json());
//     console.log("Données validées:", body);

//     // Vérifier si l'email existe déjà
//     const existingUser = await prisma.utilisateur.findFirst({
//       where: { email: body.email },
//     });
//     if (existingUser) {
//       return NextResponse.json(
//         { error: "Email déjà utilisé." },
//         { status: 409 }
//       );
//     }

//     // Hachage du mot de passe
//     const hashedPassword = await bcrypt.hash(body.motDePasse, 10);

//     // 4. chercher ou cree le role
//     let roleUtilisateur = await prisma.role.findUnique({
//       where: { nomRole: body.nomRole },
//     });
//     if (!roleUtilisateur) {
//       roleUtilisateur = await prisma.role.create({
//         data: {
//           nomRole: "UTILISATEUR",
//         },
//       });
//     }

//     /*************************************** */
//     // 2. Create the User (ETUDIANT role)
//     const utilisateur = await prisma.utilisateur.create({
//       data: {
//         nom: body.nom,
//         prenom: body.prenom,
//         adresse: body.adresse,
//         telephone: body.telephone,
//         email: body.email,
//         motDePasse: hashedPassword,
//         ville: body.ville,
//         nomUtilisateur: body.nomUtilisateur,
//         creeLe: new Date(),
//         miseAjourLe: new Date(),
//       },
//     });

//     // 5. Return response
//     return new Response(JSON.stringify({ utilisateur }), {
//       status: 201,
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (error: any) {
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 400,
//       headers: { "Content-Type": "application/json" },
//     });
//   } finally {
//     await prisma.$disconnect();
//   }
// }

/******************************************************* */

import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { utilisateurSchema } from "@/lib/validation";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // Parse and validate the request body with Zod
    const body = utilisateurSchema.parse(await req.json());
    console.log("Validated Data:", body);

    // Check if the email already exists
    const existingUser = await prisma.utilisateur.findFirst({
      where: { email: body.email },
    });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email déjà utilisé." },
        { status: 409 }
      );
    }

    // Check if the username already exists
    const existingUsername = await prisma.utilisateur.findFirst({
      where: { nomUtilisateur: body.nomUtilisateur },
    });
    if (existingUsername) {
      return NextResponse.json(
        { error: "Nom d'utilisateur déjà utilisé." },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(body.motDePasse, 10);

    // Fetch or create the role and retrieve its ID
    const role = await prisma.role.upsert({
      where: { nomRole: body.nomRole ?? "UTILISATEUR" },
      update: {},
      create: { nomRole: "UTILISATEUR" },
    });

    // Create the user
    const utilisateur = await prisma.utilisateur.create({
      data: {
        nom: body.nom,
        prenom: body.prenom,
        adresse: body.adresse,
        telephone: body.telephone,
        email: body.email,
        motDePasse: hashedPassword,
        ville: body.ville,
        nomUtilisateur: body.nomUtilisateur,
        image: body.image ? body.image : null,
        description: body.description ?? null,
        creeLe: new Date(),
        miseAjourLe: new Date(),
      },
    });

    // Create the role assignment in the pivot table
    await prisma.affectationRole.create({
      data: {
        id_utilisateur: utilisateur.id_utilisateur,
        id_role: role.id_role,
      },
    });

    // Return a successful response
    return new Response(JSON.stringify({ utilisateur }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error creating user:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    await prisma.$disconnect();
  }
}
