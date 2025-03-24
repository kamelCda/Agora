/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Helper pour extraire l'ID de la catégorie depuis l'URL
function extractCategorieId(pathname: string): string | null {
  const match = pathname.match(/\/categories\/([^/]+)/);
  return match ? match[1] : null;
}

export async function GET(req: NextRequest) {
  const categorie_id = extractCategorieId(req.nextUrl.pathname);
  if (!categorie_id) {
    return NextResponse.json({ error: "categorie_id introuvable" }, { status: 400 });
  }

  try {
    const categorie = await prisma.categorie.findUnique({
      where: { id_categorie: categorie_id },
      include: { articles: true },
    });

    return NextResponse.json({ success: true, categorie }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const categorie_id = extractCategorieId(req.nextUrl.pathname);
  if (!categorie_id) {
    return NextResponse.json({ error: "categorie_id introuvable" }, { status: 400 });
  }

  try {
    const categorie = await prisma.categorie.delete({
      where: { id_categorie: categorie_id },
    });

    return NextResponse.json({ success: true, "categorie supprimée": categorie }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  const categorie_id = extractCategorieId(req.nextUrl.pathname);
  if (!categorie_id) {
    return NextResponse.json({ error: "categorie_id introuvable" }, { status: 400 });
  }

  const { nomCategorie, utilisateur_id } = await req.json();

  try {
    const categorie = await prisma.categorie.update({
      where: { id_categorie: categorie_id },
      data: {
        nomCategorie,
        utilisateur_id,
      },
    });

    return NextResponse.json({ success: true, "Catégorie modifiée": categorie }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
