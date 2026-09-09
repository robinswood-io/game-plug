'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import NextImage from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CharactersService } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';
import DiceRoller from '@/components/dice-roller';
import RollHistoryVisual from '@/components/roll-history-visual';
import SanityTracker from '@/components/sanity-tracker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Brain, Shield, AlertTriangle, Skull, Activity, AlertCircle, RefreshCw, BookOpen, Save, Image as ImageIcon, Sparkles } from 'lucide-react';
import { SKILL_TRANSLATIONS } from '@/lib/cthulhu-data';
import type { Character, SanityCondition, ActiveEffect } from '@shared/schema';

interface InventoryItem {
  id: string;
  characterId: string;
  name: string;
  description?: string | null;
  category: string;
  quantity: number;
  weight: number;
  isEquipped: boolean;
  damage?: string | null;
  armor?: number | null;
}

interface CharacterWithDetails extends Character {
  sanityConditions: SanityCondition[];
  activeEffects: ActiveEffect[];
}

const getAgeCategory = (ageNumber: number): string => {
  if (ageNumber <= 25) return 'young';
  if (ageNumber <= 40) return 'adult';
  if (ageNumber <= 60) return 'middle';
  return 'elderly';
};

const getGenderCategory = (genderStr: string | undefined | null): string => {
  if (!genderStr) return 'male';
  const normalized = genderStr.toLowerCase().trim();
  if (
    normalized.includes('femme') ||
    normalized.includes('female') ||
    normalized.includes('f')
  ) {
    return 'female';
  }
  if (normalized.includes('autre') || normalized.includes('other')) {
    return 'other';
  }
  return 'male';
};

