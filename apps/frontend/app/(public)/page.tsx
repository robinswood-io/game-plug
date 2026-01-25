"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, LogIn, ShieldAlert, Skull, ScrollText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function LandingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleDevLogin = async (role: "gm" | "player") => {
    setIsLoading(true);
    try {
      const email = "gm@example.com"; 
      
      const response = await fetch("/api/auth/dev-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error("Dev login failed");

      const data = await response.json();
      
      localStorage.setItem("auth_token", data.access_token);
      document.cookie = `auth-token=${data.access_token}; path=/; max-age=86400; SameSite=Strict`;
      
      if (role === "player") {
        localStorage.setItem("current_session_code", "TEST01");
        toast({
          title: "Infiltration réussie",
          description: "Vous avez rejoint la session TEST01",
        });
        router.push("/play/TEST01");
      } else {
        toast({
          title: "Gardien éveillé",
          description: "Bienvenue, Maître de Jeu",
        });
        router.push("/dashboard");
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "L'Indicible résiste",
        description: "Échec de la connexion occulte",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cosmic-void text-bone-white parchment-bg overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')]"></div>
      </div>

      <div className="relative z-10 max-w-4xl w-full text-center space-y-12 animate-fade-in">
        <header className="space-y-4">
          <h1 className="text-7xl md:text-9xl font-cinzel font-bold text-aged-gold text-shadow-lg tracking-tighter glow-text">
            Game Plug
          </h1>
          <p className="text-xl md:text-3xl font-crimson italic text-aged-parchment animate-pulse-slow">
            "Le réveil des Grands Anciens est proche..."
          </p>
        </header>

        <main className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Main Actions */}
          <Card className="glass-card border-aged-gold/30 hover:border-aged-gold transition-all duration-500 group">
            <CardHeader>
              <Skull className="mx-auto h-12 w-12 text-aged-gold group-hover:text-blood-burgundy transition-colors" />
              <CardTitle className="font-cinzel text-aged-gold">Maître de Jeu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="font-source text-sm text-aged-parchment/80">
                Dirigez l'enquête, manipulez le destin et observez vos joueurs sombrer.
              </p>
              <Button 
                className="w-full btn-primary font-cinzel"
                onClick={() => router.push("/gm-login")}
              >
                Invoquer le Gardien
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card border-aged-gold/30 hover:border-aged-gold transition-all duration-500 group">
            <CardHeader>
              <Users className="mx-auto h-12 w-12 text-aged-gold group-hover:text-eldritch-green transition-colors" />
              <CardTitle className="font-cinzel text-aged-gold">Investigateur</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="font-source text-sm text-aged-parchment/80">
                Rejoignez une session existante et tentez de survivre à l'horreur.
              </p>
              <Button 
                variant="outline" 
                className="w-full border-aged-gold text-aged-gold hover:bg-aged-gold/10 font-cinzel"
                onClick={() => router.push("/join")}
              >
                Rejoindre la Session
              </Button>
            </CardContent>
          </Card>
        </main>

        {/* Dev Access Panel */}
        <section className="max-w-2xl mx-auto">
          <div className="gothic-border p-8 glass-card space-y-6">
            <h3 className="font-cinzel text-aged-gold flex items-center justify-center gap-3 uppercase tracking-widest">
              <ShieldAlert className="h-5 w-5 text-blood-burgundy" />
              Archives Secrètes (Développement)
            </h3>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <Button 
                disabled={isLoading}
                onClick={() => handleDevLogin("gm")}
                className="btn-secondary h-16 flex flex-col items-center justify-center gap-1"
              >
                <ScrollText className="h-4 w-4" />
                <span>Dev MJ (Test)</span>
              </Button>
              
              <Button 
                disabled={isLoading}
                onClick={() => handleDevLogin("player")}
                className="bg-eldritch-green/20 hover:bg-eldritch-green/40 text-bone-white border border-eldritch-green/50 h-16 flex flex-col items-center justify-center gap-1"
              >
                <Users className="h-4 w-4" />
                <span>Dev Joueur (TEST01)</span>
              </Button>
            </div>
          </div>
        </section>

        <footer className="pt-8 opacity-60">
          <p className="font-crimson text-sm text-aged-parchment">
            Call of Cthulhu Digital Platform — 7th Edition
          </p>
        </footer>
      </div>
    </div>
  );
}
