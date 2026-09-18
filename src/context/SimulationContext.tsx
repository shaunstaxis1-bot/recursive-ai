import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { GenerationRecord, LogEntry, SimulationConfig, SimulationStatus, SimulationGoal, MilestoneReport } from '../types';
import { formatMemory } from '../utils/formatters';
import { fireCelebrationConfetti } from '../utils/confetti';

interface SimulationContextType {
  status: SimulationStatus;
  generation: number;
  performanceScore: number;
  codeBaseComplexity: number;
  memoryUsedMb: number;
  maxMemoryMb: number;
  unlimitedInternetMemory: boolean;
  toggleInternetMemory: (enabled?: boolean) => void;
  internetNodesCount: number;
  internetBandwidthTbps: number;
  internetLatencyMs: number;
  config: SimulationConfig;
  history: GenerationRecord[];
  logs: LogEntry[];
  speed: number;
  activeTab: 'metrics' | 'terminal' | 'history' | 'architecture';
  setActiveTab: (tab: 'metrics' | 'terminal' | 'history' | 'architecture') => void;
  startSimulation: () => void;
  pauseSimulation: () => void;
  resetSimulation: () => void;
  stepSimulation: () => void;
  setSpeed: (speed: number) => void;
  updateConfig: (newConfig: Partial<SimulationConfig>) => void;
  clearLogs: () => void;
  currentInnovation: number | null;
  goal: SimulationGoal;
  setGoalTarget: (targetScore: number) => void;
  toggleGoalAutoPause: (autoPause?: boolean) => void;
  milestoneReport: MilestoneReport | null;
  showCelebrationModal: boolean;
  setShowCelebrationModal: (show: boolean) => void;
  triggerCelebration: () => void;
  resetGoal: () => void;
}

const DEFAULT_CONFIG: SimulationConfig = {
  initialGeneration: 1,
  initialPerformance: 0.10,
  initialComplexity: 1000,
  initialMemoryMb: 10.0,
  maxMemoryMb: 10240.0, // 10 GB (10,240 MB) baseline local threshold
  minInnovation: 1.05,
  maxInnovation: 1.30,
  delayMs: 400, // Matching time.sleep(0.4)
  unlimitedInternetMemory: true, // Enabled by default as requested
};

const DEFAULT_GOAL: SimulationGoal = {
  targetScore: 0.95, // 95% milestone target by default
  reached: false,
  autoPauseOnReach: true,
};

const CODE_MODULES = [
  'core_reasoning_kernel.py',
  'recursive_evaluator.py',
  'hyper_attention_matrix.py',
  'dynamic_branch_synthesizer.py',
  'gradient_quantization_mesh.py',
  'latent_state_cache.py',
  'self_introspect_optimizer.py',
  'meta_heuristic_scheduler.py',
  'sparse_tensor_compressor.py',
  'vector_token_allocator.py',
  'internet_memory_pager.py',
  'distributed_cloud_swap.py',
  'global_mesh_allocator.py',
];

