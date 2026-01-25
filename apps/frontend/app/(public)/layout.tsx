/**
 * Public routes layout
 * No authentication required - accessible to all users
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
