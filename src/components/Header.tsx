import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { formatMemoryCompact } from '../utils/formatters';
import { Menu, Zap, Play, Pause, RotateCcw, Globe } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const {
    activeTab,
    status,
    generation,
    performanceScore,
    memoryUsedMb,
    maxMemoryMb,
    unlimitedInternetMemory,
    toggleInternetMemory,
    startSimulation,
    pauseSimulation,
    resetSimulation,
  } = useSimulation();

  const getTabDetails = () => {
    switch (activeTab) {
      case 'metrics':
        return {
          title: 'Live Telemetry & Metrics',
          subtitle: 'Real-time observation of recursive self-improvement generations, parameter expansion, and unlimited internet memory mesh.',
        };
      case 'terminal':
        return {
          title: 'Python Terminal Console',
          subtitle: 'Interactive stdout execution log mirroring the Python agent runtime, distributed cloud swap, and memory telemetry.',
        };
      case 'history':
        return {
          title: 'Generations History Ledger',
          subtitle: 'Detailed chronological table of every architecture mutation factor, complexity delta, and internet memory paging.',
        };
      case 'architecture':
        return {
          title: 'Architecture & Simulation Parameters',
          subtitle: 'Direct inspection of the SelfImprovingAI Python model with unlimited internet memory mesh integration.',
        };
    }
  };

  const { title, subtitle } = getTabDetails();

  return (
    <header 
      id="main-app-header"
      className="bg-neutral-900/80 backdrop-blur border-b border-neutral-800 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-20"
    >
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white"
            title="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div>
          <h2 className="text-lg font-bold text-neutral-100 tracking-tight">{title}</h2>
          <p className="text-xs text-neutral-400 mt-0.5">{subtitle}</p>
        </div>
      </div>

      {/* Quick Status and Top Action Bar */}
      <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
        {/* Internet Memory Status Pill */}
        <button
          onClick={() => toggleInternetMemory()}
          title="Click to toggle Unlimited Internet Memory"
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition cursor-pointer ${
            unlimitedInternetMemory
              ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300 hover:border-emerald-500/70'
              : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Globe className={`w-3.5 h-3.5 ${unlimitedInternetMemory ? 'text-emerald-400 animate-pulse' : 'text-neutral-500'}`} />
          <span className="hidden sm:inline">Internet Memory:</span>
          <span className="font-bold">{unlimitedInternetMemory ? 'Unlimited (∞)' : 'Off (10GB)'}</span>
        </button>

        <div className="hidden sm:flex items-center gap-3 bg-neutral-950 px-3 py-1.5 rounded-lg border border-neutral-800 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-400">Gen:</span>
            <span className="text-neutral-100 font-bold">#{generation}</span>
          </div>
          <div className="h-3 w-px bg-neutral-800" />
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-400">Acc:</span>
            <span className="text-emerald-400 font-bold">{(performanceScore * 100).toFixed(2)}%</span>
          </div>
          <div className="h-3 w-px bg-neutral-800" />
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-400">Mem:</span>
            <span className={!unlimitedInternetMemory && memoryUsedMb >= maxMemoryMb ? 'text-rose-400 font-bold' : 'text-amber-400 font-bold'}>
              {formatMemoryCompact(memoryUsedMb)}
            </span>
          </div>
        </div>

        {/* Quick Start / Pause */}
        {status === 'running' ? (
          <button
            onClick={pauseSimulation}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-semibold transition cursor-pointer"
          >
            <Pause className="w-3.5 h-3.5 fill-current" />
            <span>Pause</span>
          </button>
        ) : (
          <button
            onClick={startSimulation}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-semibold transition shadow-sm cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{status === 'oom' ? 'Restart' : status === 'paused' ? 'Resume' : 'Start'}</span>
          </button>
        )}

        <button
          onClick={resetSimulation}
          title="Reset simulation"
          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 text-xs transition cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
