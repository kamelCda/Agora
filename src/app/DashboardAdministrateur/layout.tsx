"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (
      !session ||
      !session?.user?.role ||
      !session.user.role.includes("ADMINISTRATEUR")
    ) {
      router.push("/unauthorized");
    }
  }, [session, status, router]);

  if (status === "loading" || !session) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="p-4 flex-1">
            <Card className="p-4 flex justify-center items-center">
              <Skeleton className="h-6 w-24" />
            </Card>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-[90%] mx-auto">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-4 bg-muted flex-1">
          <Card className="p-4">{children}</Card>
        </main>
      </div>
    </div>
  );
}
