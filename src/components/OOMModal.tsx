import React, { useState, useEffect } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { formatMemory } from '../utils/formatters';
import { AlertTriangle, Award, TrendingUp, HardDrive, RotateCcw, X, Terminal, Globe } from 'lucide-react';

export const OOMModal: React.FC = () => {
  const {
    status,
    generation,
    performanceScore,
    memoryUsedMb,
    maxMemoryMb,
    resetSimulation,
    setActiveTab,
    toggleInternetMemory,
    startSimulation
  } = useSimulation();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (status === 'oom') {
      setDismissed(false);
    }
  }, [status]);

  if (status !== 'oom' || dismissed) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-neutral-900 border-2 border-rose-500/70 rounded-2xl max-w-lg w-full p-6 shadow-2xl shadow-rose-950/50 relative overflow-hidden">
        {/* Close button */}
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-4 right-4 p-1 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition cursor-pointer"
          title="Dismiss and inspect dashboard"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Badge */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-rose-400 font-bold">
              Critical Halt Triggered
            </span>
            <h2 className="text-lg font-bold text-neutral-100 tracking-tight">
              OUT OF LOCAL MEMORY (OOM)
            </h2>
          </div>
        </div>

        <p className="text-xs text-neutral-300 mb-5 leading-relaxed">
          The recursive self-improvement cycle exceeded the physical ceiling of{' '}
          <span className="font-mono text-neutral-100 font-bold">
            {formatMemory(maxMemoryMb)}
          </span>. You can either restart the local simulation or unlock{' '}
          <span className="text-emerald-400 font-semibold">Unlimited Internet Memory</span> to let the AI continue evolving across global cloud nodes indefinitely.
        </p>

        {/* The Final AI Version Box */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 font-mono mb-5 space-y-2.5">
          <div className="text-xs font-bold text-emerald-400 pb-2 border-b border-neutral-800 flex items-center justify-between">
            <span>=== FINAL LOCAL AI STATE ===</span>
            <span className="text-[10px] text-neutral-400">Gen #{generation}</span>
          </div>

          <div className="flex items-center justify-between text-xs py-1">
            <span className="text-neutral-400 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              Total Generations:
            </span>
            <span className="text-neutral-100 font-bold">{generation}</span>
          </div>

          <div className="flex items-center justify-between text-xs py-1">
            <span className="text-neutral-400 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              Final Optimized Accuracy:
            </span>
            <span className="text-emerald-400 font-bold">
              {(performanceScore * 100).toFixed(4)}%
            </span>
          </div>

          <div className="flex items-center justify-between text-xs py-1">
            <span className="text-neutral-400 flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-rose-400" />
              Peak Memory Load:
            </span>
            <span className="text-rose-400 font-bold">
              {formatMemory(memoryUsedMb)} / {formatMemory(maxMemoryMb)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => {
              toggleInternetMemory(true);
              setDismissed(true);
              startSimulation();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-neutral-950 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <Globe className="w-4 h-4" />
            <span>Unlock Unlimited Internet Memory & Resume</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                resetSimulation();
                setDismissed(true);
              }}
              className="flex-1 py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold border border-neutral-700 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restart Local (10GB)</span>
            </button>

            <button
              onClick={() => {
                setDismissed(true);
                setActiveTab('terminal');
              }}
              className="py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium border border-neutral-700 transition flex items-center gap-2 cursor-pointer"
            >
              <Terminal className="w-4 h-4" />
              <span>Inspect Logs</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
