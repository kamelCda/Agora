import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { utilisateur_id: string } }
) {
  const { utilisateur_id } = params;
  try {
    const mesCommentaires = await prisma.commentaire.findMany({
      where: { utilisateur_id },
    });
    return NextResponse.json(
      { success: true, mesCommentaires },
      { status: 201 }
    );
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
