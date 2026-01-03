import { ReactNode } from 'react';
import { TopNav } from './TopNav';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen gradient-background">
      <TopNav />
      <main className="container px-4 py-6">
        {children}
      </main>
    </div>
  );
}
