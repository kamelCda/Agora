import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Extrait l'article_id depuis l'URL dynamiquement
function extractArticleId(pathname: string): string | null {
  const match = pathname.match(/\/articles\/([^/]+)\/evaluations/);
  return match ? match[1] : null;
}

export async function POST(req: NextRequest) {
  const article_id = extractArticleId(req.nextUrl.pathname);
  if (!article_id) {
    return NextResponse.json(
      { error: "article_id introuvable dans l'URL" },
      { status: 400 }
    );
  }

  const { utilisateur_id, valeur } = await req.json();

  try {
    // 1. Créer l’évaluation
    const evaluation = await prisma.evaluation.create({
      data: {
        utilisateur_id,
        article_id,
        valeur,
      },
    });

    // 2. Récupérer l’article pour connaître son auteur
    const article = await prisma.article.findUnique({
      where: { id_article: article_id },
      select: {
        utilisateur_id: true,
        titre: true,
      },
    });

    // 3. Créer une notification pour l’auteur
    if (article) {
      await prisma.notification.create({
        data: {
          utilisateur_id: article.utilisateur_id,
          type: "EVALUATION",
          contenu: `Votre article « ${article.titre} » vient d'être évalué !`,
        },
      });
    }

    return NextResponse.json(evaluation, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'évaluation" },
      { status: 500 }
    );
  }
}
