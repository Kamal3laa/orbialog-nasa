import React, { useState, useEffect } from 'react';
import {
  ActiveScreen,
  PlanetaryTarget,
  AnalogLocation,
} from '@/types';
import { CenterMap } from '@/components/dashboard/CenterMap';
import { audio } from '@/utils/audio';
import { ArrowRight, FileText, CheckCircle2 } from 'lucide-react';

export type EnvironmentMode = 'surface' | 'subsurface' | 'cryo';

export interface TraversePathData {
  waypoints: [{ lat: number; lng: number }, { lat: number; lng: number }];
  distanceKm: number;
}

interface Screen3EarthDiscoveryProps {
  analogLocations: AnalogLocation[];
  selectedTarget: PlanetaryTarget;
  selectedAnalog: AnalogLocation;
  onSelectAnalog: (loc: AnalogLocation) => void;
  onNavigate: (screen: ActiveScreen) => void;
}

export const Screen3EarthDiscovery: React.FC<Screen3EarthDiscoveryProps> = ({
  analogLocations,
  selectedTarget,
  selectedAnalog,
  onSelectAnalog,
  onNavigate,
}) => {
  const [envMode, setEnvMode] = useState<EnvironmentMode>('surface');
  const [, setPathData] = useState<TraversePathData | null>(null);
  const [, setCurrentMapBbox] = useState<number[]>([-71.5, -24.5, -68.5, -23.5]);
  const [activeAnalog, setActiveAnalog] = useState<AnalogLocation>(selectedAnalog);

  // Sync activeAnalog with selectedAnalog prop
  useEffect(() => {
    if (selectedAnalog) {
      setActiveAnalog(selectedAnalog);
    }
  }, [selectedAnalog]);

  const handleSelectLocation = (loc: AnalogLocation) => {
    audio.playClick();
    setActiveAnalog(loc);
    onSelectAnalog(loc);
  };

  return (
    <div className="relative h-[calc(100vh-68px)] w-full bg-slate-950 text-slate-100 overflow-hidden font-inter">
      {/* Full-Width Interactive GIS Map Viewport */}
      <main className="w-full h-full relative overflow-hidden bg-slate-950 flex flex-col z-0">
        <CenterMap
          locations={analogLocations}
          selectedLocationId={activeAnalog?.id}
          onSelectLocation={handleSelectLocation}
          envMode={envMode}
          setEnvMode={setEnvMode}
          onPathDrawn={(path) => setPathData(path)}
          onBboxChange={setCurrentMapBbox}
          className="w-full h-full rounded-none border-none"
        />

        {/* Floating Quick-Action HUD for Active Analog */}
        {activeAnalog && (
          <div className="absolute bottom-6 left-6 z-[1000] max-w-md w-full bg-slate-950/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-4 shadow-2xl space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center space-x-2 text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                  <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                  <span>Selected Earth Analog Site</span>
                </div>
                <h3 className="text-base font-bold text-slate-100 font-mono mt-0.5">
                  {activeAnalog.name}
                </h3>
                <p className="text-xs text-slate-400">
                  {activeAnalog.region}, {activeAnalog.country}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Match Score</span>
                <span className="text-xl font-bold font-mono text-amber-400">
                  {activeAnalog.overallSimilarity.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => {
                  audio.playConfirm();
                  onNavigate('comparison');
                }}
                className="flex-1 flex items-center justify-center space-x-1.5 px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-mono text-xs uppercase tracking-wider transition-colors font-semibold"
              >
                <span>Run Comparison</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  audio.playClick();
                  onNavigate('profile');
                }}
                className="flex items-center justify-center space-x-1.5 px-3 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-lg font-mono text-xs uppercase tracking-wider transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Dossier</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
