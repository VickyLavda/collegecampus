import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { HeartPulse, Thermometer, AlertTriangle, Pill } from 'lucide-react';

const Health = () => {
  const { t, i18n } = useTranslation();

  const symptoms = [
    {
      icon: Thermometer,
      name: 'Cold & Flu',
      nameEl: 'Κρυολόγημα & Γρίπη',
      remedies: ['Rest & hydration', 'Warm liquids', 'Over-the-counter meds'],
      remediesEl: ['Ξεκούραση & ενυδάτωση', 'Ζεστά υγρά', 'Φάρμακα χωρίς συνταγή'],
    },
    {
      icon: HeartPulse,
      name: 'Headache',
      nameEl: 'Πονοκέφαλος',
      remedies: ['Drink water', 'Rest in dark room', 'Pain reliever if needed'],
      remediesEl: ['Πιείτε νερό', 'Ξεκουραστείτε σε σκοτεινό δωμάτιο', 'Παυσίπονο αν χρειάζεται'],
    },
    {
      icon: Pill,
      name: 'Upset Stomach',
      nameEl: 'Στομαχικό Άλγος',
      remedies: ['Light foods (toast, rice)', 'Ginger tea', 'Avoid dairy & spicy foods'],
      remediesEl: ['Ελαφριά φαγητά (φρυγανιά, ρύζι)', 'Τσάι τζίντζερ', 'Αποφύγετε γαλακτοκομικά & πικάντικα'],
    },
  ];

  const whenToCall = [
    'High fever over 39°C (102°F) for more than 2 days',
    'Difficulty breathing or chest pain',
    'Severe or persistent vomiting',
    'Signs of dehydration',
    'Sudden severe headache',
  ];

  const whenToCallEl = [
    'Υψηλός πυρετός άνω των 39°C για πάνω από 2 μέρες',
    'Δυσκολία στην αναπνοή ή πόνος στο στήθος',
    'Σοβαρός ή επίμονος εμετός',
    'Σημάδια αφυδάτωσης',
    'Ξαφνικός σοβαρός πονοκέφαλος',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="mb-2 flex items-center justify-center gap-2 text-foreground">
          <HeartPulse className="h-8 w-8 text-accent" />
          {t('health.title')}
        </h1>
        <p className="text-muted-foreground">{t('health.subtitle')}</p>
      </div>

      {/* Common Symptoms */}
      <div>
        <h2 className="mb-4 text-2xl text-foreground">{t('health.symptoms')}</h2>
        <div className="space-y-4">
          {symptoms.map((symptom, index) => {
            const Icon = symptom.icon;
            const name = i18n.language === 'el' ? symptom.nameEl : symptom.name;
            const remedies = i18n.language === 'el' ? symptom.remediesEl : symptom.remedies;
            return (
              <Card key={index} className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                    <Icon className="h-5 w-5 text-accent" />
                    {name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium mb-2 text-muted-foreground">
                    {t('health.homeRemedies')}:
                  </p>
                  <ul className="space-y-1">
                    {remedies.map((remedy, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-foreground">
                        <span className="text-accent">•</span>
                        <span>{remedy}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* When to Call Doctor */}
      <Alert className="border-destructive/50 bg-destructive/5">
        <AlertTriangle className="h-5 w-5 text-destructive" />
        <AlertTitle className="text-destructive font-semibold">
          {t('health.whenToCall')}
        </AlertTitle>
        <AlertDescription>
          <ul className="mt-3 space-y-2">
            {(i18n.language === 'el' ? whenToCallEl : whenToCall).map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <span className="text-destructive">⚠</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default Health;
