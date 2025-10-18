import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Phone, MapPin, Pill, AlertCircle, Shield, Ambulance, Flame } from 'lucide-react';
import { openNativeMap, openNativeMapWithLocation } from '@/lib/nativeMaps';
import { useToast } from '@/hooks/use-toast';

const SOS = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [showPharmacyFallback, setShowPharmacyFallback] = useState(false);
  const [pharmacyArea, setPharmacyArea] = useState('');
  const [callDialogOpen, setCallDialogOpen] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState('');

  const emergencyNumbers = [
    { icon: Shield, label: t('sos.police'), number: '100', color: 'text-blue-600' },
    { icon: Ambulance, label: t('sos.ambulance'), number: '166', color: 'text-red-600' },
    { icon: Flame, label: t('sos.fire'), number: '199', color: 'text-orange-600' },
  ];

  const handleCall112 = () => {
    window.location.href = 'tel:112';
  };

  const handleFindPharmacy = () => {
    // Show privacy message
    toast({
      title: t('sos.locationPermission'),
      duration: 3000,
    });

    if (!navigator.geolocation) {
      // No geolocation - open Google Maps with generic search
      window.open('https://www.google.com/maps/search/?api=1&query=pharmacy', '_blank');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        window.open(`https://www.google.com/maps/search/?api=1&query=pharmacy&query_place_id=${latitude},${longitude}`, '_blank');
      },
      () => {
        // Permission denied - show fallback or open generic search
        setShowPharmacyFallback(true);
      },
      {
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  };

  const handlePharmacySearch = () => {
    if (!pharmacyArea.trim()) return;
    const query = `pharmacy ${pharmacyArea}`;
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, '_blank');
    setShowPharmacyFallback(false);
    setPharmacyArea('');
  };

  const handleShareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
          
          if (navigator.share) {
            navigator.share({
              title: 'My Current Location',
              text: 'Here is my current location',
              url: locationUrl,
            });
          } else {
            window.open(locationUrl, '_blank');
          }
        },
        (error) => {
          alert('Unable to get your location. Please check your browser permissions.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleCallNumber = (number: string) => {
    setSelectedNumber(number);
    setCallDialogOpen(true);
  };

  const confirmCall = () => {
    window.location.href = `tel:${selectedNumber}`;
    setCallDialogOpen(false);
  };

  const cyprusNumbers = [
    { icon: '📞', label: t('sos.generalEmergency'), number: '112' },
    { icon: '👮', label: t('sos.police'), number: '112 / 199' },
    { icon: '🚑', label: t('sos.ambulance'), number: '112 / 199' },
    { icon: '🔥', label: t('sos.fire'), number: '112 / 199' },
    { icon: '⚓', label: t('sos.coastGuard'), number: '1441' },
    { icon: '🌲', label: t('sos.forestFire'), number: '1407' },
  ];

  const greeceNumbers = [
    { icon: '📞', label: t('sos.generalEmergency'), number: '112' },
    { icon: '👮', label: t('sos.police'), number: '100' },
    { icon: '🚑', label: t('sos.ambulance'), number: '166' },
    { icon: '🔥', label: t('sos.fire'), number: '199' },
    { icon: '⚓', label: t('sos.coastGuard'), number: '108' },
    { icon: '🧳', label: t('sos.touristPolice'), number: '1571' },
    { icon: '🌲', label: t('sos.forestFire'), number: '191' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="mb-2 flex items-center justify-center gap-2 text-foreground">
          <Phone className="h-8 w-8 text-accent" />
          {t('sos.title')}
        </h1>
        <p className="text-muted-foreground">{t('sos.subtitle')}</p>
      </div>

      {/* Emergency Alert */}
      <Alert className="border-destructive bg-destructive/5">
        <AlertCircle className="h-5 w-5 text-destructive" />
        <AlertTitle className="text-destructive font-semibold">
          {t('sos.emergency')}
        </AlertTitle>
        <AlertDescription className="text-foreground">
          In any emergency in Greece or Cyprus, dial <strong className="text-destructive">112</strong>
        </AlertDescription>
      </Alert>

      {/* Quick Action Buttons */}
      <div className="space-y-3">
        <Button
          onClick={handleCall112}
          className="w-full h-16 text-lg bg-destructive hover:bg-destructive/90 text-white shadow-strong"
        >
          <Phone className="h-6 w-6 mr-2" />
          {t('sos.call112')}
        </Button>

        <div className="space-y-2">
          <Button
            onClick={handleFindPharmacy}
            className="w-full h-16 text-lg bg-accent hover:bg-accent/90 text-primary shadow-gold"
            variant="default"
          >
            <Pill className="h-6 w-6 mr-2" />
            {t('sos.findPharmacy')}
          </Button>
          
          {showPharmacyFallback && (
            <div className="flex gap-2">
              <Input
                placeholder={t('sos.searchByArea')}
                value={pharmacyArea}
                onChange={(e) => setPharmacyArea(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handlePharmacySearch()}
                className="flex-1"
              />
              <Button onClick={handlePharmacySearch}>
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <Button
          onClick={handleShareLocation}
          className="w-full h-16 text-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-medium"
        >
          <MapPin className="h-6 w-6 mr-2" />
          {t('sos.shareLocation')}
        </Button>
      </div>

      {/* Important Numbers */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl text-foreground">
            <Phone className="h-5 w-5 text-accent" />
            {t('sos.importantNumbers')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {emergencyNumbers.map((emergency, index) => {
              const Icon = emergency.icon;
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-smooth"
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-6 w-6 ${emergency.color}`} />
                    <span className="font-medium text-foreground">{emergency.label}</span>
                  </div>
                  <a
                    href={`tel:${emergency.number}`}
                    className="text-2xl font-bold text-accent hover:text-accent/80 transition-smooth"
                  >
                    {emergency.number}
                  </a>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Numbers by Country */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl text-foreground">
            <Phone className="h-5 w-5 text-destructive" />
            {t('sos.emergencyNumbersTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cyprus Column */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground mb-3">{t('sos.cyprus')}</h3>
              {cyprusNumbers.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-smooth"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-sm font-medium text-foreground">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-accent">{item.number}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCallNumber(item.number.split(' / ')[0])}
                      className="h-8 w-8 p-0"
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Greece Column */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground mb-3">{t('sos.greece')}</h3>
              {greeceNumbers.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-smooth"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-sm font-medium text-foreground">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-accent">{item.number}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCallNumber(item.number)}
                      className="h-8 w-8 p-0"
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Safety Tip */}
      <Card className="bg-accent/5 border-accent/20">
        <CardContent className="pt-6">
          <p className="text-sm text-center text-foreground">
            💙 <strong>Stay Safe:</strong> Always save these numbers in your phone contacts. 
            In an emergency, every second counts.
          </p>
        </CardContent>
      </Card>

      {/* Call Confirmation Dialog */}
      <AlertDialog open={callDialogOpen} onOpenChange={setCallDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('sos.callConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('sos.callConfirmMessage')}
              <div className="mt-2 text-2xl font-bold text-accent">{selectedNumber}</div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('sos.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCall} className="bg-destructive hover:bg-destructive/90">
              <Phone className="h-4 w-4 mr-2" />
              {t('sos.call')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SOS;
