"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus } from "lucide-react";
import type { SystemConfig } from "@shared/schema";

interface EditingConfig extends SystemConfig {
  editingValue: string;
}

export default function AdminConfigPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingConfig, setEditingConfig] = useState<EditingConfig | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newConfig, setNewConfig] = useState({ key: "", value: "", description: "" });

  // Fetch all configs
  const { data: configs = [], isLoading } = useQuery({
    queryKey: ["admin-config"],
    queryFn: () => apiRequest("/api/admin/config"),
  });

  // Update config mutation
  const updateMutation = useMutation({
    mutationFn: (config: { key: string; value: any; description?: string }) =>
      apiRequest(`/api/admin/config/${config.key}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          value: config.value,
          description: config.description,
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-config"] });
      setEditingConfig(null);
      toast({
        title: "Success",
        description: "Configuration updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update config",
        variant: "destructive",
      });
    },
  });

  // Create config mutation
  const createMutation = useMutation({
    mutationFn: (config: { key: string; value: any; description?: string }) =>
      apiRequest(`/api/admin/config/${config.key}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          value: config.value,
          description: config.description,
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-config"] });
      setNewConfig({ key: "", value: "", description: "" });
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Configuration created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create config",
        variant: "destructive",
      });
    },
  });

  // Delete config mutation
  const deleteMutation = useMutation({
    mutationFn: (key: string) =>
      apiRequest(`/api/admin/config/${key}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-config"] });
      toast({
        title: "Success",
        description: "Configuration deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete config",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (config: SystemConfig) => {
    setEditingConfig({
      ...config,
      editingValue: JSON.stringify(config.value, null, 2),
    });
  };

  const handleSaveEdit = () => {
    if (!editingConfig) return;
    try {
      const value = JSON.parse(editingConfig.editingValue);
      updateMutation.mutate({
        key: editingConfig.key,
        value,
        description: editingConfig.description || undefined,
      });
    } catch {
      toast({
        title: "Error",
        description: "Invalid JSON format",
        variant: "destructive",
      });
    }
  };

  const handleCreateNew = () => {
    if (!newConfig.key.trim()) {
      toast({
        title: "Error",
        description: "Config key is required",
        variant: "destructive",
      });
      return;
    }

    try {
      let value = newConfig.value;
      try {
        value = JSON.parse(newConfig.value);
      } catch {
        // If not JSON, treat as string
        value = newConfig.value;
      }

      createMutation.mutate({
        key: newConfig.key,
        value,
        description: newConfig.description || undefined,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create config",
        variant: "destructive",
      });
    }
  };

  const formatValue = (value: any): string => {
    if (typeof value === "object") {
      return JSON.stringify(value);
    }
    return String(value);
  };

  const getValueType = (value: any): string => {
    if (typeof value === "boolean") return "boolean";
    if (typeof value === "number") return "number";
    if (typeof value === "string") return "string";
    return "json";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-muted-foreground">Loading configurations...</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">System Configuration</h1>
          <p className="text-muted-foreground mt-2">
            Manage application-wide system settings and feature toggles
          </p>
        </div>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="gap-2"
        >
          <Plus size={16} />
          New Config
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuration Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Key</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {configs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No configurations found
                    </TableCell>
                  </TableRow>
                ) : (
                  configs.map((config) => (
                    <TableRow key={config.key}>
                      <TableCell className="font-mono font-bold">{config.key}</TableCell>
                      <TableCell className="font-mono text-sm max-w-xs truncate">
                        {formatValue(config.value)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {getValueType(config.value)}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-sm">
                        {config.description || "-"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {config.updatedAt
                          ? new Date(config.updatedAt).toLocaleDateString()
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(config)}
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteMutation.mutate(config.key)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 size={16} className="text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingConfig && !isDialogOpen} onOpenChange={(open) => {
        if (!open) setEditingConfig(null);
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Configuration: {editingConfig?.key}</DialogTitle>
          </DialogHeader>
          {editingConfig && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Key</label>
                <Input
                  value={editingConfig.key}
                  disabled
                  className="mt-2 bg-muted"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Value (JSON)</label>
                <textarea
                  value={editingConfig.editingValue}
                  onChange={(e) =>
                    setEditingConfig({
                      ...editingConfig,
                      editingValue: e.target.value,
                    })
                  }
                  className="w-full h-40 mt-2 p-3 border rounded-md font-mono text-sm"
                  placeholder="Enter JSON value"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Input
                  value={editingConfig.description || ""}
                  onChange={(e) =>
                    setEditingConfig({
                      ...editingConfig,
                      description: e.target.value,
                    })
                  }
                  className="mt-2"
                  placeholder="Description (optional)"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingConfig(null)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={updateMutation.isPending}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Configuration</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Key</label>
              <Input
                value={newConfig.key}
                onChange={(e) => setNewConfig({ ...newConfig, key: e.target.value })}
                className="mt-2"
                placeholder="e.g., features.newFeature"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Value</label>
              <textarea
                value={newConfig.value}
                onChange={(e) => setNewConfig({ ...newConfig, value: e.target.value })}
                className="w-full h-32 mt-2 p-3 border rounded-md font-mono text-sm"
                placeholder="Enter value (JSON or string)"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Tip: Use JSON format for objects/arrays (e.g., {"true"}, 123, {"{"}"max": 100})
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Input
                value={newConfig.description}
                onChange={(e) => setNewConfig({ ...newConfig, description: e.target.value })}
                className="mt-2"
                placeholder="Description (optional)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateNew}
              disabled={createMutation.isPending}
            >
              Create Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
