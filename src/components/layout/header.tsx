"use client";

import React from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="flex items-center justify-between bg-white shadow p-4">
      <Link href="/">
        <h1 className="text-xl font-bold">Tableau de Bord</h1>
      </Link>
      <div className="flex items-center space-x-4">
        {session?.user && (
          <Card className="p-2 bg-gray-100">
            <CardContent className="flex items-center space-x-3">
              <span className="text-gray-600">
                Bonjour, {session.user.nom} ({session.user.role})
              </span>
              <Button
                onClick={() => signOut({ callbackUrl: "/auth/login" })}
                variant="destructive"
              >
                Déconnexion
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </header>
  );
}
