import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
const headers = {
  "Content-Type": "application/json",
};

export async function GET(
  req: NextRequest,
  { params }: { params: { utilisateur_id: string } }
) {
  const { utilisateur_id } = params;
  try {
    const mesCommentaires = await prisma.commentaire.findMany({
      where: { utilisateur_id },
    });
    return NextResponse.json(
      { success: true, mesCommentaires },
      { status: 201 }
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers,
    });
  }
}

// export async function POST() {
//     try {
//     } catch (error: any) {
//       return new Response(JSON.stringify({ error: error.message }), {
//         status: 400,
//         headers,
//       });
//     }
//   }
