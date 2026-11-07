import React from 'react';
import { AnalogSite } from '../../types';
import { formatCoordinates } from '../../utils/calculations';
import { X, Download, FileText, Globe2, ShieldCheck, Database, Beaker, AlertTriangle, ExternalLink } from 'lucide-react';
import { sound } from '../../utils/audio';

interface ResearchProfileModalProps {
  site: AnalogSite | null;
  onClose: () => void;
  onLoadIntoComparison: (site: AnalogSite) => void;
}

export const ResearchProfileModal: React.FC<ResearchProfileModalProps> = ({
  site,
  onClose,
  onLoadIntoComparison,
}) => {
  if (!site) return null;

  const handleExportJson = () => {
    sound.playChirp();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(site, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ORBiALOG_${site.id}_Research_Dossier.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-charcoal/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-obsidian border border-white/20 shadow-2xl text-mineral-white my-auto max-h-[92vh] flex flex-col reticle-corner">
        {/* Modal Top Technical Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/15 bg-charcoal/80 flex-shrink-0">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-[11px] font-mono-sci text-stone-gray">
              <span className="w-2 h-2 rounded-full bg-mars-rust"></span>
              <span>NASA SPACE APPS 2026 // RESEARCH PROFILE DOSSIER</span>
              <span>|</span>
              <span className="text-mars-rust font-semibold">{site.status.replace(/_/g, ' ')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading-sci font-bold text-mineral-white">
              {site.name}
            </h2>
            <p className="text-xs font-mono-sci text-stone-gray">
              {site.region}, {site.country} // LAT/LNG: {formatCoordinates(site.coordinates.lat, site.coordinates.lng)} // ELEV: {site.elevationM} m
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportJson}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono-sci text-mineral-white transition-colors"
              title="Download Raw JSON Scientific Dossier"
            >
              <Download className="w-3.5 h-3.5" />
              <span>EXPORT DOSSIER</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-2 text-stone-gray hover:text-white border border-white/15 hover:bg-white/5 transition-colors"
              aria-label="Close Profile"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 text-sm font-sans flex-1">
          {/* Egyptian Candidate Notice */}
          {site.isEgyptianCandidate && (
            <div className="p-4 bg-mars-rust/15 border border-mars-rust/40 text-xs font-mono-sci text-mineral-white flex items-start space-x-3">
              <ShieldCheck className="w-5 h-5 text-mars-rust flex-shrink-0" />
              <div className="space-y-1">
                <span className="font-bold text-mars-rust block">
                  ★ DESIGNATED CANDIDATE TERRESTRIAL TESTBED // EGYPT REGIONAL EXPEDITION
                </span>
                <p className="text-stone-gray leading-relaxed">
                  This site is currently evaluated by ORBiALOG as an accessible hyper-arid proving ground for Mars Gale/Jezero rover traverses and Valles Marineris canyon analogs. Quantitative field ground-truthing campaigns are proposed for the 2026-2027 testing window.
                </p>
              </div>
            </div>
          )}

          {/* Geological Stratigraphy & Context */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono-sci text-stone-gray uppercase tracking-wider flex items-center space-x-2">
              <FileText className="w-3.5 h-3.5 text-mars-rust" />
              <span>01. GEOLOGICAL MATRIX & STRATIGRAPHY</span>
            </h3>
            <p className="text-stone-gray leading-relaxed bg-charcoal/60 p-4 border border-white/10">
              {site.geologicalDescription}
            </p>
          </div>

          {/* Planetary Similarity vs Critical Discrepancies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Similarities */}
            <div className="p-4 bg-charcoal/60 border border-white/10 space-y-2">
              <h4 className="text-xs font-mono-sci text-earth-accent uppercase font-semibold flex items-center space-x-1.5">
                <Globe2 className="w-3.5 h-3.5" />
                <span>PLANETARY FIDELITY CORRELATION</span>
              </h4>
              <p className="text-xs text-stone-gray leading-relaxed">
                {site.planetarySimilarity}
              </p>
            </div>

            {/* Critical Discrepancies & Limitations */}
            <div className="p-4 bg-charcoal/60 border border-white/10 space-y-2">
              <h4 className="text-xs font-mono-sci text-mars-rust uppercase font-semibold flex items-center space-x-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>LIMITATIONS & TERRESTRIAL DISCREPANCIES</span>
              </h4>
              <ul className="text-xs text-stone-gray space-y-1.5">
                {site.criticalDiscrepancies.map((disc, idx) => (
                  <li key={idx} className="flex items-start space-x-1.5">
                    <span className="text-mars-rust font-bold">×</span>
                    <span>{disc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Exploration & Robotics Applications */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono-sci text-stone-gray uppercase tracking-wider flex items-center space-x-2">
              <ShieldCheck className="w-3.5 h-3.5 text-mars-rust" />
              <span>02. AEROSPACE TESTING & ROBOTICS APPLICATIONS</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono-sci">
              {site.testingApplications.map((app, i) => (
                <div key={i} className="p-2.5 bg-charcoal border border-white/10 flex items-start space-x-2">
                  <span className="text-mars-rust font-bold">›</span>
                  <span className="text-mineral-white">{app}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sample In-Situ Experiments & Field Protocols */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono-sci text-stone-gray uppercase tracking-wider flex items-center space-x-2">
              <Beaker className="w-3.5 h-3.5 text-earth-accent" />
              <span>03. PROPOSED IN-SITU FIELD EXPERIMENTS</span>
            </h3>
            <div className="space-y-2">
              {site.sampleExperiments.map((exp, i) => (
                <div key={i} className="p-3 bg-charcoal border border-white/10 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-heading-sci font-bold text-mineral-white text-sm">
                      {exp.title}
                    </span>
                    <span className="text-[10px] font-mono-sci px-2 py-0.5 bg-white/10 text-stone-gray">
                      TRL LEVEL: {exp.trlLevel} / 9
                    </span>
                  </div>
                  <p className="text-xs text-stone-gray font-sans">
                    {exp.objective}
                  </p>
                  <div className="flex items-center space-x-4 text-[10px] font-mono-sci text-stone-gray pt-1">
                    <span>INSTRUMENT: <span className="text-mineral-white">{exp.instrumentType}</span></span>
                    <span>CATEGORY: <span className="text-mars-rust">{exp.primaryRelevance}</span></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Available Archival Datasets & Satellite Sensors */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono-sci text-stone-gray uppercase tracking-wider flex items-center space-x-2">
              <Database className="w-3.5 h-3.5 text-mars-rust" />
              <span>04. CONNECTED ARCHIVAL DATASETS & SENSORS</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono-sci">
              {site.datasetSources.map((ds, i) => (
                <div key={i} className="p-3 bg-charcoal border border-white/10 space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-mars-rust">{ds.agency}</span>
                    <span className="text-stone-gray">{ds.accessType.replace(/_/g, ' ')}</span>
                  </div>
                  <span className="block font-bold text-mineral-white">{ds.mission}</span>
                  <span className="block text-stone-gray text-[11px]">{ds.sensor} ({ds.resolution})</span>
                  <span className="block text-[9px] text-stone-gray font-mono truncate">{ds.pdsDatasetId}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions Footer */}
        <div className="p-4 sm:p-5 border-t border-white/15 bg-charcoal/80 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
          <div className="text-xs font-mono-sci text-stone-gray">
            RECOMMENDED CAMPAIGN SEASON: <span className="text-mineral-white font-bold">{site.recommendedSeason}</span>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={() => {
                sound.playClick();
                onLoadIntoComparison(site);
                onClose();
              }}
              className="flex-1 sm:flex-none px-4 py-2 bg-mars-rust hover:bg-mars-light text-white text-xs font-mono-sci font-bold uppercase transition-colors"
            >
              COMPARE IN ENGINE
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="px-4 py-2 bg-white/10 hover:bg-white/15 text-stone-gray hover:text-white text-xs font-mono-sci uppercase transition-colors"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

