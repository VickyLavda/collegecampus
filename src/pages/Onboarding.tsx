import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Onboarding = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const selectLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    navigate('/home');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
      <Card className="w-full max-w-md p-8 text-center shadow-strong">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center shadow-gold">
            <span className="text-6xl">🎓</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="mb-2 text-primary font-heading">{t('onboarding.welcome')}</h1>
        <p className="mb-8 text-muted-foreground">{t('onboarding.subtitle')}</p>

        {/* Language Selection */}
        <div className="mb-6">
          <p className="mb-4 text-sm font-medium text-foreground">
            {t('onboarding.selectLanguage')}
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={() => selectLanguage('en')}
              variant="outline"
              className="flex-1 h-16 text-lg font-medium border-2 hover:border-accent hover:bg-accent/5"
            >
              🇬🇧 English
            </Button>
            <Button
              onClick={() => selectLanguage('el')}
              variant="outline"
              className="flex-1 h-16 text-lg font-medium border-2 hover:border-accent hover:bg-accent/5"
            >
              🇬🇷 Ελληνικά
            </Button>
          </div>
        </div>

        {/* Tagline */}
        <p className="text-sm text-muted-foreground italic">{t('app.tagline')}</p>
      </Card>
    </div>
  );
};

export default Onboarding;