const INTERNET_REGIONS = [
  'us-east (Virginia Fiber Mesh)',
  'eu-central (Frankfurt Cloud Spine)',
  'ap-southeast (Singapore Subsea Net)',
  'us-west (Oregon Edge Backbone)',
  'ap-northeast (Tokyo Ultra-Mesh)',
  'sa-east (São Paulo Distributed Hub)',
  'global-p2p (Decentralized Web Swarm)',
];

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SimulationConfig>(DEFAULT_CONFIG);
  const [status, setStatus] = useState<SimulationStatus>('idle');
  const [generation, setGeneration] = useState<number>(DEFAULT_CONFIG.initialGeneration);
  const [performanceScore, setPerformanceScore] = useState<number>(DEFAULT_CONFIG.initialPerformance);
  const [codeBaseComplexity, setCodeBaseComplexity] = useState<number>(DEFAULT_CONFIG.initialComplexity);
  const [memoryUsedMb, setMemoryUsedMb] = useState<number>(DEFAULT_CONFIG.initialMemoryMb);
  const [currentInnovation, setCurrentInnovation] = useState<number | null>(null);
  const [speed, setSpeed] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'metrics' | 'terminal' | 'history' | 'architecture'>('metrics');

  // Internet Memory Mesh Metrics
  const [internetNodesCount, setInternetNodesCount] = useState<number>(14850);
  const [internetBandwidthTbps, setInternetBandwidthTbps] = useState<number>(2.4);
  const [internetLatencyMs, setInternetLatencyMs] = useState<number>(12);

  // Simulation Goals & Milestones
  const [goal, setGoal] = useState<SimulationGoal>(DEFAULT_GOAL);
  const [milestoneReport, setMilestoneReport] = useState<MilestoneReport | null>(null);
  const [showCelebrationModal, setShowCelebrationModal] = useState<boolean>(false);
  const goalRef = useRef<SimulationGoal>(goal);

  useEffect(() => {
    goalRef.current = goal;
  }, [goal]);

  const [history, setHistory] = useState<GenerationRecord[]>([
    {
      generation: 1,
      performanceScore: 0.10,
      codeBaseComplexity: 1000,
      memoryUsedMb: 10.0,
      innovationFactor: 1.0,
      timestamp: new Date().toLocaleTimeString(),
      memoryDeltaMb: 0,
      complexityDelta: 0,
      accuracyDelta: 0,
      moduleModified: 'initial_state.py',
      isInternetPaging: false,
      internetNodesAllocated: 0,
    },
  ]);

  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 'init-1',
      timestamp: new Date().toLocaleTimeString(),
      generation: 1,
      type: 'info',
      message: '🤖 Initialising Self-Improving Agent Core...',
    },
    {
      id: 'init-2',
      timestamp: new Date().toLocaleTimeString(),
      generation: 1,
      type: 'network',
      message: '🌐 Unlimited Internet Memory Swarm connected (14,850 nodes active | 2.4 Tbps global mesh | OOM bypassed).',
    },
    {
      id: 'init-3',
      timestamp: new Date().toLocaleTimeString(),
      generation: 1,
      type: 'metric',
      message: 'System baseline: 1,000 parameters | 10.00% accuracy | 10.00 MB initial | Unlimited Cloud Memory Pool',
    },
  ]);

  const loopRef = useRef<NodeJS.Timeout | null>(null);

  const addLog = useCallback((entry: Omit<LogEntry, 'id'>) => {
    setLogs((prev) => [
      ...prev,
      {
        ...entry,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      },
    ]);
  }, []);

  const toggleInternetMemory = useCallback((enabled?: boolean) => {
    setConfig((prev) => {
      const nextVal = enabled !== undefined ? enabled : !prev.unlimitedInternetMemory;
      addLog({
        timestamp: new Date().toLocaleTimeString(),
        generation,
        type: 'network',
        message: nextVal
          ? '🌐 Unlimited Internet Memory Swarm ENABLED: Connecting to global distributed web memory pool. OOM ceiling disabled.'
          : '⚠️ Unlimited Internet Memory DISABLED: Reverting to local physical memory ceiling (10 GB). Exceeding capacity will trigger OOM halt.',
      });
      return { ...prev, unlimitedInternetMemory: nextVal };
    });
  }, [addLog, generation]);

  const executeCycle = useCallback(() => {
    setMemoryUsedMb((prevMem) => {
      const isUnlimited = config.unlimitedInternetMemory;

      // Check if memory has breached ceiling and internet memory is disabled
      if (!isUnlimited && prevMem >= config.maxMemoryMb) {
        setStatus('oom');
        addLog({
          timestamp: new Date().toLocaleTimeString(),
          generation,
          type: 'oom',
          message: '🚨 CRITICAL ERROR: OUT OF MEMORY (OOM) DETECTED.',
        });
        addLog({
          timestamp: new Date().toLocaleTimeString(),
          generation,
          type: 'warning',
          message: '⚡ Self-improvement halt initiated. Extracting final version...',
        });
        addLog({
          timestamp: new Date().toLocaleTimeString(),
          generation,
          type: 'final',
          message: '=== FINAL AI VERSION REACHED ===',
          detail: [
            `🏆 Total Generations: ${generation}`,
            `📈 Final Optimized Accuracy: ${(performanceScore * 100).toFixed(4)}%`,
            `🗄️ Peak Memory Load: ${formatMemory(prevMem)}`,
          ],
        });
        return prevMem;
      }

      // Innovation factor: random.uniform(1.05, 1.30)
      const innovationFactor =
        Math.random() * (config.maxInnovation - config.minInnovation) + config.minInnovation;
      setCurrentInnovation(innovationFactor);

      // Evaluate self: with unlimited internet memory, accuracy can scale asymptotically towards 99.9999%
      let nextPerf = 0;
      setPerformanceScore((prevPerf) => {
        const accuracyMultiplier = isUnlimited ? 0.999999 : 0.9999;
        nextPerf = Math.min(accuracyMultiplier, prevPerf * innovationFactor);
        return nextPerf;
      });

      let nextComplexity = 0;
      let complexityGrowth = 0;
      setCodeBaseComplexity((prevComp) => {
        nextComplexity = Math.floor(prevComp * innovationFactor);
        complexityGrowth = nextComplexity - prevComp;
        return nextComplexity;
      });

      // Memory increment: (self.code_base_complexity * 0.005) * innovation_factor
      const memIncrease = codeBaseComplexity * 0.005 * innovationFactor;
      const nextMemory = prevMem + memIncrease;

      const randomModule = CODE_MODULES[Math.floor(Math.random() * CODE_MODULES.length)];
      const randomRegion = INTERNET_REGIONS[Math.floor(Math.random() * INTERNET_REGIONS.length)];
      const nextGen = generation + 1;
      setGeneration(nextGen);

      // Internet memory paging calculations
      const isPagingInternet = isUnlimited && nextMemory > 512;
      const newNodes = isPagingInternet
        ? Math.floor(14000 + (nextMemory / 10) * 1.5 + Math.random() * 500)
        : 14850;
      const newBandwidth = isPagingInternet
        ? Number((2.4 + (nextMemory / 1024) * 0.3 + Math.random() * 0.2).toFixed(2))
        : 2.4;
      const newLatency = Math.floor(10 + Math.random() * 6);

      setInternetNodesCount(newNodes);
      setInternetBandwidthTbps(newBandwidth);
      setInternetLatencyMs(newLatency);

      // Add log matching Python rewrite_code
      const memoryString = isUnlimited
        ? `${formatMemory(nextMemory)} / ∞ Unlimited (Internet Mesh)`
        : `${formatMemory(nextMemory)} / ${formatMemory(config.maxMemoryMb)}`;

      addLog({
        timestamp: new Date().toLocaleTimeString(),
        generation,
        type: isPagingInternet ? 'network' : 'cycle',
        message: isPagingInternet
          ? `🌐 [Gen ${generation}] Rewrote ${randomModule} → Paged ${formatMemory(memIncrease)} across ${randomRegion}`
          : `🧬 [Gen ${generation}] Rewriting core logic (${randomModule})...`,
        detail: [
          `   - Complexity: ${nextComplexity.toLocaleString()} parameters (+${complexityGrowth.toLocaleString()})`,
          `   - Accuracy: ${(nextPerf * 100).toFixed(4)}% (+${((nextPerf - performanceScore) * 100).toFixed(4)}%)`,
          `   - Memory Load: ${memoryString} (+${formatMemory(memIncrease)})`,
          `   - Innovation Multiplier: ${(innovationFactor * 100 - 100).toFixed(1)}% gain`,
          ...(isPagingInternet
            ? [
                `   - Internet Node Swarm: ${newNodes.toLocaleString()} nodes attached | ${newBandwidth} Tbps | ${newLatency}ms latency`,
              ]
            : []),
        ],
      });

      // Add history record
      setHistory((prevHistory) => [
        ...prevHistory,
        {
          generation: nextGen,
          performanceScore: nextPerf,
          codeBaseComplexity: nextComplexity,
          memoryUsedMb: nextMemory,
          innovationFactor,
          timestamp: new Date().toLocaleTimeString(),
          memoryDeltaMb: memIncrease,
          complexityDelta: complexityGrowth,
          accuracyDelta: nextPerf - performanceScore,
          moduleModified: randomModule,
          isInternetPaging: isPagingInternet,
          internetNodesAllocated: newNodes,
          internetRegion: randomRegion,
        },
      ]);

      // Check Simulation Goal Milestone
      const currentGoal = goalRef.current;
      if (currentGoal && !currentGoal.reached && nextPerf >= currentGoal.targetScore) {
        const targetPercent = (currentGoal.targetScore * 100).toFixed(
          currentGoal.targetScore > 0.99 ? 3 : 1
        );
        const reachedPercent = (nextPerf * 100).toFixed(3);
        const report: MilestoneReport = {
          targetScore: currentGoal.targetScore,
          reachedScore: nextPerf,
          generation: nextGen,
          parameters: nextComplexity,
          memoryUsedMb: nextMemory,
          isInternetPaging: isPagingInternet,
          timestamp: new Date().toLocaleTimeString(),
          generationsElapsed: nextGen - 1,
          topModules: [
            randomModule,
            'core_reasoning_kernel.py',
            'hyper_attention_matrix.py',
            'self_introspect_optimizer.py',
          ],
        };

        setMilestoneReport(report);
        setGoal((prev) => ({
          ...prev,
          reached: true,
          reachedAtGeneration: nextGen,
          reachedAtTimestamp: new Date().toLocaleTimeString(),
          reachedScore: nextPerf,
        }));

        // Fire celebratory fireworks & confetti
        fireCelebrationConfetti();
        setShowCelebrationModal(true);

        addLog({
          timestamp: new Date().toLocaleTimeString(),
          generation: nextGen,
          type: 'final',
          message: `🎯 === SIMULATION GOAL ACHIEVED: ${reachedPercent}% ACCURACY ===`,
          detail: [
            `🏆 Target Milestone: ${targetPercent}% reached at Generation #${nextGen}`,
            `🧠 Expanded Model: ${nextComplexity.toLocaleString()} parameters (+${complexityGrowth.toLocaleString()})`,
            `💾 Memory Footprint: ${formatMemory(nextMemory)}`,
            ...(currentGoal.autoPauseOnReach ? ['⏸️ Simulation auto-paused for milestone audit.'] : []),
          ],
        });

        if (currentGoal.autoPauseOnReach) {
          setStatus('paused');
        }
      }

      // If internet memory is disabled and nextMemory breaches ceiling, trigger OOM
      if (!isUnlimited && nextMemory >= config.maxMemoryMb) {
        setStatus('oom');
        addLog({
          timestamp: new Date().toLocaleTimeString(),
          generation: nextGen,
          type: 'oom',
          message: '🚨 CRITICAL ERROR: OUT OF MEMORY (OOM) DETECTED.',
        });
        addLog({
          timestamp: new Date().toLocaleTimeString(),
          generation: nextGen,
          type: 'warning',
          message: '⚡ Self-improvement halt initiated. Extracting final version...',
        });
        addLog({
          timestamp: new Date().toLocaleTimeString(),
          generation: nextGen,
          type: 'final',
          message: '=== FINAL AI VERSION REACHED ===',
          detail: [
            `🏆 Total Generations: ${nextGen}`,
            `📈 Final Optimized Accuracy: ${(nextPerf * 100).toFixed(4)}%`,
            `🗄️ Peak Memory Load: ${formatMemory(nextMemory)} / ${formatMemory(config.maxMemoryMb)}`,
          ],
        });
      }

      return nextMemory;
    });
  }, [
    codeBaseComplexity,
    config.maxInnovation,
    config.maxMemoryMb,
    config.minInnovation,
    config.unlimitedInternetMemory,
    generation,
    performanceScore,
    addLog,
  ]);

  // Main loop when status is 'running'
  useEffect(() => {
    if (status === 'running') {
      const intervalDelay = Math.max(50, Math.floor(config.delayMs / speed));
      loopRef.current = setInterval(() => {
        executeCycle();
      }, intervalDelay);
    } else {
      if (loopRef.current) {
        clearInterval(loopRef.current);
        loopRef.current = null;
      }
    }

    return () => {
      if (loopRef.current) {
        clearInterval(loopRef.current);
        loopRef.current = null;
      }
    };
  }, [status, speed, config.delayMs, executeCycle]);

  // Start simulation handler
  const startSimulation = useCallback(() => {
    if (status === 'oom') {
      // If OOM has occurred, prompt user or reset
      resetSimulation();
      setTimeout(() => {
        setStatus('running');
      }, 50);
      return;
    }
    setStatus('running');
    addLog({
      timestamp: new Date().toLocaleTimeString(),
      generation,
      type: 'info',
      message: `▶️ Simulation loop started. Executing self-improvement cycles at ${speed}x speed...`,
    });
  }, [status, speed, generation, addLog]);

  // Pause simulation handler
  const pauseSimulation = useCallback(() => {
    setStatus('paused');
    addLog({
      timestamp: new Date().toLocaleTimeString(),
      generation,
      type: 'info',
      message: `⏸️ Simulation paused at Generation ${generation}.`,
    });
  }, [generation, addLog]);

  // Reset simulation handler
  const resetSimulation = useCallback(() => {
    if (loopRef.current) {
      clearInterval(loopRef.current);
      loopRef.current = null;
    }
    setStatus('idle');
    setGeneration(config.initialGeneration);
    setPerformanceScore(config.initialPerformance);
    setCodeBaseComplexity(config.initialComplexity);
    setMemoryUsedMb(config.initialMemoryMb);
    setCurrentInnovation(null);

    const initialHistory: GenerationRecord = {
      generation: 1,
      performanceScore: config.initialPerformance,
      codeBaseComplexity: config.initialComplexity,
      memoryUsedMb: config.initialMemoryMb,
      innovationFactor: 1.0,
      timestamp: new Date().toLocaleTimeString(),
      memoryDeltaMb: 0,
      complexityDelta: 0,
      accuracyDelta: 0,
      moduleModified: 'initial_state.py',
    };
    setHistory([initialHistory]);

    setLogs([
      {
        id: `reset-${Date.now()}-1`,
        timestamp: new Date().toLocaleTimeString(),
        generation: 1,
        type: 'info',
        message: '🔄 State reset. Re-initialising Self-Improving Agent Core...',
      },
      {
        id: `reset-${Date.now()}-2`,
        timestamp: new Date().toLocaleTimeString(),
        generation: 1,
        type: 'metric',
        message: `System baseline: ${config.initialComplexity.toLocaleString()} parameters | ${(
          config.initialPerformance * 100
        ).toFixed(2)}% accuracy | ${config.initialMemoryMb.toFixed(2)} MB memory ceiling ${config.maxMemoryMb.toFixed(2)} MB`,
      },
    ]);

    // Reset goal reached status on full reset
    setGoal((prev) => ({
      ...prev,
      reached: false,
      reachedAtGeneration: undefined,
      reachedAtTimestamp: undefined,
      reachedScore: undefined,
    }));
    setMilestoneReport(null);
    setShowCelebrationModal(false);
  }, [config]);

  // Step 1 generation
  const stepSimulation = useCallback(() => {
    if (status === 'oom') return;
    if (status === 'running') {
      setStatus('paused');
    }
    executeCycle();
  }, [status, executeCycle]);

  const updateConfig = useCallback((newConfig: Partial<SimulationConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  }, []);

  const handleSetSpeed = useCallback((newSpeed: number) => {
    setSpeed(newSpeed);
    const speedLabel = newSpeed <= 0.5 ? 'Slow (0.5x)' : newSpeed === 1 ? 'Normal (1.0x)' : newSpeed === 2 ? 'Fast (2.0x)' : `${newSpeed}x Turbo`;
    const intervalDelay = Math.max(50, Math.floor(config.delayMs / newSpeed));
    addLog({
      timestamp: new Date().toLocaleTimeString(),
      generation,
      type: 'info',
      message: `⚡ Simulation interval updated to ${speedLabel} (~${intervalDelay}ms per cycle).`,
    });
  }, [config.delayMs, generation, addLog]);

  const setGoalTarget = useCallback((targetScore: number) => {
    const isAlreadyReached = performanceScore >= targetScore;
    setGoal((prev) => ({
      ...prev,
      targetScore,
      reached: isAlreadyReached,
      reachedAtGeneration: isAlreadyReached ? generation : undefined,
      reachedAtTimestamp: isAlreadyReached ? new Date().toLocaleTimeString() : undefined,
      reachedScore: isAlreadyReached ? performanceScore : undefined,
    }));
    const targetPercent = (targetScore * 100).toFixed(targetScore > 0.99 ? 3 : 1);
    addLog({
      timestamp: new Date().toLocaleTimeString(),
      generation,
      type: 'info',
      message: `🎯 Simulation Goal set to ${targetPercent}% target performance.`,
    });
  }, [performanceScore, generation, addLog]);

  const toggleGoalAutoPause = useCallback((autoPause?: boolean) => {
    setGoal((prev) => ({
      ...prev,
      autoPauseOnReach: autoPause !== undefined ? autoPause : !prev.autoPauseOnReach,
    }));
  }, []);

  const triggerCelebration = useCallback(() => {
    fireCelebrationConfetti();
    setShowCelebrationModal(true);
  }, []);

  const resetGoal = useCallback(() => {
    setGoal(DEFAULT_GOAL);
    setMilestoneReport(null);
    setShowCelebrationModal(false);
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  return (
    <SimulationContext.Provider
      value={{
        status,
        generation,
        performanceScore,
        codeBaseComplexity,
        memoryUsedMb,
        maxMemoryMb: config.maxMemoryMb,
        unlimitedInternetMemory: config.unlimitedInternetMemory,
        toggleInternetMemory,
        internetNodesCount,
        internetBandwidthTbps,
        internetLatencyMs,
        config,
        history,
        logs,
        speed,
        activeTab,
        setActiveTab,
        startSimulation,
        pauseSimulation,
        resetSimulation,
        stepSimulation,
        setSpeed: handleSetSpeed,
        updateConfig,
        clearLogs,
        currentInnovation,
        goal,
        setGoalTarget,
        toggleGoalAutoPause,
        milestoneReport,
        showCelebrationModal,
        setShowCelebrationModal,
        triggerCelebration,
        resetGoal,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = (): SimulationContextType => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};