export default function CharacterSheetPage() {
  const params = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const characterId = params.id as string;

  const [notes, setNotes] = useState<string>('');
  const [notesModified, setNotesModified] = useState(false);
  const [showAvatarDialog, setShowAvatarDialog] = useState(false);
  const [avatarSettings, setAvatarSettings] = useState({
    gender: 'male',
    age: 'adult',
    hairColor: 'brown',
    eyeColor: 'brown',
    height: 'average',
    build: 'average',
    skinTone: 'fair',
    facialHair: 'none',
    distinctiveFeatures: '',
    clothing: 'formal',
  });

  const { data: character, isLoading: characterLoading } = useQuery({
    queryKey: ['character', characterId],
    queryFn: () => CharactersService.charactersControllerFindOne(characterId),
  });

  const updateNotesMutation = useMutation({
    mutationFn: (notes: string) =>
      CharactersService.charactersControllerUpdate(characterId, { notes }),
    onSuccess: () => {
      setNotesModified(false);
      queryClient.invalidateQueries({ queryKey: ['character', characterId] });
      toast({
        title: 'Notes sauvegardées',
        description: 'Vos notes ont été enregistrées avec succès.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de sauvegarder les notes.',
        variant: 'destructive',
      });
    },
  });

  // Helper function to convert age number to age category

  const currentNotes = notesModified ? notes : character?.notes || '';

  const saveNotes = useCallback(() => {
    if (!notesModified || !characterId) return;

    updateNotesMutation.mutate(currentNotes);
  }, [characterId, currentNotes, notesModified, updateNotesMutation]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (notesModified) {
        saveNotes();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [currentNotes, notesModified, saveNotes]);

  const calculateConditionalStatuses = () => {
    if (!character) return [];
    const statuses = [];
    const hpPercentage = character.hitPoints / character.maxHitPoints;
    const sanityPercentage = character.sanity / character.maxSanity;

    if (character.hitPoints <= 0) {
      statuses.push({
        name: 'Mort',
        description: 'Le personnage est décédé',
        severity: 'critical',
        icon: Skull,
        color: 'text-black',
      });
    } else if (character.hitPoints <= 2) {
      statuses.push({
        name: 'Mourant',
        description: 'Inconscient et en train de mourir - Soins urgents requis!',
        severity: 'critical',
        icon: Activity,
        color: 'text-red-600',
      });
    } else if (hpPercentage < 0.5) {
      statuses.push({
        name: 'Blessure Grave',
        description: 'Malus de -20% à tous les jets de compétence',
        severity: 'severe',
        icon: AlertTriangle,
        color: 'text-orange-500',
      });
    } else if (hpPercentage < 0.75) {
      statuses.push({
        name: 'Blessure Légère',
        description: 'Malus de -10% à tous les jets de compétence',
        severity: 'moderate',
        icon: AlertCircle,
        color: 'text-yellow-500',
      });
    }

    if (character.sanity <= 0) {
      statuses.push({
        name: 'Folie Permanente',
        description: "L'esprit est définitivement brisé",
        severity: 'critical',
        icon: Brain,
        color: 'text-purple-900',
      });
    } else if (sanityPercentage < 0.2) {
      statuses.push({
        name: 'Folie Majeure',
        description: 'État mental extrêmement fragile - Malus de -30% aux jets sociaux',
        severity: 'severe',
        icon: Brain,
        color: 'text-purple-600',
      });
    } else if (sanityPercentage < 0.5) {
      statuses.push({
        name: 'Instabilité Mentale',
        description: 'Nervosité et paranoïa - Malus de -15% aux jets de Psychologie et Persuasion',
        severity: 'moderate',
        icon: Brain,
        color: 'text-purple-400',
      });
    }

    if (hpPercentage < 0.3 && sanityPercentage < 0.3) {
      statuses.push({
        name: 'État Critique',
        description: 'Corps et esprit au bord de l\'effondrement - Malus de -40% à tous les jets',
        severity: 'critical',
        icon: Skull,
        color: 'text-red-900',
      });
    }

    return statuses;
  };

  const conditionalStatuses = calculateConditionalStatuses();

  if (characterLoading) {
    return (
      <div className="min-h-screen bg-deep-black flex items-center justify-center">
        <div className="text-aged-gold text-xl font-cinzel">Chargement...</div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-screen bg-deep-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-cinzel text-aged-gold mb-4">Personnage introuvable</h1>
          <Link href="/">
            <Button className="bg-blood-burgundy hover:bg-dark-crimson text-bone-white">
              Retour à l&apos;accueil
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const characteristics = [
    { key: 'strength', label: 'Force (FOR)', value: character.strength },
    { key: 'constitution', label: 'Constitution (CON)', value: character.constitution },
    { key: 'size', label: 'Taille (TAI)', value: character.size },
    { key: 'dexterity', label: 'Dextérité (DEX)', value: character.dexterity },
    { key: 'appearance', label: 'Apparence (APP)', value: character.appearance },
    { key: 'intelligence', label: 'Intelligence (INT)', value: character.intelligence },
    { key: 'power', label: 'Pouvoir (POU)', value: character.power },
    { key: 'education', label: 'Éducation (EDU)', value: character.education },
  ];

  const skills = (character.skills as Record<string, number>) || {};

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/">
          <Button
            variant="outline"
            className="border-aged-gold text-bone-white hover:bg-dark-stone"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        </Link>
        <h1 className="font-cinzel text-3xl font-bold text-aged-gold">Fiche de {character.name}</h1>
      </div>

      {/* Character Portrait & Basic Info */}
      <Card className="bg-charcoal border-aged-gold parchment-bg mb-8">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-4 gap-6">
            {/* Portrait */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex justify-center">
                {character.avatarUrl ? (
                  <NextImage
                    src={character.avatarUrl}
                    alt={`Portrait de ${character.name}`}
                    width={192}
                    height={192}
                    unoptimized
                    className="w-48 h-48 rounded-lg border-2 border-aged-gold object-cover"
                  />
                ) : (
                  <div className="w-48 h-48 bg-cosmic-void border-2 border-aged-gold rounded-lg flex items-center justify-center">
                    <span className="text-aged-parchment text-center">Aucun portrait</span>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowAvatarDialog(true)}
                  className="bg-aged-gold hover:bg-aged-gold/80 text-deep-black"
                  size="sm"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Personnaliser
                </Button>
              </div>
            </div>

            {/* Basic Info */}
            <div className="md:col-span-3 space-y-4">
              <div>
                <h2 className="font-cinzel text-2xl text-aged-gold mb-2">{character.name}</h2>
                <p className="text-lg text-bone-white font-source">{character.occupation}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-aged-parchment">Âge:</span>
                  <span className="text-bone-white ml-2">{character.age} ans</span>
                </div>
                <div>
                  <span className="text-aged-parchment">Naissance:</span>
                  <span className="text-bone-white ml-2">{character.birthplace || 'Non spécifié'}</span>
                </div>
                <div>
                  <span className="text-aged-parchment">Résidence:</span>
                  <span className="text-bone-white ml-2">{character.residence || 'Non spécifié'}</span>
                </div>
                <div>
                  <span className="text-aged-parchment">Genre:</span>
                  <span className="text-bone-white ml-2">{character.gender || 'Non spécifié'}</span>
                </div>
              </div>

              {/* Vital Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center bg-cosmic-void rounded-lg p-3 border-2 border-transparent">
                  <div className="text-lg font-bold text-bone-white">
                    {character.hitPoints}/{character.maxHitPoints}
                  </div>
                  <div className="text-xs text-aged-parchment">Points de Vie</div>
                </div>
                <div className="text-center bg-cosmic-void rounded-lg p-3 border-2 border-transparent">
                  <div className="text-lg font-bold text-bone-white">
                    {character.sanity}/{character.maxSanity}
                  </div>
                  <div className="text-xs text-aged-parchment">Sanité Mentale</div>
                </div>
                <div className="text-center bg-cosmic-void rounded-lg p-3">
                  <div className="text-lg font-bold text-bone-white">
                    {character.magicPoints}/{character.maxMagicPoints}
                  </div>
                  <div className="text-xs text-aged-parchment">Points de Magie</div>
                </div>
                <div className="text-center bg-cosmic-void rounded-lg p-3 relative">
                  <div className="text-lg font-bold text-bone-white flex items-center justify-center gap-1">
                    ${character.money || '0.00'}
                  </div>
                  <div className="text-xs text-aged-parchment">Argent</div>
                </div>
              </div>

              {/* Conditional Status Indicators */}
              {conditionalStatuses.length > 0 && (
                <div className="mt-4 space-y-2">
                  <div className="text-sm font-cinzel text-aged-gold mb-2">État Actuel</div>
                  {conditionalStatuses.map((status, index) => {
                    const Icon = status.icon;
                    return (
                      <div
                        key={index}
                        className={`flex items-start gap-2 p-2 rounded bg-deep-black border ${
                          status.severity === 'critical'
                            ? 'border-red-600'
                            : status.severity === 'severe'
                              ? 'border-orange-500'
                              : 'border-yellow-500'
                        }`}
                      >
                        <Icon className={`h-5 w-5 mt-0.5 ${status.color}`} />
                        <div className="flex-1">
                          <div className={`font-source font-semibold ${status.color}`}>{status.name}</div>
                          <div className="text-xs text-aged-parchment mt-1">{status.description}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Characteristics & Skills */}
        <div className="lg:col-span-2 space-y-8">
          {/* Characteristics */}
          <Card className="bg-charcoal border-aged-gold parchment-bg">
            <CardHeader>
              <CardTitle className="font-cinzel text-aged-gold">Caractéristiques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {characteristics.map((char) => (
                  <div key={char.key} className="flex justify-between items-center">
                    <span className="font-source">{char.label}</span>
                    <div className="flex space-x-2 text-sm">
                      <span className="w-8 text-center text-bone-white">{char.value}</span>
                      <span className="w-8 text-center text-aged-parchment">({Math.floor(char.value / 2)})</span>
                      <span className="w-8 text-center text-aged-parchment">({Math.floor(char.value / 5)})</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-aged-gold">
                <div className="text-xs text-aged-parchment text-center">Valeur / (Moitié) / (Un cinquième)</div>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card className="bg-charcoal border-aged-gold parchment-bg">
            <CardHeader>
              <CardTitle className="font-cinzel text-aged-gold flex justify-between items-center">
                <span>Compétences</span>
                {character.skillsLocked && (
                  <Badge variant="outline" className="border-aged-gold text-aged-gold">
                    <Shield className="h-3 w-3 mr-1" />
                    Verrouillées
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(skills)
                  .sort(([keyA], [keyB]) => {
                    const nameA =
                      SKILL_TRANSLATIONS[keyA] || keyA.charAt(0).toUpperCase() + keyA.slice(1).replace(/_/g, ' ');
                    const nameB =
                      SKILL_TRANSLATIONS[keyB] || keyB.charAt(0).toUpperCase() + keyB.slice(1).replace(/_/g, ' ');
                    return nameA.localeCompare(nameB, 'fr');
                  })
                  .map(([skillName, skillValue]) => (
                    <div key={skillName} className="flex justify-between items-center">
                      <span className="font-source text-aged-parchment">
                        {SKILL_TRANSLATIONS[skillName] ||
                          skillName.charAt(0).toUpperCase() + skillName.slice(1).replace(/_/g, ' ')}
                      </span>
                      <span className="text-bone-white font-bold">{skillValue}%</span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Dice Roller & Sanity */}
        <div className="space-y-6">
          <DiceRoller character={character} />
          <SanityTracker character={character} />
        </div>
      </div>

      {/* Personal Notes Section */}
      <div className="mt-8">
        <Card className="bg-charcoal border-aged-gold parchment-bg">
          <CardHeader>
            <CardTitle className="font-cinzel text-aged-gold flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Notes Personnelles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <textarea
                  value={currentNotes}
                  onChange={(e) => {
                    setNotes(e.target.value);
                    setNotesModified(true);
                  }}
                  placeholder="Écrivez vos notes ici... Indices, mystères, objectifs, rencontres importantes..."
                  className="w-full min-h-[200px] p-4 bg-cosmic-void border border-aged-gold rounded-lg text-bone-white placeholder-aged-parchment/50 resize-y focus:outline-none focus:border-aged-gold/70"
                />
                {notesModified && (
                  <div className="absolute top-2 right-2">
                    <Button
                      size="sm"
                      onClick={saveNotes}
                      disabled={updateNotesMutation.isPending}
                      className="bg-eldritch-green hover:bg-green-800 text-bone-white"
                    >
                      {updateNotesMutation.isPending ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      <span className="ml-2">Sauvegarder</span>
                    </Button>
                  </div>
                )}
              </div>
              <p className="text-aged-parchment text-sm">
                Ces notes sont privées et ne sont visibles que par vous et le Maître de Jeu. Sauvegarde automatique
                après 2 secondes d&apos;inactivité.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Avatar Customization Dialog */}
      <Dialog open={showAvatarDialog} onOpenChange={setShowAvatarDialog}>
        <DialogContent className="bg-charcoal border-aged-gold max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-cinzel text-aged-gold flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Personnaliser le portrait
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-aged-parchment">Genre</label>
                <Select
                  value={avatarSettings.gender}
                  onValueChange={(value) => setAvatarSettings({ ...avatarSettings, gender: value })}
                >
                  <SelectTrigger className="bg-cosmic-void border-aged-gold text-bone-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-charcoal border-aged-gold">
                    <SelectItem value="male">Homme</SelectItem>
                    <SelectItem value="female">Femme</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-aged-parchment">Âge</label>
                <Select
                  value={avatarSettings.age}
                  onValueChange={(value) => setAvatarSettings({ ...avatarSettings, age: value })}
                >
                  <SelectTrigger className="bg-cosmic-void border-aged-gold text-bone-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-charcoal border-aged-gold">
                    <SelectItem value="young">Jeune (18-25)</SelectItem>
                    <SelectItem value="adult">Adulte (26-40)</SelectItem>
                    <SelectItem value="middle">Âge mûr (41-60)</SelectItem>
                    <SelectItem value="elderly">Âgé (60+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowAvatarDialog(false)}
                className="border-aged-gold text-aged-gold hover:bg-aged-gold hover:text-deep-black"
              >
                Annuler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
