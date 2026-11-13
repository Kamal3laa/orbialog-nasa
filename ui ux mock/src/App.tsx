import React, { useState, useEffect } from 'react';
import { ActiveScreen, PlanetaryTarget, AnalogLocation } from './types';
import { PLANETARY_TARGETS } from './data/planetaryTargets';
import { ANALOG_LOCATIONS } from './data/analogLocations';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { Screen1Landing } from './screens/Screen1Landing';
import { Screen2TargetSelection } from './screens/Screen2TargetSelection';
import { Screen3EarthDiscovery } from './screens/Screen3EarthDiscovery';
import { Screen4ComparisonEngine } from './screens/Screen4ComparisonEngine';
import { Screen5LocationProfile } from './screens/Screen5LocationProfile';
import { Screen6MissionApplication } from './screens/Screen6MissionApplication';
import { Screen7Methodology } from './screens/Screen7Methodology';
import { audio } from './utils/audio';

export const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ActiveScreen>('landing');
  const [selectedTarget, setSelectedTarget] = useState<PlanetaryTarget>(PLANETARY_TARGETS[3]); // Default: Jezero Crater (Mars)
  const [selectedAnalog, setSelectedAnalog] = useState<AnalogLocation>(ANALOG_LOCATIONS[0]); // Default: White Desert (Egypt)

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

  return (
    <div className="min-h-screen bg-charcoal text-mineral-white font-inter flex flex-col selection:bg-mars selection:text-mineral-white">
      {/* Top Aerospace Mission Control Navigation Bar */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        selectedTarget={selectedTarget}
        selectedAnalog={selectedAnalog}
      />

      {/* Screen Router Viewport */}
      <main className="flex-1 w-full">
        {currentScreen === 'landing' && (
          <Screen1Landing
            onNavigate={handleNavigate}
            onSelectTarget={setSelectedTarget}
            planetaryTargets={PLANETARY_TARGETS}
            featuredAnalogs={ANALOG_LOCATIONS.filter((l) => l.overallSimilarity >= 90)}
          />
        )}

        {currentScreen === 'targets' && (
          <Screen2TargetSelection
            planetaryTargets={PLANETARY_TARGETS}
            selectedTarget={selectedTarget}
            onSelectTarget={setSelectedTarget}
            onNavigate={handleNavigate}
          />
        )}

        {currentScreen === 'discovery' && (
          <Screen3EarthDiscovery
            analogLocations={ANALOG_LOCATIONS}
            selectedTarget={selectedTarget}
            selectedAnalog={selectedAnalog}
            onSelectAnalog={setSelectedAnalog}
            onNavigate={handleNavigate}
          />
        )}

        {currentScreen === 'comparison' && (
          <Screen4ComparisonEngine
            planetaryTargets={PLANETARY_TARGETS}
            analogLocations={ANALOG_LOCATIONS}
            selectedTarget={selectedTarget}
            selectedAnalog={selectedAnalog}
            onSelectTarget={setSelectedTarget}
            onSelectAnalog={setSelectedAnalog}
            onNavigate={handleNavigate}
          />
        )}

        {currentScreen === 'profile' && (
          <Screen5LocationProfile
            selectedAnalog={selectedAnalog}
            selectedTarget={selectedTarget}
            analogLocations={ANALOG_LOCATIONS}
            onSelectAnalog={setSelectedAnalog}
            onNavigate={handleNavigate}
          />
        )}

        {currentScreen === 'applications' && (
          <Screen6MissionApplication
            selectedAnalog={selectedAnalog}
            selectedTarget={selectedTarget}
            onNavigate={handleNavigate}
            onSelectAnalog={setSelectedAnalog}
            analogLocations={ANALOG_LOCATIONS}
          />
        )}

        {currentScreen === 'methodology' && (
          <Screen7Methodology onNavigate={handleNavigate} />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

