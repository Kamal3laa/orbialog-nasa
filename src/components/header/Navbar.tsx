import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Radio, Globe2, Compass, Layers, Activity, Database } from 'lucide-react';
import { sound } from '../../utils/audio';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate }) => {
  const [timeUtc, setTimeUtc] = useState<string>('');
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeUtc(
        now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSoundToggle = () => {
    const active = sound.toggleMute();
    setIsMuted(!active);
  };

  const navItems = [
    { id: 'hero', label: '00 // OVERVIEW', icon: Radio },
    { id: 'explorer', label: '01 // CELESTIAL BODIES', icon: Globe2 },
    { id: 'discovery', label: '02 // EARTH ANALOGS', icon: Compass },
    { id: 'comparison', label: '03 // COMPARISON ENGINE', icon: Layers },
    { id: 'suitability', label: '04 // SUITABILITY MATRIX', icon: Activity },
    { id: 'data-sandbox', label: '05 // PDS TELEMETRY', icon: Database },
  ];

  return (
    <header className="sticky top-0 z-50 bg-charcoal/95 backdrop-blur-md border-b border-white/10 select-none">
      {/* Top Precision Telemetry Strip */}
      <div className="hidden lg:flex items-center justify-between px-6 py-1.5 text-[11px] font-mono-sci border-b border-white/5 bg-obsidian text-stone-gray">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-mineral-white font-medium">SYS-STATUS: OPERATIONAL</span>
          </div>
          <div>MISSION: <span className="text-mineral-white">NASA SPACE APPS 2026</span></div>
          <div>DATUM: <span className="text-mineral-white">WGS84 / IAU2000-MOON / MARS2000</span></div>
          <div>ACTIVE ANALOGS: <span className="text-mars-rust font-semibold">9 SITES</span> (3 CANDIDATE EGYPT)</div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-1.5">
            <Radio className="w-3.5 h-3.5 text-mars-rust" />
            <span>SOL-04 DISTANCE: <span className="text-mineral-white">224.8M KM</span> (12m 30s DELAY)</span>
          </div>
          <div className="text-mineral-white font-medium bg-white/5 px-2 py-0.5 border border-white/10">
            {timeUtc || 'SYNCHRONIZING...'}
          </div>
          <button
            onClick={handleSoundToggle}
            className="flex items-center space-x-1 hover:text-mineral-white transition-colors"
            title={isMuted ? 'Unmute scientific audio' : 'Mute audio'}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span className="text-[10px]">AUDIO: OFF</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-mars-rust animate-pulse" />
                <span className="text-mars-rust text-[10px]">AUDIO: ON</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Primary Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Typographic Logo */}
        <div
          onClick={() => {
            sound.playClick();
            onNavigate('hero');
          }}
          className="cursor-pointer group flex items-center space-x-3"
        >
          <div className="w-9 h-9 border border-mars-rust bg-obsidian flex items-center justify-center relative">
            <div className="w-4 h-4 rounded-full border border-mineral-white/60 group-hover:border-mars-rust transition-colors flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-mars-rust"></div>
            </div>
            <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-mineral-white"></div>
          </div>
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-xl font-heading-sci font-bold tracking-tight text-mineral-white">
                ORB<span className="text-mars-rust">i</span>ALOG
              </span>
              <span className="text-[10px] font-mono-sci text-stone-gray hidden sm:inline px-1.5 py-0.2 border border-white/10 bg-white/5">
                v2.6-ALPHA
              </span>
            </div>
            <p className="text-[10px] font-mono-sci text-stone-gray tracking-wider uppercase">
              Earth is our laboratory
            </p>
          </div>
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  sound.playClick();
                  onNavigate(item.id);
                }}
                className={`px-3 py-1.5 text-xs font-mono-sci transition-all flex items-center space-x-1.5 border ${
                  isActive
                    ? 'border-mars-rust bg-mars-rust/10 text-mineral-white shadow-technical-active'
                    : 'border-transparent text-stone-gray hover:text-mineral-white hover:border-white/15 hover:bg-white/[0.02]'
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Button & Mobile Menu Toggle */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              sound.playChirp();
              onNavigate('comparison');
            }}
            className="hidden sm:inline-flex items-center px-3.5 py-2 text-xs font-mono-sci font-semibold bg-mars-rust hover:bg-mars-light text-white tracking-wider uppercase transition-colors"
          >
            LAUNCH COMPARISON
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-stone-gray hover:text-mineral-white border border-white/10"
            aria-label="Toggle Navigation"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span className={`h-0.5 bg-current transition-transform ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`h-0.5 bg-current ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`h-0.5 bg-current transition-transform ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-obsidian px-4 py-3 space-y-1 font-mono-sci text-xs">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                sound.playClick();
                onNavigate(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 border ${
                activeSection === item.id
                  ? 'border-mars-rust bg-mars-rust/15 text-white'
                  : 'border-white/5 text-stone-gray hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 flex justify-between items-center text-[11px] text-stone-gray border-t border-white/10">
            <span>AUDIO FEEDBACK</span>
            <button
              onClick={handleSoundToggle}
              className="px-2 py-1 border border-white/20 text-mineral-white"
            >
              {isMuted ? 'ENABLE AUDIO' : 'MUTED'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

