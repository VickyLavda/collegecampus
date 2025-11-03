import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ShoppingCart, CheckSquare, Plus, Trash2, Tag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { User, Session } from '@supabase/supabase-js';
import alphamegaLogo from '@/assets/alphamega-logo.png';
import zorbasLogo from '@/assets/zorbas-logo.png';
import alterlifeLogo from '@/assets/alterlife-logo.png';

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
                <div className="flex items-center justify-center gap-2 p-3 bg-accent/10 rounded-lg border border-accent/20">
                  <Tag className="h-4 w-4 text-accent" />
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">
                      {i18n.language === 'el' ? 'Κωδικός Έκπτωσης' : 'Discount Code'}
                    </p>
                    <p className="font-mono font-bold text-accent">COLLEGE10</p>
                  </div>
                </div>
              </div>
              <Button className="w-full">
                <ShoppingCart className="mr-2 h-4 w-4" />
                {i18n.language === 'el' ? 'Επισκεφθείτε το Ηλεκτρονικό Κατάστημα' : 'Visit Online Store'}
              </Button>
            </div>
          </a>
        </CardContent>
      </Card>

      {/* Zorbas Bakery */}
      <Card className="shadow-soft border-accent/20">
        <CardContent className="pt-6">
          <a 
            href="https://www.zorbas.com.cy/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block"
          >
            <div className="flex flex-col items-center gap-4 p-4 rounded-lg bg-gradient-to-br from-background to-secondary/30 hover:shadow-lg transition-all">
              <img 
                src={zorbasLogo} 
                alt="Zorbas Bakery" 
                loading="lazy"
                className="h-16 object-contain dark:invert"
              />
              <div className="text-center space-y-2">
                <h3 className="font-semibold text-lg text-foreground">
                  {i18n.language === 'el' ? 'Ψωνίστε Online στο Zorbas' : 'Shop Online at Zorbas Bakery'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {i18n.language === 'el' 
                    ? 'Φρέσκα αρτοποιήματα και γλυκά παραδοσιακά' 
                    : 'Fresh bakery products and traditional sweets'}
                </p>
                <div className="flex items-center justify-center gap-2 p-3 bg-accent/10 rounded-lg border border-accent/20">
                  <Tag className="h-4 w-4 text-accent" />
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">
                      {i18n.language === 'el' ? 'Κωδικός Έκπτωσης' : 'Discount Code'}
                    </p>
                    <p className="font-mono font-bold text-accent">COLLEGE10</p>
                  </div>
                </div>
              </div>
              <Button className="w-full">
                <ShoppingCart className="mr-2 h-4 w-4" />
                {i18n.language === 'el' ? 'Επισκεφθείτε το Ηλεκτρονικό Κατάστημα' : 'Visit Online Store'}
              </Button>
            </div>
          </a>
        </CardContent>
      </Card>

      {/* Alterlife Gym */}
      <Card className="shadow-soft border-accent/20">
        <CardContent className="pt-6">
          <a 
            href="https://alterlife.gr/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block"
          >
            <div className="flex flex-col items-center gap-4 p-4 rounded-lg bg-gradient-to-br from-background to-secondary/30 hover:shadow-lg transition-all">
              <img 
                src={alterlifeLogo} 
                alt="Alterlife Gym" 
                className="h-16 object-contain"
              />
              <div className="text-center space-y-2">
                <h3 className="font-semibold text-lg text-foreground">
                  {i18n.language === 'el' ? 'Γυμνάσου στο Alterlife' : 'Train at Alterlife Gym'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {i18n.language === 'el' 
                    ? 'Fitness excellence για φοιτητές' 
                    : 'Fitness excellence for students'}
                </p>
                <div className="flex items-center justify-center gap-2 p-3 bg-accent/10 rounded-lg border border-accent/20">
                  <Tag className="h-4 w-4 text-accent" />
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">
                      {i18n.language === 'el' ? 'Κωδικός Έκπτωσης' : 'Discount Code'}
                    </p>
                    <p className="font-mono font-bold text-accent">COLLEGE10</p>
                  </div>
                </div>
              </div>
              <Button className="w-full">
                <ShoppingCart className="mr-2 h-4 w-4" />
                {i18n.language === 'el' ? 'Επισκεφθείτε το Γυμναστήριο' : 'Visit Gym Website'}
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

    </div>
  );
};

export default Supermarket;