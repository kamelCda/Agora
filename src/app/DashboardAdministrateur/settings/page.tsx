"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AdminSettings {
  telephone: string;
  nom: string;
  prenom: string;
  adresse: string;
  email: string;
}

export default function AdministrateurSettingPage() {
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { data: session, status } = useSession();
  const router = useRouter();

  // Vérification de la session et du rôle « ADMINISTRATEUR »
  useEffect(() => {
    if (status === "loading") return; 
    if (!session) {
      router.push("/login");
      return;
    }

    const roles = session.user.role;

    if (Array.isArray(roles)) {
      if (!roles.includes("ADMINISTRATEUR")) {
        router.push("/unauthorized");
      }
    } else {
      if (roles !== "ADMINISTRATEUR") {
        router.push("/unauthorized");
      }
    }
  }, [session, status, router]);

  // Récupération des données de l’administrateur
  useEffect(() => {
    const fetchAdminData = async () => {
      if (!session?.user?.id) return;

      try {
        setLoading(true);
        setError("");

        const res = await fetch(`/api/utilisateurs/${session.user.id}`);
        if (!res.ok) {
          throw new Error(`Erreur HTTP: ${res.status}`);
        }
        const data = await res.json();
        if (!data || !data.data) {
          throw new Error("Impossible de récupérer les paramètres.");
        }

        setSettings(data.data);
      } catch (err: any) {
        setError(err.message || "Erreur lors de la récupération des paramètres.");
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchAdminData();
    }
  }, [session]);

  // Mise à jour locale des champs du formulaire
  const handleChange = (field: keyof AdminSettings, value: string) => {
    setSettings((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  // Soumission du formulaire pour mettre à jour les données
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings || !session?.user?.id) return;

    try {
      const utilisateur_id = session.user.id;
      const res = await fetch(`/api/utilisateurs/${utilisateur_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error);
      } else {
        setSettings(data.data);
        alert("Paramètres mis à jour avec succès.");
      }
    } catch (err: any) {
      setError("Erreur lors de la mise à jour.");
    }
  };

  // Affichages conditionnels
  if (status === "loading") return <p>Chargement de la session...</p>;
  if (loading) return <p>Chargement des paramètres...</p>;
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  if (!settings) return <p>Impossible de charger les paramètres.</p>;

  // Rendu du formulaire
  return (
    <div className="p-6 w-1/2">
      <Card className="w-full p-4 mx-auto">
        <CardHeader>
          <CardTitle>Paramètres Administrateur</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nom */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="nom">Nom</Label>
              <Input
                id="nom"
                value={settings.nom}
                onChange={(e) => handleChange("nom", e.target.value)}
              />
            </div>

            {/* Prénom */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="prenom">Prénom</Label>
              <Input
                id="prenom"
                value={settings.prenom}
                onChange={(e) => handleChange("prenom", e.target.value)}
              />
            </div>

            {/* Adresse */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="adresse">Adresse</Label>
              <Input
                id="adresse"
                value={settings.adresse}
                onChange={(e) => handleChange("adresse", e.target.value)}
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>

            {/* Téléphone */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="telephone">Téléphone</Label>
              <Input
                id="telephone"
                value={settings.telephone}
                onChange={(e) => handleChange("telephone", e.target.value)}
              />
            </div>

            {/* Bouton de soumission */}
            <Button type="submit" className="mt-2">
              Enregistrer
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
