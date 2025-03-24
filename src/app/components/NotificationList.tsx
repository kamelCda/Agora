"use client";

import { useState, useEffect } from "react";

// 1) Définir un type ou une interface représentant votre Notification
interface Notification {
  id_notification: string;
  type: string;
  contenu: string;
  lire: boolean;
  creeLe: string;  // ou Date, selon vos besoins
}

export default function NotificationsList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Au montage du composant, on va chercher les notifications sur /api/notifications
  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/notifications", { method: "GET" });
      if (res.ok) {
        const data = (await res.json()) as Notification[];
        setNotifications(data);
      }
    }
    fetchData();
  }, []);

  // 2) Fonction pour marquer une notification comme lue
  async function markAsRead(notifId: string) {
    try {
      const res = await fetch(`/api/notifications/${notifId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lire: true }),
      });
      if (res.ok) {
        // Mise à jour locale : on met la notif à "lire: true" sans refetch complet
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id_notification === notifId
              ? { ...notif, lire: true }
              : notif
          )
        );
      } else {
        console.error("Erreur lors de la mise à jour de la notification");
      }
    } catch (err) {
      console.error("Erreur réseau ou serveur :", err);
    }
  }

  return (
    <div style={{ border: "1px solid #ccc", padding: "1em" }}>
      <h2>Vos notifications</h2>

      {notifications.length === 0 && <p>Aucune notification</p>}

      {notifications.map((notif) => (
        <div
          key={notif.id_notification}
          style={{ borderBottom: "1px solid #ccc", marginBottom: "1em" }}
        >
          <p>
            <strong>Type :</strong> {notif.type}
          </p>
          <p>
            <strong>Contenu :</strong> {notif.contenu}
          </p>
          <p>
            <strong>Lu :</strong> {notif.lire ? "Oui" : "Non"}
          </p>
          <p>
            <strong>Date :</strong>{" "}
            {new Date(notif.creeLe).toLocaleString("fr-FR")}
          </p>
          {/* 3) Affichage conditionnel du bouton si la notif n’est pas encore lue */}
          {!notif.lire && (
            <button onClick={() => markAsRead(notif.id_notification)}>
              Marquer comme lu
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
