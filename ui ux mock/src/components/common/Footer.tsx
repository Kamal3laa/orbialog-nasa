import React from 'react';
import { Shield, Database, ExternalLink, Orbit } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-charcoal-deep border-t border-obsidian-border font-mono text-xs text-stone-gray py-8 px-8 mt-12 select-none">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand & Project Info */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Orbit className="w-4 h-4 text-mars" />
            <span className="font-grotesk font-bold text-mineral-white tracking-widest text-sm">ORBiALOG PLATFORM</span>
          </div>
          <p className="text-stone-gray text-[11px] leading-relaxed">
            A planetary analog discovery and scientific comparison system developed for the 2026 NASA Space Apps Challenge.
          </p>
          <div className="text-[10px] text-stone-dark">
            PROJECT CODE: NASASPACEAPPS-2026-ORBIALOG
          </div>
        </div>

        {/* Scientific Repositories */}
        <div className="space-y-2">
          <div className="text-mineral-white font-semibold uppercase text-[11px] tracking-wider flex items-center space-x-1.5">
            <Database className="w-3.5 h-3.5 text-telemetry-cyan" />
            <span>PRIMARY REPOSITORIES</span>
          </div>
          <ul className="space-y-1.5 text-[11px]">
            <li className="hover:text-mineral-white flex items-center space-x-1">
              <span>NASA Planetary Data System (PDS)</span>
            </li>
            <li className="hover:text-mineral-white flex items-center space-x-1">
              <span>NASA Earthdata (ASTER, MODIS)</span>
            </li>
            <li className="hover:text-mineral-white flex items-center space-x-1">
              <span>USGS Astrogeology Science Center</span>
            </li>
            <li className="hover:text-mineral-white flex items-center space-x-1">
              <span>ESA Planetary Science Archive</span>
            </li>
          </ul>
        </div>

        {/* Scientific Classification Notice */}
        <div className="space-y-2">
          <div className="text-mineral-white font-semibold uppercase text-[11px] tracking-wider flex items-center space-x-1.5">
            <Shield className="w-3.5 h-3.5 text-earth-bright" />
            <span>DATA FIDELITY & INTEGRITY</span>
          </div>
          <p className="text-stone-gray text-[11px] leading-relaxed">
            All physical measurements, coordinates, and orbital rasters are derived directly from certified USGS, NASA, and ESA datasets. Similarity indices are calculated via multivariate Mahalanobis and Cosine distance algorithms.
          </p>
        </div>

        {/* Scientific Citations */}
        <div className="space-y-2">
          <div className="text-mineral-white font-semibold uppercase text-[11px] tracking-wider">
            MISSION DIRECTIVES
          </div>
          <p className="text-stone-gray text-[11px] leading-relaxed">
            Enabling planetary exploration teams to benchmark rover robotics, deep drill mechanisms, and human EVA operations in high-fidelity Earth analog environments.
          </p>
          <div className="pt-2 text-[10px] text-stone-dark">
            LATENCY: 0.04 ms | WGS84 ELLIPSOID GRS80
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-4 border-t border-obsidian-border flex flex-col md:flex-row items-center justify-between text-[10px] text-stone-dark">
        <div>
          © 2026 ORBiALOG Consortium. NASA Space Apps Challenge 2026 Submission.
        </div>
        <div className="flex items-center space-x-4 mt-2 md:mt-0">
          <span>EARTH OBSERVATION DATA: NASA / USGS / ESA</span>
          <span>PLANETARY DATA: LRO / MRO / HRSC</span>
        </div>
      </div>
    </footer>
  );
};

