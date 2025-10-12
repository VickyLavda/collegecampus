import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

export const LanguageToggle = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'el' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="gap-1.5 text-accent hover:text-accent/80 font-semibold tracking-wide"
    >
      <span className={i18n.language === 'en' ? 'opacity-100' : 'opacity-50'}>EN</span>
      <span className="opacity-50">|</span>
      <span className={i18n.language === 'el' ? 'opacity-100' : 'opacity-50'}>ΕΛ</span>
    </Button>
  );
};
