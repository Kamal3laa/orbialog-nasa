import React from 'react';
import { ActiveScreen, PlanetaryTarget, AnalogLocation } from '../../types';
import { 
  Compass, 
  Globe, 
  GitCompare, 
  FileText, 
  ArrowRight,
  Radio
} from 'lucide-react';

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
  const handleNavClick = (screen: ActiveScreen) => {
    onNavigate(screen);
  };

  const navItems: { id: ActiveScreen; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'landing', label: 'Mission Overview', icon: Radio },
    { id: 'targets', label: 'Planetary Targets', icon: Compass },
    { id: 'discovery', label: 'Earth Analogs', icon: Globe },
    { id: 'comparison', label: 'Comparison Engine', icon: GitCompare },
    { id: 'profile', label: 'Research Dossier', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-space-void/80 backdrop-blur-2xl border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-8 h-20">
        {/* Brand & Mission Identifier */}
        <div 
          onClick={() => handleNavClick('landing')}
          className="flex items-center space-x-3.5 cursor-pointer group select-none"
        >
          {/* Architectural Orbit Icon */}
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/[0.15] group-hover:border-earth/60 transition-all duration-300 shadow-glass">
            <div className="w-5 h-5 rounded-full border border-starlight-white/40 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-mars shadow-[0_0_10px_#F97316]"></div>
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-earth animate-pulse"></div>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="font-grotesk font-bold tracking-wider text-xl text-starlight-white group-hover:text-starlight-bright transition-colors">
                ORBiALOG
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.10] text-starlight-dim uppercase tracking-wider">
                NASA Space Apps
              </span>
            </div>
            <p className="font-inter text-[11px] text-starlight-subtle tracking-normal">
              Planetary Terrestrial Analog Discovery Platform
            </p>
          </div>
        </div>

        {/* Elegant Pill Navigation Bar */}
        <nav className="hidden md:flex items-center space-x-1 p-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full font-inter text-xs tracking-normal transition-all duration-200 relative ${
                  isActive
                    ? 'text-starlight-white bg-white/[0.10] border border-white/[0.15] font-semibold shadow-inner'
                    : 'text-starlight-dim hover:text-starlight-white hover:bg-white/[0.04]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 transition-colors ${isActive ? 'text-earth' : 'text-starlight-subtle'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Primary Action Button */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleNavClick('discovery')}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-mars to-mars-glow text-starlight-white font-grotesk font-semibold text-xs uppercase tracking-wider hover:shadow-mars-glow hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <span>Explore Analogs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
