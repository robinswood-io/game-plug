"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Database, Shield } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to the system administration panel. Manage application settings and system configurations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* System Configuration Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Settings className="text-blue-600" size={24} />
              </div>
              <CardTitle>System Configuration</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Manage system-wide settings including API timeouts, feature flags, and resource limits.
            </p>
            <Link href="/admin/config">
              <Button className="w-full">Manage Settings</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Database Status Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Database className="text-green-600" size={24} />
              </div>
              <CardTitle>Database Status</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              View database health metrics and configuration status.
            </p>
            <Button variant="outline" className="w-full" disabled>
              View Status (Coming Soon)
            </Button>
          </CardContent>
        </Card>

        {/* Security Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Shield className="text-purple-600" size={24} />
              </div>
              <CardTitle>Security</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Manage security policies, roles, and access control settings.
            </p>
            <Button variant="outline" className="w-full" disabled>
              Manage Security (Coming Soon)
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">API Timeout</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">30s</p>
            <p className="text-xs text-muted-foreground">Default setting</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Max File Size</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">50MB</p>
            <p className="text-xs text-muted-foreground">Upload limit</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">AI Features</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">Enabled</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Max Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">1000</p>
            <p className="text-xs text-muted-foreground">Per session</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
