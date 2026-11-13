import React from 'react';
import { Database, ShieldAlert, ExternalLink, Orbit, Layers, Globe, Radio } from 'lucide-react';
import { NASA_OFFICIAL_DISCLAIMER } from '../../data/spaceAgencyResources';

interface FooterProps {
  onOpenDataModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDataModal }) => {
  return (
    <footer className="w-full bg-space-void border-t border-white/[0.08] font-inter text-xs text-starlight-dim py-12 px-6 lg:px-8 mt-20 select-none">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Official NASA Disclaimer Banner */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex items-start space-x-3.5 text-xs text-starlight-subtle leading-relaxed">
          <ShieldAlert className="w-4 h-4 text-telemetry-amber shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-starlight-white font-grotesk tracking-wide uppercase text-[11px] block mb-0.5">
              NASA Official Data &amp; Web Resources Disclaimer
            </span>
            <p className="text-starlight-dim text-[11px] leading-relaxed">
              {NASA_OFFICIAL_DISCLAIMER}
            </p>
          </div>
        </div>

        {/* 4-Column Agency Portals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1: Brand & Space Apps Context */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-white/[0.10] to-white/[0.02] border border-white/[0.15] flex items-center justify-center">
                <Orbit className="w-3.5 h-3.5 text-mars" />
              </div>
              <span className="font-grotesk font-bold text-starlight-white tracking-wider text-sm">
                ORBiALOG PLATFORM
              </span>
            </div>
            <p className="text-[11px] text-starlight-subtle leading-relaxed">
              Planetary Terrestrial Analog Discovery &amp; Benchmarking Suite developed for the NASA Space Apps Challenge 2026.
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenDataModal}
                className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.10] border border-white/[0.12] text-earth text-xs font-medium transition-colors"
              >
                <Database className="w-3.5 h-3.5" />
                <span>Launch Agency APIs Hub</span>
              </button>
            </div>
          </div>

          {/* Column 2: NASA Data & Resources (USA) */}
          <div className="space-y-2.5">
            <div className="flex items-center space-x-2 text-starlight-white font-grotesk font-semibold text-xs uppercase tracking-wider">
              <span>🇺🇸</span>
              <span>NASA Resources</span>
            </div>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <a 
                  href="https://search.earthdata.nasa.gov/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-earth transition-colors flex items-center justify-between group"
                >
                  <span>NASA Earthdata Search</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a 
                  href="https://worldview.earthdata.nasa.gov/index.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-earth transition-colors flex items-center justify-between group"
                >
                  <span>NASA Worldview</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a 
                  href="https://pds.nasa.gov/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-earth transition-colors flex items-center justify-between group"
                >
                  <span>Planetary Data System (PDS)</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a 
                  href="https://pds-geosciences.wustl.edu/missions/lro/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-earth transition-colors flex items-center justify-between group"
                >
                  <span>LRO Lunar Geosciences Node</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a 
                  href="https://pds-geosciences.wustl.edu/missions/lro/diviner.htm" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-earth transition-colors flex items-center justify-between group"
                >
                  <span>LRO Diviner Lunar Data</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: CSA (Canada) & JAXA (Japan) */}
          <div className="space-y-2.5">
            <div className="flex items-center space-x-2 text-starlight-white font-grotesk font-semibold text-xs uppercase tracking-wider">
              <span>🇨🇦 🇯🇵</span>
              <span>CSA &amp; JAXA Partners</span>
            </div>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <a 
                  href="https://donnees-data.asc-csa.gc.ca/en/dataset/rcm" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-earth transition-colors flex items-center justify-between group"
                >
                  <span>CSA RADARSAT Constellation (RCM)</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a 
                  href="https://donnees-data.asc-csa.gc.ca/en/dataset/radarsat1" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-earth transition-colors flex items-center justify-between group"
                >
                  <span>CSA RADARSAT-1 Open Archive</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/asc-csa/Synthetic_Aperture_Radar_Tutorial" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-earth transition-colors flex items-center justify-between group text-starlight-bright"
                >
                  <span>CSA SAR Python / QGIS Tutorial</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li className="pt-1 border-t border-white/[0.05]">
                <a 
                  href="https://gportal.jaxa.jp/gpr/index/index" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-earth transition-colors flex items-center justify-between group"
                >
                  <span>JAXA G-Portal Environmental</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: ESA (Europe) & Open Science */}
          <div className="space-y-2.5">
            <div className="flex items-center space-x-2 text-starlight-white font-grotesk font-semibold text-xs uppercase tracking-wider">
              <span>🇪🇺</span>
              <span>ESA Resources</span>
            </div>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <a 
                  href="https://dataspace.copernicus.eu/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-earth transition-colors flex items-center justify-between group"
                >
                  <span>Copernicus Data Space Ecosystem</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a 
                  href="https://opensciencedata.esa.int/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-earth transition-colors flex items-center justify-between group"
                >
                  <span>ESA Open Science Catalog</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li className="pt-2 text-[10px] text-starlight-subtle leading-relaxed">
                Sentinel-1 SAR, Sentinel-2 Multispectral 10m, and Open Science processing pipelines integrated across all 12 global analogs.
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-starlight-subtle">
          <div>
            &copy; 2026 ORBiALOG Consortium. Developed for the NASA Space Apps Challenge 2026.
          </div>
          <div className="flex items-center space-x-4">
            <span>NASA EOSDIS &bull; PDS</span>
            <span>CSA RCM &bull; RADARSAT-1</span>
            <span>ESA Copernicus</span>
            <span>JAXA G-Portal</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
