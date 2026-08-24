import React from "react";
import { redirect } from "next/navigation";
import AdminNav from "@/components/admin-nav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <AdminNav />
      <main className="flex-1 overflow-auto bg-background">
        {children}
      </main>
    </div>
  );
}
