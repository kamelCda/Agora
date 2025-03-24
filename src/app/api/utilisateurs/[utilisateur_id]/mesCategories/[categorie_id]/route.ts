import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const headers = {
  "Content-Type": "application/json",
};

export async function GET(
  req: NextRequest,
  { params }: { params: { utilisateur_id: string } }
) {
  // Destructure the utilisateur_id from params
  const { utilisateur_id } = params;

  try {
    const MaCatégorie = await prisma.categorie.findFirst({
      where: { utilisateur_id },
    });

    if (!MaCatégorie) {
      return NextResponse.json(
        { error: "Category non trouvée" },
        { status: 404, headers }
      );
    }

    return NextResponse.json(MaCatégorie, { headers });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
