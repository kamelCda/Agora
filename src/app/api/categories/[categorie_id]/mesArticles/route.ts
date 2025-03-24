/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
const headers = {
  "Content-Type": "application/json",
};

export async function GET(
  req: NextRequest,
  { params }: { params: { categorie_id: string } }
) {
  const { categorie_id } = params;
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
    const mesarticles = await prisma.article.findMany({
      where: {
        utilisateur_id: session.user.id_utilisateur,
        categorie_id: categorie_id,
      },
    });
    return NextResponse.json({ success: true, mesarticles }, { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers,
    });
  }
}
