import Navigation from '@/components/navigation';

/**
 * Dashboard Layout
 * Wraps all protected routes with navigation
 * Auth protection is handled by middleware.ts
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-deep-black text-bone-white">
      <Navigation />
      <main>{children}</main>
    </div>
  );
}
