'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { z } from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { CharactersService } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Dice6, Wand2, Save, ArrowLeft, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const characterEditSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  occupation: z.string().min(1, 'Veuillez sélectionner une occupation'),
  age: z.coerce.number().min(15, "L'âge minimum est 15 ans").max(99, "L'âge maximum est 99 ans"),
  birthplace: z.string().optional(),
  residence: z.string().optional(),
  gender: z.string().optional(),
  strength: z.coerce.number().min(1).max(100),
  constitution: z.coerce.number().min(1).max(100),
  size: z.coerce.number().min(1).max(100),
  dexterity: z.coerce.number().min(1).max(100),
  appearance: z.coerce.number().min(1).max(100),
  intelligence: z.coerce.number().min(1).max(100),
  power: z.coerce.number().min(1).max(100),
  education: z.coerce.number().min(1).max(100),
  luck: z.coerce.number().min(1).max(100),
  hitPoints: z.coerce.number().min(0),
  maxHitPoints: z.coerce.number().min(1),
  sanity: z.coerce.number().min(0),
  maxSanity: z.coerce.number().min(1),
  magicPoints: z.coerce.number().min(0),
  maxMagicPoints: z.coerce.number().min(1),
  money: z.coerce.number().min(0).optional(),
});

type CharacterEditForm = z.infer<typeof characterEditSchema>;

/**
 * Character Edit Page
 * Allows GM to edit existing character
 */
