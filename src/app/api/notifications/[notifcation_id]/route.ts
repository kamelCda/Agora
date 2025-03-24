import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// 🧩 Helper pour extraire notificationId depuis l’URL
function extractNotificationId(pathname: string): string | null {
  const match = pathname.match(/\/notifications\/([^/]+)/);
  return match ? match[1] : null;
}

// ✅ GET : récupérer une notification par ID
export async function GET(req: NextRequest) {
  const notificationId = extractNotificationId(req.nextUrl.pathname);

  if (!notificationId) {
    return NextResponse.json(
      { error: "notificationId introuvable dans l'URL" },
      { status: 400 }
    );
  }

  try {
    const notification = await prisma.notification.findUnique({
      where: { id_notification: notificationId },
    });

    if (!notification) {
      return NextResponse.json(
        { error: "Notification introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json(notification, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération de la notification:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la notification" },
      { status: 500 }
    );
  }
}

// ✅ PATCH : mettre à jour une notification (partiellement)
export async function PATCH(req: NextRequest) {
  const notificationId = extractNotificationId(req.nextUrl.pathname);

  if (!notificationId) {
    return NextResponse.json(
      { error: "notificationId introuvable dans l'URL" },
      { status: 400 }
    );
  }

  try {
    const { type, contenu, lire } = await req.json();

    const currentNotification = await prisma.notification.findUnique({
      where: { id_notification: notificationId },
    });

    if (!currentNotification) {
      return NextResponse.json(
        { error: "Notification introuvable" },
        { status: 404 }
      );
    }

    const dataToUpdate = {
      type: type ?? currentNotification.type,
      contenu: contenu ?? currentNotification.contenu,
      lire: typeof lire === "boolean" ? lire : currentNotification.lire,
    };

    const updatedNotification = await prisma.notification.update({
      where: { id_notification: notificationId },
      data: dataToUpdate,
    });

    return NextResponse.json(updatedNotification, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la notification:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la notification" },
      { status: 500 }
    );
  }
}

// ✅ DELETE : supprimer une notification
export async function DELETE(req: NextRequest) {
  const notificationId = extractNotificationId(req.nextUrl.pathname);

  if (!notificationId) {
    return NextResponse.json(
      { error: "notificationId introuvable dans l'URL" },
      { status: 400 }
    );
  }

  try {
    await prisma.notification.delete({
      where: { id_notification: notificationId },
    });

    return NextResponse.json(
      { message: "Notification supprimée avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la suppression de la notification:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la notification" },
      { status: 500 }
    );
  }
}
