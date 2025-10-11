import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';

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
      className="gap-2 text-accent hover:text-accent/80"
    >
      <Languages className="h-4 w-4" />
      <span className="font-medium">{i18n.language === 'en' ? 'ΕΛ' : 'EN'}</span>
    </Button>
  );
};
