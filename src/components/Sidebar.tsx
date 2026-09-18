import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { formatMemory } from '../utils/formatters';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  StepForward, 
  Activity, 
  Terminal, 
  History, 
  Sliders, 
  Cpu, 
  AlertTriangle,
  Zap,
  Globe,
  Wifi,
  Gauge
} from 'lucide-react';
import { SimulationGoalsWidget } from './SimulationGoalsWidget';

const SPEED_PRESETS = [
  { id: 'slow', label: '0.5x', rate: 0.5, tag: '0.5x' },
  { id: 'normal', label: '1x', rate: 1.0, tag: '1.0x' },
  { id: 'turbo', label: '4x', rate: 4.0, tag: '4.0x' },
  { id: 'hyper', label: '100x', rate: 100.0, tag: '100x' },
  { id: 'warp', label: '10,000x', rate: 10000.0, tag: '⚡10k' },
] as const;

export const Sidebar: React.FC = () => {
  const {
    status,
    generation,
    memoryUsedMb,
    maxMemoryMb,
    unlimitedInternetMemory,
    toggleInternetMemory,
    internetNodesCount,
    internetBandwidthTbps,
    internetLatencyMs,
    performanceScore,
    speed,
    config,
    activeTab,
    setActiveTab,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    stepSimulation,
    setSpeed,
  } = useSimulation();

  const memoryPercent = unlimitedInternetMemory 
    ? Math.min(100, (memoryUsedMb / 20480) * 100)
    : Math.min(100, (memoryUsedMb / maxMemoryMb) * 100);
  const isDangerMemory = !unlimitedInternetMemory && memoryPercent >= 85;
  const isWarningMemory = !unlimitedInternetMemory && memoryPercent >= 60;
  const speedDisplayLabel = speed >= 10000 
    ? '⚡ 10k gen/s' 
    : `~${Math.max(10, Math.floor(config.delayMs / speed))}ms / gen`;

  const navItems = [
    { id: 'metrics', label: 'Live Telemetry', icon: Activity },
    { id: 'terminal', label: 'Terminal Output', icon: Terminal },
    { id: 'history', label: 'Generations History', icon: History },
    { id: 'architecture', label: 'Architecture & Code', icon: Sliders },
  ] as const;

  return (
    <aside 
      id="app-sidebar"
      className="w-72 bg-neutral-900 border-r border-neutral-800 flex flex-col h-screen select-none shrink-0"
    >
      {/* Brand Header */}
      <div className="p-5 border-b border-neutral-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <Cpu className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-neutral-100 tracking-tight flex items-center gap-2">
            Self-Improving AI
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              v1.0
            </span>
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">Recursive Agent Core</p>
        </div>
      </div>

      {/* System Status Pill */}
      <div className="px-5 py-3 border-b border-neutral-800/60 bg-neutral-950/40">
        <div className="flex items-center justify-between text-xs">
          <span className="text-neutral-400">System State</span>
          <div className="flex items-center gap-2">
            {status === 'running' && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            )}
            {status === 'paused' && (
              <span className="h-2 w-2 rounded-full bg-amber-400"></span>
            )}
            {status === 'idle' && (
              <span className="h-2 w-2 rounded-full bg-neutral-500"></span>
            )}
            {status === 'oom' && (
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
            )}
            <span
              className={`font-mono text-xs font-medium uppercase tracking-wider ${
                status === 'running'
                  ? 'text-emerald-400'
                  : status === 'paused'
                  ? 'text-amber-400'
                  : status === 'oom'
                  ? 'text-rose-400 font-bold'
                  : 'text-neutral-400'
              }`}
            >
              {status === 'oom' ? 'OOM HALT' : status}
            </span>
          </div>
        </div>
      </div>

      {/* Control Actions Section */}
      <div className="p-5 border-b border-neutral-800 space-y-3">
        <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
          Simulation Controls
        </div>

        {/* Primary Start / Pause Button */}
        {status === 'running' ? (
          <button
            id="btn-pause-simulation"
            onClick={pauseSimulation}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-medium text-sm transition shadow-sm cursor-pointer"
          >
            <Pause className="w-4 h-4 fill-current" />
            <span>Pause Simulation</span>
          </button>
        ) : (
          <button
            id="btn-start-simulation"
            onClick={startSimulation}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-medium text-sm transition shadow-sm shadow-emerald-950/40 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{status === 'oom' ? 'Restart Simulation' : status === 'paused' ? 'Resume Simulation' : 'Start Simulation'}</span>
          </button>
        )}

        {/* Secondary Controls: Step and Reset */}
        <div className="grid grid-cols-2 gap-2">
          <button
            id="btn-step-simulation"
            onClick={stepSimulation}
            disabled={status === 'running' || status === 'oom'}
            title="Execute exactly 1 improvement cycle"
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed text-neutral-200 text-xs font-medium border border-neutral-700/60 transition cursor-pointer"
          >
            <StepForward className="w-3.5 h-3.5" />
            <span>Step Gen</span>
          </button>

          <button
            id="btn-reset-simulation"
            onClick={resetSimulation}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 hover:text-neutral-100 text-xs font-medium border border-neutral-700/60 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Unlimited Internet Memory Toggle Widget */}
        <div className="pt-2">
          <div 
            onClick={() => toggleInternetMemory()}
            className={`p-2.5 rounded-lg border transition cursor-pointer select-none ${
              unlimitedInternetMemory
                ? 'bg-emerald-950/40 border-emerald-500/40 hover:border-emerald-500/60'
                : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-md flex items-center justify-center ${
                  unlimitedInternetMemory ? 'bg-emerald-500/20 text-emerald-400' : 'bg-neutral-800 text-neutral-400'
                }`}>
                  <Globe className={`w-4 h-4 ${unlimitedInternetMemory ? 'animate-pulse' : ''}`} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-neutral-200 flex items-center gap-1.5">
                    <span>Internet Memory</span>
                    <span className={`text-[9px] font-mono px-1 py-0.2 rounded font-bold uppercase ${
                      unlimitedInternetMemory ? 'bg-emerald-500/20 text-emerald-300' : 'bg-neutral-800 text-neutral-400'
                    }`}>
                      {unlimitedInternetMemory ? 'Unlimited' : 'Off'}
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-400 font-mono">
                    {unlimitedInternetMemory ? `${internetNodesCount.toLocaleString()} global nodes` : 'Capped to 10 GB RAM'}
                  </p>
                </div>
              </div>

              {/* Toggle switch visual */}
              <div className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                unlimitedInternetMemory ? 'bg-emerald-500' : 'bg-neutral-700'
              }`}>
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  unlimitedInternetMemory ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </div>
            </div>

            {unlimitedInternetMemory && (
              <div className="mt-2 pt-2 border-t border-emerald-500/20 flex items-center justify-between text-[10px] font-mono text-emerald-400/90">
                <span className="flex items-center gap-1">
                  <Wifi className="w-3 h-3" /> {internetLatencyMs}ms latency
                </span>
                <span>{internetBandwidthTbps} Tbps mesh</span>
              </div>
            )}
          </div>
        </div>

        {/* Simulation Goals Widget */}
        <div className="pt-2">
          <SimulationGoalsWidget />
        </div>

        {/* Speed Toggle Control */}
        <div className="pt-2">
          <div className="bg-neutral-950/70 p-2.5 rounded-lg border border-neutral-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                <span>Simulation Speed</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
                ~{currentIntervalMs}ms / gen
              </span>
            </div>

            {/* Segmented Speed Toggle */}
            <div className="grid grid-cols-5 gap-1 p-1 bg-neutral-900/90 rounded-lg border border-neutral-800">
              {SPEED_PRESETS.map((preset) => {
                const isSelected = speed === preset.rate;
                const presetInterval = Math.max(10, Math.floor(config.delayMs / preset.rate));
                const is100x = preset.rate >= 100;
                return (
                  <button
                    key={preset.id}
                    id={`speed-toggle-${preset.id}`}
                    onClick={() => setSpeed(preset.rate)}
                    title={`${preset.label} Speed (~${presetInterval}ms interval)`}
                    className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-md transition-all cursor-pointer select-none ${
                      isSelected
                        ? is100x
                          ? 'bg-gradient-to-b from-amber-500/20 to-emerald-500/20 text-amber-300 font-bold border border-amber-500/50 shadow-sm'
                          : 'bg-neutral-800 text-emerald-400 font-bold border border-emerald-500/40 shadow-sm'
                        : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40 border border-transparent'
                    }`}
                  >
                    <span className="text-xs tracking-tight">{preset.label}</span>
                    <span className={`text-[9px] font-mono ${isSelected ? (is100x ? 'text-amber-300' : 'text-emerald-300/80') : 'text-neutral-500'}`}>
                      {preset.tag}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[10px] text-neutral-500 font-mono">
              <span>Loop Interval</span>
              <span className="text-neutral-400">
                {speed >= 100 ? 'Hyperspeed (100x Ultra)' : speed <= 0.5 ? 'Slow (Step-by-step)' : speed === 1 ? 'Normal (Standard)' : speed === 2 ? 'Fast (Accelerated)' : 'Turbo (Rapid)'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="px-3 py-4 flex-1 space-y-1 overflow-y-auto">
        <div className="px-2 pb-2 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
          Views
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-tab-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                isActive
                  ? 'bg-neutral-800 text-emerald-400 border border-neutral-700/50'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-neutral-500'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Memory Pressure Telemetry in Sidebar */}
      <div className="p-4 border-t border-neutral-800 bg-neutral-950/60">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-neutral-400 flex items-center gap-1.5">
            {isDangerMemory && <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-bounce" />}
            {unlimitedInternetMemory ? 'Internet Memory Pool' : 'Memory Ceiling'}
          </span>
          <span className="font-mono text-neutral-300">
            {unlimitedInternetMemory ? (
              <span className="text-emerald-400 font-bold">{formatMemory(memoryUsedMb)} / ∞</span>
            ) : (
              `${formatMemory(memoryUsedMb)} / ${formatMemory(maxMemoryMb)}`
            )}
          </span>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
          {unlimitedInternetMemory ? (
            <div className="h-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-emerald-400 w-full animate-pulse opacity-85" />
          ) : (
            <div
              className={`h-full transition-all duration-300 ${
                isDangerMemory
                  ? 'bg-rose-500'
                  : isWarningMemory
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${memoryPercent}%` }}
            />
          )}
        </div>

        <div className="flex justify-between items-center text-[10px] text-neutral-400 mt-2 font-mono">
          <span>Gen #{generation}</span>
          <span>{unlimitedInternetMemory ? '🌐 Mesh Paged' : `Acc: ${(performanceScore * 100).toFixed(1)}%`}</span>
        </div>
      </div>
    </aside>
  );
};
