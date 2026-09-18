import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { fireCelebrationConfetti } from '../utils/confetti';
import { Target, Trophy, Award, Sparkles, CheckCircle2, ChevronRight, Settings2, Sliders } from 'lucide-react';

const GOAL_PRESETS = [
  { label: '90%', value: 0.90, desc: 'High Competence' },
  { label: '95%', value: 0.95, desc: 'Advanced Synthesis' },
  { label: '99%', value: 0.99, desc: 'Recursive Mastery' },
  { label: '99.9%', value: 0.999, desc: 'Singularity Horizon' },
];

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
  const targetDisplay = (goal.targetScore * 100).toFixed(goal.targetScore > 0.99 ? 3 : 1);

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
    if (!isNaN(parsed) && parsed > 10 && parsed <= 99.999) {
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
              ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300 font-bold'
              : 'bg-amber-950/60 border-amber-500/30 text-amber-300'
          }`}
        >
          {isAchieved ? 'ACHIEVED' : `Target: ${targetDisplay}%`}
        </span>
      </div>

      {/* Progress towards Goal Bar */}
      <div>
        <div className="flex items-center justify-between text-[11px] mb-1 font-mono">
          <span className="text-neutral-400">
            {currentPercent.toFixed(2)}% / <span className="text-neutral-200">{targetDisplay}%</span>
          </span>
          <span className={isAchieved ? 'text-emerald-400 font-semibold' : 'text-neutral-400'}>
            {isAchieved ? '100%' : `${progressToGoal.toFixed(0)}% to target`}
          </span>
        </div>

        <div className="w-full bg-neutral-900 rounded-full h-2 overflow-hidden border border-neutral-800">
          <div
            className={`h-full transition-all duration-300 ${
              isAchieved
                ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-300 shadow-sm'
                : 'bg-gradient-to-r from-emerald-600 to-amber-500'
            }`}
            style={{ width: `${progressToGoal}%` }}
          />
        </div>

        {!isAchieved && (
          <div className="flex justify-between text-[9px] text-neutral-500 font-mono mt-1">
            <span>Progress: {progressToGoal.toFixed(1)}%</span>
            <span>-{distanceRemaining.toFixed(2)}% remaining</span>
          </div>
        )}
      </div>

      {/* If Goal Achieved Badge & Action */}
      {isAchieved && (
        <div className="p-2 rounded-md bg-emerald-950/50 border border-emerald-500/30 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-[11px] text-emerald-300 font-medium truncate">
              Milestone unlocked!
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => {
                fireCelebrationConfetti();
                setShowCelebrationModal(true);
              }}
              className="px-2 py-0.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[10px] font-semibold cursor-pointer transition flex items-center gap-1"
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

      {/* Preset Target Buttons */}
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
                step="0.1"
                min="10"
                max="99.999"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                placeholder="e.g. 98.5"
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
