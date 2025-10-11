import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { UtensilsCrossed, Sparkles, HeartPulse, Lightbulb, Phone, GraduationCap } from 'lucide-react';

const Home = () => {
  const { t } = useTranslation();

  const sections = [
    {
      path: '/recipes',
      icon: UtensilsCrossed,
      title: t('home.sections.recipes'),
    },
    {
      path: '/clean',
      icon: Sparkles,
      title: t('home.sections.clean'),
    },
    {
      path: '/health',
      icon: HeartPulse,
      title: t('home.sections.health'),
    },
    {
      path: '/hacks',
      icon: Lightbulb,
      title: t('home.sections.hacks'),
    },
    {
      path: '/sos',
      icon: Phone,
      title: t('home.sections.sos'),
    },
  ];

  const dailyTips = [
    "Meal prep on Sundays to save time during the week!",
    "Keep a cleaning schedule — 10 minutes a day makes a difference.",
    "Drink water before reaching for coffee when you feel tired.",
    "Track your expenses weekly to stay within budget.",
    "Don't skip breakfast — it fuels your brain for the day!",
  ];

  const randomTip = dailyTips[Math.floor(Math.random() * dailyTips.length)];

  return (
    <div className="space-y-6 pb-6 max-w-lg mx-auto">
      {/* Logo and Brand */}
      <div className="text-center pt-6">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-2 border-accent mb-4">
          <GraduationCap className="w-12 h-12 text-accent" strokeWidth={1.5} />
        </div>
        <h1 className="text-3xl font-bold tracking-wider mb-6">{t('app.name')}</h1>
      </div>

      {/* Personalized Greeting */}
      <div className="text-center mb-2">
        <h2 className="text-2xl font-semibold mb-3">Hello, Maria!</h2>
        <p className="text-muted-foreground text-base">
          Today's tip: How to clean your sneakers fast 🪐 before class
        </p>
      </div>

      {/* Main Sections Grid */}
      <div className="grid grid-cols-2 gap-4 px-2">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link key={section.path} to={section.path}>
              <Card className="bg-secondary border-0 hover:bg-secondary/80 transition-smooth cursor-pointer">
                <CardContent className="flex flex-col items-center justify-center p-8 h-40">
                  <Icon className="h-14 w-14 text-accent mb-4" strokeWidth={1.5} />
                  <p className="text-base font-medium text-center text-foreground">
                    {section.title}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
