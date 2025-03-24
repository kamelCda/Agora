import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// 🔧 Helper pour extraire l'ID utilisateur depuis l'URL
function extractUserId(pathname: string): string | null {
  const match = pathname.match(/\/bannis\/([^/]+)/);
  return match ? match[1] : null;
}

// ✅ GET : récupérer tous les utilisateurs bannis
export async function GET() {
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
    const utilisateursBannis = await prisma.utilisateur.findMany({
      where: { banni: true },
    });

    return NextResponse.json(utilisateursBannis, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}

// ✅ DELETE : supprimer un utilisateur banni (admin only)
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!session.user.role || !session.user.role.includes("ADMINISTRATEUR")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const userId = extractUserId(req.nextUrl.pathname);
  if (!userId) {
    return NextResponse.json(
      { error: "userId introuvable dans l'URL" },
      { status: 400 }
    );
  }

  try {
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id_utilisateur: userId },
    });

    if (!utilisateur || !utilisateur.banni) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé ou non banni" },
        { status: 404 }
      );
    }

    const utilisateurSupprime = await prisma.utilisateur.delete({
      where: { id_utilisateur: userId },
    });

    return NextResponse.json(
      { success: true, utilisateurSupprime },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
