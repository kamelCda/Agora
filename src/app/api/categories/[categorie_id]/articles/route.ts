import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const headers = {
  "Content-Type": "application/json",
};

// Utilitaire pour extraire categorie_id depuis l'URL
function extractCategorieId(pathname: string): string | null {
  const match = pathname.match(/\/categories\/([^/]+)\/articles/);
  return match ? match[1] : null;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized: No active session" },
      { status: 401 }
    );
  }

  if (
    !session.user.role ||
    (!session.user.role.includes("ADMINISTRATEUR") &&
      !session.user.role.includes("MODERATEUR"))
  ) {
    return NextResponse.json(
      { error: "Forbidden: Insufficient permissions" },
      { status: 403 }
    );
  }

  try {
    const { titre, contenu, creeLe, utilisateur_id, categorie_id } =
      await req.json();

    const article = await prisma.article.create({
      data: {
        titre,
        contenu,
        creeLe,
        utilisateur_id,
        categorie_id,
      },
    });

    return NextResponse.json({ success: true, article });
  } catch (error: unknown) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 400,
      headers,
    });
  }
}

export async function GET(req: NextRequest) {
  const categorie_id = extractCategorieId(req.nextUrl.pathname);
  if (!categorie_id) {
    return NextResponse.json(
      { error: "categorie_id introuvable" },
      { status: 400 }
    );
  }

  try {
    const articles = await prisma.article.findMany({
      where: { categorie_id },
      include: {
        commentaires: true,
        categorie: {
          select: {
            nomCategorie: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, articles }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
