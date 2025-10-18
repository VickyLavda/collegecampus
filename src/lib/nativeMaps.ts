/**
 * Utility for opening native map apps with location-based searches
 * Supports iOS (Apple Maps), Android (default maps), and web fallback (OpenStreetMap)
 */

interface OpenNativeMapOptions {
  searchTerm: string;
  latitude?: number;
  longitude?: number;
  area?: string;
}

/**
 * Detects the platform and returns appropriate map URI
 */
function getMapUri({ searchTerm, latitude, longitude, area }: OpenNativeMapOptions): string {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);
  
  const query = area ? `${searchTerm}+${area}` : searchTerm;
  
  // iOS - Apple Maps
  if (isIOS) {
    if (latitude !== undefined && longitude !== undefined) {
      return `maps://?q=${encodeURIComponent(searchTerm)}&ll=${latitude},${longitude}`;
    }
    return `maps://?q=${encodeURIComponent(query)}`;
  }
  
  // Android - Default maps app
  if (isAndroid) {
    if (latitude !== undefined && longitude !== undefined) {
      return `geo:${latitude},${longitude}?q=${encodeURIComponent(searchTerm)}`;
    }
    return `geo:0,0?q=${encodeURIComponent(query)}`;
  }
  
  // Web fallback - Google Maps
  if (latitude !== undefined && longitude !== undefined) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchTerm)}&query_place_id=${latitude},${longitude}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/**
 * Opens native map app with the given search term and optional location
 */
export function openNativeMap(options: OpenNativeMapOptions): void {
  const uri = getMapUri(options);
  window.open(uri, '_blank');
}

/**
 * Requests user location and opens map with coordinates
 * Falls back to search without coordinates if permission denied
 */
export function openNativeMapWithLocation(
  searchTerm: string,
  onLocationDenied?: () => void
): Promise<void> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      // No geolocation support - open without coordinates
      openNativeMap({ searchTerm });
      if (onLocationDenied) onLocationDenied();
      resolve();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        openNativeMap({ searchTerm, latitude, longitude });
        resolve();
      },
      () => {
        // Permission denied or error - open without coordinates
        openNativeMap({ searchTerm });
        if (onLocationDenied) onLocationDenied();
        resolve();
      },
      {
        timeout: 10000,
        maximumAge: 300000, // Cache for 5 minutes
      }
    );
  });
}
