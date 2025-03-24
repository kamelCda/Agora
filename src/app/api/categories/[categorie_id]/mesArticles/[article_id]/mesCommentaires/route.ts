import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Utilitaire simple pour extraire l’ID utilisateur depuis l’URL
function extractUtilisateurId(pathname: string): string | null {
  const match = pathname.match(/\/utilisateurs\/([^/]+)/);
  return match ? match[1] : null;
}

export async function GET(req: NextRequest) {
  const utilisateur_id = extractUtilisateurId(req.nextUrl.pathname);

  if (!utilisateur_id) {
    return NextResponse.json(
      { error: "utilisateur_id introuvable dans l'URL" },
      { status: 400 }
    );
  }

  try {
    const mesCommentaires = await prisma.commentaire.findMany({
      where: { utilisateur_id },
    });

    return NextResponse.json(
      { success: true, mesCommentaires },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
