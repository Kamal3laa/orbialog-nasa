import React from 'react';
import { ArrowUp, Globe2, ShieldCheck, Heart } from 'lucide-react';
import { sound } from '../../utils/audio';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    sound.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/10 bg-obsidian text-stone-gray py-12 px-4 sm:px-6 lg:px-8 font-mono-sci text-xs select-none">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Wordmark & Tagline */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 border border-mars-rust bg-charcoal flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-mars-rust"></div>
              </div>
              <span className="text-xl font-heading-sci font-bold text-mineral-white">
                ORB<span className="text-mars-rust">i</span>ALOG
              </span>
            </div>
            <p className="text-stone-gray font-sans text-xs leading-relaxed">
              Planetary science research platform investigating Earth analog environments for permanent Moon bases and Mars exploration sites.
            </p>
            <div className="text-[11px] text-earth-accent">
              DEVELOPED FOR NASA SPACE APPS CHALLENGE 2026
            </div>
          </div>

          {/* Col 2: Scientific Data Sources */}
          <div className="space-y-2">
            <span className="text-mineral-white font-bold block uppercase text-[11px]">
              DATA ATTRIBUTION & CITATIONS
            </span>
            <ul className="space-y-1 text-stone-gray text-[11px]">
              <li>NASA Planetary Data System (PDS)</li>
              <li>NASA Earthdata (ASTER GDEM v3)</li>
              <li>MRO CRISM Hyperspectral Archive</li>
              <li>LRO Lunar Laser Altimeter (LOLA)</li>
              <li>USGS Astrogeology Science Center</li>
              <li>ESA Planetary Science Archive (PSA)</li>
            </ul>
          </div>

          {/* Col 3: Research Focus & Egyptian Testbeds */}
          <div className="space-y-2">
            <span className="text-mineral-white font-bold block uppercase text-[11px]">
              EGYPTIAN CANDIDATE ANALOGS
            </span>
            <ul className="space-y-1 text-stone-gray text-[11px]">
              <li>White Desert (Khoman Chalk Yardangs)</li>
              <li>Qattara Depression (Hypersaline Sabkhas)</li>
              <li>Southern Sinai (Precambrian Batholiths)</li>
              <li className="pt-1 text-mars-rust text-[10px]">
                *Candidate sites requiring field ground-truth validation
              </li>
            </ul>
          </div>

          {/* Col 4: Platform Telemetry & Back to Top */}
          <div className="space-y-3">
            <span className="text-mineral-white font-bold block uppercase text-[11px]">
              SYSTEM SPECIFICATIONS
            </span>
            <div className="space-y-1 text-[11px] text-stone-gray">
              <div>ENGINE: React 18 / Three.js / R3F / Vite</div>
              <div>CARTOGRAPHY: SVG GIS Vector Projection</div>
              <div>GEODETIC DATUM: WGS84 / IAU-2000</div>
              <div>BUILD VERSION: 2026.11-RELEASE</div>
            </div>

            <button
              onClick={scrollToTop}
              className="mt-2 w-full py-2 bg-charcoal hover:bg-white/5 border border-white/15 text-mineral-white transition-colors flex items-center justify-center space-x-1.5"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>RETURN TO TOP</span>
            </button>
          </div>
        </div>

        {/* Bottom Legal & Space Apps Statement */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div>
            © 2026 ORBiALOG Research Consortium. NASA Space Apps Challenge 2026 Entry.
          </div>

          <div className="flex items-center space-x-2 text-stone-gray">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Dedicated to peaceful scientific exploration of Earth, Luna, and Mars.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

