"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useWebSocket } from "@/hooks/useWebSocket";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { motion } from "framer-motion";
import {
  Users, Copy, QrCode, Share2, Settings, Package,
  Plus, Monitor, Download, BookOpen, Image, Trash2
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

// Components
import ConnectionIndicator from "@/components/connection-indicator";
import EnhancedCharacterCard from "@/components/enhanced-character-card";
import CharacterCardSkeleton from "@/components/character-card-skeleton";
import CharacterInventoryManager from "@/components/character-inventory-manager";
import GMRollWithEffects from "@/components/gm-roll-with-effects";
import UnifiedAmbientController from "@/components/unified-ambient-controller";
import NarrativeTools from "@/components/narrative-tools";
import ImportCharacterDialog from "@/components/import-character-dialog";
import VisualProjectionDialog from "@/components/visual-projection-dialog";
import NarrativeJournal from "@/components/narrative-journal";
import EnhancedButton from "@/components/enhanced-button";

// Types
import type { Character, SanityCondition, ActiveEffect } from '@shared/schema';

interface CharacterWithDetails extends Character {
  sanityConditions: SanityCondition[];
  activeEffects: ActiveEffect[];
}

interface GameSession {
  id: string;
  name: string;
  code?: string;
  isActive?: boolean;
}

export default function GMDashboard() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Modal states
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [inventoryModalOpen, setInventoryModalOpen] = useState(false);
  const [selectedCharacterForInventory, setSelectedCharacterForInventory] = useState<string | null>(null);
  const [deleteCharacterId, setDeleteCharacterId] = useState<string | null>(null);
  const [deleteCharacterName, setDeleteCharacterName] = useState<string>("");
  const [isGeneratingAvatars, setIsGeneratingAvatars] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showProjectionDialog, setShowProjectionDialog] = useState(false);
  const [showNarrativeJournal, setShowNarrativeJournal] = useState(false);

  // WebSocket connection
  const { isConnected, sendMessage, lastMessage } = useWebSocket(true);

  // Join session room on mount
  useEffect(() => {
    if (isConnected && sessionId) {
      sendMessage('session:join', { sessionId });
      console.log('✅ Joined session room:', sessionId);
    }

    return () => {
      if (isConnected && sessionId) {
        sendMessage('session:leave', { sessionId });
        console.log('👋 Left session room:', sessionId);
      }
    };
  }, [isConnected, sessionId, sendMessage]);

  // Handle WebSocket messages
  useEffect(() => {
    if (lastMessage) {
      switch (lastMessage.type) {
        case 'character_updated':
        case 'effect_applied':
        case 'buff_applied':
          // Refresh character data
          queryClient.invalidateQueries({ queryKey: ["/api/sessions", sessionId, "characters"] });
          break;
        case 'user_joined':
          toast({
            title: "Joueur connecté",
            description: "Un joueur a rejoint la session.",
          });
          break;
        case 'user_left':
          toast({
            title: "Joueur déconnecté",
            description: "Un joueur a quitté la session.",
            variant: "destructive",
          });
          break;
      }
    }
  }, [lastMessage, sessionId, queryClient, toast]);

  // Fetch session data
  const { data: session, isLoading: isLoadingSession } = useQuery<GameSession>({
    queryKey: ["/api/sessions", sessionId],
    queryFn: async () => {
      const res = await fetch(`/api/sessions/${sessionId}`);
      if (!res.ok) throw new Error("Failed to fetch session");
      return res.json();
    },
    enabled: !!sessionId,
  });

  // Fetch characters with details
  const { data: characters = [], isLoading: isLoadingCharacters } = useQuery<CharacterWithDetails[]>({
    queryKey: ["/api/sessions", sessionId, "characters"],
    queryFn: async () => {
      const res = await fetch(`/api/sessions/${sessionId}/characters`);
      if (!res.ok) throw new Error("Failed to fetch characters");
      return res.json();
    },
    enabled: !!sessionId,
  });

  // Delete character mutation
  const deleteCharacterMutation = useMutation({
    mutationFn: async (characterId: string) => {
      const response = await fetch(`/api/sessions/${sessionId}/characters/${characterId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete character");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Personnage supprimé",
        description: "Le personnage a été retiré de la session.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/sessions", sessionId, "characters"] });
      setDeleteCharacterId(null);
      setDeleteCharacterName("");
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le personnage.",
        variant: "destructive",
      });
    },
  });

  const handleCopyCode = () => {
    if (session?.code) {
      navigator.clipboard.writeText(session.code);
      toast({
        title: "Code copié",
        description: `Le code ${session.code} a été copié dans le presse-papier.`,
      });
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/join/${session?.code}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Lien copié",
      description: "Le lien de la session a été copié dans le presse-papier.",
    });
  };

  const handleGenerateAllAvatars = async () => {
    setIsGeneratingAvatars(true);
    try {
      const response = await fetch(`/api/sessions/${sessionId}/generate-all-avatars`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ forceRegenerate: false }),
      });
      const data = await response.json();

      if (data.generated > 0) {
        toast({
          title: "Portraits générés",
          description: `${data.generated} portrait(s) ont été créés avec succès.`,
        });
        queryClient.invalidateQueries({ queryKey: ["/api/sessions", sessionId, "characters"] });
      } else {
        toast({
          title: "Aucun portrait à générer",
          description: "Tous les personnages ont déjà un portrait.",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer les portraits.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingAvatars(false);
    }
  };

  if (isLoadingSession) {
    return (
      <div className="min-h-screen bg-deep-black">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <CharacterCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-deep-black flex items-center justify-center">
        <div className="text-blood-burgundy font-cinzel text-2xl">Session introuvable</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-black">
      {/* Compact Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="font-cinzel text-2xl text-aged-gold">{session.name}</h1>
            <ConnectionIndicator isConnected={isConnected} />
            <Badge className="bg-cosmic-void border-aged-gold text-aged-parchment">
              Code: {session.code}
            </Badge>
          </div>

          {/* Quick Actions Bar */}
          <div className="flex items-center gap-2">
            <EnhancedButton
              size="sm"
              variant="outline"
              onClick={handleCopyCode}
              className="border-aged-gold text-aged-gold hover:bg-cosmic-void"
              icon={<Copy className="h-4 w-4" />}
            />
            <EnhancedButton
              size="sm"
              variant="outline"
              onClick={handleCopyLink}
              className="border-aged-gold text-aged-gold hover:bg-cosmic-void"
              icon={<Share2 className="h-4 w-4" />}
            />
            <EnhancedButton
              size="sm"
              variant="outline"
              onClick={() => setShowQRDialog(true)}
              className="border-aged-gold text-aged-gold hover:bg-cosmic-void"
              icon={<QrCode className="h-4 w-4" />}
            />

            {/* GameBoard Button */}
            <EnhancedButton
              size="sm"
              variant="outline"
              onClick={() => window.open(`/sessions/${sessionId}/gameboard`, '_blank')}
              className="border-eldritch-green text-eldritch-green hover:bg-eldritch-green hover:text-deep-black"
              data-testid="button-gameboard"
              icon={<Monitor className="h-4 w-4" />}
            >
              GameBoard
            </EnhancedButton>

            {/* Narrative Journal Button */}
            <EnhancedButton
              size="sm"
              variant="outline"
              onClick={() => setShowNarrativeJournal(true)}
              className="border-aged-gold text-aged-gold hover:bg-cosmic-void"
              data-testid="button-narrative-journal"
              icon={<BookOpen className="h-4 w-4" />}
            >
              Journal
            </EnhancedButton>

            {/* Tools Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-aged-gold text-aged-gold hover:bg-cosmic-void"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Outils
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4 bg-charcoal border-aged-gold">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-cinzel text-aged-gold mb-2">Jets Groupés</h3>
                    <GMRollWithEffects
                      characters={characters}
                      onRoll={(result) => {
                        if (isConnected) {
                          sendMessage('gm_roll', {
                            formula: result.formula,
                            results: Array.from(result.results.entries()),
                            isSecret: result.isSecret
                          });
                        }
                      }}
                      onApplyEffect={async (effect) => {
                        for (const charId of effect.characterIds) {
                          await fetch(`/api/characters/${charId}/effects`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              type: effect.effectType,
                              value: effect.value.toString(),
                              description: effect.description
                            }),
                          });
                        }
                        queryClient.invalidateQueries({ queryKey: ["/api/sessions", sessionId, "characters"] });
                      }}
                    />
                  </div>

                  <div>
                    <h3 className="font-cinzel text-aged-gold mb-2">Ambiance</h3>
                    <UnifiedAmbientController />
                  </div>

                  <div>
                    <h3 className="font-cinzel text-aged-gold mb-2">Narration</h3>
                    <NarrativeTools
                      onAmbiance={(text) => {
                        if (isConnected) {
                          sendMessage('ambiance', { text, timestamp: new Date() });
                        }
                        toast({
                          title: "Ambiance envoyée",
                          description: text.substring(0, 50) + '...',
                        });
                      }}
                      onNarration={(text) => {
                        if (isConnected) {
                          sendMessage('narration', { text, timestamp: new Date() });
                        }
                        toast({
                          title: "Narration envoyée",
                          description: text.substring(0, 50) + '...',
                        });
                      }}
                    />
                  </div>

                  <Button
                    onClick={handleGenerateAllAvatars}
                    disabled={isGeneratingAvatars}
                    className="w-full bg-eldritch-green hover:bg-green-700 text-bone-white"
                  >
                    <Image className="mr-2 h-4 w-4" />
                    {isGeneratingAvatars ? "Génération..." : "Générer Portraits"}
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowImportDialog(true)}
              className="border-eldritch-green text-eldritch-green hover:bg-eldritch-green hover:text-deep-black"
              data-testid="button-import-character"
            >
              <Download className="mr-2 h-4 w-4" />
              Importer
            </Button>

            <Button
              size="sm"
              onClick={() => router.push(`/character-creation/${sessionId}`)}
              className="bg-eldritch-green hover:bg-green-700 text-bone-white"
              data-testid="button-create-character"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Personnage
            </Button>
          </div>
        </div>

        {/* Character Cards Grid */}
        {isLoadingCharacters ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <CharacterCardSkeleton key={`skeleton-${i}`} />
            ))}
          </div>
        ) : characters.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-charcoal border-aged-gold parchment-bg">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-16 w-16 text-aged-gold mb-4" />
                <p className="text-aged-parchment text-center mb-4">
                  Aucun personnage dans cette session.
                </p>
                <EnhancedButton
                  onClick={() => router.push(`/character-creation/${sessionId}`)}
                  className="bg-eldritch-green hover:bg-green-700 text-bone-white"
                  icon={<Plus className="h-4 w-4" />}
                >
                  Créer un Personnage
                </EnhancedButton>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {characters.map((character, index) => (
              <motion.div
                key={character.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
              >
                <EnhancedCharacterCard
                  character={character}
                  isConnected={isConnected}
                  onEdit={() => router.push(`/character-edit/${sessionId}/${character.id}`)}
                  onDelete={() => {
                    setDeleteCharacterId(character.id);
                    setDeleteCharacterName(character.name);
                  }}
                  onManageInventory={() => {
                    setSelectedCharacterForInventory(character.id);
                    setInventoryModalOpen(true);
                  }}
                  onApplyDamage={async (value) => {
                    await fetch(`/api/characters/${character.id}/effects`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        name: "Dégâts",
                        type: "damage",
                        value: value.toString()
                      }),
                    });
                    queryClient.invalidateQueries({ queryKey: ["/api/sessions", sessionId, "characters"] });
                    toast({
                      title: "Dégâts appliqués",
                      description: `${value} points de dégâts à ${character.name}`,
                      variant: "destructive"
                    });
                  }}
                  onApplySanity={async (value) => {
                    await fetch(`/api/characters/${character.id}/effects`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        name: "Perte de Sanité",
                        type: "sanity_loss",
                        value: value.toString()
                      }),
                    });
                    queryClient.invalidateQueries({ queryKey: ["/api/sessions", sessionId, "characters"] });
                    toast({
                      title: "Sanité perdue",
                      description: `${value} points de sanité perdus pour ${character.name}`,
                      className: "bg-purple-900/20 border-purple-600"
                    });
                  }}
                  onApplyBuff={async (name, value, duration) => {
                    await fetch(`/api/characters/${character.id}/effects`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        name,
                        type: "buff",
                        value: value.toString(),
                        duration: duration || 0
                      }),
                    });
                    queryClient.invalidateQueries({ queryKey: ["/api/sessions", sessionId, "characters"] });
                    toast({
                      title: "Buff appliqué",
                      description: `${name} (+${value}) appliqué à ${character.name}`,
                      className: "bg-eldritch-green/20 border-eldritch-green"
                    });
                  }}
                  onApplyDebuff={async (name, value) => {
                    await fetch(`/api/characters/${character.id}/effects`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        name,
                        type: "debuff",
                        value: value.toString()
                      }),
                    });
                    queryClient.invalidateQueries({ queryKey: ["/api/sessions", sessionId, "characters"] });
                    toast({
                      title: "Debuff appliqué",
                      description: `${name} appliqué à ${character.name}`,
                      variant: "destructive"
                    });
                  }}
                  onGrantSkillPoints={async (points) => {
                    await fetch(`/api/characters/${character.id}/skill-points`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ points }),
                    });
                    queryClient.invalidateQueries({ queryKey: ["/api/sessions", sessionId, "characters"] });
                    toast({
                      title: "Points attribués",
                      description: `${points} points de compétence attribués à ${character.name}`,
                      className: "bg-eldritch-green/20 border-eldritch-green"
                    });
                  }}
                  onRollSkill={(skillName, skillValue) => {
                    const result = Math.floor(Math.random() * 100) + 1;
                    toast({
                      title: `${character.name} - ${skillName}`,
                      description: `Jet: ${result} vs ${skillValue}% - ${result <= skillValue ? "Réussite" : "Échec"}`,
                      className: result <= skillValue ? "bg-eldritch-green/20" : "bg-blood-burgundy/20"
                    });
                  }}
                  onRollCharacteristic={(characteristic, value) => {
                    const result = Math.floor(Math.random() * 100) + 1;
                    toast({
                      title: `${character.name} - ${characteristic}`,
                      description: `Jet: ${result} vs ${value} - ${result <= value ? "Réussite" : "Échec"}`,
                      className: result <= value ? "bg-eldritch-green/20" : "bg-blood-burgundy/20"
                    });
                  }}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* QR Code Dialog */}
      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent className="bg-charcoal border-aged-gold">
          <DialogHeader>
            <DialogTitle className="font-cinzel text-aged-gold">Code QR de la Session</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4 p-4">
            <QRCodeCanvas
              value={`${window.location.origin}/join/${session.code}`}
              size={200}
              bgColor="#0a0a0a"
              fgColor="#d4af37"
            />
            <p className="text-aged-parchment text-center">
              Scannez ce code QR pour rejoindre la session
            </p>
            <div className="text-2xl font-cinzel text-aged-gold">
              {session.code}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Inventory Modal */}
      <Dialog open={inventoryModalOpen} onOpenChange={setInventoryModalOpen}>
        <DialogContent className="bg-charcoal border-aged-gold max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-cinzel text-aged-gold flex items-center gap-2">
              <Package className="h-5 w-5" />
              Gestion de l'Inventaire
            </DialogTitle>
          </DialogHeader>
          {selectedCharacterForInventory && (
            <CharacterInventoryManager
              characterId={selectedCharacterForInventory}
              isGM={true}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteCharacterId} onOpenChange={() => setDeleteCharacterId(null)}>
        <AlertDialogContent className="bg-charcoal border-aged-gold">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-cinzel text-aged-gold">
              Supprimer {deleteCharacterName} ?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-aged-parchment">
              Cette action est irréversible. Le personnage sera définitivement retiré de la session.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-cosmic-void border-aged-gold text-aged-parchment hover:bg-dark-stone">
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteCharacterId && deleteCharacterMutation.mutate(deleteCharacterId)}
              className="bg-blood-burgundy hover:bg-dark-crimson text-bone-white"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Import Character Dialog */}
      {sessionId && (
        <ImportCharacterDialog
          open={showImportDialog}
          onOpenChange={setShowImportDialog}
          sessionId={sessionId}
        />
      )}

      {/* Visual Projection Dialog */}
      {sessionId && (
        <VisualProjectionDialog
          open={showProjectionDialog}
          onOpenChange={setShowProjectionDialog}
          sessionId={sessionId}
        />
      )}

      {/* Narrative Journal Dialog */}
      {sessionId && (
        <Dialog open={showNarrativeJournal} onOpenChange={setShowNarrativeJournal}>
          <DialogContent className="bg-charcoal border-aged-gold max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-cinzel text-aged-gold flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Journal Narratif
              </DialogTitle>
            </DialogHeader>
            <NarrativeJournal sessionId={sessionId} />
          </DialogContent>
        </Dialog>
      )}

      {/* Floating Projection Button */}
      <motion.div
        className="fixed bottom-8 right-8 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={() => setShowProjectionDialog(true)}
          className="h-16 w-16 rounded-full bg-eldritch-green hover:bg-green-700 text-bone-white shadow-lg shadow-eldritch-green/50 hover:shadow-xl hover:shadow-eldritch-green/70 transition-all"
          data-testid="button-open-projection"
        >
          <Monitor className="h-6 w-6" />
        </Button>
      </motion.div>
    </div>
  );
}
