import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

interface Params {
  params: {
    article_id: string;
  };
}

export async function GET(req: NextRequest, { params }: Params) {
  const { article_id } = params;
  try {
    const article = await prisma.article.findUnique({
      where: { id_article: article_id },
      include: {
        commentaires: true,
        categorie: {
          select: {
            nomCategorie: true,
          },
        },
      },
    });
    return NextResponse.json({ success: true, article }, { status: 201 });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

// Helper function to check permissions using the "role" property
function hasPermission(role: string[] | undefined) {
  return (
    role && (role.includes("ADMINISTRATEUR") || role.includes("MODERATEUR"))
  );
}

export async function DELETE(req: NextRequest, { params }: Params) {
  // Session check
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized: No active session" },
      { status: 401 }
    );
  }
  // Role check: Only allow ADMINISTRATEUR or MODERATEUR
  if (!hasPermission(session.user.role)) {
    return NextResponse.json(
      { error: "Forbidden: Insufficient permissions" },
      { status: 403 }
    );
  }

  const { article_id } = params;
  try {
    const article = await prisma.article.delete({
      where: { id_article: article_id },
    });
    return NextResponse.json(
      { success: true, "article supprimé": article },
      { status: 201 }
    );
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  // Session check
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized: No active session" },
      { status: 401 }
    );
  }
  // Role check: Only allow ADMINISTRATEUR or MODERATEUR
  if (!hasPermission(session.user.role)) {
    return NextResponse.json(
      { error: "Forbidden: Insufficient permissions" },
      { status: 403 }
    );
  }

  const { article_id } = params;
  const { titre, contenu, miseAjourLe, utilisateur_id } = await req.json();
  try {
    const article = await prisma.article.update({
      where: { id_article: article_id },
      data: {
        titre,
        contenu,
        miseAjourLe,
        utilisateur_id,
      },
    });
    return NextResponse.json(
      { success: true, "article modifié": article },
      { status: 201 }
    );
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
