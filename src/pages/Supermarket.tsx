import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ShoppingCart, Store, MapPin, TrendingDown, CheckSquare, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShoppingItem {
  id: string;
  text: string;
  checked: boolean;
}

interface SavedStore {
  id: string;
  name: string;
  address: string;
}

const Supermarket = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [newItem, setNewItem] = useState('');
  const [savedStores, setSavedStores] = useState<SavedStore[]>([]);
  const [storeName, setStoreName] = useState('');
  const [storeAddress, setStoreAddress] = useState('');

  // Load from localStorage
  useEffect(() => {
    const savedList = localStorage.getItem('shoppingList');
    const savedStoresList = localStorage.getItem('savedStores');
    if (savedList) setShoppingList(JSON.parse(savedList));
    if (savedStoresList) setSavedStores(JSON.parse(savedStoresList));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
  }, [shoppingList]);

  useEffect(() => {
    localStorage.setItem('savedStores', JSON.stringify(savedStores));
  }, [savedStores]);

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

  const addStore = () => {
    if (!storeName.trim() || !storeAddress.trim()) return;
    const store: SavedStore = {
      id: Date.now().toString(),
      name: storeName.trim(),
      address: storeAddress.trim(),
    };
    setSavedStores([...savedStores, store]);
    setStoreName('');
    setStoreAddress('');
    toast({
      title: t('supermarket.storeAdded'),
      description: storeName,
    });
  };

  const deleteStore = (id: string) => {
    setSavedStores(savedStores.filter((store) => store.id !== id));
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
        'Χρησιμοποιήστε κουπόνια και κάρτες αφοσίωσης',
        'Συγκρίνετε τιμές ανά κιλό/λίτρο',
      ]
    : [
        'Buy store brands - save up to 30%',
        'Shop based on weekly sales',
        'Buy seasonal fruits and vegetables',
        'Never shop when hungry',
        'Use coupons and loyalty cards',
        'Compare prices per kg/liter',
      ];

  const essentials = i18n.language === 'el'
    ? [
        'Ρύζι, ζυμαρικά, φακές (βασικά)',
        'Αυγά, γάλα, τυρί',
        'Ψωμί ή τοστ',
        'Κατεψυγμένα λαχανικά',
        'Ελαιόλαδο, αλάτι, μπαχαρικά',
        'Καφές/τσάι',
        'Χαρτί κουζίνας & τουαλέτας',
        'Απορρυπαντικά',
      ]
    : [
        'Rice, pasta, lentils (staples)',
        'Eggs, milk, cheese',
        'Bread or toast',
        'Frozen vegetables',
        'Olive oil, salt, spices',
        'Coffee/tea',
        'Paper towels & toilet paper',
        'Cleaning supplies',
      ];

  const priceComparison = i18n.language === 'el'
    ? [
        'Lidl & Σκλαβενίτης: Χαμηλές τιμές σε βασικά',
        'AB Βασιλόποulos: Καλή ποιότητα, μέτριες τιμές',
        'My Market: Καλές προσφορές σε φρέσκα',
        'Masoutis: Ανταγωνιστικές τιμές',
      ]
    : [
        'Lidl & Sklavenitis: Low prices on basics',
        'AB Vassilopoulos: Good quality, moderate prices',
        'My Market: Great deals on fresh produce',
        'Masoutis: Competitive pricing',
      ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="mb-2 flex items-center justify-center gap-2 text-foreground">
          <ShoppingCart className="h-8 w-8 text-accent" />
          {t('supermarket.title')}
        </h1>
        <p className="text-muted-foreground">{t('supermarket.subtitle')}</p>
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

      {/* Saved Stores */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Store className="h-5 w-5 text-accent" />
            {t('supermarket.savedStores')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder={t('supermarket.storeName')}
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
            />
            <Input
              placeholder={t('supermarket.storeAddress')}
              value={storeAddress}
              onChange={(e) => setStoreAddress(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addStore()}
            />
            <Button onClick={addStore} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              {t('supermarket.addStore')}
            </Button>
          </div>

          {savedStores.length > 0 && (
            <div className="space-y-2 mt-4">
              {savedStores.map((store) => (
                <div
                  key={store.id}
                  className="flex items-start gap-2 p-3 rounded-lg border bg-secondary/20"
                >
                  <Store className="h-4 w-4 text-accent mt-1" />
                  <div className="flex-1">
                    <p className="font-medium">{store.name}</p>
                    <p className="text-sm text-muted-foreground">{store.address}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteStore(store.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
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

      {/* Price Comparison */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <TrendingDown className="h-5 w-5 text-accent" />
            {t('supermarket.priceComparison')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {priceComparison.map((tip, index) => (
              <li key={index} className="flex items-start gap-2 p-2 rounded bg-secondary/20">
                <span className="text-accent mt-1">🏪</span>
                <span className="text-foreground">{tip}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Supermarket;
