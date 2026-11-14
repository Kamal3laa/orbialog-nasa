import React, { useEffect, useState } from 'react';
import { ActiveScreen, PlanetaryTarget, AnalogLocation } from '../../types';
import { 
  Compass, 
  Globe, 
  GitCompare, 
  FileText, 
  Activity,
  Radio,
  Cpu,
  Binary
} from 'lucide-react';
import { orbialogApi } from '../../services/orbialogApi';

interface NavbarProps {
  currentScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  selectedTarget: PlanetaryTarget;
  selectedAnalog: AnalogLocation;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
}) => {
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);

  useEffect(() => {
    orbialogApi.getHealth().then((res) => {
      setApiOnline(res.status === 'ok');
    }).catch(() => {
      setApiOnline(false);
    });
  }, []);

  const handleNavClick = (screen: ActiveScreen) => {
    onNavigate(screen);
  };

  const navItems: { id: ActiveScreen; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'landing', label: 'Mission Intro', icon: Radio },
    { id: 'targets', label: 'Targets', icon: Compass },
    { id: 'discovery', label: 'Earth Analogs', icon: Globe },
    { id: 'comparison', label: 'Comparison Engine', icon: GitCompare },
    { id: 'profile', label: 'Dossier', icon: FileText },
    { id: 'applications', label: 'Mission Apps', icon: Cpu },
    { id: 'methodology', label: 'Methodology & Sandbox', icon: Binary },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-charcoal/95 border-b border-obsidian-border backdrop-blur-md">
      {/* Main Navigation Bar */}
      <div className="flex items-center justify-between px-6 py-2.5">
        {/* Brand & Mission Badge */}
        <div 
          onClick={() => handleNavClick('landing')}
          className="flex items-center space-x-3 cursor-pointer group select-none"
        >
          <div className="relative flex items-center justify-center w-8 h-8 rounded-sm bg-obsidian border border-stone-gray/40 group-hover:border-mars transition-colors">
            <div className="w-4 h-4 rounded-full border border-mineral-white flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-mars"></div>
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-grotesk font-bold tracking-widest text-lg text-mineral-white">ORBiALOG</span>
              {apiOnline !== null && (
                <span
                  title={apiOnline ? 'Backend API v1 Connected' : 'Offline Mode (Local Fallback Active)'}
                  className={`inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-medium ${
                    apiOnline
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-700/50'
                      : 'bg-amber-950/80 text-amber-400 border border-amber-700/50'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${apiOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                  <span>{apiOnline ? 'API: v1' : 'DEMO MODE'}</span>
                </span>
              )}
            </div>
            <p className="font-mono text-[9px] text-stone-gray tracking-wider uppercase -mt-0.5">
              Planetary Terrestrial Analog Discovery Engine
            </p>
          </div>
        </div>

        {/* Screen Tabs */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 font-mono text-xs transition-all relative ${
                  isActive
                    ? 'text-mineral-white bg-obsidian-surface border-t-2 border-mars font-medium'
                    : 'text-stone-gray hover:text-mineral-white hover:bg-obsidian/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-mars' : 'text-stone-gray'}`} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-mars to-transparent"></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action CTA */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleNavClick('discovery')}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-mars hover:bg-mars-glow text-mineral-white font-mono text-xs uppercase tracking-wider transition-all duration-150 shadow-sm"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>EXPLORE</span>
          </button>
        </div>
      </div>
    </header>
  );
};
