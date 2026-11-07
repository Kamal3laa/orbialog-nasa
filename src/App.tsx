import React, { useState } from 'react';
import { TargetPlanet, PlanetaryTarget, AnalogSite } from './types';
import { Navbar } from './components/header/Navbar';
import { HeroSection } from './components/hero/HeroSection';
import { PlanetaryExplorer } from './components/explorer/PlanetaryExplorer';
import { AnalogDiscovery } from './components/discovery/AnalogDiscovery';
import { ComparisonEngine } from './components/comparison/ComparisonEngine';
import { MissionSuitability } from './components/suitability/MissionSuitability';
import { DataTelemetrySandbox } from './components/dataSandbox/DataTelemetrySandbox';
import { ResearchProfileModal } from './components/profile/ResearchProfileModal';
import { Footer } from './components/footer/Footer';

export const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [currentPlanet, setCurrentPlanet] = useState<TargetPlanet>('Mars');
  
  // Cross-component communication state
  const [selectedTargetForComparison, setSelectedTargetForComparison] = useState<PlanetaryTarget | null>(null);
  const [selectedAnalogForComparison, setSelectedAnalogForComparison] = useState<AnalogSite | null>(null);
  const [modalSite, setModalSite] = useState<AnalogSite | null>(null);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectTargetForComparison = (target: PlanetaryTarget) => {
    setSelectedTargetForComparison(target);
    setCurrentPlanet(target.planetId);
  };

  const handleSelectAnalogForComparison = (site: AnalogSite) => {
    setSelectedAnalogForComparison(site);
  };

  const handleOpenProfileModal = (site: AnalogSite) => {
    setModalSite(site);
  };

  return (
    <div className="min-h-screen bg-charcoal text-mineral-white flex flex-col selection:bg-mars-rust selection:text-white">
      {/* Top Navigation */}
      <Navbar activeSection={activeSection} onNavigate={handleNavigate} />

      {/* Main Experience Stream */}
      <main className="flex-1">
        {/* Hero Experience */}
        <div id="hero">
          <HeroSection
            currentPlanet={currentPlanet}
            onSelectPlanet={(planet) => setCurrentPlanet(planet)}
            onNavigate={handleNavigate}
          />
        </div>

        {/* Section 01: Planetary Explorer */}
        <PlanetaryExplorer
          currentPlanet={currentPlanet}
          onSelectPlanet={(planet) => setCurrentPlanet(planet)}
          onSelectTargetForComparison={handleSelectTargetForComparison}
          onNavigate={handleNavigate}
        />

        {/* Section 02: Earth Analog Discovery (Global & Egyptian Candidates) */}
        <AnalogDiscovery
          onSelectSiteForProfile={handleOpenProfileModal}
          onSelectSiteForComparison={handleSelectAnalogForComparison}
          onNavigate={handleNavigate}
        />

        {/* Section 03: Analog Comparison Engine */}
        <ComparisonEngine
          initialTarget={selectedTargetForComparison}
          initialAnalog={selectedAnalogForComparison}
          onSelectSiteForProfile={handleOpenProfileModal}
        />

        {/* Section 04: Mission Suitability & The Planetary Gap */}
        <MissionSuitability
          onNavigateToDiscovery={() => handleNavigate('discovery')}
        />

        {/* Section 05: Scientific Data Telemetry Sandbox */}
        <DataTelemetrySandbox />
      </main>

      {/* Deep-Dive Scientific Research Dossier Modal */}
      <ResearchProfileModal
        site={modalSite}
        onClose={() => setModalSite(null)}
        onLoadIntoComparison={(site) => {
          setSelectedAnalogForComparison(site);
          handleNavigate('comparison');
        }}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;

