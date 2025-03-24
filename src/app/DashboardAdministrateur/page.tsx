"use client";

import { useSession } from "next-auth/react";
import { Fragment, useState, ChangeEvent } from "react";
import Image from "next/image";

// Composant notifications
import NotificationsList from "@/app/components/NotificationList";

import AdministrateurSettingPage from "./settings/page";

export default function DashboardAdministrateur() {
  const { data: session, status } = useSession();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (status === "loading") {
    return <p>Chargement...</p>;
  }

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  return (
    <Fragment>
      <div className="p-4">
        <h1 className="text-2xl font-bold">Dashboard Administrateur</h1>
        <p>Bienvenue, {session?.user.nom} !</p>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* Image de profil */}
        <div className="flex items-center gap-4">
          <Image
            src={selectedImage || "/images/profil.png"}
            alt="Image de profil"
            width={80}
            height={80}
            className="rounded-full"
          />
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="profile-image"
            >
              Changer l’image de profil
            </label>
            <input
              id="profile-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-900"
            />
          </div>
        </div>

        {/* Notifications (si vous souhaitez l’afficher ici) */}
        <NotificationsList />

        {/* Paramètres administrateur */}
        <AdministrateurSettingPage />
      </div>
    </Fragment>
  );
}
