import React, { useState } from 'react';
import { 
  SPACE_AGENCY_RESOURCES, 
  SpaceAgencyId, 
  NASA_OFFICIAL_DISCLAIMER, 
  SpaceAgencyResource,
  generateAnalogAgencyUrls,
  generatePlanetaryTargetAgencyUrls
} from '../../data/spaceAgencyResources';
import { AnalogLocation, PlanetaryTarget } from '../../types';
import { 
  X, 
  ExternalLink, 
  Database, 
  Globe, 
  Terminal, 
  Copy, 
  Check, 
  ShieldAlert, 
  Radio, 
  Code2, 
  Search,
  Sparkles,
  Layers,
  FileCode
} from 'lucide-react';

interface SpaceAgencyDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAnalog?: AnalogLocation;
  selectedTarget?: PlanetaryTarget;
}

export const SpaceAgencyDataModal: React.FC<SpaceAgencyDataModalProps> = ({
  isOpen,
  onClose,
  selectedAnalog,
  selectedTarget,
}) => {
  const [selectedAgency, setSelectedAgency] = useState<SpaceAgencyId | 'ALL'>('ALL');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeResource, setActiveResource] = useState<SpaceAgencyResource>(SPACE_AGENCY_RESOURCES[0]);
  const [copiedType, setCopiedType] = useState<'curl' | 'python' | null>(null);

  if (!isOpen) return null;

  // Filter resources
  const filteredResources = SPACE_AGENCY_RESOURCES.filter((res) => {
    if (selectedAgency !== 'ALL' && res.agency !== selectedAgency) return false;
    if (activeCategory !== 'ALL' && res.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = res.title.toLowerCase().includes(q);
      const matchDesc = res.description.toLowerCase().includes(q);
      const matchAgency = res.agencyName.toLowerCase().includes(q);
      const matchInst = res.keyInstruments?.some((i) => i.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchAgency && !matchInst) return false;
    }
    return true;
  });

  const handleCopy = (text: string, type: 'curl' | 'python') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const analogUrls = selectedAnalog 
    ? generateAnalogAgencyUrls(selectedAnalog.coordinates.lat, selectedAnalog.coordinates.lng, selectedAnalog.name)
    : null;

  const targetUrls = selectedTarget 
    ? generatePlanetaryTargetAgencyUrls(selectedTarget.planet, selectedTarget.name)
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-space-void/85 backdrop-blur-xl animate-fadeIn">
      <div 
        className="relative w-full max-w-6xl max-h-[92vh] flex flex-col rounded-3xl bg-space-surface/95 border border-white/[0.15] shadow-2xl overflow-hidden text-starlight-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.10] bg-white/[0.02]">
          <div className="flex items-center space-x-3.5">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-white/[0.10] to-white/[0.02] border border-white/[0.15] shadow-inner">
              <Database className="w-5 h-5 text-earth" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-grotesk font-bold text-lg sm:text-xl tracking-tight text-starlight-white">
                  Space Agency Data &amp; APIs Hub
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.12] text-starlight-dim uppercase tracking-wider">
                  NASA &bull; CSA &bull; ESA &bull; JAXA
                </span>
              </div>
              <p className="font-inter text-xs text-starlight-subtle">
                Official planetary and Earth observation portals, open data archives, and live REST/OData APIs
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-starlight-dim hover:text-starlight-white hover:bg-white/[0.06] border border-transparent hover:border-white/[0.12] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mandatory NASA Official Disclaimer Banner */}
        <div className="px-6 py-3 bg-white/[0.03] border-b border-white/[0.08] flex items-start space-x-3 text-xs font-inter text-starlight-dim">
          <ShieldAlert className="w-4 h-4 text-telemetry-amber shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-starlight-bright">Official Notice: </span>
            {NASA_OFFICIAL_DISCLAIMER}
          </div>
        </div>

        {/* Dynamic Contextual Query Strip for Currently Selected Analog or Target */}
        {(analogUrls || targetUrls) && (
          <div className="px-6 py-3 bg-white/[0.02] border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-3 text-xs font-inter">
            <div className="flex items-center space-x-2">
              <Radio className="w-3.5 h-3.5 text-mars animate-pulse" />
              <span className="text-starlight-subtle font-medium">Active Research Context:</span>
              {selectedAnalog && (
                <span className="font-grotesk font-semibold text-starlight-white bg-white/[0.06] px-2.5 py-0.5 rounded-md border border-white/[0.10]">
                  [{selectedAnalog.flagCode}] {selectedAnalog.name}
                </span>
              )}
              {selectedTarget && (
                <span className="font-grotesk font-semibold text-mars bg-mars/10 px-2.5 py-0.5 rounded-md border border-mars/20">
                  {selectedTarget.name} ({selectedTarget.planet.toUpperCase()})
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {analogUrls && (
                <>
                  <a
                    href={analogUrls.nasaEarthdata}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.10] text-[11px] text-earth transition-colors"
                  >
                    <span>Earthdata Search</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href={analogUrls.nasaWorldview}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.10] text-[11px] text-starlight-white transition-colors"
                  >
                    <span>NASA Worldview</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href={analogUrls.esaCopernicus}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.10] text-[11px] text-starlight-white transition-colors"
                  >
                    <span>ESA Copernicus</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href={analogUrls.csaRadarsat}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.10] text-[11px] text-starlight-white transition-colors"
                  >
                    <span>CSA RADARSAT</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href={analogUrls.jaxaGportal}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.10] text-[11px] text-starlight-white transition-colors"
                  >
                    <span>JAXA G-Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </>
              )}

              {targetUrls && (
                <>
                  <a
                    href={targetUrls.pdsArchive}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-mars/20 hover:bg-mars/30 border border-mars/40 text-[11px] text-mars transition-colors"
                  >
                    <span>NASA PDS Archive</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  {selectedTarget?.planet === 'moon' && 'lroDiviner' in targetUrls && (
                    <a
                      href={targetUrls.lroDiviner}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/[0.15] text-[11px] text-starlight-white transition-colors"
                    >
                      <span>LRO Diviner Lunar Data</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Agency Filter Tabs & Search Controls */}
        <div className="p-6 border-b border-white/[0.08] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Agency Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
            {(
              [
                ['ALL', 'All Agencies', '🌐'],
                ['NASA', 'NASA (USA)', '🇺🇸'],
                ['CSA', 'CSA (Canada)', '🇨🇦'],
                ['ESA', 'ESA (Europe)', '🇪🇺'],
                ['JAXA', 'JAXA (Japan)', '🇯🇵'],
              ] as [SpaceAgencyId | 'ALL', string, string][]
            ).map(([agency, label, flag]) => (
              <button
                key={agency}
                onClick={() => setSelectedAgency(agency)}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl font-inter text-xs transition-all duration-150 ${
                  selectedAgency === agency
                    ? 'bg-white/[0.15] text-starlight-white font-semibold shadow-inner'
                    : 'text-starlight-dim hover:text-starlight-white hover:bg-white/[0.05]'
                }`}
              >
                <span>{flag}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-starlight-subtle" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search datasets, SAR, Diviner, PDS..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.10] text-xs font-inter text-starlight-white placeholder-starlight-subtle focus:outline-none focus:border-earth/60"
            />
          </div>
        </div>

        {/* Main Content Area: Master List (Left) & Deep API Explorer (Right) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden min-h-0">
          {/* Left: Resource List Cards */}
          <div className="lg:col-span-5 border-r border-white/[0.08] overflow-y-auto p-4 space-y-2.5 max-h-[500px]">
            {filteredResources.map((res) => {
              const isSelected = activeResource.id === res.id;
              return (
                <div
                  key={res.id}
                  onClick={() => setActiveResource(res)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 select-none ${
                    isSelected
                      ? 'bg-white/[0.10] border-earth/60 shadow-glass'
                      : 'bg-white/[0.02] hover:bg-white/[0.05] border-white/[0.06] hover:border-white/[0.15]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-base">{res.agencyFlag}</span>
                      <span className="font-grotesk font-semibold text-xs uppercase tracking-wider text-starlight-dim">
                        {res.agency}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-starlight-subtle">
                      {res.category}
                    </span>
                  </div>

                  <h3 className="font-grotesk font-bold text-sm text-starlight-white mt-1.5">
                    {res.title}
                  </h3>

                  <p className="font-inter text-[11px] text-starlight-dim line-clamp-2 mt-1 leading-relaxed">
                    {res.description}
                  </p>

                  <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-white/[0.05] text-[10px] text-starlight-subtle">
                    <span className="flex items-center space-x-1">
                      <Terminal className="w-3 h-3 text-earth" />
                      <span>{res.apiEndpoint ? 'REST API Available' : 'Open Data Portal'}</span>
                    </span>
                    <a
                      href={res.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-earth hover:text-starlight-bright font-medium flex items-center space-x-1"
                    >
                      <span>Launch ↗</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Selected Resource Live Dossier & Interactive Code Sandbox */}
          <div className="lg:col-span-7 overflow-y-auto p-6 space-y-5 max-h-[500px] bg-space-void/40">
            {/* Header of Active Resource */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2 text-xs font-inter text-starlight-dim">
                  <span className="text-lg">{activeResource.agencyFlag}</span>
                  <span className="font-semibold text-starlight-white font-grotesk">{activeResource.agencyName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-telemetry-emerald/15 text-telemetry-emerald border border-telemetry-emerald/30">
                    Open Access
                  </span>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-white/[0.05] text-starlight-dim border border-white/[0.10]">
                    {activeResource.category}
                  </span>
                </div>
              </div>

              <h2 className="font-grotesk font-bold text-2xl text-starlight-white">
                {activeResource.title}
              </h2>

              <p className="font-inter text-xs text-starlight-dim leading-relaxed">
                {activeResource.description}
              </p>

              {activeResource.highlightNotes && (
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-inter text-starlight-muted flex items-start space-x-2">
                  <Sparkles className="w-4 h-4 text-telemetry-amber shrink-0 mt-0.5" />
                  <span>{activeResource.highlightNotes}</span>
                </div>
              )}
            </div>

            {/* Key Instruments & Sensors */}
            {activeResource.keyInstruments && activeResource.keyInstruments.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-grotesk font-semibold text-starlight-subtle uppercase tracking-wider">
                  Supported Payloads &amp; Key Instruments:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeResource.keyInstruments.map((inst, i) => (
                    <span 
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs font-inter text-starlight-white"
                    >
                      {inst}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Official Launch & API Docs Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={activeResource.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-earth to-earth-bright text-space-void font-grotesk font-bold text-xs uppercase tracking-wider hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Open {activeResource.title}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              {activeResource.apiDocsUrl && (
                <a
                  href={activeResource.apiDocsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.10] border border-white/[0.12] text-starlight-white font-inter text-xs font-medium transition-colors"
                >
                  <FileCode className="w-3.5 h-3.5 text-earth" />
                  <span>API Documentation</span>
                </a>
              )}
            </div>

            {/* Live API Code Snippets (cURL and Python) */}
            {(activeResource.sampleCurl || activeResource.samplePython) && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-grotesk font-semibold text-starlight-subtle uppercase tracking-wider flex items-center space-x-1.5">
                    <Code2 className="w-4 h-4 text-earth" />
                    <span>Developer Query Snippet</span>
                  </span>
                </div>

                {activeResource.sampleCurl && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono text-starlight-dim">
                      <span>cURL REST Request</span>
                      <button
                        onClick={() => handleCopy(activeResource.sampleCurl!, 'curl')}
                        className="flex items-center space-x-1 text-earth hover:text-starlight-bright"
                      >
                        {copiedType === 'curl' ? <Check className="w-3 h-3 text-telemetry-emerald" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedType === 'curl' ? 'Copied' : 'Copy cURL'}</span>
                      </button>
                    </div>
                    <pre className="p-3 rounded-xl bg-space-void border border-white/[0.10] text-[11px] font-mono text-starlight-bright overflow-x-auto">
                      <code>{activeResource.sampleCurl}</code>
                    </pre>
                  </div>
                )}

                {activeResource.samplePython && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono text-starlight-dim">
                      <span>Python Integration Script</span>
                      <button
                        onClick={() => handleCopy(activeResource.samplePython!, 'python')}
                        className="flex items-center space-x-1 text-earth hover:text-starlight-bright"
                      >
                        {copiedType === 'python' ? <Check className="w-3 h-3 text-telemetry-emerald" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedType === 'python' ? 'Copied' : 'Copy Python'}</span>
                      </button>
                    </div>
                    <pre className="p-3 rounded-xl bg-space-void border border-white/[0.10] text-[11px] font-mono text-starlight-muted overflow-x-auto whitespace-pre">
                      <code>{activeResource.samplePython}</code>
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-white/[0.10] bg-white/[0.02] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-inter text-starlight-subtle">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-telemetry-emerald"></span>
            <span>All open data queries comply with respective agency data access policies.</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-starlight-white font-grotesk font-semibold text-xs uppercase tracking-wider transition-colors"
          >
            Close Hub
          </button>
        </div>
      </div>
    </div>
  );
};
