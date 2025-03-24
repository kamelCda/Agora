import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const headers = {
  "Content-Type": "application/json",
};

// 🔧 Helper pour extraire utilisateur_id depuis l'URL
function extractUtilisateurId(pathname: string): string | null {
  const match = pathname.match(/\/utilisateurs\/([^/]+)/);
  return match ? match[1] : null;
}

export async function GET(req: NextRequest) {
  const utilisateur_id = extractUtilisateurId(req.nextUrl.pathname);

  if (!utilisateur_id) {
    return NextResponse.json(
      { error: "utilisateur_id introuvable dans l'URL" },
      { status: 400, headers }
    );
  }

  try {
    const MaCategorie = await prisma.categorie.findFirst({
      where: { utilisateur_id },
    });

    if (!MaCategorie) {
      return NextResponse.json(
        { error: "Catégorie non trouvée" },
        { status: 404, headers }
      );
    }

    return NextResponse.json(MaCategorie, { status: 200, headers });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400, headers }
    );
  }
}
