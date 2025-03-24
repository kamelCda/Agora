"use client";
import { useSession } from "next-auth/react";
import { Fragment, useState, ChangeEvent } from "react";
import Image from "next/image";
import UtilisateurSettingPage from "./settings/page";

export default function DashboardUtilisateur() {
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
      <h1 className="text-2xl font-bold">Dashboard utilisateur</h1>
      <p>Bienvenue, {session?.user.nom} !</p>
      <div className="accueil col-flex flex"></div>

      {/* Intégrez ici les composants spécifiques au dashboard formateur */}
    </div>
    <div className="p-4">
            <p>Veuillez choisir votre navigation dans le menu à gauche</p>
          </div>
    
          <div className="p-4">
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
          </div>
    
          <div className="p-4">
            <p>Présentation :</p>
            <UtilisateurSettingPage />
          </div>
    </Fragment>
  );
}
