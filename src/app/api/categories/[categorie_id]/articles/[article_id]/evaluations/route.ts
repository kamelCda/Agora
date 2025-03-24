  // POST: /api/categories/[categorie_id]/articles/[article_id]/evaluations
  import { NextRequest, NextResponse } from "next/server";
  import prisma from "@/lib/prisma";

  export async function POST(
    req: NextRequest,
    { params }: { params: { article_id: string } }
  ) {
    const { article_id } = params;
    // On s'attend à recevoir { utilisateur_id, valeur } dans le corps JSON
    const { utilisateur_id, valeur } = await req.json();

    try {
      // 1) Créer l'évaluation
      const evaluation = await prisma.evaluation.create({
        data: {
          utilisateur_id,
          article_id,
          valeur,
        },
      });

      // 2) Récupérer l'article pour connaître son auteur
      const article = await prisma.article.findUnique({
        where: { id_article: article_id },
        select: {
          utilisateur_id: true, // l’auteur
          titre: true, // pour personnaliser le message
        },
      });

      // 3) Créer la notification pour l’auteur si l’article existe
      if (article) {
        await prisma.notification.create({
          data: {
            utilisateur_id: article.utilisateur_id, // l'auteur de l'article
            type: "EVALUATION",
            contenu: `Votre article « ${article.titre} » vient d'être évalué !`,
            // lire: false // facultatif, déjà false par défaut
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
