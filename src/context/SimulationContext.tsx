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
  const [speed, setSpeed] = useState<number>(10000);
  const [activeTab, setActiveTab] = useState<'metrics' | 'terminal' | 'history' | 'architecture'>('metrics');

  // Fast mutable ref for current simulation state to support 10,000x batched cycles without UI lag
  const simStateRef = useRef({
    generation: DEFAULT_CONFIG.initialGeneration,
    performanceScore: DEFAULT_CONFIG.initialPerformance,
    codeBaseComplexity: DEFAULT_CONFIG.initialComplexity,
    memoryUsedMb: DEFAULT_CONFIG.initialMemoryMb,
    status: 'idle' as SimulationStatus,
  });

  // Keep stateRef synchronized with state changes
  useEffect(() => {
    simStateRef.current.generation = generation;
    simStateRef.current.performanceScore = performanceScore;
    simStateRef.current.codeBaseComplexity = codeBaseComplexity;
    simStateRef.current.memoryUsedMb = memoryUsedMb;
    simStateRef.current.status = status;
  }, [generation, performanceScore, codeBaseComplexity, memoryUsedMb, status]);

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
    setLogs((prev) => {
      const nextLogs = [
        ...prev,
        {
          ...entry,
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        },
      ];
      // Keep up to 500 most recent logs for performance at high speeds like 100x
      if (nextLogs.length > 500) {
        return nextLogs.slice(nextLogs.length - 500);
      }
      return nextLogs;
    });
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

  const executeCycles = useCallback(
    (count: number = 1) => {
      const isUnlimited = config.unlimitedInternetMemory;
      const accuracyMultiplier = isUnlimited ? 0.999999 : 0.9999;

      let curGen = simStateRef.current.generation;
      let curPerf = simStateRef.current.performanceScore;
      let curComp = simStateRef.current.codeBaseComplexity;
      let curMem = simStateRef.current.memoryUsedMb;
      let lastInnovation = 1.0;
      let cyclesExecuted = 0;

      let newNodes = internetNodesCount;
      let newBandwidth = internetBandwidthTbps;
      let newLatency = internetLatencyMs;

      const newHistoryEntries: GenerationRecord[] = [];
      let haltReason: 'oom' | 'goal' | null = null;
      let singleCycleModule = '';
      let singleCycleRegion = '';
      let singleCycleMemIncrease = 0;
      let singleCycleCompGrowth = 0;
      let singleCyclePaging = false;

      // History sample rate: for large batches (> 10), sample ~2 points per tick so charts remain smooth
      const sampleInterval = count > 10 ? Math.max(1, Math.floor(count / 2)) : 1;

      for (let i = 0; i < count; i++) {
        // Pre-cycle OOM check
        if (!isUnlimited && curMem >= config.maxMemoryMb) {
          haltReason = 'oom';
          break;
        }

        const innovationFactor =
          Math.random() * (config.maxInnovation - config.minInnovation) + config.minInnovation;
        lastInnovation = innovationFactor;

        const prevPerf = curPerf;
        curPerf = Math.min(accuracyMultiplier, curPerf * innovationFactor);

        const prevComp = curComp;
        curComp = Math.floor(curComp * innovationFactor);
        const compGrowth = curComp - prevComp;

        const memIncrease = curComp * 0.005 * innovationFactor;
        curMem = curMem + memIncrease;

        curGen += 1;
        cyclesExecuted += 1;

        const isPagingInternet = isUnlimited && curMem > 512;
        newNodes = isPagingInternet
          ? Math.floor(14000 + (curMem / 10) * 1.5 + Math.random() * 500)
          : 14850;
        newBandwidth = isPagingInternet
          ? Number((2.4 + (curMem / 1024) * 0.3 + Math.random() * 0.2).toFixed(2))
          : 2.4;
        newLatency = Math.floor(10 + Math.random() * 6);

        const randomModule = CODE_MODULES[Math.floor(Math.random() * CODE_MODULES.length)];
        const randomRegion = INTERNET_REGIONS[Math.floor(Math.random() * INTERNET_REGIONS.length)];

        if (count === 1) {
          singleCycleModule = randomModule;
          singleCycleRegion = randomRegion;
          singleCycleMemIncrease = memIncrease;
          singleCycleCompGrowth = compGrowth;
          singleCyclePaging = isPagingInternet;
        }

        if (count === 1 || i === count - 1 || (i > 0 && i % sampleInterval === 0)) {
          newHistoryEntries.push({
            generation: curGen,
            performanceScore: curPerf,
            codeBaseComplexity: curComp,
            memoryUsedMb: curMem,
            innovationFactor,
            timestamp: new Date().toLocaleTimeString(),
            memoryDeltaMb: memIncrease,
            complexityDelta: compGrowth,
            accuracyDelta: curPerf - prevPerf,
            moduleModified: randomModule,
            isInternetPaging: isPagingInternet,
            internetNodesAllocated: newNodes,
            internetRegion: randomRegion,
          });
        }

        // Check Simulation Goal Milestone
        const currentGoal = goalRef.current;
        if (currentGoal && !currentGoal.reached && curPerf >= currentGoal.targetScore) {
          const isASI = currentGoal.targetScore >= 0.9999 || Boolean(currentGoal.isSuperIntelligence);
          const targetPercent = (currentGoal.targetScore * 100).toFixed(
            currentGoal.targetScore > 0.99 ? (currentGoal.targetScore >= 0.999 ? 2 : 1) : 0
          );
          const reachedPercent = (curPerf * 100).toFixed(4);
          const report: MilestoneReport = {
            targetScore: currentGoal.targetScore,
            reachedScore: curPerf,
            generation: curGen,
            parameters: curComp,
            memoryUsedMb: curMem,
            isInternetPaging,
            timestamp: new Date().toLocaleTimeString(),
            generationsElapsed: curGen - 1,
            isSuperIntelligence: isASI,
            topModules: [
              randomModule,
              'core_reasoning_kernel.py',
              'hyper_attention_matrix.py',
              'self_introspect_optimizer.py',
              ...(isASI ? ['quantum_recursive_compiler.py', 'omni_cognitive_synthesis.py'] : []),
            ],
          };

          setMilestoneReport(report);
          setGoal((prev) => ({
            ...prev,
            reached: true,
            isSuperIntelligence: isASI,
            reachedAtGeneration: curGen,
            reachedAtTimestamp: new Date().toLocaleTimeString(),
            reachedScore: curPerf,
          }));

          fireCelebrationConfetti();
          setShowCelebrationModal(true);

          addLog({
            timestamp: new Date().toLocaleTimeString(),
            generation: curGen,
            type: 'final',
            message: isASI
              ? `🌌 === ARTIFICIAL SUPERINTELLIGENCE (ASI) REACHED: ${reachedPercent}% ACCURACY ===`
              : `🎯 === SIMULATION GOAL ACHIEVED: ${reachedPercent}% ACCURACY ===`,
            detail: [
              isASI
                ? `🌟 Super Intelligence Milestone: ${targetPercent}% reached at Generation #${curGen}`
                : `🏆 Target Milestone: ${targetPercent}% reached at Generation #${curGen}`,
              `🧠 Expanded Model: ${curComp.toLocaleString()} parameters`,
              `💾 Memory Footprint: ${formatMemory(curMem)}`,
              ...(isASI ? ['🌌 Cognition Horizon: Autonomous recursive mastery established.'] : []),
              ...(currentGoal.autoPauseOnReach ? ['⏸️ Simulation auto-paused for milestone audit.'] : []),
            ],
          });

          if (currentGoal.autoPauseOnReach) {
            haltReason = 'goal';
            break;
          }
        }

        // Post-cycle memory ceiling check
        if (!isUnlimited && curMem >= config.maxMemoryMb) {
          haltReason = 'oom';
          break;
        }
      }

      // Synchronize mutable ref
      simStateRef.current.generation = curGen;
      simStateRef.current.performanceScore = curPerf;
      simStateRef.current.codeBaseComplexity = curComp;
      simStateRef.current.memoryUsedMb = curMem;

      // Synchronize React state
      setGeneration(curGen);
      setPerformanceScore(curPerf);
      setCodeBaseComplexity(curComp);
      setMemoryUsedMb(curMem);
      setCurrentInnovation(lastInnovation);
      setInternetNodesCount(newNodes);
      setInternetBandwidthTbps(newBandwidth);
      setInternetLatencyMs(newLatency);

      if (newHistoryEntries.length > 0) {
        setHistory((prevHistory) => {
          const updated = [...prevHistory, ...newHistoryEntries];
          return updated.length > 1000 ? updated.slice(updated.length - 1000) : updated;
        });
      }

      const memoryString = isUnlimited
        ? `${formatMemory(curMem)} / ∞ Unlimited (Internet Mesh)`
        : `${formatMemory(curMem)} / ${formatMemory(config.maxMemoryMb)}`;

      if (count === 1 && cyclesExecuted > 0) {
        addLog({
          timestamp: new Date().toLocaleTimeString(),
          generation: curGen,
          type: singleCyclePaging ? 'network' : 'cycle',
          message: singleCyclePaging
            ? `🌐 [Gen ${curGen}] Rewrote ${singleCycleModule} → Paged ${formatMemory(singleCycleMemIncrease)} across ${singleCycleRegion}`
            : `🧬 [Gen ${curGen}] Rewriting core logic (${singleCycleModule})...`,
          detail: [
            `   - Complexity: ${curComp.toLocaleString()} parameters (+${singleCycleCompGrowth.toLocaleString()})`,
            `   - Accuracy: ${(curPerf * 100).toFixed(4)}%`,
            `   - Memory Load: ${memoryString} (+${formatMemory(singleCycleMemIncrease)})`,
            `   - Innovation Multiplier: ${(lastInnovation * 100 - 100).toFixed(1)}% gain`,
            ...(singleCyclePaging
              ? [
                  `   - Internet Node Swarm: ${newNodes.toLocaleString()} nodes attached | ${newBandwidth} Tbps | ${newLatency}ms latency`,
                ]
              : []),
          ],
        });
      } else if (count > 1 && cyclesExecuted > 0) {
        addLog({
          timestamp: new Date().toLocaleTimeString(),
          generation: curGen,
          type: 'cycle',
          message: `⚡ [Gen ${curGen}] 10,000x Warp Speed: Processed +${cyclesExecuted} cycles | ${(curPerf * 100).toFixed(4)}% acc | ${curComp.toLocaleString()} params`,
          detail: [
            `   - High-Velocity Warp: +${cyclesExecuted} cycles executed in 20ms (~${(cyclesExecuted * 50).toLocaleString()} gen/s)`,
            `   - Complexity: ${curComp.toLocaleString()} parameters`,
            `   - Accuracy: ${(curPerf * 100).toFixed(4)}%`,
            `   - Memory Load: ${memoryString}`,
          ],
        });
      }

      if (haltReason === 'oom') {
        setStatus('oom');
        simStateRef.current.status = 'oom';
        addLog({
          timestamp: new Date().toLocaleTimeString(),
          generation: curGen,
          type: 'oom',
          message: '🚨 CRITICAL ERROR: OUT OF MEMORY (OOM) DETECTED.',
        });
        addLog({
          timestamp: new Date().toLocaleTimeString(),
          generation: curGen,
          type: 'warning',
          message: '⚡ Self-improvement halt initiated. Extracting final version...',
        });
        addLog({
          timestamp: new Date().toLocaleTimeString(),
          generation: curGen,
          type: 'final',
          message: '=== FINAL AI VERSION REACHED ===',
          detail: [
            `🏆 Total Generations: ${curGen}`,
            `📈 Final Optimized Accuracy: ${(curPerf * 100).toFixed(4)}%`,
            `🗄️ Peak Memory Load: ${formatMemory(curMem)} / ${formatMemory(config.maxMemoryMb)}`,
          ],
        });
      } else if (haltReason === 'goal') {
        setStatus('paused');
        simStateRef.current.status = 'paused';
      }
    },
    [
      config.maxInnovation,
      config.maxMemoryMb,
      config.minInnovation,
      config.unlimitedInternetMemory,
      internetBandwidthTbps,
      internetLatencyMs,
      internetNodesCount,
      addLog,
    ]
  );

  // Single-cycle legacy wrapper for stepping or direct calls
  const executeCycle = useCallback(() => {
    executeCycles(1);
  }, [executeCycles]);

  // Main simulation loop with adaptive batching for speeds up to 10,000x
  useEffect(() => {
    if (status === 'running') {
      let intervalDelay: number;
      let cyclesPerTick: number;

      if (speed <= 100) {
        intervalDelay = Math.max(10, Math.floor(config.delayMs / speed));
        cyclesPerTick = 1;
      } else {
        // High-velocity warp mode (e.g. 10,000x): 50 ticks per second (20ms interval)
        // e.g. at 10000x: cyclesPerTick = 200 (200 cycles * 50 ticks = 10,000 cycles/sec!)
        intervalDelay = 20;
        cyclesPerTick = Math.max(1, Math.round((speed * (config.delayMs / 1000)) / 50));
      }

      loopRef.current = setInterval(() => {
        executeCycles(cyclesPerTick);
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
  }, [status, speed, config.delayMs, executeCycles]);

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

    simStateRef.current = {
      generation: config.initialGeneration,
      performanceScore: config.initialPerformance,
      codeBaseComplexity: config.initialComplexity,
      memoryUsedMb: config.initialMemoryMb,
      status: 'idle',
    };

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
    const speedLabel = newSpeed >= 10000
      ? '10,000x Warp Speed'
      : newSpeed >= 100
      ? 'Hyperspeed (100x)'
      : newSpeed <= 0.5
      ? 'Slow (0.5x)'
      : newSpeed === 1
      ? 'Normal (1.0x)'
      : newSpeed === 2
      ? 'Fast (2.0x)'
      : `${newSpeed}x Turbo`;
    const intervalDescription = newSpeed >= 10000
      ? '~20ms interval (200 generations/tick, ~10,000 gen/s)'
      : `~${Math.max(10, Math.floor(config.delayMs / newSpeed))}ms per cycle`;
    addLog({
      timestamp: new Date().toLocaleTimeString(),
      generation: simStateRef.current.generation,
      type: 'info',
      message: `⚡ Simulation speed updated to ${speedLabel} (${intervalDescription}).`,
    });
  }, [config.delayMs, addLog]);

  const setGoalTarget = useCallback((targetScore: number) => {
    const isASI = targetScore >= 0.9999;
    const isAlreadyReached = performanceScore >= targetScore;
    setGoal((prev) => ({
      ...prev,
      targetScore,
      isSuperIntelligence: isASI,
      reached: isAlreadyReached,
      reachedAtGeneration: isAlreadyReached ? generation : undefined,
      reachedAtTimestamp: isAlreadyReached ? new Date().toLocaleTimeString() : undefined,
      reachedScore: isAlreadyReached ? performanceScore : undefined,
    }));
    const targetPercent = (targetScore * 100).toFixed(targetScore > 0.99 ? (targetScore >= 0.999 ? 2 : 1) : 0);
    addLog({
      timestamp: new Date().toLocaleTimeString(),
      generation,
      type: isASI ? 'final' : 'info',
      message: isASI
        ? `🌌 Super Intelligence (ASI) Target Goal configured: ${targetPercent}% accuracy horizon.`
        : `🎯 Simulation Goal set to ${targetPercent}% target performance.`,
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
