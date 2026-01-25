'use client';

import { useState } from 'react';
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
import { Copy, QrCode, Share2, Check } from 'lucide-react';

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
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const joinUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/join/${sessionCode}`
    : '';

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
            Partagez le code ou le lien avec vos joueurs pour qu'ils rejoignent la session "{sessionName}"
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="code" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-cosmic-void border-aged-gold">
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
                Les joueurs peuvent rejoindre en utilisant ce code sur la page d'accueil.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="link" className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label className="text-aged-parchment font-source">Lien d'Invitation</Label>
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
                {navigator.share && (
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
              <Button
                onClick={handleCopyLink}
                variant="outline"
                className="border-aged-gold text-bone-white hover:bg-dark-stone"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copier le Lien
              </Button>
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
