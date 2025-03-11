"use client";
import { useEffect, useState } from "react";
import { signOut, useSession  } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [error, setError] = useState("");
  useEffect(() => {
    if (status === "loading") return; // Attendre que la session soit chargée
    if (session) {
      // Rediriger en fonction du rôle
      const roles = session.user.role;
      if (roles.includes("ADMINISTRATEUR")) {
        router.push("/DashboardAdminisitrateur");
      } else if (roles.includes("UTILISATEUR")) {
        router.push("/DashboardUtilisateur");
      } else if (roles.includes("MODERATEUR")) {
        router.push("/DashboardModerateur");
      } else {
        setError("Utilisateur non reconnu");
      }
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <p>Chargement...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">
        Bienvenue sur Notre Plateforme de Consulting
      </h1>
      <p className="mb-6 text-lg text-center max-w-md">
        Consultez des specialistes, maitrisez vos défis et optimisez votre
        enseignement avec notre interface intuitive.
      </p>
      <div className="space-x-4">
        <Link href="/auth/login">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Se Connecter
          </button>
        </Link>
        <Link href="/auth/register">
          <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            S'inscrire
          </button>
        </Link>
      </div>
    </div>
  );
}

// export default function SignOutButton() {
//   return (

//     <>
//     <button onClick={() => signOut({ callbackUrl: '/' })}>
//       Sign Out
//     </button>

//     </>
//   );
// }
