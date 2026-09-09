"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Skull } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
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
            &quot;Le réveil des Grands Anciens est proche...&quot;
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
                Dirigez l&apos;enquête, manipulez le destin et observez vos joueurs sombrer.
              </p>
              <Button asChild className="w-full btn-primary font-cinzel">
                <Link href="/gm-login">Invoquer le Gardien</Link>
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
                Rejoignez une session existante et tentez de survivre à l&apos;horreur.
              </p>
              <Button
                asChild
                variant="outline"
                className="w-full border-aged-gold text-aged-gold hover:bg-aged-gold/10 font-cinzel"
              >
                <Link href="/join">Rejoindre la Session</Link>
              </Button>
            </CardContent>
          </Card>
        </main>


        <footer className="pt-8 opacity-60">
          <p className="font-crimson text-sm text-aged-parchment">
            Call of Cthulhu Digital Platform — 7th Edition
          </p>
        </footer>
      </div>
    </div>
  );
}
