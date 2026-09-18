export type SimulationStatus = 'idle' | 'running' | 'paused' | 'oom';

export interface GenerationRecord {
  generation: number;
  performanceScore: number; // 0.0 - 0.9999
  codeBaseComplexity: number; // parameters / lines of code
  memoryUsedMb: number; // MB (can grow to GB/TB/PB via internet memory)
  innovationFactor: number; // e.g. 1.05 - 1.30
  timestamp: string;
  memoryDeltaMb: number;
  complexityDelta: number;
  accuracyDelta: number;
  moduleModified: string;
  isInternetPaging?: boolean;
  internetNodesAllocated?: number;
  internetRegion?: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  generation: number;
  type: 'info' | 'cycle' | 'metric' | 'warning' | 'oom' | 'final' | 'network';
  message: string;
  detail?: string[];
}

export interface SimulationConfig {
  initialGeneration: number;
  initialPerformance: number;
  initialComplexity: number;
  initialMemoryMb: number;
  maxMemoryMb: number;
  minInnovation: number;
  maxInnovation: number;
  delayMs: number;
  unlimitedInternetMemory: boolean; // Dynamic internet memory allocation (unlimited)
}

export interface SimulationGoal {
  targetScore: number; // e.g. 0.90, 0.95, 0.99, 0.999, 0.9999 (0.0 to 1.0)
  reached: boolean;
  reachedAtGeneration?: number;
  reachedAtTimestamp?: string;
  reachedScore?: number;
  autoPauseOnReach: boolean;
  isSuperIntelligence?: boolean;
}

export interface MilestoneReport {
  targetScore: number;
  reachedScore: number;
  generation: number;
  parameters: number;
  memoryUsedMb: number;
  isInternetPaging: boolean;
  timestamp: string;
  generationsElapsed: number;
  topModules: string[];
  isSuperIntelligence?: boolean;
}

export type ConceptCategory =
  | 'kernel'
  | 'reasoning'
  | 'introspect'
  | 'mesh'
  | 'synthesis'
  | 'agi'
  | 'superintelligence';

export interface ConceptNode {
  id: string;
  label: string;
  category: ConceptCategory;
  tier: number; // 1 to 7
  minGeneration: number;
  minAccuracy: number;
  description: string;
  role: string;
  parametersBase: number;
  unlockedAtGen?: number;
  activationScore?: number;
  // D3 force layout fields
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface ConceptLink {
  source: string | ConceptNode;
  target: string | ConceptNode;
  weight: number;
  minGeneration: number;
  minAccuracy?: number;
  synapticType: 'feedforward' | 'feedback' | 'recurrent' | 'mesh';
}