export default function CharacterEditPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const characterId = params.id as string;

  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [skillPoints, setSkillPoints] = useState<Record<string, number>>({});
  const [avatarDescription, setAvatarDescription] = useState('');

  // Fetch character data
  const { data: character, isLoading: characterLoading } = useQuery({
    queryKey: ['character', characterId],
    queryFn: () => CharactersService.charactersControllerFindOne(characterId),
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: any) =>
      CharactersService.charactersControllerUpdate(characterId, data),
    onSuccess: () => {
      toast({
        title: 'Personnage modifié',
        description: 'Les modifications ont été sauvegardées avec succès.',
      });
      router.push('/characters/' + characterId);
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de modifier le personnage.',
        variant: 'destructive',
      });
    },
  });

  const form = useForm<CharacterEditForm>({
    resolver: zodResolver(characterEditSchema),
    defaultValues: {
      name: '',
      occupation: '',
      age: 25,
      birthplace: '',
      residence: '',
      gender: '',
      strength: 50,
      constitution: 50,
      size: 60,
      dexterity: 50,
      appearance: 50,
      intelligence: 50,
      power: 50,
      education: 50,
      luck: 50,
      hitPoints: 10,
      maxHitPoints: 10,
      sanity: 50,
      maxSanity: 50,
      magicPoints: 10,
      maxMagicPoints: 10,
      money: 0,
    },
  });

  // Load character data into form
  useEffect(() => {
    if (character) {
      form.reset({
        name: character.name,
        occupation: character.occupation,
        age: character.age || 25,
        birthplace: character.birthplace || '',
        residence: character.residence || '',
        gender: character.gender || '',
        strength: character.strength,
        constitution: character.constitution,
        size: character.size,
        dexterity: character.dexterity,
        appearance: character.appearance,
        intelligence: character.intelligence,
        power: character.power,
        education: character.education,
        luck: character.luck,
        hitPoints: character.hitPoints,
        maxHitPoints: character.maxHitPoints,
        sanity: character.sanity,
        maxSanity: character.maxSanity,
        magicPoints: character.magicPoints,
        maxMagicPoints: character.maxMagicPoints,
        money: character.money ? parseFloat(character.money.toString()) : 0,
      });
      setAvatarUrl(character.avatarUrl || '');
      setSkillPoints((character.skills as Record<string, number>) || {});
    }
  }, [character, form]);

  const handleRecalculateDerived = () => {
    const characteristics = {
      strength: form.getValues('strength'),
      constitution: form.getValues('constitution'),
      size: form.getValues('size'),
      power: form.getValues('power'),
    };

    // Calculate derived stats (simplified)
    const maxHP = Math.floor((characteristics.constitution + characteristics.size) / 10);
    const maxMP = Math.floor(characteristics.power / 5);
    const maxSAN = characteristics.power;

    form.setValue('maxHitPoints', maxHP);
    form.setValue('maxSanity', maxSAN);
    form.setValue('maxMagicPoints', maxMP);
  };

  const onSubmit = (data: CharacterEditForm) => {
    updateMutation.mutate({
      ...data,
      money: data.money !== undefined ? data.money.toFixed(2) : undefined,
      skills: skillPoints,
      avatarUrl,
    });
  };

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
          <Button onClick={() => router.push('/')} className="bg-blood-burgundy hover:bg-dark-crimson text-bone-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au tableau de bord
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-cinzel text-3xl text-aged-gold">Édition du Personnage</h1>
        <Button
          onClick={() => router.push('/characters/' + characterId)}
          variant="outline"
          className="border-aged-gold text-bone-white hover:bg-dark-stone"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-charcoal border border-aged-gold">
              <TabsTrigger value="basic">Informations</TabsTrigger>
              <TabsTrigger value="characteristics">Caractéristiques</TabsTrigger>
              <TabsTrigger value="avatar">Portrait</TabsTrigger>
            </TabsList>

            {/* Basic Information */}
            <TabsContent value="basic">
              <Card className="bg-charcoal border-aged-gold parchment-bg">
                <CardHeader>
                  <CardTitle className="font-cinzel text-aged-gold">Informations de Base</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-aged-parchment font-source">Nom</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-cosmic-void border-aged-gold text-bone-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-aged-parchment font-source">Âge</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" className="bg-cosmic-void border-aged-gold text-bone-white" />
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
                        <FormControl>
                          <Input {...field} className="bg-cosmic-void border-aged-gold text-bone-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-aged-parchment font-source">Genre</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-cosmic-void border-aged-gold text-bone-white" />
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
                          <Input {...field} className="bg-cosmic-void border-aged-gold text-bone-white" />
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
                          <Input {...field} className="bg-cosmic-void border-aged-gold text-bone-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Characteristics */}
            <TabsContent value="characteristics">
              <Card className="bg-charcoal border-aged-gold parchment-bg">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="font-cinzel text-aged-gold">Caractéristiques</CardTitle>
                    <Button type="button" onClick={handleRecalculateDerived} variant="outline" size="sm" className="border-aged-gold text-bone-white">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Recalculer
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="grid md:grid-cols-3 gap-6">
                  {['strength', 'constitution', 'size', 'dexterity', 'appearance', 'intelligence', 'power', 'education', 'luck'].map((stat) => (
                    <FormField
                      key={stat}
                      control={form.control}
                      name={stat as keyof CharacterEditForm}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-aged-parchment font-source capitalize">{stat}</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" className="bg-cosmic-void border-aged-gold text-bone-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}

                  <FormField
                    control={form.control}
                    name="hitPoints"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-aged-parchment font-source">HP</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" className="bg-cosmic-void border-aged-gold text-bone-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maxHitPoints"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-aged-parchment font-source">Max HP</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" className="bg-cosmic-void border-aged-gold text-bone-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="money"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-aged-parchment font-source">Argent</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" step="0.01" className="bg-cosmic-void border-aged-gold text-bone-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Avatar */}
            <TabsContent value="avatar">
              <Card className="bg-charcoal border-aged-gold parchment-bg">
                <CardHeader>
                  <CardTitle className="font-cinzel text-aged-gold">Portrait du Personnage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {avatarUrl && (
                    <div className="flex justify-center mb-4">
                      <img src={avatarUrl} alt={character.name} className="w-64 h-64 rounded-lg border-2 border-aged-gold object-cover" />
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-aged-parchment font-source text-sm">Description pour AI</label>
                    <Textarea
                      value={avatarDescription}
                      onChange={(e) => setAvatarDescription(e.target.value)}
                      placeholder="Portrait 1920s style, investigateur, détective..."
                      className="bg-cosmic-void border-aged-gold text-bone-white"
                      rows={3}
                    />
                  </div>

                  <Button
                    type="button"
                    onClick={() => {}}
                    disabled={isGeneratingAvatar}
                    className="w-full bg-eldritch-green hover:bg-green-800 text-bone-white"
                  >
                    <Wand2 className="mr-2 h-4 w-4" />
                    {isGeneratingAvatar ? 'Génération en cours...' : 'Générer un Portrait AI'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.push('/characters/' + characterId)} className="border-aged-gold text-bone-white">
              Annuler
            </Button>
            <Button type="submit" disabled={updateMutation.isPending} className="bg-blood-burgundy hover:bg-dark-crimson text-bone-white">
              <Save className="mr-2 h-4 w-4" />
              {updateMutation.isPending ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
