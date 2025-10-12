import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Sparkles, Shirt, Coffee, Bath, Droplet, Home } from 'lucide-react';

const Clean = () => {
  const { t, i18n } = useTranslation();

  const categories = [
    {
      id: 'laundry',
      icon: Shirt,
      tips: [
        {
          title: 'Separate whites from colors',
          titleEl: 'Διαχωρίστε τα λευκά από τα χρωματιστά',
          details: 'Washing whites with colored clothes can cause color bleeding and turn your whites gray or discolored. Sort laundry into three piles: whites, darks, and colors. Wash new colored items separately the first time as they tend to bleed more.',
          detailsEl: 'Το πλύσιμο λευκών με χρωματιστά ρούχα μπορεί να προκαλέσει μεταφορά χρώματος και να γκριζάρουν τα λευκά σας. Διαχωρίστε τα ρούχα σε τρεις στοίβες: λευκά, σκούρα και χρωματιστά. Πλύνετε τα καινούργια χρωματιστά αντικείμενα ξεχωριστά την πρώτη φορά.',
        },
        {
          title: 'Check care labels before washing',
          titleEl: 'Ελέγξτε τις ετικέτες πριν το πλύσιμο',
          details: 'Care labels tell you the maximum temperature, whether you can tumble dry, iron, or dry clean. Following these instructions prevents shrinking, damage, and extends the life of your clothes. When in doubt, use cold water and air dry.',
          detailsEl: 'Οι ετικέτες φροντίδας σας δείχνουν τη μέγιστη θερμοκρασία, αν μπορείτε να στεγνώσετε στο στεγνωτήριο, να σιδερώσετε ή να κάνετε στεγνό καθάρισμα. Ακολουθώντας αυτές τις οδηγίες αποτρέπετε το μπόσιμο και επεκτείνετε τη ζωή των ρούχων σας.',
        },
        {
          title: 'Use cold water to save energy',
          titleEl: 'Χρησιμοποιήστε κρύο νερό για εξοικονόμηση ενέργειας',
          details: 'Heating water accounts for about 90% of the energy used in washing. Cold water cleans effectively for most loads, prevents colors from fading, and reduces shrinkage. Use warm or hot water only for heavily soiled items or whites.',
          detailsEl: 'Η θέρμανση του νερού αντιπροσωπεύει περίπου το 90% της ενέργειας που χρησιμοποιείται στο πλύσιμο. Το κρύο νερό καθαρίζει αποτελεσματικά τα περισσότερα ρούχα, αποτρέπει το ξεθώριασμα των χρωμάτων και μειώνει το μπόσιμο.',
        },
      ],
    },
    {
      id: 'kitchen',
      icon: Coffee,
      tips: [
        {
          title: 'Wipe down surfaces daily',
          titleEl: 'Σκουπίστε τις επιφάνειες καθημερινά',
          details: 'Countertops collect bacteria, crumbs, and spills throughout the day. Use a disinfectant spray or a mixture of water and dish soap to wipe down after cooking. Pay special attention to areas where raw meat was prepared. This prevents bacterial growth and keeps your kitchen hygienic.',
          detailsEl: 'Οι πάγκοι συλλέγουν βακτήρια, ψίχουλα και χυμένα υγρά καθ όλη τη διάρκεια της ημέρας. Χρησιμοποιήστε απολυμαντικό σπρέι ή μείγμα νερού και απορρυπαντικού πιάτων για να σκουπίσετε μετά το μαγείρεμα. Δώστε ιδιαίτερη προσοχή στις περιοχές όπου ετοιμάστηκε ωμό κρέας.',
        },
        {
          title: 'Clean as you cook to avoid buildup',
          titleEl: 'Καθαρίζετε ενώ μαγειρεύετε',
          details: 'Don\'t let dirty dishes pile up while cooking. Wash utensils, cutting boards, and mixing bowls as you finish with them. Fill the sink with soapy water at the start and drop items in as you go. This makes post-meal cleanup much faster and prevents dried-on food.',
          detailsEl: 'Μην αφήνετε τα βρώμικα πιάτα να συσσωρεύονται ενώ μαγειρεύετε. Πλύνετε σκεύη, πλάκες κοπής και μπολ καθώς τελειώνετε με αυτά. Γεμίστε τον νεροχύτη με σαπουνόνερο στην αρχή. Αυτό κάνει το καθάρισμα μετά το γεύμα πολύ πιο γρήγορο.',
        },
        {
          title: 'Descale kettle monthly with vinegar',
          titleEl: 'Αφαλατώστε το βραστήρα μηνιαία με ξύδι',
          details: 'Hard water leaves mineral deposits (limescale) in your kettle. Fill it with equal parts water and white vinegar, boil, then let sit for an hour. Rinse thoroughly 2-3 times. This improves taste, efficiency, and extends the kettle\'s lifespan.',
          detailsEl: 'Το σκληρό νερό αφήνει ανόργανα άλατα στο βραστήρα σας. Γεμίστε τον με ίσα μέρη νερού και λευκού ξυδιού, βράστε τον, και αφήστε τον να σταθεί για μία ώρα. Ξεπλύνετε καλά 2-3 φορές. Αυτό βελτιώνει τη γεύση και επεκτείνει τη διάρκεια ζωής του βραστήρα.',
        },
      ],
    },
    {
      id: 'bathroom',
      icon: Bath,
      tips: [
        {
          title: 'Squeegee shower after use',
          titleEl: 'Σκουπίστε το ντους μετά τη χρήση',
          details: 'Water droplets on shower walls and doors lead to water stains and soap scum buildup. Keep a squeegee in the shower and spend 30 seconds wiping down glass and tiles after each shower. This simple habit dramatically reduces cleaning time and keeps your bathroom sparkling.',
          detailsEl: 'Οι σταγόνες νερού στους τοίχους και τις πόρτες του ντους οδηγούν σε λεκέδες νερού και συσσώρευση σαπουνιού. Κρατήστε μια σπάτουλα στο ντους και αφιερώστε 30 δευτερόλεπτα σκουπίζοντας το γυαλί και τα πλακάκια μετά από κάθε ντους.',
        },
        {
          title: 'Ventilate to prevent mold',
          titleEl: 'Αερίστε για να αποφύγετε μούχλα',
          details: 'Bathrooms are naturally humid, creating perfect conditions for mold growth. Always turn on the exhaust fan during and for 20 minutes after showering. If you don\'t have a fan, open a window or door. Keep shower curtains or doors partially open between uses to allow air circulation.',
          detailsEl: 'Τα μπάνια είναι φυσικά υγρά, δημιουργώντας τέλειες συνθήκες για ανάπτυξη μούχλας. Πάντα ανοίγετε τον ανεμιστήρα κατά τη διάρκεια και για 20 λεπτά μετά το ντους. Αν δεν έχετε ανεμιστήρα, ανοίξτε ένα παράθυρο ή πόρτα.',
        },
        {
          title: 'Quick spray-clean weekly',
          titleEl: 'Γρήγορος καθαρισμός εβδομαδιαίως',
          details: 'Prevent heavy buildup with a quick weekly clean. Spray all surfaces (sink, toilet, shower) with bathroom cleaner, let sit for 5 minutes while you do something else, then wipe down. This 10-minute routine prevents the need for deep cleaning sessions.',
          detailsEl: 'Αποτρέψτε τη μεγάλη συσσώρευση με έναν γρήγορο εβδομαδιαίο καθαρισμό. Ψεκάστε όλες τις επιφάνειες με καθαριστικό μπάνιου, αφήστε το για 5 λεπτά ενώ κάνετε κάτι άλλο, μετά σκουπίστε. Αυτή η ρουτίνα 10 λεπτών αποτρέπει την ανάγκη για βαθύ καθάρισμα.',
        },
      ],
    },
    {
      id: 'stains',
      icon: Droplet,
      tips: [
        {
          title: 'Act fast on fresh stains',
          titleEl: 'Ενεργήστε γρήγορα σε φρέσκους λεκέδες',
          details: 'The longer a stain sits, the harder it is to remove as it bonds with fabric fibers. Treat stains within minutes if possible. For clothing, rinse with cold water immediately. For carpets and upholstery, blot up excess liquid first. Fresh stains are 80% easier to remove than set ones.',
          detailsEl: 'Όσο περισσότερο μένει ένας λεκές, τόσο πιο δύσκολο είναι να αφαιρεθεί καθώς συνδέεται με τις ίνες του υφάσματος. Αντιμετωπίστε τους λεκέδες μέσα σε λεπτά αν είναι δυνατόν. Για ρούχα, ξεπλύνετε με κρύο νερό αμέσως. Οι φρέσκοι λεκέδες είναι 80% πιο εύκολοι στην αφαίρεση.',
        },
        {
          title: 'Blot, don\'t rub',
          titleEl: 'Στεγνώστε, μην τρίβετε',
          details: 'Rubbing pushes the stain deeper into fibers and spreads it to a larger area. Instead, gently blot from the outside edges toward the center using a clean white cloth or paper towel. Apply gentle pressure and repeat with a fresh section of cloth until no more stain transfers.',
          detailsEl: 'Το τρίψιμο σπρώχνει τον λεκέ βαθύτερα στις ίνες και τον απλώνει σε μεγαλύτερη περιοχή. Αντίθετα, στεγνώστε απαλά από τις εξωτερικές άκρες προς το κέντρο χρησιμοποιώντας ένα καθαρό λευκό πανί. Εφαρμόστε απαλή πίεση και επαναλάβετε.',
        },
        {
          title: 'Cold water for blood, hot for grease',
          titleEl: 'Κρύο νερό για αίμα, ζεστό για λίπος',
          details: 'Hot water sets protein stains like blood, egg, and milk, making them permanent. Always use cold water for these. Grease and oil stains, however, need hot water to break down and dissolve. For wine, coffee, and juice, cold water works best. Use appropriate stain removers for each type.',
          detailsEl: 'Το ζεστό νερό στερεώνει τους λεκέδες πρωτεΐνης όπως αίμα, αυγό και γάλα, καθιστώντας τους μόνιμους. Πάντα χρησιμοποιείτε κρύο νερό για αυτούς. Οι λεκέδες λίπους όμως χρειάζονται ζεστό νερό για να διασπαστούν. Για κρασί, καφέ και χυμό, το κρύο νερό λειτουργεί καλύτερα.',
        },
      ],
    },
    {
      id: 'organize',
      icon: Home,
      tips: [
        {
          title: '10-minute daily tidy-up',
          titleEl: 'Τακτοποίηση 10 λεπτών ημερησίως',
          details: 'Set a timer for 10 minutes each evening and do a quick pickup. Put away items that are out of place, do a quick dish wash, wipe the kitchen counter, and straighten cushions. This small daily habit prevents messes from accumulating and reduces the need for marathon cleaning sessions on weekends.',
          detailsEl: 'Ρυθμίστε ένα χρονόμετρο για 10 λεπτά κάθε βράδυ και κάντε μια γρήγορη τακτοποίηση. Βάλτε στη θέση τους αντικείμενα που είναι εκτός θέσης, κάντε ένα γρήγορο πλύσιμο πιάτων, σκουπίστε τον πάγκο της κουζίνας. Αυτή η μικρή καθημερινή συνήθεια αποτρέπει την συσσώρευση άχρηστων.',
        },
        {
          title: 'Everything has a place',
          titleEl: 'Τα πάντα στη θέση τους',
          details: 'Assign a specific home for every item you own. Keys go on a hook by the door, mail in a designated basket, shoes in a rack. When everything has a place, tidying becomes automatic and you\'ll never waste time searching for items. Label containers and drawers if needed.',
          detailsEl: 'Ορίστε μια συγκεκριμένη θέση για κάθε αντικείμενο που έχετε. Τα κλειδιά πάνε σε ένα γάντζο δίπλα στην πόρτα, το ταχυδρομείο σε ένα καλάθι, τα παπούτσια σε μια σχάρα. Όταν τα πάντα έχουν μια θέση, η τακτοποίηση γίνεται αυτόματη και δεν θα χάνετε ποτέ χρόνο ψάχνοντας αντικείμενα.',
        },
        {
          title: 'Declutter monthly',
          titleEl: 'Ξεκαθάρισμα μηνιαίως',
          details: 'Once a month, go through one area (closet, drawer, shelf) and remove items you don\'t use or need. Follow the rule: if you haven\'t used it in 6 months and it\'s not seasonal, donate or discard it. Less clutter means less to clean and organize, saving you time and stress.',
          detailsEl: 'Μία φορά το μήνα, ελέγξτε μία περιοχή (ντουλάπα, συρτάρι, ράφι) και αφαιρέστε αντικείμενα που δεν χρησιμοποιείτε. Ακολουθήστε τον κανόνα: αν δεν το έχετε χρησιμοποιήσει για 6 μήνες, δωρίστε το ή πετάξτε το. Λιγότερα άχρηστα σημαίνει λιγότερο καθάρισμα.',
        },
        {
          title: 'Cockroach? Seal food, clean crumbs, use boric acid traps',
          titleEl: 'Κατσαρίδα; Σφραγίστε φαγητό, καθαρίστε ψίχουλα, χρησιμοποιήστε παγίδες βορικού οξέος',
          details: 'Cockroaches are attracted to food and moisture. Store all food in sealed containers, clean up crumbs immediately, and fix leaky pipes. Place boric acid powder in cracks and behind appliances (keep away from pets and children). Seal entry points with caulk. If the problem persists, contact pest control.',
          detailsEl: 'Οι κατσαρίδες έλκονται από το φαγητό και την υγρασία. Αποθηκεύστε όλα τα τρόφιμα σε σφραγισμένα δοχεία, καθαρίστε τα ψίχουλα αμέσως και επιδιορθώστε τις διαρροές σωλήνων. Τοποθετήστε σκόνη βορικού οξέος σε ρωγμές και πίσω από συσκευές (κρατήστε μακριά από κατοικίδια και παιδιά).',
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="mb-2 flex items-center justify-center gap-2 text-foreground">
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
                <CardTitle className="flex items-center gap-2 text-xl text-foreground">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-accent" />
                  </div>
                  {t(`clean.categories.${category.id}`)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {category.tips.map((tip, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left hover:text-accent">
                        <div className="flex items-start gap-2">
                          <span className="text-accent mt-1">✓</span>
                          <span>{i18n.language === 'el' ? tip.titleEl : tip.title}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pl-6">
                        {i18n.language === 'el' ? tip.detailsEl : tip.details}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Clean;
