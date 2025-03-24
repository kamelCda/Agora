// app/api/notifications/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Récupérer toutes les notifications d’un utilisateur
 * (ex: GET /api/notifications?userId=xxx)
 */
export async function GET(req: NextRequest) {
  try {
    // 1) Récupérer userId depuis les query params
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId est requis pour récupérer les notifications" },
        { status: 400 }
      );
    }

    // 2) Récupérer les notifications pour cet utilisateur
    const notifications = await prisma.notification.findMany({
      where: { utilisateur_id: userId },
      orderBy: { creeLe: "desc" },
    });

    return NextResponse.json(notifications, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des notifications:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des notifications" },
      { status: 500 }
    );
  }
}

/**
 * (Optionnel) Créer manuellement une notification (ex: pour tester)
 *  ex: POST /api/notifications
 */
export async function POST(req: NextRequest) {
  try {
    const { utilisateur_id, type, contenu } = await req.json();

    if (!utilisateur_id || !type || !contenu) {
      return NextResponse.json(
        { error: "utilisateur_id, type, et contenu sont requis" },
        { status: 400 }
      );
    }

    const newNotification = await prisma.notification.create({
      data: {
        utilisateur_id,
        type,
        contenu,
        lire: false,
      },
    });

    return NextResponse.json(newNotification, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de la notification:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la notification" },
      { status: 500 }
    );
  }
}
