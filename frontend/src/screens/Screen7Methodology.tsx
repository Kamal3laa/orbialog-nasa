import React, { useState, useEffect } from 'react';
import { ActiveScreen, MethodologyStep } from '../types';
import { METHODOLOGY_STEPS, DATA_TIERS } from '../data/methodologyData';
import { 
  Database, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  ArrowRight, 
  ChevronRight, 
  ExternalLink,
  Code2,
  Binary,
  Send,
  Loader2,
  CheckCircle2,
  Terminal
} from 'lucide-react';
import { audio } from '../utils/audio';
import { orbialogApi, SandboxQueryResult } from '../services/orbialogApi';

interface Screen7MethodologyProps {
  onNavigate: (screen: ActiveScreen) => void;
}

export const Screen7Methodology: React.FC<Screen7MethodologyProps> = ({ onNavigate }) => {
  const [steps, setSteps] = useState<MethodologyStep[]>(METHODOLOGY_STEPS);
  const [selectedStepIndex, setSelectedStepIndex] = useState<number>(4); // Default to Step 5: Similarity Scoring

  // Sandbox Query State (Flowchart: S7 --> SB [POST /sandbox/query])
  const [sandboxDiscipline, setSandboxDiscipline] = useState<string>('drill-subsurface-sampling');
  const [sandboxLat, setSandboxLat] = useState<number>(27.3);
  const [sandboxLng, setSandboxLng] = useState<number>(28.1);
  const [sandboxLoading, setSandboxLoading] = useState<boolean>(false);
  const [sandboxResult, setSandboxResult] = useState<SandboxQueryResult | null>(null);

  // Fetch live methodology from backend if available (S7 --> M)
  useEffect(() => {
    orbialogApi.getMethodology().then((res) => {
      if (res.data && res.data.length > 0) {
        setSteps(res.data);
      }
    });
  }, []);

  const currentStep = steps[selectedStepIndex] || steps[0];

  const handleStepClick = (index: number) => {
    audio.playClick();
    setSelectedStepIndex(index);
  };

  const handleExecuteSandbox = async () => {
    audio.playConfirm();
    setSandboxLoading(true);
    try {
      const res = await orbialogApi.querySandbox({
        disciplineId: sandboxDiscipline,
        lat: Number(sandboxLat),
        lng: Number(sandboxLng),
      });
      setSandboxResult(res.data);
    } finally {
      setSandboxLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-charcoal p-6 lg:p-10 space-y-10 max-w-7xl mx-auto">
      {/* Header & Scientific Compliance */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-obsidian-border pb-6 gap-4">
        <div>
          <div className="flex items-center space-x-2 font-mono text-xs text-stone-gray uppercase tracking-wider mb-1">
            <span className="text-mars font-bold">METHODOLOGY FRAMEWORK</span>
            <span>//</span>
            <span>END-TO-END ANALYTICAL PIPELINE & DATA PROVENANCE</span>
          </div>
          <h1 className="font-grotesk font-bold text-3xl md:text-5xl text-mineral-white uppercase tracking-tight">
            Methodology & Scientific Data
          </h1>
          <p className="font-inter text-stone-gray text-xs md:text-sm mt-1 max-w-2xl">
            A 7-stage computational pipeline converting raw orbital and terrestrial remote sensing telemetry 
            into multidimensional planetary analog similarity vectors.
          </p>
        </div>

        {/* Scientific Compliance Badge */}
        <div className="flex items-center space-x-2 px-3 py-1.5 bg-obsidian-card border border-stone-gray/30 font-mono text-[11px] text-stone-gray">
          <ShieldCheck className="w-4 h-4 text-earth-bright" />
          <span>NASA OPEN SCIENCE & FAIR DATA COMPLIANT</span>
        </div>
      </div>

      {/* 3-Tier Data Architecture Callout Strip */}
      <div className="space-y-3">
        <div className="font-mono text-xs text-stone-gray uppercase tracking-wider">
          ORBiALOG 3-TIER MULTI-MISSION ARCHITECTURE
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DATA_TIERS.map((tier) => (
            <div 
              key={tier.tier}
              className="p-5 bg-obsidian border border-obsidian-border relative overflow-hidden group hover:border-mars/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-3 font-mono text-xs">
                <span className="text-mars font-bold uppercase">{tier.tier}</span>
                <span className="text-[10px] text-stone-gray px-2 py-0.5 bg-obsidian-card">
                  {tier.updateCycle}
                </span>
              </div>
              <h3 className="font-grotesk font-bold text-lg text-mineral-white uppercase mb-2">
                {tier.title}
              </h3>
              <p className="font-inter text-xs text-mineral-muted leading-relaxed mb-4">
                {tier.description}
              </p>
              <div className="space-y-1.5 pt-3 border-t border-obsidian-border font-mono text-[11px]">
                <div className="text-stone-dark uppercase text-[10px]">MISSION ARCHIVES:</div>
                <div className="text-mineral-white text-xs">{tier.primarySources}</div>
                <div className="text-[10px] text-earth-bright">{tier.resolution}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Interactive Methodology Stepper */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: 7-Stage Pipeline Navigator */}
        <div className="lg:col-span-4 space-y-2">
          <div className="font-mono text-xs text-stone-gray uppercase tracking-wider mb-2">
            INGESTION & REDUCTION PIPELINE STAGES
          </div>
          <div className="space-y-1.5">
            {steps.map((st, idx) => {
              const isSelected = idx === selectedStepIndex;
              return (
                <button
                  key={st.stepNumber}
                  onClick={() => handleStepClick(idx)}
                  className={`w-full text-left p-3.5 transition-all border flex items-center justify-between font-mono ${
                    isSelected
                      ? 'bg-obsidian-card border-mars text-mineral-white shadow-sm'
                      : 'bg-obsidian border-obsidian-border text-stone-gray hover:text-mineral-white hover:bg-obsidian-card/60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={`text-xs font-bold ${isSelected ? 'text-mars' : 'text-stone-dark'}`}>
                      0{st.stepNumber}
                    </span>
                    <span className="text-xs uppercase font-medium">{st.title}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-mars' : 'text-stone-dark'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Middle: Expanded Stage Description & Formulations */}
        <div className="lg:col-span-4 space-y-6 bg-obsidian border border-obsidian-border p-6">
          <div>
            <div className="font-mono text-[10px] text-mars uppercase tracking-widest mb-1">
              PIPELINE STAGE 0{currentStep.stepNumber}
            </div>
            <h2 className="font-grotesk font-bold text-2xl text-mineral-white uppercase">
              {currentStep.title}
            </h2>
            <p className="font-inter text-xs text-mineral-muted mt-2 leading-relaxed">
              {currentStep.description}
            </p>
          </div>

          {/* Mathematical Formulation */}
          {currentStep.formula && (
            <div className="p-4 bg-obsidian-card border border-obsidian-border space-y-2">
              <div className="flex items-center space-x-2 font-mono text-[10px] text-stone-gray uppercase tracking-wider">
                <Code2 className="w-3.5 h-3.5 text-mars" />
                <span>FORMAL MATHEMATICAL LOGIC</span>
              </div>
              <div className="py-3 px-2 overflow-x-auto text-center font-mono text-sm md:text-base text-mineral-white bg-obsidian-surface/60 border border-obsidian-border/50">
                <code>{currentStep.formula}</code>
              </div>
              <p className="font-inter text-[11px] text-mineral-muted leading-relaxed">
                {currentStep.formulaDesc}
              </p>
            </div>
          )}

          {/* Pipeline Inputs & Outputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            <div className="p-4 bg-obsidian-card border border-obsidian-border space-y-2">
              <div className="text-[10px] text-stone-dark uppercase">DATA INPUT STREAM</div>
              <ul className="space-y-1.5 text-mineral-white text-xs">
                {currentStep.inputs.map((inp, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-mars">›</span>
                    <span className="text-[11px]">{inp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-obsidian-card border border-obsidian-border space-y-2">
              <div className="text-[10px] text-stone-dark uppercase">PROCESSED OUTPUT ASSETS</div>
              <ul className="space-y-1.5 text-mineral-white text-xs">
                {currentStep.outputs.map((out, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-earth-bright">›</span>
                    <span className="text-[11px]">{out}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right: Repository Citations & Uncertainty Bounds */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-5 bg-obsidian-card border border-obsidian-border space-y-3 font-mono text-xs">
            <div className="text-[10px] text-stone-dark uppercase">BENCHMARK ACCURACY / UNCERTAINTY</div>
            <div className="text-sm font-bold text-earth-bright">
              {currentStep.standardConfidenceInterval}
            </div>
            <p className="text-[11px] text-stone-gray font-inter leading-relaxed">
              Standard deviation calibrated against peer-reviewed planetary analog field surveys published by NASA, LPI, and ESA.
            </p>
          </div>

          <div className="p-5 bg-obsidian-card border border-obsidian-border space-y-3 font-mono text-xs">
            <div className="text-[10px] text-stone-dark uppercase">ACCREDITED DATA PROVIDERS</div>
            <div className="space-y-2">
              {currentStep.dataSources.map((src, i) => (
                <div key={i} className="p-2.5 bg-obsidian-surface border border-obsidian-border text-mineral-white flex items-center justify-between">
                  <span>{src}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-stone-gray" />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              audio.playConfirm();
              onNavigate('discovery');
            }}
            className="w-full flex items-center justify-center space-x-2 px-5 py-3.5 bg-mars hover:bg-mars-glow text-mineral-white font-mono text-xs uppercase tracking-wider font-semibold shadow-md transition-colors"
          >
            <span>LAUNCH ANALOG EXPLORER</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Interactive Live Telemetry Sandbox (Flowchart: S7 --> SB) ── */}
      <div className="p-6 lg:p-8 bg-obsidian border border-obsidian-border space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-obsidian-border gap-3">
          <div>
            <div className="flex items-center space-x-2 font-mono text-xs text-cyan-400 uppercase tracking-wider">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>LIVE SERVER TELEMETRY SANDBOX [POST /api/v1/sandbox/query]</span>
            </div>
            <h2 className="font-grotesk font-bold text-2xl text-mineral-white uppercase mt-1">
              Field Telemetry Simulation Console
            </h2>
          </div>
          <span className="font-mono text-xs text-stone-gray px-3 py-1 bg-obsidian-card border border-obsidian-border">
            NASA SPACE APPS TELEMETRY PROTOCOL
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="font-mono text-[11px] text-stone-gray uppercase">Mission Discipline ID:</label>
            <select
              value={sandboxDiscipline}
              onChange={(e) => setSandboxDiscipline(e.target.value)}
              className="w-full bg-obsidian-card border border-obsidian-border px-3 py-2 text-mineral-white font-mono text-xs focus:border-cyan-400 focus:outline-none"
            >
              <option value="drill-subsurface-sampling">drill-subsurface-sampling (Drill & Subsurface)</option>
              <option value="autonomous-rover-mobility">autonomous-rover-mobility (Rover Mobility)</option>
              <option value="optical-spectral-remote-sensing">optical-spectral-remote-sensing (Optical & Spectral)</option>
              <option value="eva-spacesuit-ergonomics">eva-spacesuit-ergonomics (EVA Ergonomics)</option>
              <option value="in-situ-resource-utilization">in-situ-resource-utilization (ISRU)</option>
              <option value="closed-loop-habitats">closed-loop-habitats (Closed-Loop Habitats)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-mono text-[11px] text-stone-gray uppercase">Target Latitude:</label>
            <input
              type="number"
              step="0.001"
              value={sandboxLat}
              onChange={(e) => setSandboxLat(Number(e.target.value))}
              className="w-full bg-obsidian-card border border-obsidian-border px-3 py-2 text-mineral-white font-mono text-xs focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-mono text-[11px] text-stone-gray uppercase">Target Longitude:</label>
            <input
              type="number"
              step="0.001"
              value={sandboxLng}
              onChange={(e) => setSandboxLng(Number(e.target.value))}
              className="w-full bg-obsidian-card border border-obsidian-border px-3 py-2 text-mineral-white font-mono text-xs focus:border-cyan-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2 text-[11px] font-mono text-stone-gray">
            <span>Presets:</span>
            <button
              onClick={() => { setSandboxLat(27.3); setSandboxLng(28.1); }}
              className="px-2 py-0.5 bg-obsidian-card hover:bg-obsidian-surface border border-obsidian-border text-cyan-400"
            >
              White Desert (EG)
            </button>
            <button
              onClick={() => { setSandboxLat(-23.86); setSandboxLng(-69.13); }}
              className="px-2 py-0.5 bg-obsidian-card hover:bg-obsidian-surface border border-obsidian-border text-cyan-400"
            >
              Atacama (CL)
            </button>
            <button
              onClick={() => { setSandboxLat(78.22); setSandboxLng(15.65); }}
              className="px-2 py-0.5 bg-obsidian-card hover:bg-obsidian-surface border border-obsidian-border text-cyan-400"
            >
              Svalbard (NO)
            </button>
          </div>

          <button
            onClick={handleExecuteSandbox}
            disabled={sandboxLoading}
            className="flex items-center space-x-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-mono text-xs uppercase tracking-wider font-semibold transition-colors shadow-sm"
          >
            {sandboxLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>QUERY LIVE TELEMETRY SANDBOX</span>
          </button>
        </div>

        {/* Sandbox Query Response Display */}
        {sandboxResult && (
          <div className="p-4 bg-slate-950 border border-cyan-800/60 rounded space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-[11px] text-cyan-400 border-b border-slate-800 pb-2">
              <span className="flex items-center space-x-1.5 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>TELEMETRY_RESPONSE // 200 OK</span>
              </span>
              <span className="text-slate-400">TIMESTAMP: {sandboxResult.QUERY_TIMESTAMP_UTC}</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px]">
              <div>
                <span className="text-slate-500 block">DISCIPLINE:</span>
                <span className="text-slate-200 font-semibold">{sandboxResult.DISCIPLINE_TITLE}</span>
              </div>
              <div>
                <span className="text-slate-500 block">COORDINATES:</span>
                <span className="text-slate-200">{sandboxResult.QUERY_LATITUDE}°N, {sandboxResult.QUERY_LONGITUDE}°E</span>
              </div>
              <div>
                <span className="text-slate-500 block">SERVER TELEMETRY:</span>
                <span className="text-emerald-400 font-semibold">{sandboxResult.SERVER_TELEMETRY}</span>
              </div>
              <div>
                <span className="text-slate-500 block">INTEGRATION STATUS:</span>
                <span className="text-cyan-400">{sandboxResult.INTEGRATION_STATUS}</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-slate-500 text-[10px] uppercase block mb-1">SAMPLE TELEMETRY RECORD:</span>
              <pre className="p-3 bg-black/60 border border-slate-800 text-[11px] text-emerald-400 overflow-x-auto rounded">
                {JSON.stringify(sandboxResult.SAMPLE_RECORD, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
