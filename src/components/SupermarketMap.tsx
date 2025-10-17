import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';
import { Navigation, ExternalLink } from 'lucide-react';

interface Supermarket {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  phone?: string;
  hours?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
}

interface SupermarketMapProps {
  supermarkets: Supermarket[];
  userLocation: { lat: number; lng: number } | null;
  mapboxToken: string;
}

const SupermarketMap: React.FC<SupermarketMapProps> = ({ supermarkets, userLocation, mapboxToken }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedMarket, setSelectedMarket] = useState<Supermarket | null>(null);

  useEffect(() => {
    if (!mapContainer.current || !userLocation || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [userLocation.lng, userLocation.lat],
      zoom: 13,
    });

    // Add user location marker
    new mapboxgl.Marker({ color: '#1e40af' })
      .setLngLat([userLocation.lng, userLocation.lat])
      .setPopup(new mapboxgl.Popup().setHTML('<p class="font-medium">Your Location</p>'))
      .addTo(map.current);

    // Add supermarket markers
    supermarkets.forEach((market) => {
      if (market.latitude && market.longitude && map.current) {
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div class="p-2">
            <h3 class="font-semibold text-sm">${market.name}</h3>
            <p class="text-xs text-muted-foreground">${market.address}</p>
            ${market.distance ? `<p class="text-xs mt-1">${market.distance.toFixed(1)} km away</p>` : ''}
          </div>
        `);

        const marker = new mapboxgl.Marker({ color: '#d4af37' })
          .setLngLat([market.longitude, market.latitude])
          .setPopup(popup)
          .addTo(map.current);

        marker.getElement().addEventListener('click', () => {
          setSelectedMarket(market);
        });
      }
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      map.current?.remove();
    };
  }, [supermarkets, userLocation, mapboxToken]);

  const openDirections = (market: Supermarket) => {
    if (market.latitude && market.longitude) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${market.latitude},${market.longitude}`,
        '_blank'
      );
    }
  };

  return (
    <div className="relative w-full h-[500px] rounded-lg overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {selectedMarket && (
        <div className="absolute bottom-4 left-4 right-4 bg-background/95 backdrop-blur-sm border rounded-lg p-4 shadow-lg">
          <h3 className="font-semibold text-foreground">{selectedMarket.name}</h3>
          <p className="text-sm text-muted-foreground">{selectedMarket.address}</p>
          {selectedMarket.distance && (
            <p className="text-sm text-accent mt-1">{selectedMarket.distance.toFixed(1)} km away</p>
          )}
          <div className="flex gap-2 mt-3">
            <Button
              onClick={() => openDirections(selectedMarket)}
              size="sm"
              className="flex-1"
            >
              <Navigation className="mr-2 h-4 w-4" />
              Get Directions
            </Button>
            {selectedMarket.website && (
              <Button
                onClick={() => window.open(selectedMarket.website, '_blank')}
                variant="outline"
                size="sm"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}
      
      {!mapboxToken && (
        <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center">
          <p className="text-muted-foreground">Map requires Mapbox token</p>
        </div>
      )}
    </div>
  );
};

export default SupermarketMap;
