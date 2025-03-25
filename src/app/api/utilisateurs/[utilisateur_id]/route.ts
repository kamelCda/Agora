import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

const headers = {
  "Content-Type": "application/json",
};

// 🧩 Helper pour extraire l’ID utilisateur depuis l’URL
function extractUtilisateurId(pathname: string): string | null {
  const match = pathname.match(/\/utilisateurs\/([^/]+)/);
  return match ? match[1] : null;
}

// ✅ GET : récupérer un utilisateur avec ses relations
export async function GET(req: NextRequest) {
  const utilisateur_id = extractUtilisateurId(req.nextUrl.pathname);
  if (!utilisateur_id) {
    return NextResponse.json({ error: "ID requis" }, { status: 400 });
  }

  try {
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id_utilisateur: utilisateur_id },
      include: { commentaires: true },
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
    console.error("Erreur GET utilisateur :", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// ✅ PATCH : mettre à jour l'utilisateur
export async function PATCH(req: NextRequest) {
  const utilisateur_id = extractUtilisateurId(req.nextUrl.pathname);
  if (!utilisateur_id) {
    return NextResponse.json({ error: "ID requis" }, { status: 400 });
  }

  try {
    const body = await req.json();

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
      include: { commentaires: true },
    });

    return NextResponse.json(
      { success: true, data: updatedUtilisateur },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur PATCH utilisateur :", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la mise à jour" },
      { status: 500 }
    );
  }
}

// ✅ DELETE : supprimer un utilisateur
export async function DELETE(req: NextRequest) {
  const utilisateur_id = extractUtilisateurId(req.nextUrl.pathname);
  if (!utilisateur_id) {
    return NextResponse.json({ error: "ID requis" }, { status: 400 });
  }

  try {
    const deletedUser = await prisma.utilisateur.delete({
      where: { id_utilisateur: utilisateur_id },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Utilisateur supprimé",
        data: deletedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur DELETE utilisateur :", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
