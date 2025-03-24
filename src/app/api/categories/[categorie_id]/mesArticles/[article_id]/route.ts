/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export interface Params {
  params: {
    utilisateur_id: string;
    categorie_id: string;
    article_id: string;
    commentaire_id?: string;
  };
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const MonArticle = await prisma.article.findUnique({
      where: {
        id_article: params.article_id,
      },
    });

    if (!MonArticle) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json(MonArticle);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
