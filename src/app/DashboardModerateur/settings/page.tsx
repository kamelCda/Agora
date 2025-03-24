// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import React, { useEffect, useState } from "react";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { Input } from "@/app/components/ui/input";
// import { Button } from "@/app/components/ui/button";
// import { Label } from "@/app/components/ui/label";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/app/components/ui/card";
// import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";

// interface ModeSettings {
//   telephone: string;
//   nom: string;
//   prenom: string;
//   adresse: string;
//   email: string;
//   ville: string;
// }

// export default function ModerateurSettingPage() {
//   const [settings, setSettings] = useState<ModeSettings | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const { data: session, status } = useSession();
//   const router = useRouter();

//   // Vérification de la session et du rôle «MODERATEUR »
//   useEffect(() => {
//     if (status === "loading") return;
//     if (!session) {
//       router.push("/login");
//       return;
//     }

//     const roles = session.user.role;

//     if (Array.isArray(roles)) {
//       if (!roles.includes("MODERATEUR")) {
//         router.push("/unauthorized");
//       }
//     } else {
//       if (roles !== "MODERATEUR") {
//         router.push("/unauthorized");
//       }
//     }
//   }, [session, status, router]);

//   // Récupération des données DU MODERATEUR
//   useEffect(() => {
//     const fetchAdminData = async () => {
//       if (!session?.user?.id) return;

//       try {
//         setLoading(true);
//         setError("");

//         const res = await fetch(`/api/utilisateurs/${session.user.id}`);
//         if (!res.ok) {
//           throw new Error(`Erreur HTTP: ${res.status}`);
//         }
//         const data = await res.json();
//         if (!data || !data.data) {
//           throw new Error("Impossible de récupérer les paramètres.");
//         }

//         setSettings(data.data);
//       } catch (err: any) {
//         setError(
//           err.message || "Erreur lors de la récupération des paramètres."
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (session?.user?.id) {
//       fetchAdminData();
//     }
//   }, [session]);

//   // Mise à jour locale des champs du formulaire
//   const handleChange = (field: keyof ModeSettings, value: string) => {
//     setSettings((prev) => (prev ? { ...prev, [field]: value } : null));
//   };

//   // Soumission du formulaire pour mettre à jour les données
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!settings || !session?.user?.id) return;

//     try {
//       const utilisateur_id = session.user.id;
//       const res = await fetch(`/api/utilisateurs/${utilisateur_id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(settings),
//       });
//       const data = await res.json();
//       if (!data.success) {
//         setError(data.error);
//       } else {
//         setSettings(data.data);
//         alert("Paramètres mis à jour avec succès.");
//       }
//     } catch (err: any) {
//       setError(
//         err instanceof Error ? err.message : "Erreur lors de la mise à jour."
//       );
//     }
//   };

//   // Affichages conditionnels
//   if (status === "loading") return <p>Chargement de la session...</p>;
//   if (loading) return <p>Chargement des paramètres...</p>;
//   if (error) {
//     return (
//       <Alert variant="destructive">
//         <AlertTitle>Erreur</AlertTitle>
//         <AlertDescription>{error}</AlertDescription>
//       </Alert>
//     );
//   }
//   if (!settings) return <p>Impossible de charger les paramètres.</p>;

//   // Rendu du formulaire
//   return (
//     <div className="p-6 w-full">
//       <Card className="w-full p-4 mx-auto shadow-none border-none">
//         <CardHeader>
//           <CardTitle>Paramètres Moderateur</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             {/* Nom */}
//             <div className="flex flex-col gap-1">
//               <Label htmlFor="nom">Nom</Label>
//               <Input
//                 id="nom"
//                 className="border-none focus:ring-0 focus:outline-none"
//                 value={settings.nom}
//                 onChange={(e) => handleChange("nom", e.target.value)}
//               />
//             </div>

//             {/* Prénom */}
//             <div className="flex flex-col gap-1">
//               <Label htmlFor="prenom">Prénom</Label>
//               <Input
//                 id="prenom"
//                 className="border-none focus:ring-0 focus:outline-none"
//                 value={settings.prenom}
//                 onChange={(e) => handleChange("prenom", e.target.value)}
//               />
//             </div>

//             {/* Adresse */}
//             <div className="flex flex-col gap-1">
//               <Label htmlFor="adresse">Adresse</Label>
//               <Input
//                 id="adresse"
//                 className="border-none focus:ring-0 focus:outline-none"
//                 value={settings.adresse}
//                 onChange={(e) => handleChange("adresse", e.target.value)}
//               />
//             </div>

//             {/* Email */}
//             <div className="flex flex-col gap-1">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 className="border-none focus:ring-0 focus:outline-none"
//                 type="email"
//                 value={settings.email}
//                 onChange={(e) => handleChange("email", e.target.value)}
//               />
//             </div>

//             {/* Téléphone */}
//             <div className="flex flex-col gap-1">
//               <Label htmlFor="telephone">Téléphone</Label>
//               <Input
//                 id="telephone"
//                 className="border-none focus:ring-0 focus:outline-none"
//                 value={settings.telephone}
//                 onChange={(e) => handleChange("telephone", e.target.value)}
//               />
//             </div>

//             {/* Bouton de soumission */}
//             <Button type="submit" className="mt-2">
//               Enregistrer
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }


"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // <-- Assurez-vous d'utiliser ce hook
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";

interface ModeSettings {
  telephone: string;
  nom: string;
  prenom: string;
  adresse: string;
  email: string;
  ville: string;
}

export default function ModerateurSettingPage() {
  const [settings, setSettings] = useState<ModeSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { data: session, status } = useSession();
  const router = useRouter();

  // 1) Vérifier la session et le rôle «MODERATEUR»
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
      return;
    }

    const roles = session.user.role;
    if (Array.isArray(roles)) {
      if (!roles.includes("MODERATEUR")) {
        router.push("/unauthorized");
      }
    } else {
      if (roles !== "MODERATEUR") {
        router.push("/unauthorized");
      }
    }
  }, [session, status, router]);

  // 2) Récupération des données du MODERATEUR depuis l'API
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  const handleChange = (field: keyof ModeSettings, value: string) => {
    setSettings((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  // 3) Soumission du formulaire => PATCH => si succès, on rafraîchit
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
        
        // 4) Forcer la réactualisation côté serveur (relecture via callback session)
        router.refresh();
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la mise à jour."
      );
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
    <div className="p-6 w-full">
      <Card className="w-full p-4 mx-auto shadow-none border-none">
        <CardHeader>
          <CardTitle>Paramètres Moderateur</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nom */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="nom">Nom</Label>
              <Input
                id="nom"
                className="border-none focus:ring-0 focus:outline-none"
                value={settings.nom}
                onChange={(e) => handleChange("nom", e.target.value)}
              />
            </div>

            {/* Prénom */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="prenom">Prénom</Label>
              <Input
                id="prenom"
                className="border-none focus:ring-0 focus:outline-none"
                value={settings.prenom}
                onChange={(e) => handleChange("prenom", e.target.value)}
              />
            </div>

            {/* Adresse */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="adresse">Adresse</Label>
              <Input
                id="adresse"
                className="border-none focus:ring-0 focus:outline-none"
                value={settings.adresse}
                onChange={(e) => handleChange("adresse", e.target.value)}
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                className="border-none focus:ring-0 focus:outline-none"
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
                className="border-none focus:ring-0 focus:outline-none"
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
