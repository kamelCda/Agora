"use client";

import React from "react";

// import { Card, CardContent } from "@/app/components/ui/card";

import { useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/app/components/ui/button"; // Assurez-vous d'importer vos composants personnalisés si nécessaire

export default function Header() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header
      className="relative bg-white p-4  flex justify-between items-center"
      style={{ boxShadow: "0 10px 20px -2px rgba(0,0,0,0.2)" }}
    >
      {/* Titre / Logo */}
      <Link href="/DashboardAdministrateur">
        <h1 className="text-xl font-bold">Tableau de Bord</h1>
      </Link>

      {/* Bouton Burger pour mobile */}
      <div className="md:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-gray-600 focus:outline-none"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Menu complet affiché en desktop */}
      <div className="hidden md:flex items-center space-x-4">
        {session?.user && (
          <>
            <span className="text-gray-600">
              Bonjour, {session.user.nom} ({session.user.role})
            </span>
            <Button
              onClick={() => signOut({ callbackUrl: "/auth/login" })}
              variant="destructive"
            >
              Déconnexion
            </Button>
          </>
        )}
      </div>

      {/* Menu burger en mobile */}
      {isMenuOpen && (
        <div className="absolute top-full right-4 mt-2 bg-white shadow rounded p-4 md:hidden z-10">
          <nav className="flex flex-col space-y-2">
            <Link
              href="/"
              className="hover:underline"
              onClick={() => setIsMenuOpen(false)}
            >
              Tableau de Bord
            </Link>

            {session?.user && (
              <>
                <span className="text-gray-600">
                  Bonjour, {session.user.nom} ({session.user.role})
                </span>
                <Button
                  onClick={() => {
                    signOut({ callbackUrl: "/auth/login" });
                    setIsMenuOpen(false);
                  }}
                  variant="destructive"
                >
                  Déconnexion
                </Button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
