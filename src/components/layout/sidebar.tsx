"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  // Define links for each role
  const adminLinks = [
    { label: "Tableau de bord", href: "/DashboardAdministrateur" },
    {
      label: "Gestion des utilisateurs",
      href: "/DashboardAdministrateur/gestion_utilisateurs",
    },
    { label: "Articles", href: "/DashboardAdministrateur/articles" },
    { label: "Categories", href: "/DashboardAdministrateur/categories" },
    { label: "Paramètres", href: "/DashboardAdministrateur/settings" },
    { label: "Mes Categories", href: "/DashboardAdministrateur/mesCategories" },
    { label: "Mes Articles", href: "/DashboardAdministrateur/mesArticles" },
    {
      label: "Mes Commentaires",
      href: "/DashboardAdministrateur/commentaires",
    },
  ];

  const moderatorLinks = [
    { label: "Tableau de bord", href: "/DashboardModerateur" },
    { label: "Modération de contenu", href: "/DashboardModerateur/content" },
    { label: "Paramètres", href: "/DashboardModerateur/settings" },
    { label: "Articles", href: "/DashboardModerateur/articles" },
    { label: "Categories", href: "/DashboardModerateur/categories" },
    { label: "Mes Categories", href: "/DashboardModerateur/mesCategories" },
  ];

  const userLinks = [
    { label: "Accueil", href: "/DashboardUtilisateur" },
    { label: "Articles", href: "/DashboardUtilisateur/articles" },
    { label: "Paramètres", href: "/DashboardUtilisateur/settings" },
    { label: "categories", href: "/DashboardUtilisateur/categories" },
  ];

  let links = userLinks; // valeur par défaut
  const roles = session?.user?.role || []; // tableau de rôles (ex: ["ADMINISTRATEUR", "UTILISATEUR", ...])

  switch (true) {
    case roles.includes("ADMINISTRATEUR"):
      links = adminLinks;
      break;
    case roles.includes("MODERATEUR"):
      links = moderatorLinks;
      break;
    default:
      links = userLinks; // Par défaut, c’est UTILISATEUR
      break;
  }

  return (
    <aside className="w-64 bg-background text-foreground min-h-screen p-4 border-r">
      <nav className="mt-4 space-y-2">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Button
              key={link.label}
              asChild
              variant={active ? "default" : "ghost"}
              className={cn("w-full justify-start", active && "bg-muted")}
            >
              <Link href={link.href}>{link.label}</Link>
            </Button>
          );
        })}
      </nav>
    </aside>
  );
}
