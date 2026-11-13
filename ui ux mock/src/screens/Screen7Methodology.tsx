import React, { useState } from 'react';
import { ActiveScreen, MethodologyStep } from '../types';
import { METHODOLOGY_STEPS, DATA_TIERS } from '../data/methodologyData';
import { 
  Database, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  ArrowRight, 
  ChevronRight, 
  FileCheck, 
  ExternalLink,
  Code2,
  Binary
} from 'lucide-react';
import { audio } from '../utils/audio';

interface Screen7MethodologyProps {
  onNavigate: (screen: ActiveScreen) => void;
}

export const Screen7Methodology: React.FC<Screen7MethodologyProps> = ({ onNavigate }) => {
  const [selectedStepIndex, setSelectedStepIndex] = useState<number>(4); // Default to Step 5: Similarity Scoring

  const currentStep = METHODOLOGY_STEPS[selectedStepIndex];

  const handleStepClick = (index: number) => {
    audio.playClick();
    setSelectedStepIndex(index);
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-charcoal p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
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
          DATA FIDELITY & ATTRIBUTION ARCHITECTURE (TIER SPECIFICATION)
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          {DATA_TIERS.map((tier, idx) => (
            <div key={idx} className="p-5 bg-obsidian border border-obsidian-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-stone-gray uppercase">{tier.tier}</span>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tier.color }}></span>
              </div>
              <div className="font-bold text-mineral-white text-xs" style={{ color: tier.color }}>
                {tier.badge}
              </div>
              <p className="font-inter text-[11px] text-mineral-muted leading-relaxed">
                {tier.description}
              </p>
              <div className="pt-2 border-t border-obsidian-border/50 flex flex-wrap gap-1 text-[10px] text-stone-gray">
                {tier.sources.map((s, si) => (
                  <span key={si} className="px-1.5 py-0.5 bg-obsidian-card border border-obsidian-border">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7-Stage Workflow Pipeline Horizontal Stepper */}
      <div className="bg-obsidian border border-obsidian-border p-6 space-y-4">
        <div className="flex items-center justify-between font-mono text-xs text-stone-gray">
          <span className="uppercase tracking-wider">7-STAGE SIMILARITY CALCULATION WORKFLOW</span>
          <span className="text-mars font-bold">CLICK TO INSPECT MATHEMATICAL FORMULA</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 font-mono text-xs">
          {METHODOLOGY_STEPS.map((step, idx) => {
            const isSelected = idx === selectedStepIndex;
            return (
              <button
                key={step.stepNumber}
                onClick={() => handleStepClick(idx)}
                className={`p-3 text-left border transition-all duration-150 flex flex-col justify-between h-24 ${
                  isSelected
                    ? 'bg-obsidian-surface border-mars shadow-md ring-1 ring-mars/50'
                    : 'bg-obsidian-card hover:bg-obsidian-surface border-obsidian-border text-stone-gray'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-[10px] font-bold ${isSelected ? 'text-mars' : 'text-stone-dark'}`}>
                    STEP 0{step.stepNumber}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-gray/40"></span>
                </div>
                <div className={`font-semibold text-xs leading-tight line-clamp-2 ${isSelected ? 'text-mineral-white' : 'text-mineral-dim'}`}>
                  {step.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Step Deep Dive Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-obsidian border border-obsidian-border p-6 lg:p-8">
        {/* Left: Stage Information & Formula */}
        <div className="lg:col-span-8 space-y-6">
          <div className="border-b border-obsidian-border pb-4">
            <div className="font-mono text-[10px] text-mars uppercase tracking-widest font-bold">
              {currentStep.stageName}
            </div>
            <h2 className="font-grotesk font-bold text-2xl lg:text-3xl text-mineral-white uppercase mt-0.5">
              {currentStep.title}
            </h2>
            <p className="font-inter text-stone-gray text-xs mt-1">
              {currentStep.description}
            </p>
          </div>

          {/* Mathematical Formulation Display Box */}
          {currentStep.formula && (
            <div className="bg-charcoal-deep border border-obsidian-border p-6 space-y-3 font-mono">
              <div className="flex items-center justify-between text-xs text-stone-gray border-b border-obsidian-border pb-2">
                <span className="flex items-center space-x-2 text-mineral-white">
                  <Binary className="w-4 h-4 text-telemetry-cyan" />
                  <span>MATHEMATICAL ALGORITHM FORMULATION</span>
                </span>
                <span className="text-[10px] text-stone-dark">LATEX SYNTAX</span>
              </div>

              {/* Rendered Equation Block */}
              <div className="py-4 px-2 overflow-x-auto text-center font-mono text-base md:text-lg text-mineral-white bg-obsidian-surface/60 border border-obsidian-border/50">
                <code>{currentStep.formula}</code>
              </div>

              <p className="font-inter text-xs text-mineral-muted leading-relaxed">
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
          {/* Scientific Confidence & Tolerance */}
          <div className="p-5 bg-obsidian-card border border-obsidian-border space-y-3 font-mono text-xs">
            <div className="text-[10px] text-stone-dark uppercase">BENCHMARK ACCURACY / UNCERTAINTY</div>
            <div className="text-sm font-bold text-earth-bright">
              {currentStep.standardConfidenceInterval}
            </div>
            <p className="text-[11px] text-stone-gray font-inter leading-relaxed">
              Standard deviation calibrated against peer-reviewed planetary analog field surveys published by NASA, LPI, and ESA.
            </p>
          </div>

          {/* Data Sources Ingested in this Step */}
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

          {/* Direct CTA back to Exploration */}
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
    </div>
  );
};

