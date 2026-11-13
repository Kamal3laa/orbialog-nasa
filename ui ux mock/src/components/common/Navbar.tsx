import React, { useState, useEffect } from 'react';
import { ActiveScreen, PlanetaryTarget, AnalogLocation } from '../../types';
import { 
  Compass, 
  Globe, 
  Layers, 
  GitCompare, 
  FileText, 
  Cpu, 
  Database, 
  Volume2, 
  VolumeX, 
  Activity,
  Radio
} from 'lucide-react';
import { audio } from '../../utils/audio';

interface NavbarProps {
  currentScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  selectedTarget: PlanetaryTarget;
  selectedAnalog: AnalogLocation;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  selectedTarget,
  selectedAnalog,
}) => {
  const [utcTime, setUtcTime] = useState<string>('');
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().slice(17, 25) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleNavClick = (screen: ActiveScreen) => {
    audio.playClick();
    onNavigate(screen);
  };

  const toggleAudio = () => {
    const next = !audioEnabled;
    setAudioEnabled(next);
    audio.setEnabled(next);
    if (next) audio.playConfirm();
  };

  const navItems: { id: ActiveScreen; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'landing', label: 'Mission Intro', icon: Radio },
    { id: 'targets', label: 'Planetary Targets', icon: Compass },
    { id: 'discovery', label: 'Earth Analogs', icon: Globe },
    { id: 'comparison', label: 'Comparison Engine', icon: GitCompare },
    { id: 'profile', label: 'Research Profile', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-charcoal/95 border-b border-obsidian-border backdrop-blur-md">
      {/* Top Aerospace Telemetry Ticker */}
      <div className="flex items-center justify-between px-6 py-1 bg-obsidian-deep text-[11px] font-mono border-b border-obsidian-border/50 text-stone-gray">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-telemetry-emerald animate-pulse"></span>
            <span className="text-mineral-white font-medium tracking-wider">ORBiALOG FLIGHT SUITE</span>
          </div>
          <span className="text-stone-dark">|</span>
          <span>NASA SPACE APPS CHALLENGE 2026</span>
          <span className="text-stone-dark">|</span>
          <span className="text-telemetry-cyan font-mono">PDS-GATEWAY: SYNCHRONIZED</span>
        </div>

        <div className="flex items-center space-x-5">
          <div className="flex items-center space-x-2">
            <span className="text-stone-dark">ACTIVE TARGET:</span>
            <span className="text-mars font-semibold uppercase">{selectedTarget.name.split(' ')[0]} ({selectedTarget.designation})</span>
          </div>
          <span className="text-stone-dark">|</span>
          <div className="flex items-center space-x-2">
            <span className="text-stone-dark">CANDIDATE:</span>
            <span className="text-earth-bright font-semibold">{selectedAnalog.name.split(' (')[0]}</span>
          </div>
          <span className="text-stone-dark">|</span>
          <div className="text-mineral-white font-mono tracking-wider font-semibold">
            {utcTime || '00:00:00 UTC'}
          </div>
          <button
            onClick={toggleAudio}
            className="hover:text-mineral-white transition-colors p-0.5"
            title={audioEnabled ? 'Mute Scientific Audio' : 'Enable Scientific Audio'}
          >
            {audioEnabled ? <Volume2 className="w-3.5 h-3.5 text-mineral-muted" /> : <VolumeX className="w-3.5 h-3.5 text-stone-dark" />}
          </button>
        </div>
      </div>

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
              <span className="text-[9px] font-mono px-1.5 py-0.5 bg-obsidian-card border border-stone-gray/30 text-stone-gray uppercase">
                v2.6-NASA
              </span>
            </div>
            <p className="font-mono text-[9px] text-stone-gray tracking-wider uppercase -mt-0.5">
              Planetary Terrestrial Analog Discovery Engine
            </p>
          </div>
        </div>

        {/* Screen Tabs */}
        <nav className="flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 font-mono text-xs transition-all relative ${
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

        {/* Mission Direct CTA Pill */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleNavClick('discovery')}
            className="flex items-center space-x-2 px-3.5 py-1.5 bg-mars hover:bg-mars-glow text-mineral-white font-mono text-xs uppercase tracking-wider transition-all duration-150 shadow-sm"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>EXPLORE ANALOGS</span>
          </button>
        </div>
      </div>
    </header>
  );
};

