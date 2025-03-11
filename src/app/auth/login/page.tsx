"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LoginPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "loading") return; // Attendre que la session soit chargée
    if (session) {
      // Rediriger en fonction du rôle
      const roles = session.user.role;
      if (roles.includes("ADMINISTRATEUR")) {
        router.push("/DashboardAdministrateur");
      } else if (roles.includes("UTILISATEUR")) {
        router.push("/DashboardUtilisateur");
      } else if (roles.includes("MODERATEUR")) {
        router.push("/DashboardModerateur");
      } else {
        setError("Utilisateur non reconnu");
      }
    }
  }, [session, status, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error || !result?.ok) {
      setError(result?.error || "Identifiants invalides");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-96">
        <CardHeader>
          <CardTitle className="text-center">Connexion</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label>Email :</label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
              />
            </div>
            <div>
              <label>Mot de passe :</label>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Se connecter
            </Button>
          </form>
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
          <p className="text-center mt-4">
            Pas encore inscrit ?{" "}
            <Link
              href="/auth/register"
              className="text-blue-600 hover:underline"
            >
              S'inscrire
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
