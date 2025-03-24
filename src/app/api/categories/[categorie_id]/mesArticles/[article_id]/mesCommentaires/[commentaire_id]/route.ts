import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Params } from "../../route";

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const MonCommentaire = await prisma.commentaire.findUnique({
      where: {
        utilisateur_id: params.utilisateur_id,
        article_id: params.article_id,
        id_commentaire: params.commentaire_id,
      },
    });
    return NextResponse.json(
      { success: true, MonCommentaire },
      { status: 201 }
    );
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
  
}
