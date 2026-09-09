import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-deep-black">
      <Card className="w-full max-w-md mx-4 bg-charcoal border-aged-gold">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-blood-burgundy" />
            <h1 className="text-2xl font-bold font-cinzel text-aged-gold">404 Page Introuvable</h1>
          </div>

          <p className="mt-4 text-sm text-aged-parchment">
            La page que vous recherchez n&apos;existe pas ou a été déplacée.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
