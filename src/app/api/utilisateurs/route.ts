import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
const headers = {
  "Content-Type": "application/json",
};

export async function POST(req: Request) {
  try {
    
    const {
      nom,
      prenom,
      adresse,
      telephone,
      email,
      motDePasse,
      ville,
      nomUtilisateur,
      description,
      nomRole, //
    } = await req.json();

    // 1. Validation des champs ...

    // 2. verifier si l'email exite deja ...
    const existingUser = await prisma.utilisateur.findFirst({
      where: { email: email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email déjà utilisé." },
        { status: 409 }
      );
    }
    // 3. Hasher le password ...
    const hashedPassword = await bcrypt.hash(motDePasse, 10);

    // 4. chercher ou cree le role
    let roleUtilisateur = await prisma.role.findUnique({
      where: { nomRole },
    });
    if (!roleUtilisateur) {
      roleUtilisateur = await prisma.role.create({
        data: { nomRole },
      });
    }

    // creation de l'utilisateur
    const utilisateur = await prisma.utilisateur.create({
      data: {
        nom,
        prenom,
        adresse,
        telephone,
        email,
        ville,
        nomUtilisateur,
        motDePasse: hashedPassword,
        role_id: roleUtilisateur.id_role,
        affectations: {
          create: [
            {
              role: { connect: { id_role: roleUtilisateur.id_role } },
            },
          ],
        },
      },
      include: {
        role: true,
        affectations: { include: { role: true } },
      },
    });

    // Retourne le nouvel utilisateur
    return NextResponse.json({ utilisateur }, { status: 201 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers,
    });
  }
}

/***************************************************** */
export async function GET() {
  try {
    const utilisateurs = await prisma.utilisateur.findMany({
      include: {
        role: true, // Direct role if you have a role_id on utilisateur
        affectations: {
          include: {
            role: true, // Includes the role record tied to each affectation
          },
        },
      },
    });
    return new Response(
      JSON.stringify({
        success: true,
        utilisateurs,
      }),
      {
        status: 200,
        headers,
      }
    );
  } catch (error) {
    let errorMessage = "";
    if (typeof error === "string") {
      errorMessage = error;
    } else if (typeof error === "object" && error !== null) {
      errorMessage =
        error instanceof Error ? error.message : JSON.stringify(error);
    } else {
      errorMessage = String(error);
    }

    console.error("Error fetching users:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
    });
  } finally {
    await prisma.$disconnect();
  }
}
