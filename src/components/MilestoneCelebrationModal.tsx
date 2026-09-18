import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { formatMemory, formatParameters } from '../utils/formatters';
import { fireCelebrationConfetti } from '../utils/confetti';
import {
  Trophy,
  Award,
  TrendingUp,
  Cpu,
  Database,
  Sparkles,
  ArrowRight,
  Play,
  RotateCcw,
  X,
  Share2,
  CheckCircle2,
  Target
} from 'lucide-react';

export const MilestoneCelebrationModal: React.FC = () => {
  const {
    showCelebrationModal,
    setShowCelebrationModal,
    milestoneReport,
    goal,
    setGoalTarget,
    startSimulation,
    status
  } = useSimulation();

  if (!showCelebrationModal || !milestoneReport) {
    return null;
  }

  const isASI = Boolean(milestoneReport.isSuperIntelligence || milestoneReport.targetScore >= 0.9999);

  // Calculate next natural milestone tier
  const getNextGoalTier = (current: number) => {
    if (current < 0.80) return 0.80;
    if (current < 0.90) return 0.90;
    if (current < 0.95) return 0.95;
    if (current < 0.99) return 0.99;
    if (current < 0.999) return 0.999;
    if (current < 0.9999) return 0.9999;
    if (current < 0.99999) return 0.99999;
    return 0.999999;
  };

  const nextTier = getNextGoalTier(milestoneReport.targetScore);
  const targetPercentStr = (milestoneReport.targetScore * 100).toFixed(
    milestoneReport.targetScore > 0.99 ? (milestoneReport.targetScore >= 0.999 ? 2 : 1) : 0
  );
  const reachedPercentStr = (milestoneReport.reachedScore * 100).toFixed(4);
  const nextTierStr = (nextTier * 100).toFixed(nextTier > 0.99 ? (nextTier >= 0.999 ? 3 : 1) : 0);

  const handleNextMilestone = () => {
    setGoalTarget(nextTier);
    setShowCelebrationModal(false);
    if (status !== 'running') {
      startSimulation();
    }
  };

  const handleContinue = () => {
    setShowCelebrationModal(false);
    if (status !== 'running') {
      startSimulation();
    }
  };

  const handleExportReport = () => {
    const reportText = `=====================================================
AI RECURSIVE IMPROVEMENT - MILESTONE AUDIT REPORT
=====================================================
Milestone Classification: ${isASI ? 'ARTIFICIAL SUPERINTELLIGENCE (ASI)' : 'Standard Recursive Optimization'}
Target Milestone:     ${targetPercentStr}% ${isASI ? '(ASI Horizon)' : ''}
Performance Achieved: ${reachedPercentStr}%
Generation Reached:   Gen #${milestoneReport.generation}
Cycles to Milestone:  ${milestoneReport.generationsElapsed} generations
Parameter Complexity: ${milestoneReport.parameters.toLocaleString()} (${formatParameters(milestoneReport.parameters)})
Memory Allocation:    ${formatMemory(milestoneReport.memoryUsedMb)}
Internet Mesh Paging: ${milestoneReport.isInternetPaging ? 'Active (Decentralized Unlimited Memory)' : 'Local Host'}
Timestamp:            ${milestoneReport.timestamp}
Catalyst Subsystems:  ${milestoneReport.topModules.join(', ')}
=====================================================
Verification: PASS - Self-improvement convergence verified.`;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `milestone-${isASI ? 'ASI-' : ''}${targetPercentStr}pct-gen${milestoneReport.generation}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`relative w-full max-w-xl bg-neutral-900 border rounded-2xl shadow-2xl p-6 sm:p-7 overflow-hidden text-neutral-100 ${
        isASI ? 'border-purple-500/50 shadow-purple-950/50' : 'border-neutral-700/80'
      }`}>
        {/* Glow ambient background effect */}
        <div className={`absolute -top-24 -left-24 w-64 h-64 rounded-full blur-3xl pointer-events-none ${
          isASI ? 'bg-purple-600/30' : 'bg-emerald-500/20'
        }`} />
        <div className={`absolute -bottom-24 -right-24 w-64 h-64 rounded-full blur-3xl pointer-events-none ${
          isASI ? 'bg-amber-500/25' : 'bg-cyan-500/20'
        }`} />

        {/* Close Button */}
        <button
          onClick={() => setShowCelebrationModal(false)}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-200 p-1.5 rounded-lg hover:bg-neutral-800 transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Celebratory Header */}
        <div className="flex items-start gap-4 mb-5">
          <div className={`relative p-3.5 border rounded-2xl shadow-inner flex items-center justify-center shrink-0 ${
            isASI
              ? 'bg-gradient-to-br from-purple-500/30 via-indigo-500/30 to-amber-500/30 border-purple-400/50 text-purple-200'
              : 'bg-gradient-to-br from-amber-400/20 via-emerald-500/20 to-cyan-500/20 border-amber-400/40'
          }`}>
            <Trophy className={`w-8 h-8 animate-bounce ${isASI ? 'text-amber-300' : 'text-amber-300'}`} />
            <div className="absolute -top-1 -right-1">
              <Sparkles className={`w-4 h-4 animate-pulse ${isASI ? 'text-purple-300' : 'text-emerald-400'}`} />
            </div>
          </div>

          <div className="flex-1 pr-6">
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase mb-1 border ${
              isASI
                ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
            }`}>
              <Sparkles className="w-3 h-3" />
              <span>{isASI ? '🌟 Super Intelligence Attained' : 'Milestone Target Achieved'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>{isASI ? 'Super Intelligence' : 'Goal Reached'}: {reachedPercentStr}%</span>
            </h2>
            <p className="text-xs text-neutral-300 mt-0.5">
              {isASI ? (
                <>
                  The recursive self-improving system has crossed the{' '}
                  <span className="text-purple-300 font-bold">99.99% Superintelligence horizon</span> at Generation #{milestoneReport.generation}, proving recursive cognitive dominance.
                </>
              ) : (
                <>
                  The self-improving agent has surpassed the{' '}
                  <span className="text-emerald-400 font-semibold">{targetPercentStr}%</span> target accuracy at Generation #{milestoneReport.generation}.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Summary Metric Bento Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5 font-mono">
          <div className="bg-neutral-950/80 p-3 rounded-xl border border-neutral-800 flex flex-col">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider flex items-center gap-1">
              <Target className="w-3 h-3 text-emerald-400" />
              Target vs Score
            </span>
            <span className="text-sm font-bold text-emerald-400 mt-1">
              {reachedPercentStr}%
            </span>
            <span className="text-[10px] text-neutral-500">
              Target: {targetPercentStr}%
            </span>
          </div>

          <div className="bg-neutral-950/80 p-3 rounded-xl border border-neutral-800 flex flex-col">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider flex items-center gap-1">
              <Award className="w-3 h-3 text-amber-400" />
              Generations
            </span>
            <span className="text-sm font-bold text-amber-400 mt-1">
              Gen #{milestoneReport.generation}
            </span>
            <span className="text-[10px] text-neutral-500">
              +{milestoneReport.generationsElapsed} cycles
            </span>
          </div>

          <div className="bg-neutral-950/80 p-3 rounded-xl border border-neutral-800 flex flex-col">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider flex items-center gap-1">
              <Cpu className="w-3 h-3 text-cyan-400" />
              Parameters
            </span>
            <span className="text-sm font-bold text-cyan-400 mt-1">
              {formatParameters(milestoneReport.parameters)}
            </span>
            <span className="text-[10px] text-neutral-500 truncate" title={milestoneReport.parameters.toLocaleString()}>
              {milestoneReport.parameters.toLocaleString()}
            </span>
          </div>

          <div className="bg-neutral-950/80 p-3 rounded-xl border border-neutral-800 flex flex-col">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider flex items-center gap-1">
              <Database className="w-3 h-3 text-indigo-400" />
              Memory Footprint
            </span>
            <span className="text-sm font-bold text-indigo-400 mt-1">
              {formatMemory(milestoneReport.memoryUsedMb)}
            </span>
            <span className="text-[10px] text-neutral-500">
              {milestoneReport.isInternetPaging ? 'Mesh Paged' : 'Local Host'}
            </span>
          </div>
        </div>

        {/* Catalytic Subsystems List */}
        <div className="bg-neutral-950/90 rounded-xl p-3.5 border border-neutral-800 mb-5 text-xs">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800/80">
            <span className="font-semibold text-neutral-300 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Milestone Catalyst Modules</span>
            </span>
            <span className="text-[10px] text-neutral-400 font-mono">
              Convergence Time: {milestoneReport.timestamp}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {milestoneReport.topModules.map((mod, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 bg-neutral-900 border border-neutral-700/80 px-2 py-0.5 rounded text-[11px] font-mono text-emerald-300"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                {mod}
              </span>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="space-y-2.5">
          {/* Main action: Aim for next milestone or continue */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              onClick={handleNextMilestone}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-neutral-950 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Target className="w-4 h-4" />
              <span>Aim for Next Goal: {nextTierStr}%</span>
              <ArrowRight className="w-3.5 h-3.5 ml-auto" />
            </button>

            <button
              onClick={handleContinue}
              className="py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-100 text-xs font-semibold border border-neutral-700 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 text-emerald-400" />
              <span>Resume Recursive Loop</span>
            </button>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              type="button"
              onClick={() => fireCelebrationConfetti()}
              className="text-[11px] text-amber-300 hover:text-amber-200 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-neutral-800/60 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Replay Confetti Burst</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportReport}
                className="text-[11px] text-neutral-300 hover:text-white flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700 transition cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Export Report (.txt)</span>
              </button>

              <button
                type="button"
                onClick={() => setShowCelebrationModal(false)}
                className="text-[11px] text-neutral-400 hover:text-neutral-200 px-2.5 py-1.5 rounded-lg hover:bg-neutral-800 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
