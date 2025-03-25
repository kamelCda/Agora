import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

function extractArticleId(pathname: string): string | null {
  const match = pathname.match(/\/articles\/([^/]+)\/commentaires/);
  return match ? match[1] : null;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userRoles: string[] = session.user.role;
  if (
    !userRoles.some((role) =>
      ["ADMINISTRATEUR", "MODERATEUR", "UTILISATEUR"].includes(role)
    )
  ) {
    return NextResponse.json(
      { error: "interdit: vous n'etes pas autorisé à poster un commentaire" },
      { status: 403 }
    );
  }

  const article_id = extractArticleId(req.nextUrl.pathname);
  if (!article_id) {
    return NextResponse.json(
      { error: "article_id introuvable dans l'URL" },
      { status: 400 }
    );
  }

  try {
    const { contenu, creeLe } = await req.json();
    const commentaire = await prisma.commentaire.create({
      data: {
        contenu,
        creeLe: creeLe || new Date(),
        utilisateur: {
          connect: { id_utilisateur: session.user.id_utilisateur },
        },
        article: { connect: { id_article: article_id } },
      },
      include: { upvotes: true },
    });

    return NextResponse.json({ success: true, commentaire }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}

export async function GET(req: NextRequest) {
  const article_id = extractArticleId(req.nextUrl.pathname);
  if (!article_id) {
    return NextResponse.json(
      { error: "article_id introuvable dans l'URL" },
      { status: 400 }
    );
  }

  try {
    const commentaires = await prisma.commentaire.findMany({
      where: { article_id },
      include: { upvotes: true },
      orderBy: { upvotes: { _count: "desc" } },
    });

    return NextResponse.json({ success: true, commentaires }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
