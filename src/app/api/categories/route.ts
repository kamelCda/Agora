import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const headers = {
  "Content-Type": "application/json",
};

export async function POST(req: NextRequest) {
  // Check for an active session
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized: No active session" },
      { status: 401 }
    );
  }

  // Ensure the user has the required role(s)
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
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers,
    });
  }
}

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
