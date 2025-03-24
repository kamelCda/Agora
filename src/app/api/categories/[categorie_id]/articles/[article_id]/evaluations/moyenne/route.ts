// GET /api/categories/[categorie_id]/articles/[article_id]/evaluations/moyenne
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export async function GET(
  req: NextRequest,
  { params }: { params: { article_id: string } }
) {
  const { article_id } = params;

  const moyenne = await prisma.evaluation.aggregate({
    _avg: { valeur: true },
    where: { article_id },
  });

  return NextResponse.json({ moyenne: moyenne._avg.valeur });
}
