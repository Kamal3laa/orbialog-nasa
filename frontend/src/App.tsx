import React, { useState, useEffect, useCallback } from 'react';
import { ActiveScreen, PlanetaryTarget, AnalogLocation } from './types';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { SpaceAgencyDataModal } from './components/common/SpaceAgencyDataModal';
import { Screen1Landing } from './screens/Screen1Landing';
import { Screen2TargetSelection } from './screens/Screen2TargetSelection';
import { Screen3EarthDiscovery } from './screens/Screen3EarthDiscovery';
import { Screen4ComparisonEngine } from './screens/Screen4ComparisonEngine';
import { Screen5LocationProfile } from './screens/Screen5LocationProfile';
import { Screen6MissionApplication } from './screens/Screen6MissionApplication';
import { Screen7Methodology } from './screens/Screen7Methodology';
import { audio } from './utils/audio';
import { orbialogApi } from './services/orbialogApi';
import { AlertTriangle, RefreshCw, Radio, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ActiveScreen>('landing');
  const [planetaryTargets, setPlanetaryTargets] = useState<PlanetaryTarget[]>([]);
  const [analogLocations, setAnalogLocations] = useState<AnalogLocation[]>([]);
  const [selectedTarget, setSelectedTarget] = useState<PlanetaryTarget | null>(null);
  const [selectedAnalog, setSelectedAnalog] = useState<AnalogLocation | null>(null);
  const [isDataModalOpen, setIsDataModalOpen] = useState<boolean>(false);
  const [isApiLoading, setIsApiLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  // Ingest live targets & analog sites strictly from Backend API (Flowchart: S1/S2 --> T, S3 --> S)
  const fetchLiveBackendData = useCallback(async () => {
    setIsApiLoading(true);
    setApiError(null);

    try {
      const [targetsRes, sitesRes] = await Promise.all([
        orbialogApi.getTargets(),
        orbialogApi.getSites({ page: 1, limit: 50 }),
      ]);

      if (targetsRes.data && targetsRes.data.length > 0) {
        setPlanetaryTargets(targetsRes.data);
        setSelectedTarget((prev) => prev || targetsRes.data![0]);
      }

      if (sitesRes.data && sitesRes.data.length > 0) {
        setAnalogLocations(sitesRes.data);
        setSelectedAnalog((prev) => prev || sitesRes.data[0]);
      }

      if (!targetsRes.isLive && !sitesRes.isLive && !orbialogApi.isDemoModeActive()) {
        setApiError(`Could not reach live backend at ${orbialogApi.getBaseUrl()}. Start your backend server (cd backend && npm run dev) or set VITE_API_URL in .env.`);
      } else {
        setApiError(null);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (!orbialogApi.isDemoModeActive()) {
        setApiError(`Backend connection failed: ${msg}`);
      }
    } finally {
      setIsApiLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveBackendData();
  }, [fetchLiveBackendData]);

  const handleEnableDemoMode = () => {
    audio.playConfirm?.();
    orbialogApi.setDemoMode(true);
    setIsDemoMode(true);
    setApiError(null);
    fetchLiveBackendData();
  };

  // Keyboard navigation shortcuts for professional aerospace interface feel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if typing in an input
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      switch (e.key) {
        case '1':
          setCurrentScreen('landing');
          audio.playClick();
          break;
        case '2':
          setCurrentScreen('targets');
          audio.playClick();
          break;
        case '3':
          setCurrentScreen('discovery');
          audio.playClick();
          break;
        case '4':
          setCurrentScreen('comparison');
          audio.playClick();
          break;
        case '5':
          setCurrentScreen('profile');
          audio.playClick();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Screen transition handler with auto-scroll to top
  const handleNavigate = (screen: ActiveScreen) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeTarget = selectedTarget || planetaryTargets[0] || (null as unknown as PlanetaryTarget);
  const activeAnalog = selectedAnalog || analogLocations[0] || (null as unknown as AnalogLocation);

  return (
    <div className="min-h-screen bg-charcoal text-mineral-white font-inter flex flex-col selection:bg-mars selection:text-mineral-white">
      {/* Top Aerospace Mission Control Navigation Bar (5 Requested Tabs) */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        selectedTarget={activeTarget}
        selectedAnalog={activeAnalog}
        onOpenDataModal={() => setIsDataModalOpen(true)}
      />

      {/* Backend API Connection Alert / Offline Status Bar */}
      {apiError && !isDemoMode && (
        <div className="bg-amber-950/80 border-b border-amber-600/40 px-6 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center space-x-2.5 text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>BACKEND OFFLINE:</strong> The frontend strictly consumes data from <code>{orbialogApi.getBaseUrl()}</code>. Start your backend (<code>cd backend && npm run dev</code>) to load live data.
            </span>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={fetchLiveBackendData}
              disabled={isApiLoading}
              className="px-3 py-1 bg-amber-900/60 hover:bg-amber-800/80 border border-amber-600/50 rounded text-amber-200 transition-colors flex items-center space-x-1"
            >
              <RefreshCw className={`w-3 h-3 ${isApiLoading ? 'animate-spin' : ''}`} />
              <span>Retry</span>
            </button>
            <button
              onClick={handleEnableDemoMode}
              className="px-3 py-1 bg-white/[0.08] hover:bg-white/[0.15] border border-white/[0.20] rounded text-starlight-white transition-colors flex items-center space-x-1"
            >
              <Sparkles className="w-3 h-3 text-earth" />
              <span>Preview Demo Data</span>
            </button>
          </div>
        </div>
      )}

      {isDemoMode && (
        <div className="bg-blue-950/60 border-b border-cyan-800/40 px-6 py-1.5 flex items-center justify-between text-[11px] font-mono text-cyan-300">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>DEMO MODE ACTIVE (Explicitly Requested Preview) — Backend data remains primary source of truth.</span>
          </div>
          <button
            onClick={() => {
              orbialogApi.setDemoMode(false);
              setIsDemoMode(false);
              fetchLiveBackendData();
            }}
            className="text-[10px] text-cyan-400 underline hover:text-white"
          >
            Switch to Strict Live API
          </button>
        </div>
      )}

      {/* Screen Router Viewport */}
      <main className="flex-1 w-full">
        {isApiLoading && planetaryTargets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4 font-mono text-xs">
            <Radio className="w-8 h-8 text-mars animate-pulse" />
            <div className="text-mineral-white font-semibold tracking-wider uppercase">
              CONNECTING TO ORBiALOG BACKEND TELEMETRY...
            </div>
            <div className="text-stone-gray text-[11px]">
              Target endpoint: {orbialogApi.getBaseUrl()}/targets
            </div>
          </div>
        ) : (
          <>
            {currentScreen === 'landing' && (
              <Screen1Landing
                onNavigate={handleNavigate}
                onSelectTarget={setSelectedTarget}
                planetaryTargets={planetaryTargets}
                featuredAnalogs={analogLocations.filter((l) => l.featuredEgypt)}
              />
            )}

            {currentScreen === 'targets' && (
              <Screen2TargetSelection
                planetaryTargets={planetaryTargets}
                selectedTarget={activeTarget}
                onSelectTarget={setSelectedTarget}
                onNavigate={handleNavigate}
              />
            )}

            {currentScreen === 'discovery' && (
              <Screen3EarthDiscovery
                analogLocations={analogLocations}
                selectedTarget={activeTarget}
                selectedAnalog={activeAnalog}
                onSelectAnalog={setSelectedAnalog}
                onNavigate={handleNavigate}
                onOpenDataModal={() => setIsDataModalOpen(true)}
              />
            )}

            {currentScreen === 'comparison' && (
              <Screen4ComparisonEngine
                planetaryTargets={planetaryTargets}
                analogLocations={analogLocations}
                selectedTarget={activeTarget}
                selectedAnalog={activeAnalog}
                onSelectTarget={setSelectedTarget}
                onSelectAnalog={setSelectedAnalog}
                onNavigate={handleNavigate}
              />
            )}

            {currentScreen === 'profile' && (
              <Screen5LocationProfile
                selectedAnalog={activeAnalog}
                selectedTarget={activeTarget}
                analogLocations={analogLocations}
                onSelectAnalog={setSelectedAnalog}
                onNavigate={handleNavigate}
              />
            )}

            {currentScreen === 'applications' && (
              <Screen6MissionApplication
                selectedAnalog={activeAnalog}
                selectedTarget={activeTarget}
                onNavigate={handleNavigate}
                onSelectAnalog={setSelectedAnalog}
                analogLocations={analogLocations}
              />
            )}

            {currentScreen === 'methodology' && (
              <Screen7Methodology onNavigate={handleNavigate} />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <Footer onOpenDataModal={() => setIsDataModalOpen(true)} />

      {/* Space Agency Data & APIs Modal Hub */}
      {activeTarget && activeAnalog && (
        <SpaceAgencyDataModal
          isOpen={isDataModalOpen}
          onClose={() => setIsDataModalOpen(false)}
          selectedAnalog={activeAnalog}
          selectedTarget={activeTarget}
        />
      )}
    </div>
  );
};
