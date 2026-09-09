'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QRCodeCanvas } from 'qrcode.react';
import { Copy, QrCode, Share2, Check, Download, RefreshCw, Save, User, Briefcase } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { apiRequest } from '@/lib/queryClient';
import type { Character } from '@shared/schema';
import NextImage from "next/image";

interface ImportableCharacter extends Character {
  sessionName: string;
}

interface AddPlayersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionId: string;
  sessionCode?: string;
  sessionName: string;
}

export default function AddPlayersDialog({
  open,
  onOpenChange,
  sessionId,
  sessionCode,
  sessionName,
}: AddPlayersDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [resetState, setResetState] = useState<boolean>(true);

  const joinUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/join/${sessionCode}`
    : '';

  // Fetch importable characters
  const { data: importableCharacters = [], isLoading } = useQuery<ImportableCharacter[]>({
    queryKey: ["/api/sessions", sessionId, "importable-characters"],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/sessions/${sessionId}/importable-characters`);
      return response.json();
    },
    enabled: open && !!sessionId,
  });

  // Import character mutation
  const importCharacterMutation = useMutation({
    mutationFn: async ({ characterId, resetState }: { characterId: string; resetState: boolean }) => {
      const response = await apiRequest("POST", `/api/sessions/${sessionId}/import-character`, {
        characterId,
        resetState
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Personnage importé",
        description: `${data.character.name} a été importé avec succès dans cette session.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/sessions", sessionId, "characters"] });
      setSelectedCharacterId(null);
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible d'importer le personnage.",
        variant: "destructive",
      });
    },
  });

  const handleImport = () => {
    if (selectedCharacterId) {
      importCharacterMutation.mutate({ characterId: selectedCharacterId, resetState });
    }
  };

  const handleCopyCode = async () => {
    if (!sessionCode) {
      toast({
        title: 'Erreur',
        description: 'Code de session manquant',
        variant: 'destructive',
      });
      return;
    }

    await navigator.clipboard.writeText(sessionCode);
    setCopiedCode(true);
    toast({
      title: 'Code copié',
      description: 'Le code de session a été copié dans le presse-papiers.',
    });

    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(joinUrl);
    setCopiedLink(true);
    toast({
      title: 'Lien copié',
      description: "Le lien d'invitation a été copié dans le presse-papiers.",
    });

    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Rejoindre la session ${sessionName}`,
          text: `Rejoins notre partie de l'Appel de Cthulhu avec le code: ${sessionCode}`,
          url: joinUrl,
        });
      } catch (error) {
        // User cancelled share dialog
        console.log('Share cancelled');
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-charcoal border-aged-gold parchment-bg max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-cinzel text-aged-gold text-2xl">
            Inviter des Joueurs
          </DialogTitle>
          <DialogDescription className="text-aged-parchment font-source">
            Partagez le code ou le lien avec vos joueurs pour qu&apos;ils rejoignent la session &quot;{sessionName}&quot;
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="code" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-cosmic-void border-aged-gold">
            <TabsTrigger
              value="code"
              className="text-bone-white data-[state=active]:bg-aged-gold data-[state=active]:text-deep-black"
            >
              Code Session
            </TabsTrigger>
            <TabsTrigger
              value="link"
              className="text-bone-white data-[state=active]:bg-aged-gold data-[state=active]:text-deep-black"
            >
              Lien Direct
            </TabsTrigger>
            <TabsTrigger
              value="qr"
              className="text-bone-white data-[state=active]:bg-aged-gold data-[state=active]:text-deep-black"
            >
              QR Code
            </TabsTrigger>
            <TabsTrigger
              value="import"
              className="text-bone-white data-[state=active]:bg-eldritch-green data-[state=active]:text-deep-black"
            >
              Importer
            </TabsTrigger>
          </TabsList>

          <TabsContent value="code" className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label className="text-aged-parchment font-source">Code de Session</Label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={sessionCode || ''}
                  className="bg-cosmic-void border-aged-gold text-bone-white text-2xl font-bold text-center tracking-widest"
                />
                <Button
                  onClick={handleCopyCode}
                  className="bg-blood-burgundy hover:bg-dark-crimson text-bone-white"
                >
                  {copiedCode ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-sm text-aged-parchment">
                Les joueurs peuvent rejoindre en utilisant ce code sur la page d&apos;accueil.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="link" className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label className="text-aged-parchment font-source">Lien d&apos;Invitation</Label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={joinUrl}
                  className="bg-cosmic-void border-aged-gold text-bone-white"
                />
                <Button
                  onClick={handleCopyLink}
                  className="bg-blood-burgundy hover:bg-dark-crimson text-bone-white"
                >
                  {copiedLink ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
                {typeof window !== 'undefined' && typeof navigator.share === 'function' && (
                  <Button
                    onClick={handleShare}
                    className="bg-aged-gold hover:bg-yellow-700 text-deep-black"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <p className="text-sm text-aged-parchment">
                Partagez ce lien directement avec vos joueurs pour un accès rapide.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="qr" className="space-y-4 mt-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-white p-4 rounded-lg">
                <QRCodeCanvas
                  value={joinUrl}
                  size={256}
                  level="H"
                  includeMargin
                />
              </div>
              <p className="text-sm text-aged-parchment text-center">
                Scannez ce QR code avec un smartphone pour rejoindre directement la session.
              </p>
              <div className="w-full flex flex-col gap-2">
                <Button
                  onClick={handleCopyLink}
                  className="w-full bg-blood-burgundy hover:bg-dark-crimson text-bone-white"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copier le Lien
                </Button>
                {typeof window !== 'undefined' && typeof navigator.share === 'function' && (
                  <Button
                    onClick={handleShare}
                    className="w-full bg-aged-gold hover:bg-yellow-700 text-deep-black"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Partager
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="import" className="space-y-4 mt-6">
            {/* Import State Option */}
            <div className="bg-cosmic-void border border-aged-gold rounded-lg p-4">
              <h3 className="font-cinzel text-aged-gold mb-3 flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Options d&apos;import
              </h3>
              <RadioGroup
                value={resetState ? "reset" : "keep"}
                onValueChange={(value) => setResetState(value === "reset")}
                className="space-y-3"
              >
                <div className="flex items-start space-x-3 p-3 rounded border border-aged-gold/30 hover:border-aged-gold transition-colors">
                  <RadioGroupItem value="reset" id="reset" className="mt-1" data-testid="radio-reset-state" />
                  <div className="flex-1">
                    <Label htmlFor="reset" className="font-cinzel text-aged-gold cursor-pointer flex items-center gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Réinitialiser l&apos;état
                    </Label>
                    <p className="text-sm text-aged-parchment opacity-80 mt-1">
                      PV, Santé mentale et PM remis au maximum. Inventaire, notes et historique effacés.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 rounded border border-aged-gold/30 hover:border-aged-gold transition-colors">
                  <RadioGroupItem value="keep" id="keep" className="mt-1" data-testid="radio-keep-state" />
                  <div className="flex-1">
                    <Label htmlFor="keep" className="font-cinzel text-aged-gold cursor-pointer flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Conserver l&apos;état
                    </Label>
                    <p className="text-sm text-aged-parchment opacity-80 mt-1">
                      Copie complète : PV, Santé, inventaire, effets actifs, conditions et notes.
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Characters List */}
            <div className="space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="bg-cosmic-void border-aged-gold">
                      <CardHeader>
                        <Skeleton className="h-6 w-48 bg-charcoal" />
                        <Skeleton className="h-4 w-32 bg-charcoal mt-2" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-20 w-full bg-charcoal" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : importableCharacters.length === 0 ? (
                <div className="text-center py-8">
                  <User className="mx-auto h-12 w-12 text-aged-gold opacity-50 mb-4" />
                  <p className="text-aged-parchment font-crimson">
                    Aucun personnage disponible pour l&apos;import.
                  </p>
                  <p className="text-sm text-aged-parchment opacity-70 mt-2">
                    Les personnages apparaîtront ici une fois que vous aurez créé des personnages dans d&apos;autres sessions.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-4">
                  {importableCharacters.map((character) => (
                    <Card
                      key={character.id}
                      className={`cursor-pointer transition-all border-2 ${
                        selectedCharacterId === character.id
                          ? "border-eldritch-green bg-cosmic-void shadow-lg shadow-eldritch-green/20"
                          : "border-aged-gold bg-cosmic-void hover:border-eldritch-green hover:shadow-md"
                      }`}
                      onClick={() => setSelectedCharacterId(character.id)}
                      data-testid={`card-character-import-${character.id}`}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="font-cinzel text-lg text-aged-gold flex items-center gap-2">
                              {character.avatarUrl && (
                                <NextImage
                                  src={character.avatarUrl}
                                  alt={character.name}
                                  width={32}
                                  height={32}
                                  unoptimized
                                  className="w-8 h-8 rounded-full object-cover border border-aged-gold"
                                />
                              )}
                              {character.name}
                            </CardTitle>
                            <CardDescription className="text-aged-parchment mt-1">
                              <div className="flex items-center gap-2 mt-1">
                                <Briefcase className="h-3 w-3" />
                                <span className="text-xs">{character.occupation}</span>
                              </div>
                            </CardDescription>
                          </div>
                          {selectedCharacterId === character.id && (
                            <Download className="h-5 w-5 text-eldritch-green" />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div>
                          <Badge className="bg-cosmic-void border-aged-gold text-aged-parchment text-xs">
                            {character.sessionName}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-3 gap-1 text-xs">
                          <div className="text-aged-parchment">
                            <div className="font-cinzel text-aged-gold text-xs">FOR</div>
                            <div className="text-xs">{character.strength}</div>
                          </div>
                          <div className="text-aged-parchment">
                            <div className="font-cinzel text-aged-gold text-xs">DEX</div>
                            <div className="text-xs">{character.dexterity}</div>
                          </div>
                          <div className="text-aged-parchment">
                            <div className="font-cinzel text-aged-gold text-xs">INT</div>
                            <div className="text-xs">{character.intelligence}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t border-aged-gold/30">
          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
            className="border-aged-gold text-bone-white hover:bg-dark-stone"
          >
            Fermer
          </Button>
          {open && selectedCharacterId && (
            <Button
              onClick={handleImport}
              disabled={importCharacterMutation.isPending}
              className="bg-eldritch-green hover:bg-green-700 text-bone-white"
              data-testid="button-confirm-import"
            >
              <Download className="mr-2 h-4 w-4" />
              {importCharacterMutation.isPending ? "Import en cours..." : "Importer"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
