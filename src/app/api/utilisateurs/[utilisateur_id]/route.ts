const headers = {
  "Content-Type": "application/json",
};

import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

interface Params {
  params: {
    utilisateur_id: string;
  };
}

// GET : Récupération de l'utilisateur avec ses relations
export async function GET(
  req: NextRequest,
  { params }: { params: { utilisateur_id: string } }
) {
  const { utilisateur_id } = params;

  if (!utilisateur_id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id_utilisateur: utilisateur_id },
      include: { /*role: true,*/ commentaires: true },
    });

    if (!utilisateur) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: utilisateur },
      { status: 200, headers }
    );
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur :", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { utilisateur_id } = params;

  if (!utilisateur_id) {
    return NextResponse.json({ error: "ID requis" }, { status: 400 });
  }

  try {
    const body = await request.json();

    const existingUser = await prisma.utilisateur.findUnique({
      where: { id_utilisateur: utilisateur_id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    const dataToUpdate: Record<string, unknown> = {};

    // Champs éditables
    if (body.nom !== undefined) dataToUpdate.nom = body.nom;
    if (body.prenom !== undefined) dataToUpdate.prenom = body.prenom;
    if (body.adresse !== undefined) dataToUpdate.adresse = body.adresse;
    if (body.telephone !== undefined) dataToUpdate.telephone = body.telephone;
    if (body.email !== undefined) dataToUpdate.email = body.email;
    if (body.ville !== undefined) dataToUpdate.ville = body.ville;
    if (body.image !== undefined) dataToUpdate.image = body.image;
    if (body.nomUtilisateur !== undefined)
      dataToUpdate.nomUtilisateur = body.nomUtilisateur;
    if (body.banni !== undefined) dataToUpdate.banni = body.banni;
    if (body.description !== undefined)
      dataToUpdate.description = body.description;

    // Hachage du mot de passe si fourni
    if (body.motDePasse !== undefined) {
      const salt = await bcrypt.genSalt(10);
      dataToUpdate.motDePasse = await bcrypt.hash(body.motDePasse, salt);
    }

    if (Object.keys(dataToUpdate).length === 0) {
      return NextResponse.json(
        { success: false, error: "Aucune donnée à mettre à jour." },
        { status: 400 }
      );
    }

    const updatedUtilisateur = await prisma.utilisateur.update({
      where: { id_utilisateur: utilisateur_id },
      data: dataToUpdate,
      include: {
        commentaires: true, // ou d'autres relations utiles
      },
    });

    return NextResponse.json({ success: true, data: updatedUtilisateur });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la mise à jour" },
      { status: 500 }
    );
  }
}

// DELETE : Suppression d'un utilisateur avec ses relations
export async function DELETE(req: NextRequest, { params }: Params) {
  const { utilisateur_id } = params;

  if (!utilisateur_id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    // 5. Supprimer enfin l’utilisateur
    const deletedUser = await prisma.utilisateur.delete({
      where: { id_utilisateur: utilisateur_id },
    });

    return NextResponse.json({
      success: true,
      message: "Utilisateur et toutes ses relations supprimées",
      data: deletedUser,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
