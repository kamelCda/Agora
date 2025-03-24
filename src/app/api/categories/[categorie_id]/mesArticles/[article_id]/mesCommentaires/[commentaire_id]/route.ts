import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// 👇 Fonction utilitaire pour extraire les paramètres depuis l'URL
function extractIds(pathname: string) {
  const match = pathname.match(
    /\/utilisateurs\/([^/]+)\/articles\/([^/]+)\/commentaires\/([^/]+)/
  );
  if (!match) return null;

  const [, utilisateur_id, article_id, commentaire_id] = match;
  return { utilisateur_id, article_id, commentaire_id };
}

export async function GET(req: NextRequest) {
  const ids = extractIds(req.nextUrl.pathname);

  if (!ids) {
    return NextResponse.json(
      { error: "Paramètres introuvables dans l'URL" },
      { status: 400 }
    );
  }

  const { utilisateur_id, article_id, commentaire_id } = ids;

  try {
    const MonCommentaire = await prisma.commentaire.findFirst({
      where: {
        utilisateur_id,
        article_id,
        id_commentaire: commentaire_id,
      },
    });

    return NextResponse.json(
      { success: true, MonCommentaire },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
