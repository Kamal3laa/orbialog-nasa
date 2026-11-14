import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { AnalogLocation } from '../../types';
import { 
  Globe, 
  MapPin, 
  Compass, 
  Satellite, 
  Layers
} from 'lucide-react';
import { audio } from '../../utils/audio';

interface RealGISMapProps {
  locations: AnalogLocation[];
  selectedLocationId: string | null;
  onSelectLocation: (loc: AnalogLocation) => void;
  className?: string;
}

export type GoogleBasemapMode = 'google-satellite' | 'google-hybrid' | 'google-terrain';

export const RealGISMap: React.FC<RealGISMapProps> = ({
  locations,
  selectedLocationId,
  onSelectLocation,
  className = '',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const currentTileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  // Basemap selection (Google Maps: Satellite, Hybrid, Terrain — No Dark)
  const [basemapMode, setBasemapMode] = useState<GoogleBasemapMode>('google-satellite');

  // Real-time Coordinate & Telemetry HUD Probe
  const [mouseProbe, setMouseProbe] = useState<{ lat: number; lng: number } | null>(null);

  // Google Maps Tile Providers
  const getGoogleTileLayer = (mode: GoogleBasemapMode): L.TileLayer => {
    switch (mode) {
      case 'google-satellite':
        return L.tileLayer('https://mt{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
          subdomains: ['0', '1', '2', '3'],
          maxZoom: 20,
          attribution: 'Imagery © Google Satellite',
        });
      case 'google-hybrid':
        return L.tileLayer('https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
          subdomains: ['0', '1', '2', '3'],
          maxZoom: 20,
          attribution: 'Imagery © Google Hybrid (Satellite + Labels)',
        });
      case 'google-terrain':
      default:
        return L.tileLayer('https://mt{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
          subdomains: ['0', '1', '2', '3'],
          maxZoom: 20,
          attribution: 'Imagery © Google Terrain (Topography + Relief)',
        });
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // 1. Initialize Leaflet Map
    const map = L.map(mapContainerRef.current, {
      center: [20.0, 0.0],
      zoom: 2.2,
      minZoom: 2,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: false,
    });
    mapInstanceRef.current = map;

    // 2. Add Google Maps Basemap Tile Layer
    const tileLayer = getGoogleTileLayer(basemapMode);
    tileLayer.addTo(map);
    currentTileLayerRef.current = tileLayer;

    // 3. Custom Tactical Candidate Markers
    locations.forEach((loc) => {
      if (!loc || !loc.coordinates || typeof loc.coordinates.lat !== 'number' || typeof loc.coordinates.lng !== 'number') {
        return;
      }
      const isSelected = loc.id === selectedLocationId;
      const isMars = loc.primaryTargetAnalog === 'mars';
      const color = isSelected ? '#38BDF8' : isMars ? '#F97316' : '#E2E8F0';

      const customIcon = L.divIcon({
        className: 'custom-tactical-pin',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px;">
            ${
              isSelected
                ? `<div style="position: absolute; width: 28px; height: 28px; border: 2px solid ${color}; border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; opacity: 0.85;"></div>`
                : ''
            }
            <div style="width: 14px; height: 14px; background: ${color}; border: 2px solid #030712; border-radius: 50%; box-shadow: 0 0 10px ${color};"></div>
            <div style="position: absolute; width: 4px; height: 4px; background: #ffffff; border-radius: 50%;"></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([loc.coordinates.lat, loc.coordinates.lng], { icon: customIcon });
      const googleMapsUrl = `https://www.google.com/maps/@${loc.coordinates.lat},${loc.coordinates.lng},14z/data=!3m1!1e3`;

      // Studio-Grade Scientific Dossier Popup
      marker.bindPopup(`
        <div style="font-family: 'Inter', sans-serif; font-size: 12px; color: #F8FAFC; padding: 12px; min-width: 250px; background: #0B1120; border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);">
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: ${color}; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">
            <span>[${loc.flagCode}] ${loc.country.toUpperCase()}</span>
            <span style="background: rgba(255,255,255,0.06); padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.1);">${loc.overallSimilarity.toFixed(1)}% MATCH</span>
          </div>
          <div style="font-size: 15px; font-weight: 700; color: #FFFFFF; margin-top: 6px; font-family: 'Space Grotesk', sans-serif; line-height: 1.2;">
            ${loc.name}
          </div>
          <div style="margin-top: 8px; padding: 6px 8px; background: rgba(255,255,255,0.04); border-radius: 6px; border-left: 3px solid ${color};">
            <div style="font-size: 11px; color: #94A3B8;">
              Target: <strong style="color: #FFFFFF;">${loc.primaryTargetAnalog.toUpperCase()}</strong> | Elev: <strong style="color: #FFFFFF;">${loc.elevationMeters}m</strong>
            </div>
            <div style="font-size: 10px; color: #64748B; margin-top: 2px;">
              ${loc.climateType}
            </div>
          </div>
          <div style="font-size: 10px; color: #38BDF8; margin-top: 8px; font-family: monospace;">
            ${loc.coordinates.display}
          </div>
          <div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.08); display: flex; justify-content: space-between; align-items: center;">
            <a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer" style="color: #38BDF8; text-decoration: none; font-size: 11px; font-weight: 600; display: inline-flex; align-items: center; gap: 4px;">
              View on Google Maps ↗
            </a>
          </div>
        </div>
      `);

      marker.on('click', () => {
        onSelectLocation(loc);
      });

      marker.addTo(map);
      markersRef.current[loc.id] = marker;
    });

    // 4. Live Mouse Coordinates Probe
    map.on('mousemove', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      setMouseProbe({
        lat: Math.round(lat * 1000) / 1000,
        lng: Math.round(lng * 1000) / 1000,
      });
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [locations, onSelectLocation]);

  // Handle Basemap Switcher without destroying the map
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (currentTileLayerRef.current) {
      mapInstanceRef.current.removeLayer(currentTileLayerRef.current);
    }

    const newLayer = getGoogleTileLayer(basemapMode);
    newLayer.addTo(mapInstanceRef.current);
    currentTileLayerRef.current = newLayer;
  }, [basemapMode]);

  // Center on selected location when changed
  useEffect(() => {
    if (selectedLocationId && mapInstanceRef.current && markersRef.current[selectedLocationId]) {
      const loc = locations.find((l) => l.id === selectedLocationId);
      if (loc && loc.coordinates && typeof loc.coordinates.lat === 'number' && typeof loc.coordinates.lng === 'number') {
        mapInstanceRef.current.flyTo([loc.coordinates.lat, loc.coordinates.lng], 6, {
          duration: 1.2,
        });
        markersRef.current[selectedLocationId]?.openPopup();
      }
    }
  }, [selectedLocationId, locations]);

  return (
    <div className={`relative w-full h-[580px] bg-space-void rounded-2xl border border-white/[0.08] overflow-hidden select-none shadow-2xl ${className}`}>
      {/* Real Google Maps Viewport */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Map Floating Mission Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between px-5 py-3 rounded-xl bg-space-void/85 border border-white/[0.12] backdrop-blur-2xl font-inter text-xs shadow-glass gap-3">
        <div className="flex items-center space-x-3 text-starlight-muted">
          <Globe className="w-4 h-4 text-earth" />
          <span className="text-starlight-white font-grotesk font-semibold uppercase tracking-wider text-xs">
            Google Maps Global Earth Observation
          </span>
          <span className="text-white/20">|</span>
          <span className="text-starlight-dim text-[11px] font-normal">
            {basemapMode === 'google-satellite'
              ? 'Satellite Optical Imagery'
              : basemapMode === 'google-hybrid'
              ? 'Hybrid (Satellite + Vector Cartography)'
              : 'Terrain Topographic Elevation'}
          </span>
        </div>

        {/* Google Basemap Style Tabs (Satellite, Hybrid, Terrain — No Dark) */}
        <div className="flex items-center space-x-1.5 p-1 rounded-lg bg-white/[0.05] border border-white/[0.08]">
          {(
            [
              ['google-satellite', 'Satellite'],
              ['google-hybrid', 'Hybrid'],
              ['google-terrain', 'Terrain'],
            ] as [GoogleBasemapMode, string][]
          ).map(([mode, label]) => (
            <button
              key={mode}
              onClick={() => {
                setBasemapMode(mode);
              }}
              className={`px-3 py-1.5 rounded-md font-inter text-xs tracking-wide transition-all duration-150 ${
                basemapMode === mode
                  ? 'bg-white/[0.15] text-starlight-white font-semibold shadow-inner'
                  : 'text-starlight-dim hover:text-starlight-white hover:bg-white/[0.04]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Left: Coordinates Telemetry Probe */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-none font-inter text-xs bg-space-void/85 border border-white/[0.10] px-4 py-2.5 rounded-xl backdrop-blur-xl shadow-glass flex items-center space-x-3">
        <span className="w-2 h-2 rounded-full bg-telemetry-emerald animate-pulse"></span>
        {mouseProbe ? (
          <div className="text-[11px] text-starlight-white font-mono">
            Lat: <strong className="text-earth">{mouseProbe.lat.toFixed(4)}°</strong> &bull; Lng: <strong className="text-earth">{mouseProbe.lng.toFixed(4)}°</strong>
          </div>
        ) : (
          <div className="text-[11px] text-starlight-subtle">Hover cursor over terrain to read coordinates</div>
        )}
      </div>

      {/* Bottom Right: Global Analog Legend */}
      <div className="absolute bottom-4 right-4 z-20 pointer-events-none font-inter text-xs bg-space-void/85 border border-white/[0.10] px-4 py-2.5 rounded-xl backdrop-blur-xl shadow-glass flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-mars shadow-[0_0_6px_#F97316]"></span>
          <span className="text-starlight-dim text-[11px]">Mars Analog</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-slate-300"></span>
          <span className="text-starlight-dim text-[11px]">Moon Analog</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-earth shadow-[0_0_6px_#38BDF8]"></span>
          <span className="text-starlight-white text-[11px] font-medium">Selected</span>
        </div>
      </div>
    </div>
  );
};