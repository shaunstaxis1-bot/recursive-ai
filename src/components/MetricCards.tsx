import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { formatMemory, formatParameters } from '../utils/formatters';
import { Layers, Target, Database, Cpu, TrendingUp, AlertOctagon, Globe } from 'lucide-react';

export const MetricCards: React.FC = () => {
  const {
    generation,
    performanceScore,
    codeBaseComplexity,
    memoryUsedMb,
    maxMemoryMb,
    unlimitedInternetMemory,
    internetNodesCount,
    internetBandwidthTbps,
    history,
    status,
  } = useSimulation();

  const currentRecord = history[history.length - 1];
  const prevRecord = history.length > 1 ? history[history.length - 2] : null;

  const memoryPercentage = Math.min(100, (memoryUsedMb / maxMemoryMb) * 100);

  // Delta calculations
  const accuracyDelta = prevRecord
    ? (performanceScore - prevRecord.performanceScore) * 100
    : 0;
  const complexityDelta = prevRecord
    ? codeBaseComplexity - prevRecord.codeBaseComplexity
    : 0;
  const memoryDelta = prevRecord ? memoryUsedMb - prevRecord.memoryUsedMb : 0;

  return (
    <div id="metric-cards-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Generation Metric */}
      <div 
        id="card-generation"
        className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-4 flex flex-col justify-between hover:border-neutral-700 transition"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-neutral-400">Current Generation</span>
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Layers className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-3xl font-bold font-mono tracking-tight text-neutral-100 flex items-baseline gap-2">
            #{generation}
            <span className="text-xs font-sans font-normal text-neutral-400">
              {status === 'running' ? 'Iterating...' : status === 'oom' ? 'Halted' : 'Ready'}
            </span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
          <span>Cycle status:</span>
          <span className="font-mono text-neutral-300">
            {history.length} cycle{history.length !== 1 ? 's' : ''} logged
          </span>
        </div>
      </div>

      {/* 2. Optimized Accuracy Metric */}
      <div 
        id="card-accuracy"
        className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-4 flex flex-col justify-between hover:border-neutral-700 transition"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-neutral-400">Optimized Accuracy</span>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Target className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-3xl font-bold font-mono tracking-tight text-neutral-100 flex items-baseline gap-1">
            {(performanceScore * 100).toFixed(2)}
            <span className="text-xl text-emerald-400">%</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
          <span className="text-neutral-400">
            {unlimitedInternetMemory ? 'Target: 99.9999%' : 'Ceiling: 99.99%'}
          </span>
          <span className="font-mono text-emerald-400 flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" />
            +{accuracyDelta > 0 ? accuracyDelta.toFixed(2) : '0.00'}%
          </span>
        </div>
      </div>

      {/* 3. Code Complexity / Parameters */}
      <div 
        id="card-complexity"
        className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-4 flex flex-col justify-between hover:border-neutral-700 transition"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-neutral-400">Codebase Complexity</span>
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Cpu className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-3xl font-bold font-mono tracking-tight text-neutral-100">
            {codeBaseComplexity > 10_000_000 ? formatParameters(codeBaseComplexity) : codeBaseComplexity.toLocaleString()}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
          <span className="text-neutral-400">Parameters / LOC</span>
          <span className="font-mono text-cyan-400">
            +{complexityDelta > 0 ? (complexityDelta > 1_000_000 ? formatParameters(complexityDelta) : complexityDelta.toLocaleString()) : 0}
          </span>
        </div>
      </div>

      {/* 4. Memory Consumption */}
      <div 
        id="card-memory"
        className={`bg-neutral-900/90 border rounded-xl p-4 flex flex-col justify-between transition ${
          unlimitedInternetMemory
            ? 'border-emerald-500/40 bg-emerald-950/15'
            : memoryPercentage >= 90
            ? 'border-rose-500/60 bg-rose-950/20 shadow-sm shadow-rose-950/30'
            : memoryPercentage >= 65
            ? 'border-amber-500/40'
            : 'border-neutral-800 hover:border-neutral-700'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-neutral-400 flex items-center gap-1.5">
            {!unlimitedInternetMemory && memoryPercentage >= 90 && <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />}
            {unlimitedInternetMemory ? 'Internet Memory' : 'Memory Load'}
          </span>
          <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${
            unlimitedInternetMemory
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : memoryPercentage >= 90 
              ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' 
              : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
          }`}>
            {unlimitedInternetMemory ? <Globe className="w-4 h-4 animate-pulse" /> : <Database className="w-4 h-4" />}
          </div>
        </div>

        <div className="mt-3">
          <div className="text-3xl font-bold font-mono tracking-tight text-neutral-100 flex items-baseline gap-1">
            {formatMemory(memoryUsedMb)}
            <span className="text-sm text-neutral-400 font-sans font-normal ml-1">
              / {unlimitedInternetMemory ? '∞ Unlimited' : formatMemory(maxMemoryMb)}
            </span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
          <span className="text-neutral-400">
            {unlimitedInternetMemory ? `${internetNodesCount.toLocaleString()} Web Nodes` : `${memoryPercentage.toFixed(1)}% of ceiling`}
          </span>
          <span className={`font-mono font-medium ${
            unlimitedInternetMemory ? 'text-emerald-400' : memoryPercentage >= 90 ? 'text-rose-400' : 'text-amber-400'
          }`}>
            +{formatMemory(memoryDelta)}
          </span>
        </div>
      </div>
    </div>
  );
};
