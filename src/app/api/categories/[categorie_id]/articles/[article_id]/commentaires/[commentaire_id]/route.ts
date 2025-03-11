import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

interface Params {
  params: {
    commentaire_id: string;
  };
}

export async function GET(req: NextRequest, { params }: Params) {
  const { commentaire_id } = params;
  try {
    const commentaire = await prisma.commentaire.findUnique({
      where: { id_commentaire: commentaire_id },
    });
    return NextResponse.json({ success: true, commentaire }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

function hasPermission(roles: string[] | undefined) {
  // Ensure roles is an array and check if it includes either "admin" or "moderateur"
  return (
    roles && (roles.includes("ADMINISTRATEUR") || roles.includes("MODERATEUR"))
  );
}

export async function DELETE(req: NextRequest, { params }: Params) {
  // Check session and roles
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized: No active session" },
      { status: 401 }
    );
  }

  // Use the "role" property instead of "roles"
  if (!hasPermission(session.user.role)) {
    return NextResponse.json(
      { error: "Forbidden: Insufficient permissions" },
      { status: 403 }
    );
  }

  const { commentaire_id } = params;
  try {
    // Delete all upvotes related to this comment first
    await prisma.upvote.deleteMany({
      where: { commentaire_id },
    });
    // Then delete the comment
    await prisma.commentaire.delete({
      where: { id_commentaire: commentaire_id },
    });
    return NextResponse.json(
      { success: true, message: "Commentaire supprimé avec succès" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  // Check session and roles
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized: No active session" },
      { status: 401 }
    );
  }

  // Use the "role" property instead of "roles"
  if (!hasPermission(session.user.role)) {
    return NextResponse.json(
      { error: "Forbidden: Insufficient permissions" },
      { status: 403 }
    );
  }

  const { commentaire_id } = params;
  const { contenu, miseAjourLe, utilisateur_id } = await req.json();
  try {
    const commentaire = await prisma.commentaire.update({
      where: { id_commentaire: commentaire_id },
      data: {
        contenu,
        miseAjourLe,
        utilisateur_id,
      },
      include: {
        upvotes: true, // Include the upvotes relation
      },
    });
    return NextResponse.json({ success: true, commentaire }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
