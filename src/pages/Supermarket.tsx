import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ShoppingCart, Store, MapPin, TrendingDown, CheckSquare, Plus, Trash2, Phone, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { User, Session } from '@supabase/supabase-js';

interface ShoppingItem {
  id: string;
  text: string;
  checked: boolean;
}

interface Supermarket {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  phone?: string;
  hours?: string;
  website?: string;
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
  const [profile, setProfile] = useState<Profile | null>(null);
  const [supermarkets, setSupermarkets] = useState<Supermarket[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [newItem, setNewItem] = useState('');

  // Check authentication
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        navigate('/auth');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session) {
          navigate('/auth');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Fetch user profile and supermarkets
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      setLoading(true);
      
      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('country, city')
        .eq('user_id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        toast({
          title: 'Error loading profile',
          description: profileError.message,
          variant: 'destructive',
        });
      } else {
        setProfile(profileData);
        
        // Fetch supermarkets based on user's country and city
        const { data: supermarketsData, error: supermarketsError } = await supabase
          .from('supermarkets')
          .select('*')
          .eq('country', profileData.country)
          .eq('city', profileData.city)
          .order('name');

        if (supermarketsError) {
          console.error('Error fetching supermarkets:', supermarketsError);
        } else {
          setSupermarkets(supermarketsData || []);
        }
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

  const findNearbyStores = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          window.open(
            `https://www.google.com/maps/search/supermarket/@${latitude},${longitude},15z`,
            '_blank'
          );
        },
        () => {
          window.open('https://www.google.com/maps/search/supermarket', '_blank');
        }
      );
    } else {
      window.open('https://www.google.com/maps/search/supermarket', '_blank');
    }
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

  if (loading) {
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

      {/* Find Nearby Stores */}
      <Card className="shadow-soft">
        <CardContent className="pt-6">
          <Button
            onClick={findNearbyStores}
            className="w-full h-12 text-lg"
            size="lg"
          >
            <MapPin className="mr-2 h-5 w-5" />
            {t('supermarket.findNearby')}
          </Button>
        </CardContent>
      </Card>

      {/* Local Supermarkets */}
      {supermarkets.length > 0 && (
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Store className="h-5 w-5 text-accent" />
              {i18n.language === 'el' ? 'Τοπικά Σούπερ Μάρκετ' : 'Local Supermarkets'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {supermarkets.map((market) => (
                <div
                  key={market.id}
                  className="p-4 rounded-lg border bg-secondary/20 space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{market.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {market.address}, {market.city}
                      </p>
                      {market.phone && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <Phone className="h-3 w-3" />
                          {market.phone}
                        </p>
                      )}
                      {market.hours && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3" />
                          {market.hours}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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