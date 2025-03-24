import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Extrait article_id depuis l’URL
function extractArticleId(pathname: string): string | null {
  const match = pathname.match(/\/articles\/([^/]+)\/evaluations/);
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
    const moyenne = await prisma.evaluation.aggregate({
      _avg: { valeur: true },
      where: { article_id },
    });

    return NextResponse.json({ moyenne: moyenne._avg.valeur }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
