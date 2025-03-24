import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// 🔧 Utilitaire pour extraire categorie_id depuis l'URL
function extractCategorieId(pathname: string): string | null {
  const match = pathname.match(/\/categories\/([^/]+)/);
  return match ? match[1] : null;
}

export async function GET(req: NextRequest) {
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

  const categorie_id = extractCategorieId(req.nextUrl.pathname);
  if (!categorie_id) {
    return NextResponse.json(
      { error: "categorie_id introuvable dans l'URL" },
      { status: 400 }
    );
  }

  try {
    const mesarticles = await prisma.article.findMany({
      where: {
        utilisateur_id: session.user.id_utilisateur,
        categorie_id: categorie_id,
      },
    });

    return NextResponse.json({ success: true, mesarticles }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
