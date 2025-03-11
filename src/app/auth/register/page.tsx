
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    motDePasse: "",
    telephone: "",
    ville: "",
    adresse: "",
    nomUtilisateur: "",
    image: "", 
    description: "",
  });

  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/utilisateurs/inscriptionViaFormulaire", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Erreur lors de l'inscription");
    } else {
      router.push("/auth/login");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Inscription</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {Object.entries(formData).map(([key, value]) => (
              <div key={key}>
                <Label htmlFor={key} className="capitalize">
                  {key
                    .replace("motDePasse", "Mot de passe")
                    .replace("nomUtilisateur", "Nom d'utilisateur")
                    .replace("image", "URL de l'image (optionnel)")
                    .replace("description", "Description")}
                </Label>
                <Input
                  id={key}
                  name={key}
                  type={
                    key === "motDePasse"
                      ? "password"
                      : key === "email"
                      ? "email"
                      : key === "image"
                      ? "url"
                      : "text"
                  }
                  value={value}
                  onChange={handleChange}
                  placeholder={
                    key === "image" ? "https://example.com/image.png" : ""
                  }
                  required={
                    [
                      "nom",
                      "prenom",
                      "email",
                      "motDePasse",
                      "ville",
                      "adresse",
                      "nomUtilisateur",
                    ].includes(key)
                  }
                />
              </div>
            ))}

            <Button type="submit" className="w-full">
              S'inscrire
            </Button>
          </form>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <p className="mt-4 text-center text-sm">
            Déjà un compte ?{" "}
            <Link href="/auth/login" className="text-blue-600">
              Se connecter
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
