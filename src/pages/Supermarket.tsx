import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ShoppingCart, TrendingDown, CheckSquare, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { User, Session } from '@supabase/supabase-js';
import alphamegaLogo from '@/assets/alphamega-logo.png';
import metroLogo from '@/assets/metro-logo.png';

interface ShoppingItem {
  id: string;
  text: string;
  checked: boolean;
}

interface Profile {
  country: string;
  city: string;
}

const Supermarket = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [newItem, setNewItem] = useState('');

  // Check authentication
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session) {
          navigate('/auth');
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setAuthChecking(false);
      
      if (!session) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Fetch user profile
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      setLoading(true);
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('country, city')
        .eq('user_id', user.id)
        .single();

      if (profileError) {
        toast({
          title: 'Error loading profile',
          description: 'Unable to load your profile. Please try again later.',
          variant: 'destructive',
        });
      } else {
        setProfile(profileData);
      }
      
      setLoading(false);
    };

    fetchData();
  }, [user, toast]);

  // Load from localStorage
  useEffect(() => {
    const savedList = localStorage.getItem('shoppingList');
    if (savedList) setShoppingList(JSON.parse(savedList));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
  }, [shoppingList]);

  const addShoppingItem = () => {
    if (!newItem.trim()) return;
    const item: ShoppingItem = {
      id: Date.now().toString(),
      text: newItem.trim(),
      checked: false,
    };
    setShoppingList([...shoppingList, item]);
    setNewItem('');
    toast({
      title: t('supermarket.itemAdded'),
      description: newItem,
    });
  };

  const toggleItem = (id: string) => {
    setShoppingList(
      shoppingList.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const deleteItem = (id: string) => {
    setShoppingList(shoppingList.filter((item) => item.id !== id));
  };

  const clearCompleted = () => {
    setShoppingList(shoppingList.filter((item) => !item.checked));
    toast({
      title: t('supermarket.clearedCompleted'),
    });
  };

  const budgetTips = i18n.language === 'el'
    ? [
        'Αγοράστε προϊόντα ιδιωτικής ετικέτας - εξοικονομήστε έως 30%',
        'Ψωνίστε με βάση τις εβδομαδιαίες προσφορές',
        'Αγοράστε εποχιακά φρούτα και λαχανικά',
        'Αποφύγετε τα ψώνια όταν πεινάτε',
      ]
    : [
        'Buy store brands - save up to 30%',
        'Shop based on weekly sales',
        'Buy seasonal fruits and vegetables',
        'Never shop when hungry',
      ];

  const essentials = i18n.language === 'el'
    ? [
        'Ρύζι, ζυμαρικά, φακές (βασικά)',
        'Αυγά, γάλα, τυρί',
        'Ψωμί ή τοστ',
        'Κατεψυγμένα λαχανικά',
        'Ελαιόλαδο, αλάτι, μπαχαρικά',
        'Καφές/τσάι',
      ]
    : [
        'Rice, pasta, lentils (staples)',
        'Eggs, milk, cheese',
        'Bread or toast',
        'Frozen vegetables',
        'Olive oil, salt, spices',
        'Coffee/tea',
      ];

  if (authChecking || loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="mb-2 flex items-center justify-center gap-2 text-foreground">
          <ShoppingCart className="h-8 w-8 text-accent" />
          {t('supermarket.title')}
        </h1>
        <p className="text-muted-foreground">{t('supermarket.subtitle')}</p>
        {profile && (
          <p className="text-sm text-accent mt-2">
            {i18n.language === 'el' 
              ? `Σούπερ μάρκετ στην ${profile.city}, ${profile.country}` 
              : `Supermarkets in ${profile.city}, ${profile.country}`}
          </p>
        )}
      </div>

      {/* Alphamega Online Shopping */}
      <Card className="shadow-soft border-accent/20">
        <CardContent className="pt-6">
          <a 
            href="https://www.alphamega.com.cy/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block"
          >
            <div className="flex flex-col items-center gap-4 p-4 rounded-lg bg-gradient-to-br from-background to-secondary/30 hover:shadow-lg transition-all">
              <img 
                src={alphamegaLogo} 
                alt="Alphamega Hypermarket" 
                className="h-16 object-contain"
              />
              <div className="text-center space-y-2">
                <h3 className="font-semibold text-lg text-foreground">
                  {i18n.language === 'el' ? 'Ψωνίστε Online στην Alphamega' : 'Shop Online at Alphamega'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {i18n.language === 'el' 
                    ? 'Κάντε τα ψώνια σας online με παράδοση στο σπίτι' 
                    : 'Order your groceries online with home delivery'}
                </p>
              </div>
              <Button className="w-full">
                <ShoppingCart className="mr-2 h-4 w-4" />
                {i18n.language === 'el' ? 'Επισκεφθείτε το Ηλεκτρονικό Κατάστημα' : 'Visit Online Store'}
              </Button>
            </div>
          </a>
        </CardContent>
      </Card>

      {/* Metro Online Shopping */}
      <Card className="shadow-soft border-accent/20">
        <CardContent className="pt-6">
          <a 
            href="https://www.metro.com.cy/en/home" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block"
          >
            <div className="flex flex-col items-center gap-4 p-4 rounded-lg bg-gradient-to-br from-background to-secondary/30 hover:shadow-lg transition-all">
              <img 
                src={metroLogo} 
                alt="Metro Supermarket" 
                className="h-16 object-contain"
              />
              <div className="text-center space-y-2">
                <h3 className="font-semibold text-lg text-foreground">
                  {i18n.language === 'el' ? 'Ψωνίστε Online στο Metro' : 'Shop Online at Metro'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {i18n.language === 'el' 
                    ? 'Κάντε τα ψώνια σας online με παράδοση στο σπίτι' 
                    : 'Order your groceries online with home delivery'}
                </p>
              </div>
              <Button className="w-full">
                <ShoppingCart className="mr-2 h-4 w-4" />
                {i18n.language === 'el' ? 'Επισκεφθείτε το Ηλεκτρονικό Κατάστημα' : 'Visit Online Store'}
              </Button>
            </div>
          </a>
        </CardContent>
      </Card>

      {/* Shopping List */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <CheckSquare className="h-5 w-5 text-accent" />
            {t('supermarket.shoppingList')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder={t('supermarket.addItem')}
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addShoppingItem()}
            />
            <Button onClick={addShoppingItem} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {shoppingList.length > 0 && (
            <>
              <div className="space-y-2">
                {shoppingList.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary/50"
                  >
                    <Checkbox
                      checked={item.checked}
                      onCheckedChange={() => toggleItem(item.id)}
                    />
                    <span
                      className={`flex-1 ${
                        item.checked ? 'line-through text-muted-foreground' : ''
                      }`}
                    >
                      {item.text}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>

              {shoppingList.some((item) => item.checked) && (
                <Button
                  variant="outline"
                  onClick={clearCompleted}
                  className="w-full"
                >
                  {t('supermarket.clearCompleted')}
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Budget Tips */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <TrendingDown className="h-5 w-5 text-accent" />
            {t('supermarket.budgetTips')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {budgetTips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-accent mt-1">💰</span>
                <span className="text-foreground">{tip}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Student Essentials */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <CheckSquare className="h-5 w-5 text-accent" />
            {t('supermarket.essentials')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {essentials.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-accent mt-1">✓</span>
                <span className="text-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Supermarket;