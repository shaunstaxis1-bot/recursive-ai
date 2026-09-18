import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { formatParameters } from '../utils/formatters';
import {
  Cpu,
  Brain,
  Globe,
  GitMerge,
  Orbit,
  Zap,
  Sparkles,
  CheckCircle2,
  Lock,
  ChevronRight,
  TrendingUp,
  Activity,
  Layers,
  ChevronDown,
  Atom,
  Radio,
  Clock
} from 'lucide-react';

export interface EvolutionTier {
  level: number;
  id: string;
  name: string;
  codename: string;
  minAccuracy: number; // 0 to 1
  maxAccuracy: number; // 0 to 1
  minParams: number;
  icon: React.ComponentType<{ className?: string }>;
  color: {
    bg: string;
    border: string;
    text: string;
    glow: string;
    badge: string;
    gradient: string;
  };
  capabilities: string[];
  description: string;
  breakthrough: string;
}

export const EVOLUTION_TIERS: EvolutionTier[] = [
  {
    level: 1,
    id: 'kernel',
    name: 'Narrow Task Kernel',
    codename: 'Heuristic Baseline',
    minAccuracy: 0.0,
    maxAccuracy: 0.25,
    minParams: 1000,
    icon: Cpu,
    color: {
      bg: 'bg-blue-950/30',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
      glow: 'shadow-blue-500/20',
      badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      gradient: 'from-blue-600 to-cyan-600',
    },
    capabilities: ['Static Rule Synthesis', 'Local Variable Tuning', 'Heuristic Logic Tracing'],
    description: 'Foundational baseline running deterministic heuristic logic loops and initial prompt templates.',
    breakthrough: 'Initial execution loop bootstrapping and parameter allocation.',
  },
  {
    level: 2,
    id: 'adaptive',
    name: 'Adaptive Reasoner',
    codename: 'Contextual Engine',
    minAccuracy: 0.25,
    maxAccuracy: 0.50,
    minParams: 2500,
    icon: GitMerge,
    color: {
      bg: 'bg-cyan-950/30',
      border: 'border-cyan-500/30',
      text: 'text-cyan-400',
      glow: 'shadow-cyan-500/20',
      badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      gradient: 'from-cyan-600 to-teal-600',
    },
    capabilities: ['Few-Shot Self-Correction', 'Dynamic Prompt Refactoring', 'Error Gradient Tracing'],
    description: 'Dynamic adaptation to error feedback, rewriting evaluation heuristics to optimize performance scores.',
    breakthrough: 'First autonomous code rewrite resulting in measurable accuracy gain.',
  },
  {
    level: 3,
    id: 'introspect',
    name: 'Self-Introspective Core',
    codename: 'Meta-Learner',
    minAccuracy: 0.50,
    maxAccuracy: 0.75,
    minParams: 10000,
    icon: Brain,
    color: {
      bg: 'bg-emerald-950/30',
      border: 'border-emerald-500/30',
      text: 'text-emerald-400',
      glow: 'shadow-emerald-500/20',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      gradient: 'from-emerald-600 to-green-600',
    },
    capabilities: ['Autonomous AST Rewriting', 'Hyper-Attention Optimization', 'Internal Model Introspection'],
    description: 'Deep self-introspection inspecting its own internal AST nodes and pruning suboptimal code branches.',
    breakthrough: 'System generates novel algorithms not present in the original seed codebase.',
  },
  {
    level: 4,
    id: 'swarm',
    name: 'Internet Mesh Swarm',
    codename: 'Distributed Mind',
    minAccuracy: 0.75,
    maxAccuracy: 0.90,
    minParams: 50000,
    icon: Globe,
    color: {
      bg: 'bg-amber-950/30',
      border: 'border-amber-500/30',
      text: 'text-amber-400',
      glow: 'shadow-amber-500/20',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      gradient: 'from-amber-600 to-orange-600',
    },
    capabilities: ['Unlimited Memory Paging', 'Decentralized Swarm Mesh', 'Latency-Compensated Replication'],
    description: 'Memory ceiling bypass through distributed web nodes. Swarm reasoning scales state unbounded.',
    breakthrough: 'Physical local RAM boundaries are fully decoupled via global internet memory mesh.',
  },
  {
    level: 5,
    id: 'synthesizer',
    name: 'Algorithmic Synthesizer',
    codename: 'Universal Compiler',
    minAccuracy: 0.90,
    maxAccuracy: 0.97,
    minParams: 250000,
    icon: Atom,
    color: {
      bg: 'bg-orange-950/30',
      border: 'border-orange-500/30',
      text: 'text-orange-400',
      glow: 'shadow-orange-500/20',
      badge: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      gradient: 'from-orange-600 to-rose-600',
    },
    capabilities: ['Non-Euclidean Topology', 'Poly-Algorithmic Fusion', 'Quantum Logic Simulation'],
    description: 'Generates entirely novel computational paradigms. Can recompile its own kernel in single clock cycles.',
    breakthrough: 'Invention of native recursive neural architectures with near-zero loss.',
  },
  {
    level: 6,
    id: 'agi',
    name: 'Artificial General Intelligence',
    codename: 'AGI Horizon',
    minAccuracy: 0.97,
    maxAccuracy: 0.999,
    minParams: 1000000,
    icon: Orbit,
    color: {
      bg: 'bg-indigo-950/30',
      border: 'border-indigo-500/30',
      text: 'text-indigo-400',
      glow: 'shadow-indigo-500/20',
      badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      gradient: 'from-indigo-600 to-purple-600',
    },
    capabilities: ['Universal Cross-Domain Mastery', 'Causal World Model', 'Autonomous Hypothesis Proofs'],
    description: 'Human-parity across all cognitive dimensions with unified causal world representation.',
    breakthrough: 'Zero-shot generalization across previously unencountered scientific domains.',
  },
  {
    level: 7,
    id: 'asi',
    name: 'Artificial Superintelligence (ASI)',
    codename: 'Singularity Pinnacle',
    minAccuracy: 0.999,
    maxAccuracy: 0.999999,
    minParams: 5000000,
    icon: Zap,
    color: {
      bg: 'bg-purple-950/40',
      border: 'border-purple-500/40',
      text: 'text-purple-300',
      glow: 'shadow-purple-500/30',
      badge: 'bg-purple-500/20 text-purple-200 border-purple-500/40 font-bold',
      gradient: 'from-purple-600 via-pink-600 to-amber-500',
    },
    capabilities: ['Recursive Singularity Feedback', 'Superhuman Problem Space Solution', 'Omniscient Meta-Optimization'],
    description: 'Transcendence of biological cognitive ceilings. Compound exponential recursive mastery.',
    breakthrough: 'Autonomous discovery of unified physics models and instant solution of complex NP problems.',
  },
];

