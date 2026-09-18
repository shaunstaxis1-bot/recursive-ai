import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { MetricCards } from './MetricCards';
import { AsiEvolutionMeter } from './AsiEvolutionMeter';
import { formatMemory, formatMemoryCompact } from '../utils/formatters';
import { 
  AlertTriangle, 
  ArrowUpRight, 
  Code2, 
  TrendingUp, 
  HardDrive,
  RefreshCw,
  Terminal as TerminalIcon,
  Globe,
  Wifi,
  CloudLightning,
  Trophy,
  Target,
  Sparkles,
  Zap
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';

export const MetricsDashboard: React.FC = () => {
  const {
    status,
    generation,
    performanceScore,
    codeBaseComplexity,
    memoryUsedMb,
    maxMemoryMb,
    unlimitedInternetMemory,
    toggleInternetMemory,
    internetNodesCount,
    internetBandwidthTbps,
    internetLatencyMs,
    history,
    currentInnovation,
    goal,
    setShowCelebrationModal,
    milestoneReport,
    setActiveTab,
    startSimulation,
  } = useSimulation();

  const [activePayload, setActivePayload] = useState<any>(null);

  const memoryPercent = unlimitedInternetMemory
    ? Math.min(100, (memoryUsedMb / 20480) * 100)
    : Math.min(100, (memoryUsedMb / maxMemoryMb) * 100);
  const isOOM = status === 'oom';
  const isDanger = !unlimitedInternetMemory && memoryPercent >= 85;

  const chartData = history.map((record) => ({
    name: `Gen ${record.generation}`,
    generation: record.generation,
    accuracy: Number((record.performanceScore * 100).toFixed(4)),
    memory: Number(record.memoryUsedMb.toFixed(2)),
    parameters: record.codeBaseComplexity,
    module: record.moduleModified,
    innovation: Number(((record.innovationFactor - 1) * 100).toFixed(1)),
    timestamp: record.timestamp,
    isInternetPaging: record.isInternetPaging,
    internetRegion: record.internetRegion,
  }));

  const latestRecord = history[history.length - 1];

  return (
    <div id="metrics-dashboard" className="space-y-6 max-w-7xl mx-auto">
      {/* OOM Alert Banner (Only when Internet Memory is OFF and limit reached) */}
      {isOOM && (
        <div 
          id="oom-alert-banner"
          className="bg-rose-950/50 border-2 border-rose-500/80 rounded-xl p-5 shadow-lg shadow-rose-950/40 text-neutral-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2"
        >
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-rose-300">
                  CRITICAL ERROR: OUT OF MEMORY (OOM) DETECTED
                </h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  LOCAL RAM HALT
                </span>
              </div>
              <p className="text-xs text-neutral-300 mt-1">
                Peak memory ceiling of <span className="font-mono font-semibold">{formatMemory(maxMemoryMb)}</span> reached at Generation <span className="font-mono font-semibold">#{generation}</span>. The self-improvement loop halted due to physical RAM exhaustion.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                toggleInternetMemory(true);
                startSimulation();
              }}
              className="px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-semibold shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <Globe className="w-4 h-4" />
              <span>Enable Unlimited Internet Memory</span>
            </button>
            <button
              onClick={() => setActiveTab('terminal')}
              className="px-3.5 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-medium border border-neutral-700 transition flex items-center gap-1.5 cursor-pointer"
            >
              <TerminalIcon className="w-3.5 h-3.5" />
              <span>Inspect Log</span>
            </button>
          </div>
        </div>
      )}

      {/* Internet Swarm Active Banner */}
      {unlimitedInternetMemory && (
        <div 
          id="internet-memory-banner"
          className="bg-gradient-to-r from-emerald-950/40 via-neutral-900/90 to-cyan-950/30 border border-emerald-500/30 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Globe className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-neutral-100 flex items-center gap-1.5">
                  <span>Unlimited Internet Memory Mesh Active</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase font-semibold">
                    Unbounded
                  </span>
                </h3>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                The recursive self-improving agent dynamically expands memory across global internet cloud nodes. Physical OOM halts are bypassed.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono shrink-0 bg-neutral-950/80 px-3 py-2 rounded-lg border border-neutral-800">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <Globe className="w-3.5 h-3.5" />
              <span>{internetNodesCount.toLocaleString()} Nodes</span>
            </div>
            <div className="h-3 w-px bg-neutral-800" />
            <div className="flex items-center gap-1.5 text-cyan-400">
              <Wifi className="w-3.5 h-3.5" />
              <span>{internetLatencyMs}ms RTT</span>
            </div>
            <div className="h-3 w-px bg-neutral-800" />
            <div className="flex items-center gap-1.5 text-neutral-300">
              <CloudLightning className="w-3.5 h-3.5 text-amber-400" />
              <span>{internetBandwidthTbps} Tbps</span>
            </div>
          </div>
        </div>
      )}

      {/* Goal Milestone Reached Banner */}
      {goal.reached && (
        <div 
          id="milestone-achieved-banner"
          className={`border rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg animate-in fade-in ${
            goal.isSuperIntelligence || goal.targetScore >= 0.9999
              ? 'bg-gradient-to-r from-purple-950/50 via-neutral-900/95 to-amber-950/40 border-purple-500/50 shadow-purple-950/40'
              : 'bg-gradient-to-r from-amber-950/40 via-neutral-900/95 to-emerald-950/40 border-amber-500/40'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
              goal.isSuperIntelligence || goal.targetScore >= 0.9999
                ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            }`}>
              {goal.isSuperIntelligence || goal.targetScore >= 0.9999 ? (
                <Zap className="w-5 h-5 animate-pulse" />
              ) : (
                <Trophy className="w-5 h-5 animate-bounce" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-neutral-100 flex items-center gap-1.5">
                  <span>
                    {goal.isSuperIntelligence || goal.targetScore >= 0.9999
                      ? '🌟 Artificial Superintelligence (ASI) Achieved!'
                      : 'Simulation Goal Milestone Reached!'}
                  </span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border font-bold uppercase ${
                    goal.isSuperIntelligence || goal.targetScore >= 0.9999
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}>
                    {(goal.targetScore * 100).toFixed(goal.targetScore >= 0.999 ? 2 : 0)}% Target Met
                  </span>
                </h3>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                {goal.isSuperIntelligence || goal.targetScore >= 0.9999
                  ? `The agent conquered the 99.99% Superintelligence horizon ${goal.reachedAtGeneration ? `at Generation #${goal.reachedAtGeneration}` : ''} with ${((goal.reachedScore ?? performanceScore) * 100).toFixed(4)}% accuracy.`
                  : `The agent surpassed the performance threshold ${goal.reachedAtGeneration ? `at Generation #${goal.reachedAtGeneration}` : ''} with ${((goal.reachedScore ?? performanceScore) * 100).toFixed(2)}% accuracy.`}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowCelebrationModal(true)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-neutral-950 text-xs font-bold transition shadow-sm cursor-pointer shrink-0 ${
              goal.isSuperIntelligence || goal.targetScore >= 0.9999
                ? 'bg-gradient-to-r from-purple-400 via-indigo-300 to-amber-400 hover:from-purple-300 hover:to-amber-300'
                : 'bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{goal.isSuperIntelligence || goal.targetScore >= 0.9999 ? 'View Superintelligence Audit' : 'View Milestone Report'}</span>
          </button>
        </div>
      )}

      {/* Current Level of Evolution - ASI Meter */}
      <AsiEvolutionMeter />

      {/* Primary 4 Metric Cards */}
      <MetricCards />

      {/* Middle Section: Telemetry Gauge & Recursive Execution Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Memory Pressure & Safe Ceiling Gauge */}
        <div 
          id="panel-memory-gauge"
          className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-5 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-neutral-200 flex items-center gap-2">
                {unlimitedInternetMemory ? (
                  <Globe className="w-4 h-4 text-emerald-400" />
                ) : (
                  <HardDrive className="w-4 h-4 text-neutral-400" />
                )}
                {unlimitedInternetMemory ? 'Internet Mesh Buffer' : 'Memory Ceiling Proximity'}
              </h3>
              <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded ${
                unlimitedInternetMemory
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : isDanger
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}>
                {unlimitedInternetMemory ? 'UNLIMITED' : `${memoryPercent.toFixed(1)}%`}
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              {unlimitedInternetMemory
                ? 'Allocated across decentralized web nodes via ultra-low-latency distributed swap.'
                : `Simulated buffer ceiling of ${formatMemory(maxMemoryMb)} prevents host process crash.`}
            </p>
          </div>

          {/* Large Visual Progress Bar with Thresholds */}
          <div className="my-6 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-neutral-400">
                {formatMemory(memoryUsedMb)} Allocated
              </span>
              <span className="text-neutral-400">
                {unlimitedInternetMemory ? '∞ Unlimited (Web Mesh)' : `${formatMemory(maxMemoryMb)} Max`}
              </span>
            </div>

            <div className="h-4 bg-neutral-950 rounded-full p-0.5 border border-neutral-800 overflow-hidden relative">
              {unlimitedInternetMemory ? (
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-emerald-400 w-full animate-pulse opacity-90" />
              ) : (
                <>
                  <div className="absolute top-0 bottom-0 left-[50%] w-0.5 bg-neutral-700/60 z-10" title="50% threshold" />
                  <div className="absolute top-0 bottom-0 left-[85%] w-0.5 bg-rose-500/60 z-10" title="85% Danger" />
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isOOM
                        ? 'bg-gradient-to-r from-rose-600 to-red-500 shadow-lg shadow-rose-900/50'
                        : isDanger
                        ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                        : 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                    }`}
                    style={{ width: `${memoryPercent}%` }}
                  />
                </>
              )}
            </div>

            <div className="flex justify-between text-[10px] text-neutral-400 px-1 font-mono">
              <span>{unlimitedInternetMemory ? 'Local Ingress' : '0 MB (Base)'}</span>
              <span>{unlimitedInternetMemory ? `${internetNodesCount.toLocaleString()} P2P Nodes` : `${formatMemory(maxMemoryMb / 2)} (50%)`}</span>
              <span className={unlimitedInternetMemory ? 'text-emerald-400' : 'text-rose-400'}>
                {unlimitedInternetMemory ? '∞ Global Mesh' : `${formatMemory(maxMemoryMb)} (OOM)`}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-800/80 grid grid-cols-2 gap-3 text-xs">
            <div className="bg-neutral-950/60 p-2.5 rounded-lg border border-neutral-800/60">
              <span className="text-neutral-400 block text-[11px]">
                {unlimitedInternetMemory ? 'Mesh Status' : 'Headroom Left'}
              </span>
              <span className="text-neutral-200 font-mono font-semibold text-sm">
                {unlimitedInternetMemory ? (
                  <span className="text-emerald-400">Unlimited</span>
                ) : (
                  formatMemory(Math.max(0, maxMemoryMb - memoryUsedMb))
                )}
              </span>
            </div>
            <div className="bg-neutral-950/60 p-2.5 rounded-lg border border-neutral-800/60">
              <span className="text-neutral-400 block text-[11px]">Growth Ratio</span>
              <span className="text-cyan-400 font-mono font-semibold text-sm">
                {currentInnovation ? `x${currentInnovation.toFixed(3)}` : '1.000'}
              </span>
            </div>
          </div>
        </div>

        {/* Recursive Improvement Loop Architecture */}
        <div 
          id="panel-loop-flow"
          className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-5 lg:col-span-2 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-neutral-200 flex items-center gap-2">
                <RefreshCw className={`w-4 h-4 text-emerald-400 ${status === 'running' ? 'animate-spin' : ''}`} />
                Self-Improvement Recursion Loop
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Simulated code rewriting cycle with distributed internet memory streaming.
              </p>
            </div>
            <span className="text-xs font-mono text-neutral-400 bg-neutral-950 px-2.5 py-1 rounded-md border border-neutral-800">
              loop delay: 400ms
            </span>
          </div>

          {/* 3 Step Interactive Flow Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
            {/* Step 1: evaluate_self() */}
            <div className="bg-neutral-950/80 border border-neutral-800 rounded-lg p-3 relative overflow-hidden">
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-200 mb-1">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-mono">1</span>
                <span>evaluate_self()</span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed font-mono">
                innovation = uniform(1.05, 1.30)
              </p>
              <div className="mt-2 text-xs text-neutral-300 font-mono flex items-center justify-between">
                <span className="text-neutral-400">Factor:</span>
                <span className="text-emerald-400 font-bold">
                  {currentInnovation ? `+${((currentInnovation - 1) * 100).toFixed(1)}%` : 'Active'}
                </span>
              </div>
            </div>

            {/* Step 2: rewrite_code() */}
            <div className="bg-neutral-950/80 border border-neutral-800 rounded-lg p-3 relative overflow-hidden">
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-200 mb-1">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-mono">2</span>
                <span>rewrite_code()</span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed font-mono truncate">
                {latestRecord.moduleModified}
              </p>
              <div className="mt-2 text-xs text-neutral-300 font-mono flex items-center justify-between">
                <span className="text-neutral-400">Expansion:</span>
                <span className="text-cyan-400 font-bold">
                  {codeBaseComplexity.toLocaleString()} params
                </span>
              </div>
            </div>

            {/* Step 3: memory_expansion() */}
            <div className="bg-neutral-950/80 border border-neutral-800 rounded-lg p-3 relative overflow-hidden">
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-200 mb-1">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-mono">3</span>
                <span>{unlimitedInternetMemory ? 'internet_mesh_swap()' : 'memory_expansion'}</span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed font-mono">
                {unlimitedInternetMemory ? 'paged to global web nodes' : 'mem += (comp * 0.005) * factor'}
              </p>
              <div className="mt-2 text-xs text-neutral-300 font-mono flex items-center justify-between">
                <span className="text-neutral-400">Status:</span>
                <span className={`font-bold ${unlimitedInternetMemory ? 'text-emerald-400' : isOOM ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {unlimitedInternetMemory ? '🌐 UNLIMITED' : isOOM ? 'OOM HALT' : 'Within Bounds'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
            <span className="flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-neutral-400" />
              Source Model: <code className="text-neutral-300 font-mono">SelfImprovingAI.run_improvement_cycle()</code>
            </span>
            <button
              onClick={() => setActiveTab('architecture')}
              className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 text-xs cursor-pointer"
            >
              View Python source code <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Accuracy & Memory Progression Recharts Live Chart */}
      <div 
        id="panel-growth-chart"
        className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-neutral-200 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Live Telemetry: Accuracy vs Memory Historical Trend
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Recharts live visualization tracking dual-axis accuracy (%) against memory load across generations.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            {unlimitedInternetMemory ? (
              <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 flex items-center gap-1">
                <Globe className="w-3 h-3" /> Internet Paging Active (∞)
              </span>
            ) : isOOM ? (
              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                OOM Reached
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-neutral-300">
                10 GB RAM Cap
              </span>
            )}
            <span className="px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-neutral-300">
              {chartData.length} data points
            </span>
          </div>
        </div>

        {/* Live Recharts LineChart */}
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 15, right: 20, left: 0, bottom: 5 }}
              onMouseMove={(e: any) => {
                if (e && e.activePayload && e.activePayload.length) {
                  setActivePayload(e.activePayload[0].payload);
                }
              }}
              onMouseLeave={() => setActivePayload(null)}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
              
              <XAxis 
                dataKey="name" 
                stroke="#737373" 
                tick={{ fill: '#a3a3a3', fontSize: 11 }}
                tickLine={{ stroke: '#404040' }}
              />
              
              {/* Left Y-Axis for Accuracy % */}
              <YAxis
                yAxisId="left"
                stroke="#10b981"
                domain={[0, 100]}
                tick={{ fill: '#10b981', fontSize: 11 }}
                tickFormatter={(val) => `${val}%`}
                width={50}
              />

              {/* Right Y-Axis for Memory */}
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#f59e0b"
                domain={[0, (dataMax: number) => Math.max(unlimitedInternetMemory ? 1024 : maxMemoryMb, Math.ceil(dataMax || 0))]}
                tick={{ fill: '#f59e0b', fontSize: 11 }}
                tickFormatter={(val) => formatMemoryCompact(val)}
                width={55}
              />

              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    const formattedMem = formatMemory(data.memory);
                    const formattedMax = unlimitedInternetMemory ? '∞ Unlimited (Internet Mesh)' : formatMemory(maxMemoryMb);
                    return (
                      <div className="bg-neutral-950/95 border border-neutral-700 p-3 rounded-lg shadow-xl text-xs font-mono space-y-1.5 z-30 backdrop-blur-sm">
                        <div className="text-neutral-100 font-bold border-b border-neutral-800 pb-1 flex justify-between items-center gap-4">
                          <span>{label}</span>
                          <span className="text-neutral-400 font-normal text-[10px]">{data.timestamp}</span>
                        </div>
                        <div className="text-emerald-400 flex justify-between gap-4">
                          <span>Accuracy:</span>
                          <span className="font-bold">{data.accuracy}%</span>
                        </div>
                        <div className="text-amber-400 flex justify-between gap-4">
                          <span>Memory Load:</span>
                          <span className="font-bold">{formattedMem} / {formattedMax}</span>
                        </div>
                        <div className="text-cyan-400 flex justify-between gap-4">
                          <span>Complexity:</span>
                          <span>{data.parameters.toLocaleString()} params</span>
                        </div>
                        {data.internetRegion && (
                          <div className="text-emerald-400 flex justify-between gap-4 text-[11px]">
                            <span>Internet Region:</span>
                            <span className="truncate max-w-[140px]">{data.internetRegion}</span>
                          </div>
                        )}
                        <div className="text-neutral-400 flex justify-between gap-4 text-[11px] pt-1 border-t border-neutral-800/80">
                          <span>Rewritten Module:</span>
                          <span className="text-neutral-200 truncate max-w-[140px]">{data.module}</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Legend 
                verticalAlign="top"
                height={36}
                wrapperStyle={{ paddingBottom: '10px', fontSize: '12px' }}
              />

              {/* Reference Line */}
              {!unlimitedInternetMemory ? (
                <ReferenceLine
                  yAxisId="right"
                  y={maxMemoryMb}
                  stroke="#f43f5e"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  label={{
                    value: `${formatMemory(maxMemoryMb)} OOM Limit`,
                    fill: '#f43f5e',
                    fontSize: 10,
                    position: 'insideTopRight',
                  }}
                />
              ) : (
                <ReferenceLine
                  yAxisId="right"
                  y={maxMemoryMb}
                  stroke="#10b981"
                  strokeDasharray="2 4"
                  strokeWidth={1}
                  label={{
                    value: `Local Boundary (${formatMemory(maxMemoryMb)}) → Internet Paging Active`,
                    fill: '#10b981',
                    fontSize: 9,
                    position: 'insideTopRight',
                  }}
                />
              )}

              {/* Goal Target Reference Line */}
              <ReferenceLine
                yAxisId="left"
                y={goal.targetScore * 100}
                stroke={goal.isSuperIntelligence || goal.targetScore >= 0.9999 ? '#c084fc' : '#eab308'}
                strokeDasharray={goal.isSuperIntelligence || goal.targetScore >= 0.9999 ? '3 3' : '4 4'}
                strokeWidth={goal.isSuperIntelligence || goal.targetScore >= 0.9999 ? 2 : 1.5}
                label={{
                  value: goal.isSuperIntelligence || goal.targetScore >= 0.9999
                    ? 'Target: 99.99% (Super Intelligence ASI)'
                    : `Target Goal: ${(goal.targetScore * 100).toFixed(goal.targetScore >= 0.999 ? 2 : 1)}%`,
                  fill: goal.isSuperIntelligence || goal.targetScore >= 0.9999 ? '#d8b4fe' : '#facc15',
                  fontSize: 10,
                  position: 'insideTopLeft',
                }}
              />

              {/* Accuracy Live Line */}
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="accuracy"
                name="AI Accuracy (%)"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#10b981', stroke: '#09090b', strokeWidth: 1.5 }}
                activeDot={{ r: 6, fill: '#10b981' }}
                isAnimationActive={false}
              />

              {/* Memory Consumption Live Line */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="memory"
                name="Memory Consumption"
                stroke="#f59e0b"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#f59e0b', stroke: '#09090b', strokeWidth: 1.5 }}
                activeDot={{ r: 6, fill: '#f59e0b' }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Active Point Inspector */}
        <div className="mt-3 pt-3 border-t border-neutral-800 flex flex-wrap items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="text-neutral-400">Selected:</span>
            <span className="font-mono text-neutral-200 font-semibold bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
              {activePayload ? `Gen #${activePayload.generation}` : `Gen #${latestRecord.generation} (Current)`}
            </span>
            <span className="text-neutral-400">
              Module: <code className="text-neutral-300 font-mono">
                {activePayload ? activePayload.module : latestRecord.moduleModified}
              </code>
            </span>
          </div>

          <div className="flex items-center gap-4 font-mono">
            <span className="text-emerald-400">
              Accuracy: {activePayload ? activePayload.accuracy : (latestRecord.performanceScore * 100).toFixed(4)}%
            </span>
            <span className="text-amber-400">
              Memory: {activePayload 
                ? formatMemory(activePayload.memory)
                : formatMemory(latestRecord.memoryUsedMb)}
            </span>
            <span className="text-cyan-400">
              Complexity: {(activePayload ? activePayload.parameters : latestRecord.codeBaseComplexity).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
