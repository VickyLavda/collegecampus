import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UtensilsCrossed, Sparkles, HeartPulse, Lightbulb, Phone, Sparkle } from 'lucide-react';

const Home = () => {
  const { t } = useTranslation();

  const sections = [
    {
      path: '/recipes',
      icon: UtensilsCrossed,
      title: t('home.sections.recipes'),
      color: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
    },
    {
      path: '/clean',
      icon: Sparkles,
      title: t('home.sections.clean'),
      color: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
    },
    {
      path: '/health',
      icon: HeartPulse,
      title: t('home.sections.health'),
      color: 'bg-red-50 text-red-600 hover:bg-red-100',
    },
    {
      path: '/hacks',
      icon: Lightbulb,
      title: t('home.sections.hacks'),
      color: 'bg-amber-50 text-amber-600 hover:bg-amber-100',
    },
    {
      path: '/sos',
      icon: Phone,
      title: t('home.sections.sos'),
      color: 'bg-green-50 text-green-600 hover:bg-green-100',
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
    <div className="space-y-6 pb-6">
      {/* Welcome Message */}
      <div className="text-center py-4">
        <h1 className="mb-2 text-primary">{t('app.name')}</h1>
        <p className="text-muted-foreground italic">{t('app.tagline')}</p>
      </div>

      {/* Daily Tip */}
      <Card className="bg-gradient-gold text-primary shadow-gold border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Sparkle className="h-5 w-5" />
            {t('home.dailyTip')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-primary font-medium">{randomTip}</p>
        </CardContent>
      </Card>

      {/* Main Sections Grid */}
      <div className="grid grid-cols-2 gap-4">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link key={section.path} to={section.path}>
              <Card className="h-full hover:shadow-medium transition-smooth cursor-pointer border-2 hover:border-accent">
                <CardContent className="flex flex-col items-center justify-center p-6 h-32">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${section.color} transition-smooth`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-semibold text-center text-foreground">
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
