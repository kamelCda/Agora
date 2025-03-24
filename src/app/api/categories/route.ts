import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// AFFICHERA LA CATEGORIE AINSI QUE TOUT LES ARTICLES DE CETTE CATEGORIE
export async function GET() {
  try {
    const categories = await prisma.categorie.findMany({
      include: {
        articles: {
          include: {
            commentaires: true,
          },
        },
      },
    });
    return NextResponse.json({ success: true, categories }, { status: 201 });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
