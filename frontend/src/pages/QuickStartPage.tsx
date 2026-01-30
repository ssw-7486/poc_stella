import { Navigation } from '../components/ui/Navigation';

export function QuickStartPage() {
  return (
    <div className="min-h-screen bg-card-bg">
      <Navigation />
      <main className="p-6">
        <h1 className="text-3xl font-bold text-navy">Quick Start Wizard</h1>
        <p className="text-navy/60 mt-2">5-step wizard coming soon...</p>
      </main>
    </div>
  );
}
