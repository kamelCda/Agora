import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // Adjust the path if needed

export async function POST(
  req: NextRequest,
  { params }: { params: { article_id: string } }
) {
  // For App Router (Next.js 15 with app directory), call getServerSession with only authOptions.
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userRoles: string[] = session.user.role;
  if (
    !userRoles.some((role) => ["ADMINISTRATEUR", "MODERATEUR"].includes(role))
  ) {
    return NextResponse.json(
      { error: "interdit: vous n'etes pas autorisé a poster un commentaire" },
      { status: 403 }
    );
  }

  try {
    // Extract contenu and optionally creeLe from the body. Article id comes from the URL parameters.
    const { contenu, creeLe } = await req.json();
    const commentaire = await prisma.commentaire.create({
      data: {
        contenu,
        creeLe: creeLe || new Date(), // Use server-generated timestamp if not provided
        utilisateur: {
          connect: { id_utilisateur: session.user.id_utilisateur },
        },
        article: { connect: { id_article: params.article_id } },
      },
      include: {
        upvotes: true, // Ensure the upvotes relation is included (even if empty)
      },
    });
    return NextResponse.json({ success: true, commentaire }, { status: 201 });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { article_id: string } }
) {
  const { article_id } = params;
  try {
    const commentaires = await prisma.commentaire.findMany({
      where: { article_id },
      include: { upvotes: true },
      orderBy: { upvotes: { _count: "desc" } },
    });
    return NextResponse.json({ success: true, commentaires }, { status: 200 });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
