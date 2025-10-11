import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Shirt, Coffee, Bath, Droplet, Home } from 'lucide-react';

const Clean = () => {
  const { t } = useTranslation();

  const categories = [
    {
      id: 'laundry',
      icon: Shirt,
      tips: [
        'Separate whites from colors',
        'Check care labels before washing',
        'Use cold water to save energy',
      ],
      tipsEl: [
        'Διαχωρίστε τα λευκά από τα χρωματιστά',
        'Ελέγξτε τις ετικέτες πριν το πλύσιμο',
        'Χρησιμοποιήστε κρύο νερό για εξοικονόμηση ενέργειας',
      ],
    },
    {
      id: 'kitchen',
      icon: Coffee,
      tips: [
        'Wipe down surfaces daily',
        'Clean as you cook to avoid buildup',
        'Descale kettle monthly with vinegar',
      ],
      tipsEl: [
        'Σκουπίστε τις επιφάνειες καθημερινά',
        'Καθαρίζετε ενώ μαγειρεύετε',
        'Αφαλατώστε το βραστήρα μηνιαία με ξύδι',
      ],
    },
    {
      id: 'bathroom',
      icon: Bath,
      tips: [
        'Squeegee shower after use',
        'Ventilate to prevent mold',
        'Quick spray-clean weekly',
      ],
      tipsEl: [
        'Σκουπίστε το ντους μετά τη χρήση',
        'Αερίστε για να αποφύγετε μούχλα',
        'Γρήγορος καθαρισμός εβδομαδιαίως',
      ],
    },
    {
      id: 'stains',
      icon: Droplet,
      tips: [
        'Act fast on fresh stains',
        'Blot, don\'t rub',
        'Cold water for blood, hot for grease',
      ],
      tipsEl: [
        'Ενεργήστε γρήγορα σε φρέσκους λεκέδες',
        'Στεγνώστε, μην τρίβετε',
        'Κρύο νερό για αίμα, ζεστό για λίπος',
      ],
    },
    {
      id: 'organize',
      icon: Home,
      tips: [
        '10-minute daily tidy-up',
        'Everything has a place',
        'Declutter monthly',
      ],
      tipsEl: [
        'Τακτοποίηση 10 λεπτών ημερησίως',
        'Τα πάντα στη θέση τους',
        'Ξεκαθάρισμα μηνιαίως',
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="mb-2 flex items-center justify-center gap-2 text-primary">
          <Sparkles className="h-8 w-8 text-accent" />
          {t('clean.title')}
        </h1>
        <p className="text-muted-foreground">{t('clean.subtitle')}</p>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Card key={category.id} className="shadow-soft hover:shadow-medium transition-smooth">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-primary">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-accent" />
                  </div>
                  {t(`clean.categories.${category.id}`)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {(category.tips).map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-muted-foreground">
                      <span className="text-accent mt-1">✓</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Clean;
