/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/lib/auth";

const headers = {
  "Content-Type": "application/json",
};

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
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers,
    });
  }
}
