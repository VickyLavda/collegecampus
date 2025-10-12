import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Wallet, Home, Users, BookOpen, Heart } from 'lucide-react';

const LifeHacks = () => {
  const { t, i18n } = useTranslation();

  const hacks = [
    {
      id: 'budget',
      icon: Wallet,
      tips: [
        'Track expenses with a simple app',
        'Set aside "fun money" weekly',
        'Buy store brands to save 30%',
        'Meal prep to avoid takeout costs',
      ],
      tipsEl: [
        'Παρακολουθήστε έξοδα με μια απλή εφαρμογή',
        'Διαθέστε "χρήματα διασκέδασης" εβδομαδιαίως',
        'Αγοράστε brands καταστημάτων για εξοικονόμηση 30%',
        'Προετοιμάστε γεύματα για να αποφύγετε delivery',
      ],
    },
    {
      id: 'rent',
      icon: Home,
      tips: [
        'Read your lease carefully',
        'Document everything with photos',
        'Split bills fairly with roommates',
        'Know your tenant rights',
      ],
      tipsEl: [
        'Διαβάστε προσεκτικά το συμβόλαιο',
        'Τεκμηριώστε τα πάντα με φωτογραφίες',
        'Χωρίστε τους λογαριασμούς δίκαια',
        'Γνωρίστε τα δικαιώματά σας ως ενοικιαστής',
      ],
    },
    {
      id: 'roommates',
      icon: Users,
      tips: [
        'Set ground rules early',
        'Use a chore rotation schedule',
        'Communicate openly about issues',
        'Respect personal space & boundaries',
      ],
      tipsEl: [
        'Ορίστε κανόνες από νωρίς',
        'Χρησιμοποιήστε πρόγραμμα περιστροφής δουλειών',
        'Επικοινωνήστε ανοιχτά για προβλήματα',
        'Σεβαστείτε τον προσωπικό χώρο',
      ],
    },
    {
      id: 'study',
      icon: BookOpen,
      tips: [
        'Use the Pomodoro technique (25 min focus)',
        'Study in groups for motivation',
        'Take regular breaks to stay fresh',
        'Don\'t cram — spread study sessions',
      ],
      tipsEl: [
        'Χρησιμοποιήστε την τεχνική Pomodoro (25 λεπτά εστίαση)',
        'Μελετήστε σε ομάδες για κίνητρο',
        'Κάντε τακτικά διαλείμματα',
        'Μην στριμωχθείτε — διανείμετε τις συνεδρίες μελέτης',
      ],
    },
    {
      id: 'social',
      icon: Heart,
      tips: [
        'Join clubs to meet people',
        'Don\'t compare your social life to others',
        'Balance study & social time',
        'It\'s okay to say no sometimes',
      ],
      tipsEl: [
        'Συμμετέχετε σε λέσχες για να γνωρίσετε κόσμο',
        'Μην συγκρίνετε τη κοινωνική σας ζωή με άλλους',
        'Εξισορροπήστε μελέτη & κοινωνική ζωή',
        'Είναι εντάξει να πείτε όχι μερικές φορές',
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="mb-2 flex items-center justify-center gap-2 text-foreground">
          <Lightbulb className="h-8 w-8 text-accent" />
          {t('hacks.title')}
        </h1>
        <p className="text-muted-foreground">{t('hacks.subtitle')}</p>
      </div>

      {/* Hacks Categories */}
      <div className="space-y-4">
        {hacks.map((hack) => {
          const Icon = hack.icon;
          const tips = i18n.language === 'el' ? hack.tipsEl : hack.tips;
          return (
            <Card key={hack.id} className="shadow-soft hover:shadow-medium transition-smooth">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-foreground">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-accent" />
                  </div>
                  {t(`hacks.categories.${hack.id}`)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-accent mt-1 text-lg">💡</span>
                      <span className="flex-1 text-foreground">{tip}</span>
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

export default LifeHacks;
