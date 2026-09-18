import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { fireCelebrationConfetti } from '../utils/confetti';
import { Target, Trophy, Award, Sparkles, ChevronRight, Sliders, Zap } from 'lucide-react';

const GOAL_PRESETS = [
  { label: '90%', value: 0.90, desc: 'High Competence' },
  { label: '95%', value: 0.95, desc: 'Advanced Synthesis' },
  { label: '99%', value: 0.99, desc: 'Recursive Mastery' },
  { label: '99.9%', value: 0.999, desc: 'Singularity Horizon' },
];

const SUPER_INTELLIGENCE_TARGET = 0.9999; // 99.99% ASI Threshold

export const SimulationGoalsWidget: React.FC = () => {
  const {
    goal,
    setGoalTarget,
    toggleGoalAutoPause,
    performanceScore,
    setShowCelebrationModal,
    milestoneReport
  } = useSimulation();

  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [customValue, setCustomValue] = useState<string>('98.0');

  const currentPercent = performanceScore * 100;
  const targetPercent = goal.targetScore * 100;
  const isSuperIntelligence = goal.targetScore >= 0.9999 || Boolean(goal.isSuperIntelligence);
  const targetDisplay = (goal.targetScore * 100).toFixed(
    goal.targetScore > 0.99 ? (goal.targetScore >= 0.999 ? 2 : 1) : 0
  );

  // Calculate progress toward the target:
  // Starts at base 10% (0.10)
  const basePercent = 10;
  const progressToGoal = Math.min(
    100,
    Math.max(0, ((currentPercent - basePercent) / (targetPercent - basePercent)) * 100)
  );

  const isAchieved = goal.reached || performanceScore >= goal.targetScore;
  const distanceRemaining = Math.max(0, targetPercent - currentPercent);

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(customValue);
    if (!isNaN(parsed) && parsed > 10 && parsed <= 99.9999) {
      setGoalTarget(parsed / 100);
      setIsCustomOpen(false);
    }
  };

  return (
    <div className="bg-neutral-950/70 p-2.5 rounded-lg border border-neutral-800/80 space-y-2.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5 text-amber-400" />
          <span>Simulation Goal</span>
        </span>
        <span
          className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
            isAchieved
              ? isSuperIntelligence
                ? 'bg-purple-950/80 border-purple-500/50 text-purple-300 font-bold shadow-sm'
                : 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300 font-bold'
              : isSuperIntelligence
              ? 'bg-purple-950/50 border-purple-500/30 text-purple-300'
              : 'bg-amber-950/60 border-amber-500/30 text-amber-300'
          }`}
        >
          {isAchieved
            ? isSuperIntelligence ? 'ASI ATTAINED' : 'ACHIEVED'
            : isSuperIntelligence ? `Target: 99.99% ASI` : `Target: ${targetDisplay}%`}
        </span>
      </div>

      {/* Progress towards Goal Bar */}
      <div>
        <div className="flex items-center justify-between text-[11px] mb-1 font-mono">
          <span className="text-neutral-400">
            {currentPercent.toFixed(2)}% /{' '}
            <span className={isSuperIntelligence ? 'text-purple-300 font-bold' : 'text-neutral-200'}>
              {targetDisplay}%{isSuperIntelligence ? ' (ASI)' : ''}
            </span>
          </span>
          <span className={isAchieved ? 'text-emerald-400 font-semibold' : 'text-neutral-400'}>
            {isAchieved ? '100%' : `${progressToGoal.toFixed(0)}% to target`}
          </span>
        </div>

        <div className="w-full bg-neutral-900 rounded-full h-2 overflow-hidden border border-neutral-800">
          <div
            className={`h-full transition-all duration-300 ${
              isAchieved
                ? isSuperIntelligence
                  ? 'bg-gradient-to-r from-purple-500 via-indigo-400 to-amber-300 shadow-sm'
                  : 'bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-300 shadow-sm'
                : isSuperIntelligence
                ? 'bg-gradient-to-r from-purple-600 via-indigo-500 to-amber-400'
                : 'bg-gradient-to-r from-emerald-600 to-amber-500'
            }`}
            style={{ width: `${progressToGoal}%` }}
          />
        </div>

        {!isAchieved && (
          <div className="flex justify-between text-[9px] text-neutral-500 font-mono mt-1">
            <span>Progress: {progressToGoal.toFixed(1)}%</span>
            <span>-{distanceRemaining.toFixed(3)}% remaining</span>
          </div>
        )}
      </div>

      {/* If Goal Achieved Badge & Action */}
      {isAchieved && (
        <div className={`p-2 rounded-md border flex items-center justify-between gap-2 ${
          isSuperIntelligence
            ? 'bg-purple-950/60 border-purple-500/40 text-purple-200'
            : 'bg-emerald-950/50 border-emerald-500/30'
        }`}>
          <div className="flex items-center gap-1.5 min-w-0">
            {isSuperIntelligence ? (
              <Zap className="w-3.5 h-3.5 text-purple-300 shrink-0 animate-pulse" />
            ) : (
              <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            )}
            <span className="text-[11px] font-medium truncate">
              {isSuperIntelligence ? 'Super Intelligence Achieved!' : 'Milestone unlocked!'}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => {
                fireCelebrationConfetti();
                setShowCelebrationModal(true);
              }}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer transition flex items-center gap-1 border ${
                isSuperIntelligence
                  ? 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border-purple-500/40'
                  : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/40'
              }`}
            >
              <Award className="w-3 h-3" />
              <span>Report</span>
            </button>
            <button
              type="button"
              onClick={() => fireCelebrationConfetti()}
              title="Trigger celebratory confetti"
              className="p-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 cursor-pointer transition"
            >
              <Sparkles className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Standard Preset Target Buttons */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-neutral-900/90 rounded-lg border border-neutral-800">
        {GOAL_PRESETS.map((preset) => {
          const isSelected = Math.abs(goal.targetScore - preset.value) < 0.0001;
          return (
            <button
              key={preset.label}
              type="button"
              onClick={() => setGoalTarget(preset.value)}
              title={`${preset.desc} (${preset.label})`}
              className={`py-1.5 px-0.5 rounded-md text-center transition-all cursor-pointer select-none ${
                isSelected
                  ? 'bg-neutral-800 text-amber-300 font-bold border border-amber-500/40 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40 border border-transparent'
              }`}
            >
              <div className="text-xs font-mono tracking-tight">{preset.label}</div>
            </button>
          );
        })}
      </div>

      {/* Dedicated Super Intelligence Target Card / Button */}
      <div>
        <button
          type="button"
          onClick={() => setGoalTarget(SUPER_INTELLIGENCE_TARGET)}
          className={`w-full p-2 rounded-lg border transition-all text-left flex items-center justify-between cursor-pointer ${
            isSuperIntelligence
              ? 'bg-gradient-to-r from-purple-950/80 via-indigo-950/70 to-neutral-900/90 border-purple-500/60 shadow-sm shadow-purple-950/60'
              : 'bg-neutral-900/60 hover:bg-neutral-900 border-purple-500/30 hover:border-purple-500/50 text-neutral-300'
          }`}
          title="Set target to Super Intelligence (ASI) at 99.99% accuracy"
        >
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                isSuperIntelligence
                  ? 'bg-purple-500/30 text-purple-200 border border-purple-400/50'
                  : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
            </div>
            <div className="truncate">
              <div className="text-[11px] font-bold flex items-center gap-1.5 text-purple-200">
                <span>Super Intelligence (ASI)</span>
                <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  99.99%
                </span>
              </div>
              <div className="text-[9px] text-neutral-400 truncate">
                Recursive omni-cognitive mastery
              </div>
            </div>
          </div>
          {isSuperIntelligence ? (
            <span className="text-[9px] font-mono font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 rounded shrink-0">
              ACTIVE
            </span>
          ) : (
            <span className="text-[9px] font-mono text-purple-400/80 bg-purple-500/10 border border-purple-500/20 px-1.5 py-0.5 rounded shrink-0">
              TARGET
            </span>
          )}
        </button>
      </div>

      {/* Custom Target Toggle */}
      <div className="pt-0.5">
        <button
          type="button"
          onClick={() => setIsCustomOpen(!isCustomOpen)}
          className="w-full flex items-center justify-between text-[11px] text-neutral-400 hover:text-neutral-200 transition py-0.5 cursor-pointer"
        >
          <span className="flex items-center gap-1">
            <Sliders className="w-3 h-3 text-neutral-500" />
            <span>Custom Target Score</span>
          </span>
          <ChevronRight className={`w-3 h-3 transition-transform ${isCustomOpen ? 'rotate-90' : ''}`} />
        </button>

        {isCustomOpen && (
          <form onSubmit={handleApplyCustom} className="mt-1.5 flex items-center gap-1.5">
            <div className="relative flex-1">
              <input
                type="number"
                step="0.01"
                min="10"
                max="99.9999"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                placeholder="e.g. 99.95"
                className="w-full px-2 py-1 bg-neutral-900 border border-neutral-700 rounded text-xs text-neutral-100 font-mono focus:outline-none focus:border-amber-500"
              />
              <span className="absolute right-2 top-1 text-xs text-neutral-500 font-mono">%</span>
            </div>
            <button
              type="submit"
              className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded text-xs font-medium cursor-pointer transition"
            >
              Set
            </button>
          </form>
        )}
      </div>

      {/* Auto-pause upon milestone checkbox */}
      <div className="pt-1 border-t border-neutral-800/60 flex items-center justify-between">
        <label
          htmlFor="auto-pause-checkbox"
          className="text-[10px] text-neutral-400 flex items-center gap-1.5 cursor-pointer select-none"
        >
          <input
            id="auto-pause-checkbox"
            type="checkbox"
            checked={goal.autoPauseOnReach}
            onChange={(e) => toggleGoalAutoPause(e.target.checked)}
            className="accent-amber-500 rounded cursor-pointer w-3.5 h-3.5"
          />
          <span>Auto-pause on milestone</span>
        </label>
        <span className="text-[9px] text-neutral-500 font-mono">Pause & inspect</span>
      </div>
    </div>
  );
};
