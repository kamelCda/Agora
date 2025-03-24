/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
interface Params {
  params: {
    categorie_id: string;
  };
}
export async function GET(req: NextRequest, { params }: Params) {
  const { categorie_id } = params;
  try {
    const categorie = await prisma.categorie.findUnique({
      where: { id_categorie: categorie_id },
      include: { articles: true },
    });
    return NextResponse.json({ success: true, categorie }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const { categorie_id } = params;
  try {
    const categorie = await prisma.categorie.delete({
      where: {
        id_categorie: categorie_id,
      },
    });
    return NextResponse.json(
      { success: true, "categorie supprimée": categorie },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { categorie_id } = params;
  const { nomCategorie, utilisateur_id } = await req.json();
  try {
    const categorie = await prisma.categorie.update({
      where: { id_categorie: categorie_id },
      data: {
        nomCategorie,
        utilisateur_id,
      },
    });
    return NextResponse.json(
      { success: true, "Catégorie modifiée": categorie },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
