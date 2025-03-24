import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

function extractParamFromUrl(url: string, paramName: string): string | null {
  const pattern =
    /\/categories\/([^/]+)\/articles\/([^/]+)\/commentaires\/([^/]+)/;
  const match = url.match(pattern);
  if (match) {
    const [, , , commentaire_id] = match;
    return commentaire_id;
  }
  return null;
}

function hasPermission(roles: string[] | undefined) {
  return (
    roles && (roles.includes("ADMINISTRATEUR") || roles.includes("MODERATEUR"))
  );
}

export async function GET(req: NextRequest) {
  const commentaire_id = extractParamFromUrl(
    req.nextUrl.pathname,
    "commentaire_id"
  );
  if (!commentaire_id) {
    return NextResponse.json({ error: "Paramètre manquant" }, { status: 400 });
  }

  try {
    const commentaire = await prisma.commentaire.findUnique({
      where: { id_commentaire: commentaire_id },
    });
    return NextResponse.json({ success: true, commentaire }, { status: 200 });
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
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasPermission(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const commentaire_id = extractParamFromUrl(
    req.nextUrl.pathname,
    "commentaire_id"
  );
  if (!commentaire_id) {
    return NextResponse.json({ error: "Paramètre manquant" }, { status: 400 });
  }

  try {
    await prisma.upvote.deleteMany({ where: { commentaire_id } });
    await prisma.commentaire.delete({
      where: { id_commentaire: commentaire_id },
    });

    return NextResponse.json({
      success: true,
      message: "Commentaire supprimé avec succès",
    });
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
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasPermission(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const commentaire_id = extractParamFromUrl(
    req.nextUrl.pathname,
    "commentaire_id"
  );
  if (!commentaire_id) {
    return NextResponse.json({ error: "Paramètre manquant" }, { status: 400 });
  }

  const { contenu, miseAjourLe, utilisateur_id } = await req.json();

  try {
    const commentaire = await prisma.commentaire.update({
      where: { id_commentaire: commentaire_id },
      data: { contenu, miseAjourLe, utilisateur_id },
      include: { upvotes: true },
    });

    return NextResponse.json({ success: true, commentaire });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
