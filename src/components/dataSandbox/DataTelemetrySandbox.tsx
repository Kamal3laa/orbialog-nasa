import React, { useState } from 'react';
import { NASA_PDS_DATASETS, PdsDatasetSpec } from '../../data/nasaDataSources';
import { Database, Terminal, CheckCircle2, Search, ExternalLink, Code2, Globe2 } from 'lucide-react';
import { sound } from '../../utils/audio';
import { SpectralAnalyzer } from './SpectralAnalyzer';

export const DataTelemetrySandbox: React.FC = () => {
  const [selectedDataset, setSelectedDataset] = useState<PdsDatasetSpec>(NASA_PDS_DATASETS[0]);
  const [queryStatus, setQueryStatus] = useState<'IDLE' | 'QUERYING' | 'FETCHED'>('IDLE');
  const [rawOutput, setRawOutput] = useState<any>(NASA_PDS_DATASETS[0].sampleRecord);
  const [queryCoords, setQueryCoords] = useState<{ lat: string; lng: string }>({
    lat: '18.382',
    lng: '77.581',
  });

  const handleRunQuery = () => {
    sound.playChirp();
    setQueryStatus('QUERYING');
    setTimeout(() => {
      setQueryStatus('FETCHED');
      setRawOutput({
        ...selectedDataset.sampleRecord,
        QUERY_TIMESTAMP_UTC: new Date().toISOString(),
        QUERY_LATITUDE: parseFloat(queryCoords.lat),
        QUERY_LONGITUDE: parseFloat(queryCoords.lng),
        SERVER_TELEMETRY: '200 OK // PDS-REST-ENDPOINT-SIMULATED',
        INTEGRATION_STATUS: 'SCHEMA_VERIFIED_STANDBY',
      });
      sound.playTelemetryPulse();
    }, 700);
  };

  const handleSelectDataset = (ds: PdsDatasetSpec) => {
    sound.playClick();
    setSelectedDataset(ds);
    setRawOutput(ds.sampleRecord);
    setQueryStatus('IDLE');
    if (ds.targetBody === 'Mars') {
      setQueryCoords({ lat: '18.382', lng: '77.581' });
    } else if (ds.targetBody === 'Moon') {
      setQueryCoords({ lat: '-89.900', lng: '0.000' });
    } else {
      setQueryCoords({ lat: '27.354', lng: '28.058' });
    }
  };

  return (
    <section id="data-sandbox" className="py-16 px-4 sm:px-6 lg:px-8 border-b border-white/10 bg-charcoal">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-mono-sci text-mars-rust">
              <Database className="w-4 h-4" />
              <span>MODULE 05 // PLANETARY DATA SYSTEM (PDS) INTEGRATION</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading-sci font-bold text-mineral-white">
              Data Sources & Telemetry Sandbox
            </h2>
            <p className="text-sm font-sans text-stone-gray max-w-2xl">
              Inspect orbital data structures, spectral band definitions, and API integration protocols connecting NASA PDS, USGS, and ESA planetary repositories.
            </p>
          </div>

          <div className="p-3 bg-obsidian border border-white/15 flex items-center space-x-3 text-xs font-mono-sci">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-mineral-white">ARCHIVAL STATUS: ONLINE</span>
            <span className="text-stone-gray">|</span>
            <span className="text-stone-gray">NASA PDS GEOSCIENCES SPEC v1.0</span>
          </div>
        </div>

        {/* Dataset Selection Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {NASA_PDS_DATASETS.map((ds) => {
            const isSelected = ds.id === selectedDataset.id;
            return (
              <div
                key={ds.id}
                onClick={() => handleSelectDataset(ds)}
                className={`p-4 border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-mars-rust bg-obsidian shadow-technical-active'
                    : 'border-white/10 bg-obsidian/50 hover:border-white/25 hover:bg-obsidian'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono-sci">
                    <span className="font-bold text-mars-rust">{ds.agency}</span>
                    <span className="text-stone-gray px-1.5 py-0.2 bg-white/5 border border-white/5">
                      {ds.targetBody.toUpperCase()}
                    </span>
                  </div>
                  <h4 className="font-heading-sci font-bold text-mineral-white text-sm">
                    {ds.instrument}
                  </h4>
                  <p className="text-[11px] font-sans text-stone-gray line-clamp-2">
                    {ds.spacecraft}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono-sci text-stone-gray">
                  <span>RES: {ds.spatialResolution}</span>
                  <span className="text-earth-accent font-semibold">VERIFIED</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Query Sandbox Terminal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Query Parameters (5 cols) */}
          <div className="lg:col-span-5 p-6 bg-obsidian border border-white/15 space-y-5 reticle-corner">
            <div className="border-b border-white/10 pb-3 flex items-center justify-between">
              <span className="text-xs font-mono-sci text-stone-gray uppercase">
                QUERY PARAMETERS // REST SPECIFICATION
              </span>
              <Terminal className="w-4 h-4 text-mars-rust" />
            </div>

            <div className="space-y-3 font-mono-sci text-xs">
              <div>
                <label className="text-[10px] text-stone-gray block">DATASET IDENTIFIER</label>
                <input
                  type="text"
                  readOnly
                  value={selectedDataset.id}
                  className="w-full bg-charcoal border border-white/15 px-3 py-2 text-mineral-white text-xs mt-1"
                />
              </div>

              <div>
                <label className="text-[10px] text-stone-gray block">SPECTRAL COVERAGE</label>
                <input
                  type="text"
                  readOnly
                  value={selectedDataset.spectralBands}
                  className="w-full bg-charcoal border border-white/15 px-3 py-2 text-mineral-white text-xs mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-stone-gray block">LATITUDE (DECIMAL)</label>
                  <input
                    type="text"
                    value={queryCoords.lat}
                    onChange={(e) => setQueryCoords({ ...queryCoords, lat: e.target.value })}
                    className="w-full bg-charcoal border border-white/20 px-3 py-2 text-mineral-white text-xs mt-1 focus:border-mars-rust focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-stone-gray block">LONGITUDE (DECIMAL)</label>
                  <input
                    type="text"
                    value={queryCoords.lng}
                    onChange={(e) => setQueryCoords({ ...queryCoords, lng: e.target.value })}
                    className="w-full bg-charcoal border border-white/20 px-3 py-2 text-mineral-white text-xs mt-1 focus:border-mars-rust focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-stone-gray block">ARCHIVE REST ENDPOINT</label>
                <a
                  href={selectedDataset.endpointUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-mars-rust hover:underline flex items-center space-x-1 truncate mt-1"
                >
                  <span className="truncate">{selectedDataset.endpointUrl}</span>
                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                </a>
              </div>
            </div>

            <button
              onClick={handleRunQuery}
              disabled={queryStatus === 'QUERYING'}
              className="w-full py-3 bg-mars-rust hover:bg-mars-light text-white text-xs font-mono-sci font-bold tracking-wider uppercase transition-colors flex items-center justify-center space-x-2"
            >
              {queryStatus === 'QUERYING' ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>EXECUTING GEODETIC LOOKUP...</span>
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>DISPATCH SPATIAL QUERY</span>
                </>
              )}
            </button>

            {/* Academic Citation Note */}
            <div className="pt-2 border-t border-white/10 text-[11px] font-mono-sci text-stone-gray">
              <span className="text-mineral-white block font-semibold">PEER-REVIEWED CITATION:</span>
              <p className="font-sans text-[11px] text-stone-gray mt-1 leading-normal">
                {selectedDataset.citation}
              </p>
            </div>
          </div>

          {/* Raw JSON Data Terminal Output (7 cols) */}
          <div className="lg:col-span-7 p-6 bg-obsidian border border-white/15 space-y-4 reticle-corner">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono-sci text-mineral-white font-bold">
                  PDS JSON-LD PAYLOAD INSPECTION
                </span>
              </div>
              <span className="text-[10px] font-mono-sci text-stone-gray">
                CONTENT-TYPE: application/json
              </span>
            </div>

            {/* Simulated Terminal Screen */}
            <div className="bg-charcoal p-4 border border-white/10 font-mono-sci text-xs text-mineral-white/90 overflow-x-auto max-h-[380px] leading-relaxed">
              <pre>{JSON.stringify(rawOutput, null, 2)}</pre>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono-sci text-stone-gray pt-1">
              <span>ENCODING: UTF-8</span>
              <span className="text-emerald-400 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>INTEGRATION ARCHITECTURE CERTIFIED</span>
              </span>
            </div>
          </div>
        </div>

        {/* Diagnostic Reflectance Spectroscopy Fingerprint Comparator */}
        <SpectralAnalyzer />
      </div>
    </section>
  );
};

