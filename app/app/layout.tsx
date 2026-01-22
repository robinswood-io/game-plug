import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from '@/components/providers/query-provider';
import { AuthProvider } from '@/contexts/auth-context';
import { AuthInitializer } from '@/components/auth-initializer';
import { SocketProvider } from '@/components/providers/socket-provider';
import Navigation from '@/components/navigation';

export const metadata: Metadata = {
  title: 'Rôle Plug - Call of Cthulhu 7e',
  description: 'Plateforme RPG digitale pour Call of Cthulhu 7e',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <QueryProvider>
          <AuthProvider>
            <AuthInitializer>
              <SocketProvider>
                <Navigation />
                {children}
              </SocketProvider>
            </AuthInitializer>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
