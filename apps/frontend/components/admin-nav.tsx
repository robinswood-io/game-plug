"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, Home, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AdminNav() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: Home,
    },
    {
      label: "Configuration",
      href: "/admin/config",
      icon: Settings,
    },
  ];

  return (
    <div className="w-64 bg-sidebar border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <p className="text-xs text-muted-foreground mt-1">System Management</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className="w-full justify-start gap-3"
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Link href="/dashboard">
          <Button variant="outline" className="w-full justify-start gap-3">
            <LogOut size={18} />
            <span>Back to Game</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
