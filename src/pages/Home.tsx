import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { UtensilsCrossed, Sparkles, HeartPulse, MessageSquare, Phone, GraduationCap, ShoppingCart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Home = () => {
  const { t } = useTranslation();
  const [firstName, setFirstName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('name')
          .eq('user_id', session.user.id)
          .maybeSingle();
        
        if (profile?.name) {
          setFirstName(profile.name);
        }
      }
      setLoading(false);
    };

    fetchUserProfile();
  }, []);

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
      path: '/community',
      icon: MessageSquare,
      title: t('home.sections.community'),
    },
    {
      path: '/supermarket',
      icon: ShoppingCart,
      title: t('home.sections.supermarket'),
    },
    {
      path: '/sos',
      icon: Phone,
      title: t('home.sections.sos'),
    },
  ];

  const dailyTips = t('home.dailyTips', { returnObjects: true }) as string[];
  const randomTip = dailyTips[Math.floor(Math.random() * dailyTips.length)];

  return (
    <div className="space-y-6 pb-6 max-w-lg mx-auto">
      {/* Logo and Brand */}
      <div className="text-center pt-6">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-2 border-accent mb-4">
          <GraduationCap className="w-12 h-12 text-accent" strokeWidth={1.5} />
        </div>
        <h1 className="text-3xl font-bold tracking-wider mb-6 text-accent">{t('app.name')}</h1>
        <a href="/auth" className="text-sm text-muted-foreground hover:text-accent transition-smooth">
          Login / Sign Up
        </a>
      </div>

      {/* Personalized Greeting */}
      <div className="text-center mb-2">
        <h2 className="text-2xl font-semibold mb-3">
          {!loading && firstName ? `Hello ${firstName}!` : t('home.greeting')}
        </h2>
        <p className="text-muted-foreground text-base">
          {t('home.todayTip')}
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
