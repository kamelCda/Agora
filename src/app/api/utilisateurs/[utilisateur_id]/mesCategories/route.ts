import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// 🔧 Helper pour extraire utilisateur_id depuis l’URL
function extractUtilisateurId(pathname: string): string | null {
  const match = pathname.match(/\/utilisateurs\/([^/]+)/);
  return match ? match[1] : null;
}

export async function GET(req: NextRequest) {
  const utilisateur_id = extractUtilisateurId(req.nextUrl.pathname);

  if (!utilisateur_id) {
    return NextResponse.json(
      { error: "utilisateur_id introuvable dans l'URL" },
      { status: 400 }
    );
  }

  try {
    const mescategories = await prisma.categorie.findMany({
      where: { utilisateur_id },
    });
    return NextResponse.json({ success: true, mescategories }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
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
    const { nomCategorie } = await req.json();
    const userId = session.user.id;

    const categorie = await prisma.categorie.create({
      data: {
        nomCategorie,
        utilisateur: { connect: { id_utilisateur: userId } },
      },
    });

    return NextResponse.json({ success: true, categorie }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
