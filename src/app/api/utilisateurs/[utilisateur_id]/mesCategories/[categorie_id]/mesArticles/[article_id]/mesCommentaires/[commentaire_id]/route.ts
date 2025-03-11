import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Params } from "../../../[article_id]/route";

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
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
