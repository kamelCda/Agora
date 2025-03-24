// app/api/notifications/[notificationId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Récupération d’une notification par ID
export async function GET(
  _req: NextRequest,
  { params }: { params: { notificationId: string } }
) {
  try {
    const { notificationId } = params;

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

// Marquer une notification comme lue (ou mettre à jour n’importe quel champ)

export async function PATCH(
  req: NextRequest,
  { params }: { params: { notificationId: string } }
) {
  try {
    const { notificationId } = params;
    // On récupère seulement les champs qu'on veut potentiellement mettre à jour
    const { type, contenu, lire } = await req.json();

    // 1) Récupérer la notification existante
    const currentNotification = await prisma.notification.findUnique({
      where: { id_notification: notificationId },
    });

    if (!currentNotification) {
      return NextResponse.json(
        { error: "Notification introuvable" },
        { status: 404 }
      );
    }

    // 2) Construire un objet data pour l’update, en reprenant la valeur actuelle
    // si le champ n’est pas fourni dans la requête
    const dataToUpdate = {
      type: type ?? currentNotification.type,
      contenu: contenu ?? currentNotification.contenu,
      // Pour un booléen, on vérifie si c’est bien un booléen, sinon on conserve l'ancienne valeur
      lire: typeof lire === "boolean" ? lire : currentNotification.lire,
    };

    // 3) Mettre à jour la notification avec ces données partielles
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

// Supprimer une notification
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { notificationId: string } }
) {
  try {
    const { notificationId } = params;

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
