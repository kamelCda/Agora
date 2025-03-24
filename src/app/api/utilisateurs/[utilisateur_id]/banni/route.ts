import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  // Vérification de la session active
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized: No active session" },
      { status: 401 }
    );
  }

  // Vérification du rôle utilisateur
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
    const utilisateursBannis = await prisma.utilisateur.findUnique({
      where: { banni: true, id_utilisateur: session.user.id_utilisateur },
    });

    return NextResponse.json(utilisateursBannis, { status: 200 });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!session.user.role || !session.user.role.includes("ADMINISTRATEUR")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const utilisateurSupprime = await prisma.utilisateur.delete({
      where: { id_utilisateur: params.userId, banni: true },
    });

    return NextResponse.json(
      { success: true, utilisateurSupprime },
      { status: 200 }
    );
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
