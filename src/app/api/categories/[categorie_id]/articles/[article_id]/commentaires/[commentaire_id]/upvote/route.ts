import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type UpvoteRequest = {
  commentaire_id: string;
  utilisateur_id: string;
};

// 🟢 Fonction pour créer un upvote (Méthode POST)
export async function POST(req: NextRequest) {
  try {
    const { commentaire_id, utilisateur_id }: UpvoteRequest = await req.json();

    if (!commentaire_id || !utilisateur_id) {
      return NextResponse.json(
        { error: "commentaire_id et utilisateur_id sont requis" },
        { status: 400 }
      );
    }

    const existingUpvote = await prisma.upvote.findFirst({
      where: { commentaire_id, utilisateur_id },
    });

    if (existingUpvote) {
      return NextResponse.json(
        { error: "Vous avez déjà voté pour ce commentaire" },
        { status: 409 }
      );
    }

    const newUpvote = await prisma.upvote.create({
      data: { commentaire_id, utilisateur_id },
    });

    return NextResponse.json(newUpvote, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de l'ajout du upvote :", error);
    return NextResponse.json(
      { error: "Erreur lors de l'ajout du upvote" },
      { status: 500 }
    );
  }
}

// 🔍 Fonction pour récupérer tous les upvotes (Méthode GET)
export async function GET() {
  try {
    const upvotes = await prisma.upvote.findMany();
    return NextResponse.json(upvotes, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des upvotes :", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des upvotes" },
      { status: 500 }
    );
  }
}

// ❌ Fonction pour supprimer un upvote spécifique (Méthode DELETE)
export async function DELETE(req: NextRequest) {
  try {
    const { commentaire_id, utilisateur_id }: UpvoteRequest = await req.json();

    if (!commentaire_id || !utilisateur_id) {
      return NextResponse.json(
        { error: "commentaire_id et utilisateur_id sont requis" },
        { status: 400 }
      );
    }

    await prisma.upvote.deleteMany({
      where: { commentaire_id, utilisateur_id },
    });

    return NextResponse.json(
      { message: "Upvote supprimé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la suppression du upvote :", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du upvote" },
      { status: 500 }
    );
  }
}
