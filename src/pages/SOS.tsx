import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Phone, MapPin, Pill, AlertCircle, Shield, Ambulance, Flame } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SOS = () => {
  const { t } = useTranslation();
  const { toast } = useToast();

  const emergencyNumbers = [
    { icon: Shield, label: t('sos.police'), number: '100', color: 'text-blue-600' },
    { icon: Ambulance, label: t('sos.ambulance'), number: '166', color: 'text-red-600' },
    { icon: Flame, label: t('sos.fire'), number: '199', color: 'text-orange-600' },
  ];

  const handleCall112 = () => {
    window.location.href = 'tel:112';
  };

  const pharmacyUrl = 'https://www.google.com/maps/search/pharmacy+near+me';

  const handleFindPharmacy = async () => {
    const url = pharmacyUrl;
    
    // Try multiple methods to open the link
    try {
      // Try window.open first
      const w = window.open(url, '_blank', 'noopener,noreferrer');
      if (w) return;
    } catch (_) {}

    // Try creating an anchor and clicking it
    try {
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    } catch (_) {}

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: t('common.linkCopied') || 'Link copied',
        description: t('common.externalLinksBlocked') || 'External links are blocked in preview. Paste the link into a new tab.',
      });
    } catch (_) {
      alert(url);
    }
  };

  const handleCopyPharmacyLink = async () => {
    try {
      await navigator.clipboard.writeText(pharmacyUrl);
      toast({
        title: t('common.linkCopied') || 'Link copied',
        description: 'Pharmacy search link copied. Paste it in a new tab if the preview blocks external sites.',
      });
    } catch (_) {
      alert(pharmacyUrl);
    }
  };

  const handleShareLocation = async () => {
    if (!navigator.geolocation) {
      toast({
        title: t('sos.locationError') || 'Location Error',
        description: t('sos.geolocationNotSupported') || 'Geolocation is not supported by your browser.',
        variant: 'destructive',
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const locationUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        
        // Try to share using native share API
        if (navigator.share) {
          try {
            await navigator.share({
              title: 'My Current Location',
              text: 'Here is my current location',
              url: locationUrl,
            });
            return;
          } catch (error) {
            // If share fails, fall through to clipboard
          }
        }
        
        // Fallback: copy to clipboard
        try {
          await navigator.clipboard.writeText(locationUrl);
          toast({
            title: t('common.locationCopied') || 'Location copied',
            description: t('common.locationCopiedDesc') || 'Your location link has been copied to clipboard. Share it with others!',
          });
        } catch (_) {
          // Last resort: try to open in new tab
          window.open(locationUrl, '_blank');
        }
      },
      (error) => {
        toast({
          title: t('sos.locationError') || 'Location Error',
          description: t('sos.locationPermissionDenied') || 'Unable to get your location. Please check your browser permissions.',
          variant: 'destructive',
        });
      }
    );
  };

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

        <Button
          onClick={handleFindPharmacy}
          className="w-full h-16 text-lg bg-accent hover:bg-accent/90 text-primary shadow-gold"
          variant="default"
        >
          <Pill className="h-6 w-6 mr-2" />
          {t('sos.findPharmacy')}
        </Button>
        <Button
          onClick={handleCopyPharmacyLink}
          className="w-full h-10 text-sm"
          variant="outline"
        >
          {t('common.copyLink') || 'Copy pharmacy link'}
        </Button>

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

      {/* Safety Tip */}
      <Card className="bg-accent/5 border-accent/20">
        <CardContent className="pt-6">
          <p className="text-sm text-center text-foreground">
            💙 <strong>Stay Safe:</strong> Always save these numbers in your phone contacts. 
            In an emergency, every second counts.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SOS;
