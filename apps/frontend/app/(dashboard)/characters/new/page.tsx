'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { CharactersService, AiService } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';
import { rollCharacteristics, calculateDerivedStats } from '@/lib/dice';
import {
  OCCUPATIONS,
  DEFAULT_SKILLS,
  calculateOccupationPoints,
  SKILL_TRANSLATIONS,
} from '@/lib/cthulhu-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dice6, Wand2, Save, X, AlertCircle, Info } from 'lucide-react';
import type { InsertCharacter } from '@shared/schema';
import NextImage from "next/image";

const characterCreationSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  occupation: z.string().min(1, 'Veuillez sélectionner une occupation'),
  age: z.coerce.number().min(15, "L'âge minimum est 15 ans").max(99, "L'âge maximum est 99 ans"),
  birthplace: z.string().optional(),
  residence: z.string().optional(),
  gender: z.string().optional(),
  sessionId: z.string().optional(),
});

type CharacterCreationForm = z.infer<typeof characterCreationSchema>;

export default function CharacterCreationPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [characteristics, setCharacteristics] = useState(rollCharacteristics());
  const [sessionId, setSessionId] = useState<string | undefined>();

  // Get sessionId from localStorage if available
  useEffect(() => {
    const storedSessionId = localStorage.getItem('createCharacterForSession');
    if (storedSessionId) {
      setSessionId(storedSessionId);
      console.log('Creating character for session:', storedSessionId);
    }
  }, []);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
  const [selectedOccupation, setSelectedOccupation] = useState<string>('');
  const [skillPoints, setSkillPoints] = useState<Record<string, number>>({});
  const [allocatedPoints, setAllocatedPoints] = useState<Record<string, number>>({});
  const [manualSkillMode, setManualSkillMode] = useState(false);
  const [availableOccupationPoints, setAvailableOccupationPoints] = useState(0);
  const [availablePersonalPoints, setAvailablePersonalPoints] = useState(0);
  const [usedOccupationPoints, setUsedOccupationPoints] = useState(0);
  const [usedPersonalPoints, setUsedPersonalPoints] = useState(0);
  const [physicalTraits, setPhysicalTraits] = useState({
    height: '',
    weight: '',
    hairColor: '',
    eyeColor: '',
    build: '',
    style: '',
    distinctiveFeatures: [] as string[],
  });

  const form = useForm<CharacterCreationForm>({
    resolver: zodResolver(characterCreationSchema),
    defaultValues: {
      name: '',
      occupation: '',
      age: 25,
      birthplace: '',
      residence: '',
      gender: '',
      sessionId: '',
    },
  });

  // Initialize skills with defaults
  useEffect(() => {
    const baseSkills = { ...DEFAULT_SKILLS };
    baseSkills.dodge = Math.floor(characteristics.dexterity / 2);
    baseSkills.language_own = characteristics.education;
    setSkillPoints(baseSkills);
    setAllocatedPoints({});
    setAvailablePersonalPoints(characteristics.intelligence * 2);
  }, [characteristics]);


  // Calculate used points
  useEffect(() => {
    let occUsed = 0;
    let persUsed = 0;

    const occupation = OCCUPATIONS.find((occ) => occ.name === selectedOccupation);
    const occupationSkills = occupation?.occupationSkills || [];

    Object.entries(allocatedPoints).forEach(([skill, points]) => {
      if (occupationSkills.includes(skill)) {
        occUsed += points;
      } else {
        persUsed += points;
      }
    });

    setUsedOccupationPoints(occUsed);
    setUsedPersonalPoints(persUsed);
  }, [allocatedPoints, selectedOccupation]);

  const updateSkillTotals = useCallback((allocations: Record<string, number>) => {
    const baseSkills = { ...DEFAULT_SKILLS };
    baseSkills.dodge = Math.floor(characteristics.dexterity / 2);
    baseSkills.language_own = characteristics.education;

    const finalSkills = { ...baseSkills };
    Object.entries(allocations).forEach(([skill, points]) => {
      finalSkills[skill] = Math.min((baseSkills[skill] || 0) + points, 90);
    });

    setSkillPoints(finalSkills);
  }, [characteristics]);

  const autoAllocateSkills = useCallback((occupation: typeof OCCUPATIONS[0], totalPoints: number) => {
    const newAllocations: Record<string, number> = {};
    const baseSkills = { ...DEFAULT_SKILLS };
    baseSkills.dodge = Math.floor(characteristics.dexterity / 2);
    baseSkills.language_own = characteristics.education;

    const age = form.getValues('age') || 21;

    let ageBonus = 0;
    if (age >= 40 && age < 50) {
      ageBonus = 10;
    } else if (age >= 50 && age < 60) {
      ageBonus = 20;
    } else if (age >= 60) {
      ageBonus = 30;
    }

    const skillPriorities: Record<string, number> = {};
    occupation.occupationSkills.forEach((skill, index) => {
      skillPriorities[skill] = index < 4 ? 2 : 1;
    });

    const totalWeight = Object.values(skillPriorities).reduce((sum, weight) => sum + weight, 0);

    const adjustedTotalPoints = totalPoints + ageBonus;
    occupation.occupationSkills.forEach((skill) => {
      const baseValue = baseSkills[skill] || 0;
      const weight = skillPriorities[skill];
      const points = Math.floor((adjustedTotalPoints * weight) / totalWeight);
      newAllocations[skill] = Math.min(points, 90 - baseValue);
    });

    const personalPoints = characteristics.intelligence * 2;
    const recommendedSkills = occupation.recommendedSkills || [];

    const essentialSkills = ['listen', 'spot_hidden', 'psychology'];
    if (age >= 30) {
      essentialSkills.push('credit_rating');
    }

    const allPersonalSkills = Array.from(new Set([...recommendedSkills, ...essentialSkills]));

    if (allPersonalSkills.length > 0) {
      const recommendedPoints = Math.floor(personalPoints * 0.6);
      const essentialPoints = personalPoints - recommendedPoints;

      if (recommendedSkills.length > 0) {
        const pointsPerRecommended = Math.floor(recommendedPoints / recommendedSkills.length);
        recommendedSkills.forEach((skill) => {
          const currentAllocation = newAllocations[skill] || 0;
          const baseValue = baseSkills[skill] || 0;
          const maxAdditional = 90 - baseValue - currentAllocation;
          newAllocations[skill] = currentAllocation + Math.min(pointsPerRecommended, maxAdditional);
        });
      }

      const pointsPerEssential = Math.floor(essentialPoints / essentialSkills.length);
      essentialSkills.forEach((skill) => {
        const currentAllocation = newAllocations[skill] || 0;
        const baseValue = baseSkills[skill] || 0;
        const maxAdditional = 90 - baseValue - currentAllocation;
        const additionalPoints = Math.min(pointsPerEssential, maxAdditional);
        if (additionalPoints > 0) {
          newAllocations[skill] = currentAllocation + additionalPoints;
        }
      });
    }

    setAllocatedPoints(newAllocations);
    updateSkillTotals(newAllocations);
  }, [characteristics, form, updateSkillTotals]);

  // Update occupation points when occupation changes
  useEffect(() => {
    if (selectedOccupation) {
      const occupation = OCCUPATIONS.find((occ) => occ.name === selectedOccupation);
      if (occupation) {
        const points = calculateOccupationPoints(occupation.skillPointsFormula, characteristics);
        setAvailableOccupationPoints(points);

        if (!manualSkillMode) {
          autoAllocateSkills(occupation, points);
        }
      }
    }
  }, [selectedOccupation, characteristics, manualSkillMode, autoAllocateSkills]);

  // Update form when sessionId is loaded from localStorage
  useEffect(() => {
    if (sessionId) {
      form.setValue('sessionId', sessionId);
    }
  }, [sessionId, form]);

  const createCharacterMutation = useMutation({
    mutationFn: (data: any) => CharactersService.charactersControllerCreate(data),
    onSuccess: (character: any) => {
      toast({
        title: 'Personnage créé',
        description: `${character.name} a été créé avec succès.`,
      });

      // Clear the stored sessionId and redirect appropriately
      const createdForSession = localStorage.getItem('createCharacterForSession');
      if (createdForSession) {
        localStorage.removeItem('createCharacterForSession');
        router.push(`/sessions/${createdForSession}`);
      } else {
        router.push(`/characters/${character.id}`);
      }
    },
    onError: (error: any) => {
      console.error('Character creation error:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de créer le personnage.',
        variant: 'destructive',
      });
    },
  });

  const handleRollCharacteristics = () => {
    setCharacteristics(rollCharacteristics());
    toast({
      title: 'Caractéristiques lancées',
      description: 'Nouvelles valeurs générées selon les règles de la 7e édition.',
    });
  };

  const handleGenerateAvatar = async () => {
    try {
      setIsGeneratingAvatar(true);
      const characterName = form.getValues('name');
      const occupation = form.getValues('occupation');
      const age = form.getValues('age') || 25;
      const gender = form.getValues('gender') || '';

      // Determine age category from numeric age
      let ageCategory = 'adult';
      if (age <= 25) ageCategory = 'young';
      else if (age <= 40) ageCategory = 'adult';
      else if (age <= 60) ageCategory = 'middle';
      else ageCategory = 'elderly';

      const response = await AiService.aiControllerGenerateAvatar({
        characterName,
        occupation,
        age: ageCategory,
        gender: gender || 'male',
        physicalDescription: physicalTraits.distinctiveFeatures.join(', ') || undefined,
        styleHints: physicalTraits.style || '1920s',
      });

      if (response?.imageUrl) {
        setAvatarUrl(response.imageUrl);
        toast({
          title: 'Portrait généré',
          description: 'Le portrait AI de votre personnage a été créé avec succès.',
        });
      } else {
        throw new Error('No image URL returned');
      }
    } catch (error: any) {
      toast({
        title: 'Erreur de génération',
        description: error.message || 'Impossible de générer le portrait AI.',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingAvatar(false);
    }
  };

  const onSubmit = (data: CharacterCreationForm) => {
    const derivedStats = calculateDerivedStats(characteristics);
    const occupation = OCCUPATIONS.find((occ) => occ.name === data.occupation);

    let finalSessionId = data.sessionId;
    if (finalSessionId === 'none' || !finalSessionId) {
      // Generate a default session ID or use a placeholder
      // For now, we'll use a special UUID to indicate "no session"
      finalSessionId = undefined;
    }

    const characterData = {
      name: data.name,
      occupation: data.occupation,
      age: typeof data.age === 'number' ? data.age : 25,
      birthplace: data.birthplace || '',
      residence: data.residence || '',
      gender: data.gender || '',

      height: physicalTraits.height ? physicalTraits.height : undefined,
      build: physicalTraits.build ? physicalTraits.build : undefined,
      hairColor: physicalTraits.hairColor ? physicalTraits.hairColor : undefined,
      eyeColor: physicalTraits.eyeColor ? physicalTraits.eyeColor : undefined,

      sessionId: finalSessionId,
      userId: '',

      strength: characteristics.strength,
      constitution: characteristics.constitution,
      size: characteristics.size,
      dexterity: characteristics.dexterity,
      appearance: characteristics.appearance,
      intelligence: characteristics.intelligence,
      power: characteristics.power,
      education: characteristics.education,
      luck: characteristics.luck,

      hitPoints: derivedStats.hitPoints,
      maxHitPoints: derivedStats.hitPoints,
      sanity: derivedStats.sanity,
      maxSanity: derivedStats.maxSanity,
      magicPoints: derivedStats.magicPoints,
      maxMagicPoints: derivedStats.magicPoints,

      skills: skillPoints,

      avatarUrl: avatarUrl || undefined,
      isActive: true,

      money: '50.00',
    };

    createCharacterMutation.mutate(characterData);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="font-cinzel text-4xl font-bold text-aged-gold mb-2">Création d&apos;Investigateur</h1>
        <p className="font-crimson text-lg text-aged-parchment">
          Donnez naissance à celui qui défiera les ténèbres cosmiques
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <Card className="bg-charcoal border-aged-gold parchment-bg">
            <CardHeader>
              <CardTitle className="font-cinzel text-aged-gold">Informations de Base</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-aged-parchment font-source">Nom du Personnage</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-cosmic-void border-aged-gold text-bone-white"
                          placeholder="Dr. Marcus Whitmore"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="occupation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-aged-parchment font-source">Occupation</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedOccupation(value);
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-cosmic-void border-aged-gold text-bone-white">
                            <SelectValue placeholder="Sélectionnez une occupation" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-cosmic-void border-aged-gold">
                          {OCCUPATIONS.map((occupation) => (
                            <SelectItem key={occupation.name} value={occupation.name}>
                              {occupation.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-aged-parchment font-source">Âge</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min={15}
                          max={99}
                          className="bg-cosmic-void border-aged-gold text-bone-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="birthplace"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-aged-parchment font-source">Lieu de naissance</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-cosmic-void border-aged-gold text-bone-white"
                          placeholder="Boston, MA"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="residence"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-aged-parchment font-source">Résidence</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-cosmic-void border-aged-gold text-bone-white"
                          placeholder="Arkham, MA"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Characteristics */}
          <Card className="bg-charcoal border-aged-gold parchment-bg">
            <CardHeader>
              <CardTitle className="font-cinzel text-aged-gold flex justify-between items-center">
                Caractéristiques
                <Button
                  type="button"
                  onClick={handleRollCharacteristics}
                  className="bg-blood-burgundy hover:bg-dark-crimson text-bone-white"
                >
                  <Dice6 className="mr-2 h-4 w-4" />
                  Relancer
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(characteristics).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="text-xs font-source text-aged-parchment mb-1 uppercase">
                      {key === 'strength' && 'Force (FOR)'}
                      {key === 'constitution' && 'Constitution (CON)'}
                      {key === 'size' && 'Taille (TAI)'}
                      {key === 'dexterity' && 'Dextérité (DEX)'}
                      {key === 'appearance' && 'Apparence (APP)'}
                      {key === 'intelligence' && 'Intelligence (INT)'}
                      {key === 'power' && 'Pouvoir (POU)'}
                      {key === 'education' && 'Éducation (EDU)'}
                      {key === 'luck' && 'Chance (CHA)'}
                    </div>
                    <div className="bg-cosmic-void border border-aged-gold rounded px-2 py-3">
                      <div className="text-lg font-bold text-bone-white">{value}</div>
                      <div className="text-xs text-aged-parchment">
                        {key === 'size' || key === 'intelligence' || key === 'education' ? '(2d6+6)×5' : '3d6×5'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Skills Allocation */}
          <Card
            className={`bg-charcoal parchment-bg ${
              selectedOccupation ? 'border-aged-gold' : 'border-2 border-blood-burgundy'
            }`}
          >
            <CardHeader>
              <CardTitle className="font-cinzel text-aged-gold flex justify-between items-center">
                <span className="flex items-center gap-2">
                  Compétences
                  {!selectedOccupation && (
                    <Badge
                      variant="outline"
                      className="border-blood-burgundy text-blood-burgundy animate-pulse"
                    >
                      Sélectionnez une occupation d&apos;abord
                    </Badge>
                  )}
                </span>
                {selectedOccupation && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-source text-aged-parchment">
                      {manualSkillMode ? 'Allocation Manuelle' : 'Allocation Automatique'}
                    </span>
                    <Switch
                      checked={manualSkillMode}
                      onCheckedChange={(checked) => {
                        setManualSkillMode(checked);
                        if (!checked) {
                          const occupation = OCCUPATIONS.find((occ) => occ.name === selectedOccupation);
                          if (occupation) {
                            const points = calculateOccupationPoints(occupation.skillPointsFormula, characteristics);
                            autoAllocateSkills(occupation, points);
                          }
                        }
                      }}
                      className="data-[state=checked]:bg-aged-gold"
                    />
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!selectedOccupation ? (
                <Alert className="bg-cosmic-void border-blood-burgundy">
                  <AlertCircle className="h-4 w-4 text-blood-burgundy" />
                  <AlertDescription className="text-aged-parchment">
                    <strong className="text-bone-white">Étape requise:</strong> Sélectionnez une occupation pour
                    débloquer la répartition des compétences.
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-cosmic-void rounded-lg p-4 border border-aged-gold">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-source text-aged-parchment">Points d&apos;Occupation</span>
                        <span
                          className={`text-sm font-bold ${
                            usedOccupationPoints > availableOccupationPoints
                              ? 'text-red-600'
                              : usedOccupationPoints === availableOccupationPoints
                                ? 'text-green-500'
                                : 'text-aged-gold'
                          }`}
                        >
                          {usedOccupationPoints} / {availableOccupationPoints}
                        </span>
                      </div>
                      <Progress
                        value={(usedOccupationPoints / availableOccupationPoints) * 100}
                        className="h-2 bg-deep-black"
                      />
                    </div>

                    <div className="bg-cosmic-void rounded-lg p-4 border border-aged-gold">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-source text-aged-parchment">Points d&apos;Intérêts Personnels</span>
                        <span
                          className={`text-sm font-bold ${
                            usedPersonalPoints > availablePersonalPoints
                              ? 'text-red-600'
                              : usedPersonalPoints === availablePersonalPoints
                                ? 'text-green-500'
                                : 'text-aged-gold'
                          }`}
                        >
                          {usedPersonalPoints} / {availablePersonalPoints}
                        </span>
                      </div>
                      <Progress
                        value={(usedPersonalPoints / availablePersonalPoints) * 100}
                        className="h-2 bg-deep-black"
                      />
                    </div>
                  </div>

                  <Alert className="bg-cosmic-void border-aged-gold">
                    <Info className="h-4 w-4 text-aged-gold" />
                    <AlertDescription className="text-aged-parchment">
                      <strong className="text-bone-white">Compétences d&apos;occupation:</strong>
                      {' ' +
                        (OCCUPATIONS.find((occ) => occ.name === selectedOccupation)?.occupationSkills
                          .map(
                            (skill) =>
                              SKILL_TRANSLATIONS[skill] ||
                              skill.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
                          )
                          .join(', ') || 'Aucune')}
                    </AlertDescription>
                  </Alert>

                  <div className="grid md:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-2">
                    {Object.entries(skillPoints)
                      .sort(([keyA], [keyB]) => {
                        const nameA =
                          SKILL_TRANSLATIONS[keyA] ||
                          keyA.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
                        const nameB =
                          SKILL_TRANSLATIONS[keyB] ||
                          keyB.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
                        return nameA.localeCompare(nameB, 'fr');
                      })
                      .map(([skillKey, value]) => {
                        const skillName =
                          SKILL_TRANSLATIONS[skillKey] ||
                          skillKey.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
                        const baseValue = DEFAULT_SKILLS[skillKey] || 0;

                        return (
                          <div
                            key={skillKey}
                            className="bg-cosmic-void rounded p-2 border border-aged-gold/50"
                          >
                            <div className="font-source text-sm text-bone-white">{skillName}</div>
                            <div className="text-xs text-aged-parchment">{value}%</div>
                          </div>
                        );
                      })}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Avatar Generation */}
          <Card className="bg-charcoal border-aged-gold parchment-bg">
            <CardHeader>
              <CardTitle className="font-cinzel text-aged-gold">Portrait du Personnage</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="selectors" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-cosmic-void border-aged-gold">
                  <TabsTrigger
                    value="selectors"
                    className="text-bone-white data-[state=active]:bg-aged-gold data-[state=active]:text-deep-black"
                  >
                    Sélecteurs Intuitifs
                  </TabsTrigger>
                  <TabsTrigger
                    value="description"
                    className="text-bone-white data-[state=active]:bg-aged-gold data-[state=active]:text-deep-black"
                  >
                    Description Libre
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="selectors" className="space-y-6 mt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {/* Physical Traits */}
                      <div className="space-y-3">
                        <h4 className="font-cinzel text-aged-gold text-sm uppercase tracking-wide">
                          Caractéristiques Physiques
                        </h4>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-aged-parchment text-xs">Taille</Label>
                            <Select
                              value={physicalTraits.height}
                              onValueChange={(value) =>
                                setPhysicalTraits((prev) => ({ ...prev, height: value }))
                              }
                            >
                              <SelectTrigger className="bg-cosmic-void border-aged-gold text-bone-white h-9">
                                <SelectValue placeholder="Choisir" />
                              </SelectTrigger>
                              <SelectContent className="bg-cosmic-void border-aged-gold">
                                <SelectItem value="très petit(e) (moins d'1m50)">Très petit(e)</SelectItem>
                                <SelectItem value="petit(e) (1m50-1m60)">Petit(e)</SelectItem>
                                <SelectItem value="de taille moyenne (1m60-1m70)">Moyen(ne)</SelectItem>
                                <SelectItem value="grand(e) (1m70-1m80)">Grand(e)</SelectItem>
                                <SelectItem value="très grand(e) (plus d'1m80)">Très grand(e)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label className="text-aged-parchment text-xs">Corpulence</Label>
                            <Select
                              value={physicalTraits.build}
                              onValueChange={(value) =>
                                setPhysicalTraits((prev) => ({ ...prev, build: value }))
                              }
                            >
                              <SelectTrigger className="bg-cosmic-void border-aged-gold text-bone-white h-9">
                                <SelectValue placeholder="Choisir" />
                              </SelectTrigger>
                              <SelectContent className="bg-cosmic-void border-aged-gold">
                                <SelectItem value="très mince">Très mince</SelectItem>
                                <SelectItem value="mince">Mince</SelectItem>
                                <SelectItem value="de corpulence moyenne">Moyenne</SelectItem>
                                <SelectItem value="corpulent(e)">Corpulent(e)</SelectItem>
                                <SelectItem value="imposant(e)">Imposant(e)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-aged-parchment text-xs">Cheveux</Label>
                            <Select
                              value={physicalTraits.hairColor}
                              onValueChange={(value) =>
                                setPhysicalTraits((prev) => ({ ...prev, hairColor: value }))
                              }
                            >
                              <SelectTrigger className="bg-cosmic-void border-aged-gold text-bone-white h-9">
                                <SelectValue placeholder="Couleur" />
                              </SelectTrigger>
                              <SelectContent className="bg-cosmic-void border-aged-gold">
                                <SelectItem value="noirs">Noirs</SelectItem>
                                <SelectItem value="bruns foncés">Bruns foncés</SelectItem>
                                <SelectItem value="châtains">Châtains</SelectItem>
                                <SelectItem value="blonds">Blonds</SelectItem>
                                <SelectItem value="roux">Roux</SelectItem>
                                <SelectItem value="gris">Gris</SelectItem>
                                <SelectItem value="blancs">Blancs</SelectItem>
                                <SelectItem value="chauve">Chauve</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label className="text-aged-parchment text-xs">Yeux</Label>
                            <Select
                              value={physicalTraits.eyeColor}
                              onValueChange={(value) =>
                                setPhysicalTraits((prev) => ({ ...prev, eyeColor: value }))
                              }
                            >
                              <SelectTrigger className="bg-cosmic-void border-aged-gold text-bone-white h-9">
                                <SelectValue placeholder="Couleur" />
                              </SelectTrigger>
                              <SelectContent className="bg-cosmic-void border-aged-gold">
                                <SelectItem value="bruns">Bruns</SelectItem>
                                <SelectItem value="bleus">Bleus</SelectItem>
                                <SelectItem value="verts">Verts</SelectItem>
                                <SelectItem value="noisette">Noisette</SelectItem>
                                <SelectItem value="gris">Gris</SelectItem>
                                <SelectItem value="noirs">Noirs</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* Style vestimentaire */}
                      <div className="space-y-3">
                        <h4 className="font-cinzel text-aged-gold text-sm uppercase tracking-wide">
                          Style Vestimentaire (Années 1920)
                        </h4>

                        <Select
                          value={physicalTraits.style}
                          onValueChange={(value) => setPhysicalTraits((prev) => ({ ...prev, style: value }))}
                        >
                          <SelectTrigger className="bg-cosmic-void border-aged-gold text-bone-white">
                            <SelectValue placeholder="Choisir un style d'époque" />
                          </SelectTrigger>
                          <SelectContent className="bg-cosmic-void border-aged-gold">
                            <SelectItem value="gentleman élégant en costume trois-pièces">Gentleman élégant</SelectItem>
                            <SelectItem value="flapper moderne avec robe courte">Flapper moderne</SelectItem>
                            <SelectItem value="bourgeois conservateur">Bourgeois conservateur</SelectItem>
                            <SelectItem value="universitaire en tweed">Universitaire</SelectItem>
                            <SelectItem value="ouvrier en vêtements pratiques">Ouvrier</SelectItem>
                            <SelectItem value="dandy sophistiqué">Dandy sophistiqué</SelectItem>
                            <SelectItem value="dame de la haute société">Dame de société</SelectItem>
                            <SelectItem value="bohème artistique">Bohème artistique</SelectItem>
                            <SelectItem value="aventurier en tenue de voyage">Aventurier</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Signes distinctifs */}
                      <div className="space-y-3">
                        <h4 className="font-cinzel text-aged-gold text-sm uppercase tracking-wide">Signes Distinctifs</h4>

                        <div className="grid grid-cols-1 gap-2">
                          {[
                            'Cicatrice visible',
                            'Lunettes',
                            'Moustache',
                            'Barbe',
                            'Tatouage',
                            'Canne de marche',
                            'Bijoux voyants',
                            'Regard perçant',
                            'Sourire énigmatique',
                            'Tic nerveux',
                            'Démarche particulière',
                          ].map((feature) => (
                            <div key={feature} className="flex items-center space-x-2">
                              <Checkbox
                                id={feature}
                                checked={physicalTraits.distinctiveFeatures.includes(feature)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setPhysicalTraits((prev) => ({
                                      ...prev,
                                      distinctiveFeatures: [...prev.distinctiveFeatures, feature],
                                    }));
                                  } else {
                                    setPhysicalTraits((prev) => ({
                                      ...prev,
                                      distinctiveFeatures: prev.distinctiveFeatures.filter((f) => f !== feature),
                                    }));
                                  }
                                }}
                                className="border-aged-gold data-[state=checked]:bg-aged-gold"
                              />
                              <Label htmlFor={feature} className="text-aged-parchment text-sm cursor-pointer">
                                {feature}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Portrait Preview */}
                    <div className="flex justify-center">
                      <div className="w-48 h-48 bg-cosmic-void border border-aged-gold rounded-lg flex items-center justify-center">
                        {avatarUrl ? (
                          <NextImage src={avatarUrl} alt="Portrait du personnage" width={192} height={192} unoptimized className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <div className="text-center text-aged-parchment">
                            <Wand2 className="mx-auto h-12 w-12 mb-2" />
                            <p className="text-sm">Portrait à générer</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={handleGenerateAvatar}
                    disabled={isGeneratingAvatar}
                    className="w-full bg-eldritch-green hover:bg-green-800 text-bone-white"
                  >
                    <Wand2 className="mr-2 h-4 w-4" />
                    {isGeneratingAvatar ? 'Génération...' : 'Générer le Portrait IA'}
                  </Button>
                </TabsContent>

                <TabsContent value="description" className="space-y-4 mt-6">
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-aged-parchment font-source">Genre</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ''}>
                          <FormControl>
                            <SelectTrigger className="bg-cosmic-void border-aged-gold text-bone-white">
                              <SelectValue placeholder="Sélectionnez un genre" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-cosmic-void border-aged-gold">
                            <SelectItem value="Homme">Homme</SelectItem>
                            <SelectItem value="Femme">Femme</SelectItem>
                            <SelectItem value="Autre">Autre</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-aged-parchment font-source">Âge (optionnel pour rappel)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min={15}
                            max={99}
                            disabled
                            className="bg-cosmic-void border-aged-gold text-bone-white opacity-75"
                          />
                        </FormControl>
                        <div className="text-xs text-aged-parchment mt-1">
                          L&apos;âge saisi dans les informations de base sera utilisé pour la génération du portrait.
                        </div>
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Final Warning before saving */}
          <Alert className="bg-cosmic-void border-aged-gold">
            <Info className="h-4 w-4 text-aged-gold" />
            <AlertDescription className="text-aged-parchment">
              <strong className="text-bone-white">Rappel:</strong> Les compétences seront verrouillées après la
              création du personnage et ne pourront plus être modifiées.
            </AlertDescription>
          </Alert>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/')}
              className="border-aged-gold text-bone-white hover:bg-dark-stone"
            >
              <X className="mr-2 h-4 w-4" />
              Annuler
            </Button>

            <Button
              type="submit"
              disabled={createCharacterMutation.isPending}
              className="bg-blood-burgundy hover:bg-dark-crimson text-bone-white"
            >
              <Save className="mr-2 h-4 w-4" />
              {createCharacterMutation.isPending ? 'Sauvegarde...' : 'Sauvegarder le Personnage'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
