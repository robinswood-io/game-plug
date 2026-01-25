"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Sparkles, User, Mail, Lock } from "lucide-react";
import { gmSignupSchema } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { AuthenticationService } from "@/lib/api-client";
import type { z } from "zod";

type SignupForm = z.infer<typeof gmSignupSchema>;

export default function GMSignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignupForm>({
    resolver: zodResolver(gmSignupSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    },
  });

  const signupMutation = useMutation({
    mutationFn: (data: SignupForm) => AuthenticationService.authControllerSignup(data),
    onSuccess: async (response: any) => {
      // Store token if returned
      if (response?.access_token) {
        localStorage.setItem('auth_token', response.access_token);
        // SET COOKIE for Middleware
        document.cookie = `auth-token=${response.access_token}; path=/; max-age=86400; SameSite=Strict`;
      }

      toast({
        title: "Compte créé avec succès !",
        description: "Vous êtes maintenant connecté en tant que Maître de Jeu.",
        variant: "default",
      });

      // Navigate immediately
      router.push("/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Erreur lors de l'inscription",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SignupForm) => {
    signupMutation.mutate(data);
  };

  const handleDevLogin = async () => {
    try {
      const response = await fetch("/api/auth/dev-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "gm@example.com" }),
      });

      if (!response.ok) throw new Error("Dev login failed");

      const data = await response.json();
      localStorage.setItem("auth_token", data.access_token);
      document.cookie = `auth-token=${data.access_token}; path=/; max-age=86400; SameSite=Strict`;

      toast({
        title: "Dev Login",
        description: "Connecté en mode développement",
        variant: "default",
      });

      router.push("/dashboard");
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de se connecter en mode dev",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-cosmic-void text-aged-parchment relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cosmic-void via-charcoal to-cosmic-void"></div>
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-64 h-64 bg-eldritch-green rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-blood-burgundy rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md bg-charcoal border-aged-gold shadow-2xl eldritch-glow">
          <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-aged-gold/20 border border-aged-gold">
                <Sparkles className="h-8 w-8 text-aged-gold" />
              </div>
            </div>
            <CardTitle className="text-2xl font-cinzel text-aged-gold">
              Inscription Maître de Jeu
            </CardTitle>
            <CardDescription className="text-aged-parchment font-source">
              Créez votre compte pour diriger des sessions Call of Cthulhu
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Prénom */}
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium text-aged-parchment">
                  <User className="inline h-4 w-4 mr-2" />
                  Prénom
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  {...form.register("firstName")}
                  className="bg-cosmic-void border-aged-gold text-aged-parchment placeholder-aged-parchment/50"
                  placeholder="Votre prénom"
                  data-testid="input-firstname"
                />
                {form.formState.errors.firstName && (
                  <p className="text-xs text-blood-burgundy">
                    {form.formState.errors.firstName.message}
                  </p>
                )}
              </div>

              {/* Nom */}
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium text-aged-parchment">
                  <User className="inline h-4 w-4 mr-2" />
                  Nom
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  {...form.register("lastName")}
                  className="bg-cosmic-void border-aged-gold text-aged-parchment placeholder-aged-parchment/50"
                  placeholder="Votre nom"
                  data-testid="input-lastname"
                />
                {form.formState.errors.lastName && (
                  <p className="text-xs text-blood-burgundy">
                    {form.formState.errors.lastName.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-aged-parchment">
                  <Mail className="inline h-4 w-4 mr-2" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  className="bg-cosmic-void border-aged-gold text-aged-parchment placeholder-aged-parchment/50"
                  placeholder="votre@email.com"
                  data-testid="input-email"
                />
                {form.formState.errors.email && (
                  <p className="text-xs text-blood-burgundy">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              {/* Mot de passe */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-aged-parchment">
                  <Lock className="inline h-4 w-4 mr-2" />
                  Mot de passe
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...form.register("password")}
                    className="bg-cosmic-void border-aged-gold text-aged-parchment placeholder-aged-parchment/50 pr-12"
                    placeholder="Min. 8 caractères"
                    data-testid="input-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    data-testid="button-toggle-password"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-aged-parchment" />
                    ) : (
                      <Eye className="h-4 w-4 text-aged-parchment" />
                    )}
                  </Button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-xs text-blood-burgundy">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={signupMutation.isPending}
                className="w-full bg-blood-burgundy hover:bg-dark-crimson text-bone-white font-source py-3 mt-6"
                data-testid="button-signup"
              >
                {signupMutation.isPending ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Création du compte...
                  </div>
                ) : (
                  "Créer mon compte GM"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-aged-parchment">
                Déjà un compte ?{" "}
                <Button
                  variant="link"
                  className="text-aged-gold hover:text-eldritch-green p-0 h-auto font-normal"
                  onClick={() => router.push("/gm-login")}
                  data-testid="link-login"
                >
                  Se connecter
                </Button>
              </p>

              {process.env.NODE_ENV === 'development' && (
                <p className="text-xs text-eldritch-green/80 font-source pt-2 border-t border-aged-gold/20">
                  <Button
                    variant="link"
                    className="text-eldritch-green hover:text-aged-gold p-0 h-auto font-normal text-xs"
                    onClick={handleDevLogin}
                    data-testid="button-dev-login"
                  >
                    🔧 Dev Login (Mode Développement)
                  </Button>
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
