import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// Helper: extraire article_id de l'URL
function extractArticleId(pathname: string): string | null {
  const match = pathname.match(/\/articles\/([^/]+)/);
  return match ? match[1] : null;
}

// Permissions
function hasPermission(role: string[] | undefined) {
  return (
    role && (role.includes("ADMINISTRATEUR") || role.includes("MODERATEUR"))
  );
}

export async function GET(req: NextRequest) {
  const article_id = extractArticleId(req.nextUrl.pathname);
  if (!article_id) {
    return NextResponse.json(
      { error: "article_id introuvable" },
      { status: 400 }
    );
  }

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
    return NextResponse.json({ success: true, article }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized: No active session" },
      { status: 401 }
    );
  }

  if (!hasPermission(session.user.role)) {
    return NextResponse.json(
      { error: "Forbidden: Insufficient permissions" },
      { status: 403 }
    );
  }

  const article_id = extractArticleId(req.nextUrl.pathname);
  if (!article_id) {
    return NextResponse.json(
      { error: "article_id introuvable" },
      { status: 400 }
    );
  }

  try {
    const article = await prisma.article.delete({
      where: { id_article: article_id },
    });
    return NextResponse.json(
      { success: true, "article supprimé": article },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized: No active session" },
      { status: 401 }
    );
  }

  if (!hasPermission(session.user.role)) {
    return NextResponse.json(
      { error: "Forbidden: Insufficient permissions" },
      { status: 403 }
    );
  }

  const article_id = extractArticleId(req.nextUrl.pathname);
  if (!article_id) {
    return NextResponse.json(
      { error: "article_id introuvable" },
      { status: 400 }
    );
  }

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
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
