import React, { useState, useEffect } from 'react';
import {
  ActiveScreen,
  PlanetaryTarget,
  AnalogLocation,
} from '@/types';
import { LeftSidebar } from '@/components/dashboard/LeftSidebar';
import { CenterMap } from '@/components/dashboard/CenterMap';
import { RightSidebar } from '@/components/dashboard/RightSidebar';
import { audio } from '@/utils/audio';

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
  // Lifted Master Dashboard State
  const [targetPlanet, setTargetPlanet] = useState<'mars' | 'moon'>(
    selectedTarget.planet === 'moon' ? 'moon' : 'mars'
  );
  const [envMode, setEnvMode] = useState<EnvironmentMode>('surface');
  const [pathData, setPathData] = useState<TraversePathData | null>(null);
  const [currentMapBbox, setCurrentMapBbox] = useState<number[]>([-71.5, -24.5, -68.5, -23.5]);
  const [activeAnalog, setActiveAnalog] = useState<AnalogLocation>(selectedAnalog);

  // Sync state if selectedTarget prop changes externally
  useEffect(() => {
    if (selectedTarget.planet) {
      setTargetPlanet(selectedTarget.planet);
    }
  }, [selectedTarget]);

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

  const handleTargetPlanetChange = (planet: 'mars' | 'moon') => {
    audio.playClick();
    setTargetPlanet(planet);
  };

  return (
    <div className="flex h-[calc(100vh-68px)] w-full bg-slate-950 text-slate-100 overflow-hidden font-inter">
      {/* 1. LEFT COLUMN: Control & Multi-Dataset Fusion Panel */}
      <aside className="w-80 flex-shrink-0 border-r border-slate-800 h-full flex flex-col bg-slate-950 z-20 shadow-2xl">
        <LeftSidebar
          targetPlanet={targetPlanet}
          onTargetPlanetChange={handleTargetPlanetChange}
          currentMapBbox={currentMapBbox}
          className="h-full border-none rounded-none"
        />
      </aside>

      {/* 2. CENTER COLUMN: NASA GIBS + Sentinel-2 COG + CSA SAR Center Map */}
      <main className="flex-1 relative h-full w-full overflow-hidden bg-slate-950 flex flex-col z-0">
        <CenterMap
          locations={analogLocations}
          selectedLocationId={activeAnalog.id}
          onSelectLocation={handleSelectLocation}
          envMode={envMode}
          setEnvMode={setEnvMode}
          onPathDrawn={(path) => setPathData(path)}
          onBboxChange={setCurrentMapBbox}
          className="w-full h-full rounded-none border-none"
        />
      </main>

      {/* 3. RIGHT COLUMN: Analytics, Live Physics Compensator & Mission Sandbox */}
      <aside className="w-96 flex-shrink-0 border-l border-slate-800 h-full flex flex-col bg-slate-950 z-20 shadow-2xl">
        <RightSidebar
          targetPlanet={targetPlanet}
          selectedAnalogName={activeAnalog.name}
          pathData={pathData}
          radarScores={{
            slope: activeAnalog.metrics.terrainRoughness,
            temp: activeAnalog.metrics.thermalDeltaMatch,
            ndvi: activeAnalog.metrics.volatilesAnalogy,
            aerosols: activeAnalog.metrics.granulometryMatch,
            morphology: activeAnalog.metrics.geologicalSimilarity,
          }}
          className="h-full border-none rounded-none"
        />
      </aside>
    </div>
  );
};