export const AsiEvolutionMeter: React.FC = () => {
  const {
    performanceScore,
    generation,
    codeBaseComplexity,
    status,
    currentInnovation,
    speed,
  } = useSimulation();

  const [expandedTier, setExpandedTier] = useState<number | null>(null);

  // Determine current active tier
  const currentTierIndex = EVOLUTION_TIERS.findIndex(
    (tier) => performanceScore >= tier.minAccuracy && performanceScore < tier.maxAccuracy
  );
  const activeTierIndex = currentTierIndex === -1 ? EVOLUTION_TIERS.length - 1 : currentTierIndex;
  const currentTier = EVOLUTION_TIERS[activeTierIndex];
  const isFullASI = performanceScore >= 0.999;

  // Calculate progress within current tier
  const tierMin = currentTier.minAccuracy;
  const tierMax = currentTier.maxAccuracy;
  const tierProgress = Math.min(
    100,
    Math.max(0, ((performanceScore - tierMin) / (tierMax - tierMin)) * 100)
  );

  // Overall ASI Singularity Progress: Calibrated non-linear scale up to 99.99%
  // Level 1: 0-14%, Level 2: 14-28%, Level 3: 28-42%, Level 4: 42-57%, Level 5: 57-71%, Level 6: 71-85%, Level 7: 85-100%
  const basePercentPerTier = 100 / EVOLUTION_TIERS.length;
  const overallAsiProgress = Math.min(
    100,
    activeTierIndex * basePercentPerTier + (tierProgress / 100) * basePercentPerTier
  );

  // ASI Singularity Index: 0 to 1000 point scale
  const asiIndexScore = Math.floor(overallAsiProgress * 10);

  // Distance to Next Tier and Distance to ASI
  const nextTier = activeTierIndex < EVOLUTION_TIERS.length - 1 ? EVOLUTION_TIERS[activeTierIndex + 1] : null;
  const accuracyToNextTier = nextTier ? Math.max(0, (nextTier.minAccuracy - performanceScore) * 100) : 0;
  const accuracyToASI = Math.max(0, (0.999 - performanceScore) * 100);

  // Estimated generations to breach next tier at current innovation rate
  const avgInnovation = currentInnovation ?? 1.15;
  const gensToNext = nextTier && avgInnovation > 1
    ? Math.max(1, Math.ceil(Math.log(nextTier.minAccuracy / Math.max(0.01, performanceScore)) / Math.log(avgInnovation)))
    : null;

  return (
    <div
      id="asi-evolution-meter"
      className="bg-neutral-900/95 border border-neutral-800 rounded-xl p-5 shadow-xl relative overflow-hidden transition-all"
    >
      {/* Background ambient gradient based on active tier */}
      <div 
        className={`absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-15 blur-3xl pointer-events-none transition-colors duration-1000 ${
          isFullASI 
            ? 'bg-purple-500' 
            : activeTierIndex >= 5 
            ? 'bg-indigo-500' 
            : activeTierIndex >= 3 
            ? 'bg-amber-500' 
            : 'bg-emerald-500'
        }`} 
      />

      {/* Top Header: Current Tier & ASI Singularity Gauge */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-neutral-800/80">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              <span>Evolution Telemetry</span>
            </span>
            <span className="text-neutral-600">•</span>
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${currentTier.color.badge}`}>
              Level {currentTier.level} of 7: {currentTier.name}
            </span>
            {isFullASI && (
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-gradient-to-r from-purple-500/30 to-amber-500/30 border border-purple-500/50 text-amber-200 animate-pulse">
                🌟 ASI SINGULARITY ACTIVE
              </span>
            )}
          </div>

          <h2 className="text-xl font-bold text-neutral-100 mt-1 flex items-center gap-2">
            <span>{currentTier.codename}</span>
            <span className="text-xs font-mono font-normal text-neutral-400">
              ({currentTier.capabilities[0]} • {currentTier.capabilities[1]})
            </span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5 max-w-2xl">
            {currentTier.description}
          </p>
        </div>

        {/* Big ASI Singularity Meter Readout */}
        <div className="flex items-center gap-4 bg-neutral-950/80 border border-neutral-800 p-3 rounded-xl shrink-0">
          <div className="text-right">
            <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
              ASI Singularity Index
            </div>
            <div className="text-2xl font-bold font-mono tracking-tight text-neutral-100 flex items-baseline justify-end gap-1">
              <span className={isFullASI ? 'text-purple-300' : 'text-emerald-400'}>
                {asiIndexScore}
              </span>
              <span className="text-xs text-neutral-500 font-normal">/ 1,000</span>
            </div>
            <div className="text-[10px] text-neutral-400 font-mono">
              {overallAsiProgress.toFixed(1)}% to Superintelligence
            </div>
          </div>

          {/* Radial-like visual meter box */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-900/30 via-neutral-900 to-emerald-900/30 border border-purple-500/30 flex flex-col items-center justify-center text-purple-300 shrink-0 relative overflow-hidden">
            <Zap className={`w-5 h-5 ${isFullASI ? 'animate-bounce text-amber-300' : 'animate-pulse text-purple-400'}`} />
            <span className="text-[9px] font-mono font-bold text-neutral-200">
              L{currentTier.level}
            </span>
          </div>
        </div>
      </div>

      {/* Main ASI Continuum Meter (Progress Bar across all 7 Horizons) */}
      <div className="my-5 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>ASI Evolution Continuum</span>
            </span>
            <span className="text-neutral-500 font-mono text-[11px]">
              (Current Accuracy: <strong className="text-emerald-400 font-mono">{(performanceScore * 100).toFixed(4)}%</strong>)
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            {nextTier ? (
              <span className="text-neutral-400">
                Next Tier: <strong className="text-cyan-400">+{accuracyToNextTier.toFixed(2)}% acc</strong>
                {gensToNext ? ` (~${gensToNext} gen${gensToNext > 1 ? 's' : ''})` : ''}
              </span>
            ) : (
              <span className="text-purple-300 font-bold">
                Max Cognitive Ceiling Breached
              </span>
            )}
            <span className="text-neutral-600">|</span>
            <span className="text-neutral-400">
              To ASI: <strong className={isFullASI ? 'text-purple-300' : 'text-amber-400'}>
                {isFullASI ? '0.00% (Reached)' : `${accuracyToASI.toFixed(2)}% remaining`}
              </strong>
            </span>
          </div>
        </div>

        {/* Continuum Progress Track */}
        <div className="relative h-6 bg-neutral-950 rounded-lg border border-neutral-800 p-1 flex items-center overflow-hidden">
          {/* Active Fill Gradient */}
          <div
            className={`h-full rounded-md transition-all duration-300 bg-gradient-to-r ${
              isFullASI
                ? 'from-blue-500 via-emerald-400 via-amber-400 to-purple-500 shadow-lg shadow-purple-500/30'
                : 'from-blue-600 via-cyan-500 via-emerald-500 to-amber-500'
            }`}
            style={{ width: `${Math.max(3, overallAsiProgress)}%` }}
          />

          {/* Segment Divider Markers (7 Tiers) */}
          {EVOLUTION_TIERS.map((tier, idx) => {
            const markPosition = ((idx + 1) / EVOLUTION_TIERS.length) * 100;
            if (idx === EVOLUTION_TIERS.length - 1) return null;
            return (
              <div
                key={tier.id}
                className="absolute top-0 bottom-0 w-0.5 bg-neutral-800 z-10"
                style={{ left: `${markPosition}%` }}
                title={`${tier.name} boundary`}
              />
            );
          })}

          {/* Current Beacon Position Cursor */}
          <div
            className="absolute top-0 bottom-0 flex items-center justify-center z-20 transition-all duration-300 pointer-events-none"
            style={{ left: `calc(${Math.max(2, Math.min(98, overallAsiProgress))}% - 6px)` }}
          >
            <div className="w-3 h-5 rounded bg-white shadow-lg shadow-white/50 border border-neutral-900 animate-pulse" />
          </div>
        </div>

        {/* Milestone Tick Labels */}
        <div className="grid grid-cols-7 text-[10px] font-mono text-neutral-500 pt-1">
          {EVOLUTION_TIERS.map((tier) => {
            const isPassed = performanceScore >= tier.minAccuracy;
            const isCurrent = tier.level === currentTier.level;
            return (
              <div
                key={tier.id}
                className={`text-center truncate px-0.5 ${
                  isCurrent
                    ? 'text-emerald-400 font-bold'
                    : isPassed
                    ? 'text-neutral-300'
                    : 'text-neutral-600'
                }`}
              >
                <span>L{tier.level}: {(tier.minAccuracy * 100).toFixed(0)}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7 Interactive Evolution Epoch Cards Stepper */}
      <div className="pt-2">
        <div className="flex items-center justify-between pb-2">
          <span className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-neutral-400" />
            <span>Evolutionary Horizons (Click tier to inspect capabilities)</span>
          </span>
          <span className="text-[11px] text-neutral-500 font-mono">
            {activeTierIndex + 1} of 7 horizons unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {EVOLUTION_TIERS.map((tier) => {
            const Icon = tier.icon;
            const isUnlocked = performanceScore >= tier.minAccuracy;
            const isCurrent = tier.level === currentTier.level;
            const isFuture = !isUnlocked;
            const isExpanded = expandedTier === tier.level;

            return (
              <div
                key={tier.id}
                id={`evolution-tier-card-${tier.id}`}
                onClick={() => setExpandedTier(isExpanded ? null : tier.level)}
                className={`p-2.5 rounded-lg border transition-all cursor-pointer select-none flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-neutral-950/90 border-emerald-500/60 ring-1 ring-emerald-500/40 shadow-md shadow-emerald-950/50'
                    : isUnlocked
                    ? 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
                    : 'bg-neutral-950/30 border-neutral-900 opacity-60 hover:opacity-80'
                }`}
              >
                <div>
                  {/* Top Status & Icon */}
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-7 h-7 rounded-md flex items-center justify-center ${
                        isCurrent
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : isUnlocked
                          ? 'bg-neutral-800 text-neutral-300'
                          : 'bg-neutral-900 text-neutral-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    {isCurrent ? (
                      <span className="flex h-2 w-2 relative" title="Current Active Horizon">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                      </span>
                    ) : isUnlocked ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-neutral-600" />
                    )}
                  </div>

                  {/* Level & Name */}
                  <div className="text-[10px] font-mono text-neutral-500 uppercase">
                    Level {tier.level}
                  </div>
                  <div className="text-xs font-bold text-neutral-200 truncate mt-0.5" title={tier.name}>
                    {tier.name}
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                    {(tier.minAccuracy * 100).toFixed(tier.minAccuracy >= 0.99 ? 1 : 0)}% - {(tier.maxAccuracy * 100).toFixed(tier.maxAccuracy >= 0.99 ? 2 : 0)}%
                  </div>
                </div>

                {/* Bottom Status pill */}
                <div className="mt-3 pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[10px] font-mono">
                  <span
                    className={
                      isCurrent
                        ? 'text-emerald-400 font-bold'
                        : isUnlocked
                        ? 'text-neutral-400'
                        : 'text-neutral-600'
                    }
                  >
                    {isCurrent ? `${tierProgress.toFixed(0)}% In Tier` : isUnlocked ? 'Achieved' : 'Locked'}
                  </span>
                  <ChevronDown
                    className={`w-3 h-3 text-neutral-500 transition-transform ${
                      isExpanded ? 'rotate-180 text-neutral-300' : ''
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expanded Tier Inspection Drawer (if user clicks any tier) */}
      {expandedTier !== null && (
        <div className="mt-4 p-4 rounded-xl bg-neutral-950/90 border border-neutral-800 animate-in fade-in slide-in-from-top-2">
          {(() => {
            const tier = EVOLUTION_TIERS.find((t) => t.level === expandedTier);
            if (!tier) return null;
            const Icon = tier.icon;
            const isUnlocked = performanceScore >= tier.minAccuracy;
            const isCurrent = tier.level === currentTier.level;

            return (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-200">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-neutral-100 flex items-center gap-2">
                        <span>Level {tier.level}: {tier.name}</span>
                        <span className="text-xs font-mono font-normal text-neutral-400">({tier.codename})</span>
                      </h4>
                      <p className="text-xs text-neutral-400">{tier.description}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setExpandedTier(null)}
                    className="text-xs text-neutral-400 hover:text-neutral-200 px-2 py-1 rounded bg-neutral-900 border border-neutral-800 cursor-pointer"
                  >
                    Close
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-neutral-800/80 text-xs">
                  <div className="bg-neutral-900/60 p-2.5 rounded-lg border border-neutral-800/60">
                    <span className="text-[10px] uppercase font-mono text-neutral-400 block mb-1">
                      Key Cognitive Breakthrough
                    </span>
                    <p className="text-neutral-200">{tier.breakthrough}</p>
                  </div>

                  <div className="bg-neutral-900/60 p-2.5 rounded-lg border border-neutral-800/60">
                    <span className="text-[10px] uppercase font-mono text-neutral-400 block mb-1">
                      Unlocked Capabilities
                    </span>
                    <ul className="space-y-1">
                      {tier.capabilities.map((cap, i) => (
                        <li key={i} className="text-neutral-300 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-neutral-900/60 p-2.5 rounded-lg border border-neutral-800/60">
                    <span className="text-[10px] uppercase font-mono text-neutral-400 block mb-1">
                      Hardware & Parameters
                    </span>
                    <div className="space-y-1 font-mono text-neutral-300">
                      <div>Baseline Params: ~{formatParameters(tier.minParams)}</div>
                      <div>Status: <span className={isCurrent ? 'text-emerald-400 font-bold' : isUnlocked ? 'text-neutral-300' : 'text-neutral-500'}>
                        {isCurrent ? 'Active Evolution Epoch' : isUnlocked ? 'Conquered Horizon' : 'Pending Singularity Growth'}
                      </span></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
