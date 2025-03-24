"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/app/components/ui/button";

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Liens pour chaque rôle
  const adminLinks = [
    { label: "Tableau de bord", href: "/DashboardAdministrateur" },
    {
      label: "Gestion des utilisateurs",
      href: "/DashboardAdministrateur/gestion_utilisateursAdmin",
    },
    { label: "Articles", href: "/DashboardAdministrateur/articles" },
    { label: "Categories", href: "/DashboardAdministrateur/categories" },
    { label: "Paramètres", href: "/DashboardAdministrateur/settings" },
    { label: "Mes Categories", href: "/DashboardAdministrateur/mesCategories" },
    {
      label: "Mes Articles",
      href: "/DashboardAdministrateur/mesArticlescomposants",
    },
  ];

  const moderatorLinks = [
    { label: "Tableau de bord", href: "/DashboardModerateur" },
    {
      label: "Gestion des utilisateurs",
      href: "/DashboardModerateur/gestion_utilisateursModerateur",
    },
    { label: "Paramètres", href: "/DashboardModerateur/settings" },
    { label: "Articles", href: "/DashboardModerateur/articles" },
    { label: "Categories", href: "/DashboardModerateur/categories" },
    { label: "Mes Categories", href: "/DashboardModerateur/mesCategories" },
  ];

  const userLinks = [
    { label: "Accueil", href: "/DashboardUtilisateur" },
    { label: "Articles", href: "/DashboardUtilisateur/articles" },
    { label: "Paramètres", href: "/DashboardUtilisateur/settings" },
    { label: "Categories", href: "/DashboardUtilisateur/categories" },
  ];

  let links = userLinks;
  const roles = session?.user?.role || [];

  switch (true) {
    case roles.includes("ADMINISTRATEUR"):
      links = adminLinks;
      break;
    case roles.includes("MODERATEUR"):
      links = moderatorLinks;
      break;
    default:
      links = userLinks;
      break;
  }

  return (
    <>
      {/* Bouton burger pour mobile */}
      <div className="md:hidden p-4">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="text-gray-600 focus:outline-none"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Sidebar en mode mobile (overlay) */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          {/* Fond semi-transparent */}
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
          <aside className="relative w-64 bg-background text-foreground min-h-screen p-4 border-r shadow-lg z-50">
            {/* Bouton de fermeture */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="absolute top-4 right-4 md:hidden text-gray-600 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
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
                    <Link
                      href={link.href}
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </Button>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Sidebar en version desktop */}
      <aside className="hidden md:block w-64 bg-background text-foreground min-h-screen p-4 border-r shadow-lg">
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
    </>
  );
}
