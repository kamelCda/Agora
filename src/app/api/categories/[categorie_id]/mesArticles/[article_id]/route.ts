import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Utilitaire pour extraire article_id depuis l’URL
function extractArticleId(pathname: string): string | null {
  const match = pathname.match(/\/articles\/([^/]+)/);
  return match ? match[1] : null;
}

export async function GET(req: NextRequest) {
  const article_id = extractArticleId(req.nextUrl.pathname);

  if (!article_id) {
    return NextResponse.json(
      { error: "article_id introuvable dans l'URL" },
      { status: 400 }
    );
  }

  try {
    const MonArticle = await prisma.article.findUnique({
      where: {
        id_article: article_id,
      },
    });

    if (!MonArticle) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json(MonArticle, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
