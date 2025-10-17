import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SupermarketData {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
}

interface SupermarketMapProps {
  supermarkets: SupermarketData[];
  userLocation: { lat: number; lng: number } | null;
  onMarkerClick?: (supermarket: SupermarketData) => void;
}

const SupermarketMap = ({ supermarkets, userLocation, onMarkerClick }: SupermarketMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [tokenInput, setTokenInput] = useState<string>('');
  const [showTokenInput, setShowTokenInput] = useState<boolean>(false);

  useEffect(() => {
    // Try to get token from environment or state
    const envToken = import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN;
    const savedToken = localStorage.getItem('mapboxToken');
    
    if (envToken) {
      setMapboxToken(envToken);
    } else if (savedToken) {
      setMapboxToken(savedToken);
    } else {
      setShowTokenInput(true);
    }
  }, []);

  const handleTokenSubmit = () => {
    if (tokenInput.trim()) {
      localStorage.setItem('mapboxToken', tokenInput.trim());
      setMapboxToken(tokenInput.trim());
      setShowTokenInput(false);
    }
  };

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    // Determine initial center and zoom
    const center: [number, number] = userLocation 
      ? [userLocation.lng, userLocation.lat]
      : supermarkets.length > 0 && supermarkets[0].longitude && supermarkets[0].latitude
      ? [supermarkets[0].longitude, supermarkets[0].latitude]
      : [33.3642, 35.1725]; // Default to Nicosia, Cyprus

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: center,
      zoom: 12,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: false,
      }),
      'top-right'
    );

    // Add user location marker if available
    if (userLocation) {
      const userMarker = new mapboxgl.Marker({ color: '#3b82f6' })
        .setLngLat([userLocation.lng, userLocation.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML('<div style="padding: 8px;"><strong>Your Location</strong></div>')
        )
        .addTo(map.current);
      markers.current.push(userMarker);
    }

    // Add supermarket markers
    supermarkets.forEach((supermarket) => {
      if (!supermarket.latitude || !supermarket.longitude || !map.current) return;

      const el = document.createElement('div');
      el.className = 'supermarket-marker';
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = '#10b981';
      el.style.border = '3px solid white';
      el.style.cursor = 'pointer';
      el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';

      // Create popup with button
      const popup = new mapboxgl.Popup({ offset: 25, closeButton: true });
      
      const marker = new mapboxgl.Marker(el)
        .setLngLat([supermarket.longitude, supermarket.latitude])
        .setPopup(popup)
        .addTo(map.current);

      // Set popup content with event listener
      marker.getPopup().on('open', () => {
        const popupContent = document.createElement('div');
        popupContent.style.padding = '12px';
        popupContent.style.minWidth = '200px';
        
        popupContent.innerHTML = `
          <h3 style="margin: 0 0 8px 0; font-weight: bold; font-size: 14px;">${supermarket.name}</h3>
          <p style="margin: 0 0 8px 0; font-size: 12px; color: #666;">${supermarket.address}</p>
          ${supermarket.distance ? `<p style="margin: 0 0 8px 0; font-size: 12px; color: #10b981; font-weight: 600;">${supermarket.distance.toFixed(1)} km away</p>` : ''}
          <button 
            id="directions-btn-${supermarket.id}"
            style="
              width: 100%;
              padding: 8px 16px;
              background: #10b981;
              color: white;
              border: none;
              border-radius: 6px;
              font-size: 13px;
              font-weight: 600;
              cursor: pointer;
              margin-top: 8px;
            "
          >
            📍 Get Directions
          </button>
        `;
        
        popup.setDOMContent(popupContent);
        
        // Add click handler to button
        const btn = document.getElementById(`directions-btn-${supermarket.id}`);
        if (btn && onMarkerClick) {
          btn.addEventListener('click', () => {
            onMarkerClick(supermarket);
          });
        }
      });

      markers.current.push(marker);
    });

    // Fit bounds to show all markers if there are supermarkets
    if (supermarkets.length > 0 && map.current) {
      const validSupermarkets = supermarkets.filter(s => s.latitude && s.longitude);
      
      if (validSupermarkets.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        
        validSupermarkets.forEach(s => {
          if (s.latitude && s.longitude) {
            bounds.extend([s.longitude, s.latitude]);
          }
        });

        if (userLocation) {
          bounds.extend([userLocation.lng, userLocation.lat]);
        }

        map.current.fitBounds(bounds, {
          padding: 50,
          maxZoom: 14,
        });
      }
    }

    // Cleanup
    return () => {
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
      map.current?.remove();
    };
  }, [supermarkets, userLocation, onMarkerClick, mapboxToken]);

  if (showTokenInput) {
    return (
      <div className="w-full h-[400px] rounded-lg border bg-secondary/20 flex flex-col items-center justify-center gap-4 p-8">
        <p className="text-center text-muted-foreground mb-2">
          Enter your Mapbox public token to display the map
        </p>
        <p className="text-sm text-muted-foreground text-center mb-4">
          Get your free token at{' '}
          <a 
            href="https://mapbox.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            mapbox.com
          </a>
        </p>
        <div className="flex gap-2 w-full max-w-md">
          <Input
            type="text"
            placeholder="pk.eyJ1..."
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleTokenSubmit()}
            className="flex-1"
          />
          <Button onClick={handleTokenSubmit}>
            Set Token
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-[400px] rounded-lg shadow-lg"
      style={{ minHeight: '400px' }}
    />
  );
};

export default SupermarketMap;
