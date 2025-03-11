import { PrismaClient } from "@prisma/client";

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
export async function GET(req: NextRequest, { params }: Params) {
  const { utilisateur_id } = params;

  if (!utilisateur_id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id_utilisateur: utilisateur_id },
      include: { role: true ,commentaires:true},
    });

    if (!utilisateur) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: utilisateur });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur :", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// PATCH : Mise à jour des champs de l'utilisateur
export async function PATCH(request: NextRequest, { params }: Params) {
  const { utilisateur_id } = params;

  if (!utilisateur_id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    // Lecture du body JSON envoyé par le client
    const body = await request.json();

    // Vérification que l'utilisateur existe
    const existingUser = await prisma.utilisateur.findUnique({
      where: { id_utilisateur: utilisateur_id },
    });
    if (!existingUser) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Construction d'un objet contenant uniquement les champs à mettre à jour
    const dataToUpdate: { [key: string]: any } = {};

    if (body.nom !== undefined) dataToUpdate.nom = body.nom;
    if (body.prenom !== undefined) dataToUpdate.prenom = body.prenom;
    if (body.adresse !== undefined) dataToUpdate.adresse = body.adresse;
    if (body.telephone !== undefined) dataToUpdate.telephone = body.telephone;
    if (body.email !== undefined) dataToUpdate.email = body.email;
    if (body.ville !== undefined) dataToUpdate.ville = body.ville;
    if (body.classe !== undefined) dataToUpdate.classe = body.classe;
    if (body.debutFormation !== undefined)
      dataToUpdate.debutFormation = new Date(body.debutFormation);
    if (body.finFormation !== undefined)
      dataToUpdate.finFormation = new Date(body.finFormation);

    // Si un nouveau mot de passe est fourni, on le hache avant mise à jour
    if (body.motDePasse !== undefined) {
      const salt = await bcrypt.genSalt(10);
      dataToUpdate.motDePasse = await bcrypt.hash(body.motDePasse, salt);
    }

    // Mettre à jour le timestamp de modification
    dataToUpdate.modifieLe = new Date();

    // Mise à jour de l'utilisateur avec retour des relations identiques au GET
    const updatedUtilisateur = await prisma.utilisateur.update({
      where: { id_utilisateur: utilisateur_id },
      data: dataToUpdate,
      include: {},
    });

    return NextResponse.json({ success: true, data: updatedUtilisateur });
  } catch (error) {
    console.error("Erreur dans PATCH settings:", error);
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
    console.error("Erreur lors de la suppression :", error);
    let errorMessage = "Erreur lors de la suppression";

    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      {
        success: false,
        error: errorMessage || "Erreur lors de la suppression",
      },
      { status: 500 }
    );
  }
}
