import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
const headers = {
  "content-type": "application/json",
};

export async function GET(
  req: NextRequest,
  { params }: { params: { utilisateur_id: string } }
) {
  const { utilisateur_id } = params;

  try {
    const utilisateurBannis = await prisma.utilisateur.findUnique({
      where: { id_utilisateur: params.utilisateur_id, banni: true },
    });
    return NextResponse.json(
      { success: true, utilisateurBannis },
      { status: 200 }
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers,
    });
  }
}

//VERSION SECURISEE

/*


import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";

const secret = process.env.NEXTAUTH_SECRET;

export async function GET(
  req: NextRequest,
  { params }: { params: { utilisateur_id: string } }
) {
  // Récupération du token d'authentification
  const token = await getToken({ req, secret });
  if (!token) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  // Vérification que l'utilisateur est administrateur
  // On suppose ici que le token contient une propriété 'role'
  if (token.role !== "admin") {
    return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
  }

  try {
    // Récupération d'un utilisateur spécifique et vérification de son statut "banni"
    const utilisateurBannis = await prisma.utilisateur.findUnique({
      where: { id_utilisateur: params.utilisateur_id, banni: true },
    });
    return NextResponse.json(
      { success: true, utilisateurBannis },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}




*/
