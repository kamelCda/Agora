// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// const headers = {
//   "Content-Type": "application/json",
// };

// export async function POST(req: NextRequest) {
//   try {
//     const { titre, contenu, creeLe, utilisateur_id, categorie_id } =
//       await req.json();

//     const article = await prisma.article.create({
//       data: {
//         titre,
//         contenu,
//         creeLe,
//         utilisateur_id,
//         categorie_id,
//       },
//     });
//     return NextResponse.json({ success: true, article }, { status: 201 });
//   } catch (error: any) {
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 400,
//       headers,
//     });
//   }
// }

// export async function GET(
//   req: Request,
//   { params }: { params: { categorie_id: string } }
// ) {
//   const { categorie_id } = params;

//   try {
//     const articles = await prisma.article.findMany({
//       where: { categorie_id },
//       include: {
//         commentaires: true,
//         categorie: {
//           select: {
//             nomCategorie: true,
//           },
//         },
//       },
//     });
//     return NextResponse.json({ success: true, articles }, { status: 200 });
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 400 });
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
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
  // Assumes session.user.role is an array of roles.
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
    const { titre, contenu, creeLe, utilisateur_id, categorie_id } =
      await req.json();

    const article = await prisma.article.create({
      data: {
        titre,
        contenu,
        creeLe,
        utilisateur_id,
        categorie_id,
      },
    });
    return NextResponse.json({ success: true, article }, { status: 201 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers,
    });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { categorie_id: string } }
) {
  const { categorie_id } = params;

  try {
    const articles = await prisma.article.findMany({
      where: { categorie_id },
      include: {
        commentaires: true,
        categorie: {
          select: {
            nomCategorie: true,
          },
        },
      },
    });
    return NextResponse.json({ success: true, articles }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
