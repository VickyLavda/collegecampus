import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, UtensilsCrossed, Sparkles, HeartPulse, Lightbulb, Phone } from 'lucide-react';
import { LanguageToggle } from './LanguageToggle';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { path: '/home', icon: Home, label: t('home.title') },
    { path: '/recipes', icon: UtensilsCrossed, label: t('recipes.title') },
    { path: '/clean', icon: Sparkles, label: t('clean.title') },
    { path: '/health', icon: HeartPulse, label: t('health.title') },
    { path: '/hacks', icon: Lightbulb, label: t('hacks.title') },
    { path: '/sos', icon: Phone, label: t('sos.title') },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-medium">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-2">
            <span className="text-2xl">🎓</span>
            <span className="font-heading font-bold text-lg">College Campus</span>
          </Link>
          <LanguageToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 max-w-6xl">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="sticky bottom-0 bg-card border-t border-border shadow-strong">
        <div className="container mx-auto px-2">
          <div className="flex justify-around items-center py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-smooth ${
                    isActive
                      ? 'text-accent bg-accent/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium hidden sm:block">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
};
