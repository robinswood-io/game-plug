"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Settings, Dice6, Music, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import GMRollWithEffects from "./gm-roll-with-effects";
import UnifiedAmbientController from "./unified-ambient-controller";
import NarrativeTools from "./narrative-tools";
import { Button } from "@/components/ui/button";
import type { Character } from "@shared/schema";

interface GMToolsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  characters: Array<Character & {
    sanityConditions?: any[];
    activeEffects?: any[];
  }>;
  isConnected: boolean;
  onRoll: (result: any) => void;
  onApplyEffect: (effect: any) => Promise<void>;
  onAmbiance: (text: string) => void;
  onNarration: (text: string) => void;
  isGeneratingAvatars: boolean;
  onGenerateAvatars: () => Promise<void>;
}

export default function GMToolsModal({
  open,
  onOpenChange,
  characters,
  isConnected,
  onRoll,
  onApplyEffect,
  onAmbiance,
  onNarration,
  isGeneratingAvatars,
  onGenerateAvatars,
}: GMToolsModalProps) {
  const [selectedTab, setSelectedTab] = useState("rolls");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-charcoal border-aged-gold max-w-2xl max-h-[90vh] p-0 flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-aged-gold/20">
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-aged-gold" />
            <DialogTitle className="font-cinzel text-aged-gold text-xl">
              Outils du Maître de Jeu
            </DialogTitle>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6">
          <Tabs
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 bg-cosmic-void border border-aged-gold/20 sticky top-0 z-50">
              <TabsTrigger
                value="rolls"
                className="flex items-center gap-2"
                data-testid="tab-rolls"
              >
                <Dice6 className="h-4 w-4" />
                <span className="hidden sm:inline">Jets</span>
              </TabsTrigger>
              <TabsTrigger
                value="ambient"
                className="flex items-center gap-2"
                data-testid="tab-ambient"
              >
                <Music className="h-4 w-4" />
                <span className="hidden sm:inline">Ambiance</span>
              </TabsTrigger>
              <TabsTrigger
                value="narrative"
                className="flex items-center gap-2"
                data-testid="tab-narrative"
              >
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Narration</span>
              </TabsTrigger>
              <TabsTrigger
                value="utilities"
                className="flex items-center gap-2"
                data-testid="tab-utilities"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Utilitaires</span>
              </TabsTrigger>
            </TabsList>

            <div className="py-6">
              {/* Rolls Tab */}
              <TabsContent value="rolls" className="space-y-4 mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <GMRollWithEffects
                    characters={characters}
                    onRoll={onRoll}
                    onApplyEffect={onApplyEffect}
                  />
                </motion.div>
              </TabsContent>

              {/* Ambient Tab */}
              <TabsContent value="ambient" className="space-y-4 mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <UnifiedAmbientController />
                </motion.div>
              </TabsContent>

              {/* Narrative Tab */}
              <TabsContent value="narrative" className="space-y-4 mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <NarrativeTools
                    onAmbiance={onAmbiance}
                    onNarration={onNarration}
                  />
                </motion.div>
              </TabsContent>

              {/* Utilities Tab */}
              <TabsContent value="utilities" className="space-y-4 mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="space-y-4">
                    <div className="p-4 bg-cosmic-void border border-aged-gold/20 rounded-lg">
                      <h3 className="font-cinzel text-aged-gold mb-3 flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Utilitaires
                      </h3>
                      <p className="text-sm text-aged-parchment mb-4">
                        Générez des portraits pour tous les personnages sans portrait.
                      </p>
                      <Button
                        onClick={onGenerateAvatars}
                        disabled={isGeneratingAvatars}
                        className="w-full bg-eldritch-green hover:bg-green-700 text-bone-white"
                        data-testid="button-generate-avatars-modal"
                      >
                        {isGeneratingAvatars ? "Génération..." : "Générer Portraits"}
                      </Button>
                    </div>

                    <div className="p-4 bg-cosmic-void border border-aged-gold/20 rounded-lg">
                      <h3 className="font-cinzel text-aged-gold mb-2">Informations</h3>
                      <div className="space-y-2 text-sm text-aged-parchment/70">
                        <p>
                          <strong>Personnages actifs:</strong> {characters.length}
                        </p>
                        <p>
                          <strong>Connexion WebSocket:</strong>{" "}
                          <span
                            className={
                              isConnected
                                ? "text-eldritch-green"
                                : "text-blood-burgundy"
                            }
                          >
                            {isConnected ? "Connecté" : "Déconnecté"}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>
            </div>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
