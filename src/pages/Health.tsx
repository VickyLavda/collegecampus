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
      remedies: [
        'Get 8-10 hours of sleep - your body heals while resting',
        'Drink water, herbal tea, or warm lemon water every 2 hours',
        'Take vitamin C (1000mg) and zinc supplements',
        'Use a humidifier or breathe steam from hot shower',
        'Gargle with warm salt water for sore throat',
        'Take paracetamol or ibuprofen for fever and aches',
        'Eat chicken soup or warm broth for nutrition',
        'Skip classes if fever is above 38°C - rest is priority'
      ],
      remediesEl: [
        'Κοιμηθείτε 8-10 ώρες - το σώμα θεραπεύεται με ξεκούραση',
        'Πίνετε νερό, βότανα ή ζεστό νερό με λεμόνι κάθε 2 ώρες',
        'Πάρτε βιταμίνη C (1000mg) και ψευδάργυρο',
        'Χρησιμοποιήστε υγραντήρα ή αναπνεύστε ατμό από ζεστό ντους',
        'Κάντε γαργάρες με ζεστό νερό και αλάτι για πονόλαιμο',
        'Πάρτε παρακεταμόλη ή ιβουπροφαίνη για πυρετό',
        'Φάτε κοτόσουπα ή ζεστό ζωμό για θρέψη',
        'Μην πάτε σχολή αν έχετε πυρετό πάνω από 38°C'
      ],
    },
    {
      icon: HeartPulse,
      name: 'Headache',
      nameEl: 'Πονοκέφαλος',
      remedies: [
        'Drink 2 glasses of water immediately - dehydration causes headaches',
        'Rest in a dark, quiet room for 30 minutes',
        'Apply cold compress to forehead or back of neck',
        'Take ibuprofen or paracetamol as directed',
        'Avoid screens (phone, laptop) for at least 1 hour',
        'Try peppermint or lavender essential oil on temples',
        'Eat a small snack if you haven\'t eaten recently',
        'If due to stress, try deep breathing exercises'
      ],
      remediesEl: [
        'Πιείτε 2 ποτήρια νερό αμέσως - η αφυδάτωση προκαλεί πονοκεφάλους',
        'Ξεκουραστείτε σε σκοτεινό δωμάτιο για 30 λεπτά',
        'Βάλτε κρύα κομπρέσα στο μέτωπο ή στο σβέρκο',
        'Πάρτε ιβουπροφαίνη ή παρακεταμόλη',
        'Αποφύγετε οθόνες (κινητό, laptop) για 1 ώρα',
        'Δοκιμάστε δυόσμο ή λεβάντα στους κροτάφους',
        'Φάτε κάτι μικρό αν δεν έχετε φάει',
        'Αν οφείλεται σε άγχος, κάντε βαθιές αναπνοές'
      ],
    },
    {
      icon: Pill,
      name: 'Upset Stomach',
      nameEl: 'Στομαχικό Άλγος',
      remedies: [
        'Start with clear liquids: water, herbal tea, or clear broth',
        'Try the BRAT diet: Bananas, Rice, Applesauce, Toast',
        'Drink ginger tea or chew fresh ginger',
        'Take small sips of water every 15 minutes',
        'Avoid caffeine, alcohol, dairy, and greasy foods',
        'Use a heating pad on your stomach for cramps',
        'Try peppermint tea to calm nausea',
        'Rest and avoid lying down right after eating',
        'If persistent vomiting or diarrhea, see a doctor'
      ],
      remediesEl: [
        'Ξεκινήστε με διαυγή υγρά: νερό, βότανα, ζωμό',
        'Δοκιμάστε τη δίαιτα BRAT: Μπανάνες, Ρύζι, Μηλόπιτα, Φρυγανιά',
        'Πιείτε τσάι τζίντζερ ή μασήστε φρέσκο τζίντζερ',
        'Πάρτε μικρές γουλιές νερό κάθε 15 λεπτά',
        'Αποφύγετε καφεΐνη, αλκοόλ, γαλακτοκομικά',
        'Βάλτε θερμοφόρα στο στομάχι για κράμπες',
        'Δοκιμάστε τσάι δυόσμου για ναυτία',
        'Ξεκουραστείτε και μην ξαπλώνετε αμέσως μετά το φαγητό',
        'Αν συνεχίζεται ο εμετός, δείτε γιατρό'
      ],
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
