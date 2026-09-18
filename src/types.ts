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
