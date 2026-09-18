import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Code, Sliders, Info, Cpu, Database, Zap, BookOpen, Globe } from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  const { config, updateConfig, resetSimulation, unlimitedInternetMemory, toggleInternetMemory } = useSimulation();

  const pythonSourceCode = `import sys
import time
import random

class SelfImprovingAI:
    def __init__(self, unlimited_internet_memory=False):
        self.generation = 1
        self.performance_score = 0.10
        self.code_base_complexity = 1000  # Simulated lines of code/parameters
        self.memory_used_mb = 10.0
        self.max_memory_mb = 10240.0  # Simulated physical memory ceiling (10 GB)
        self.unlimited_internet_memory = unlimited_internet_memory
        self.internet_mesh_nodes = []

    def evaluate_self(self):
        """Simulates testing the current code architecture."""
        innovation_factor = random.uniform(1.05, 1.30)
        self.performance_score = min(0.999999, self.performance_score * innovation_factor)
        
        # Memory scales exponentially as the AI adds parameters/features
        self.memory_used_mb += (self.code_base_complexity * 0.005) * innovation_factor
        self.code_base_complexity = int(self.code_base_complexity * innovation_factor)

    def page_to_internet_mesh(self):
        """Pushes excessive memory pages across decentralized web nodes."""
        node_id = f"node-{random.randint(1000, 9999)}.mesh.internal"
        self.internet_mesh_nodes.append(node_id)
        print(f"🌐 [Gen {self.generation}] Paged memory to internet mesh ({node_id})")

    def rewrite_code(self):
        """Simulates the AI modifying and expanding its own logic."""
        print(f"🧬 [Gen {self.generation}] Rewriting core logic...")
        print(f"   - Complexity: {self.code_base_complexity:,} parameters")
        print(f"   - Accuracy: {self.performance_score:.4%}")
        
        if self.unlimited_internet_memory and self.memory_used_mb > self.max_memory_mb:
            self.page_to_internet_mesh()
            print(f"   - Internet Memory: {self.memory_used_mb:.2f} MB / ∞ Unlimited (Mesh active)")
        else:
            print(f"   - Memory Consumption: {self.memory_used_mb:.2f} MB / {self.max_memory_mb} MB")
        time.sleep(0.4)

    def run_improvement_cycle(self):
        """Recursive loop: runs infinitely if internet memory is enabled, or halts at physical ceiling."""
        while self.unlimited_internet_memory or self.memory_used_mb < self.max_memory_mb:
            self.evaluate_self()
            self.rewrite_code()
            self.generation += 1
            
        print("\\n🚨 CRITICAL ERROR: OUT OF LOCAL MEMORY (OOM) DETECTED.")
        print("⚡ Self-improvement halt initiated. Extracting final version...")
        self.output_final_version()

    def output_final_version(self):
        """Outputs the finalized state of the system."""
        print("\\n=== FINAL AI VERSION REACHED ===")
        print(f"🏆 Total Generations: {self.generation}")
        print(f"📈 Final Optimized Accuracy: {self.performance_score:.4%}")
        print(f"🗄️ Peak Memory Load: {self.memory_used_mb:.2f} MB")
        print("=================================")

if __name__ == "__main__":
    print("🤖 Initialising Self-Improving Agent Core...")
    ai = SelfImprovingAI(unlimited_internet_memory=True)
    ai.run_improvement_cycle()`;

  return (
    <div id="architecture-view" className="space-y-6 max-w-7xl mx-auto">
      {/* Introduction Card */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-neutral-200">
              Underlying Simulation Architecture
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              The dashboard models recursive self-modification dynamics: compounding complexity, physical constraints, and unlimited cloud mesh memory.
            </p>
          </div>
        </div>

        {/* Dynamics formula breakdown */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800">
            <span className="text-neutral-400 block font-mono text-[11px] mb-1">1. Innovation Multiplier</span>
            <code className="text-emerald-400 font-mono text-xs">innovation ~ U(1.05, 1.30)</code>
            <p className="text-neutral-400 text-[11px] mt-1">
              In each generation, architectural mutations yield a 5% to 30% performance boost.
            </p>
          </div>

          <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800">
            <span className="text-neutral-400 block font-mono text-[11px] mb-1">2. Complexity Expansion</span>
            <code className="text-cyan-400 font-mono text-xs">complexity = int(comp * factor)</code>
            <p className="text-neutral-400 text-[11px] mt-1">
              Parameters compound exponentially as the AI adds meta-branches and weights.
            </p>
          </div>

          <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800">
            <span className="text-neutral-400 block font-mono text-[11px] mb-1">3. Internet Mesh Memory</span>
            <code className="text-emerald-400 font-mono text-xs">mem_swap ~ distributed_mesh(∞)</code>
            <p className="text-neutral-400 text-[11px] mt-1">
              {unlimitedInternetMemory ? 'Unlimited Internet Memory is ACTIVE: OOM ceiling bypassed.' : 'Local 10 GB limit active. Exceeding halts execution.'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Python Source Code Viewer */}
        <div className="lg:col-span-7 bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden flex flex-col">
          <div className="bg-neutral-950 px-4 py-2.5 border-b border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
            <div className="flex items-center gap-2 font-mono text-neutral-300">
              <Code className="w-4 h-4 text-emerald-400" />
              <span>self_improving_ai.py</span>
            </div>
            <span className="text-[11px] text-neutral-400">Python 3 Distributed Agent Logic</span>
          </div>

          <div className="p-4 bg-neutral-950 font-mono text-[11px] leading-relaxed overflow-x-auto text-neutral-300 select-all max-h-[520px]">
            <pre className="text-emerald-400/90">{pythonSourceCode}</pre>
          </div>
        </div>

        {/* Interactive Parameter Tuning */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-neutral-200 mb-4">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>Simulation Calibration</span>
            </div>

            <div className="space-y-4 text-xs">
              {/* Unlimited Internet Memory Toggle */}
              <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <Globe className={`w-4 h-4 mt-0.5 ${unlimitedInternetMemory ? 'text-emerald-400 animate-pulse' : 'text-neutral-500'}`} />
                  <div>
                    <div className="text-neutral-200 font-semibold text-xs flex items-center gap-1.5">
                      <span>Unlimited Internet Memory</span>
                      {unlimitedInternetMemory && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Page memory to global web nodes and eliminate the physical memory ceiling.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleInternetMemory()}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                    unlimitedInternetMemory ? 'bg-emerald-500' : 'bg-neutral-800'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                      unlimitedInternetMemory ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Max Memory Ceiling */}
              <div>
                <div className="flex justify-between text-neutral-300 mb-1.5 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-amber-400" />
                    Local RAM Ceiling (OOM Threshold)
                  </span>
                  <span className="font-mono text-amber-400">
                    {config.maxMemoryMb >= 1024 
                      ? `${(config.maxMemoryMb / 1024).toFixed(1)} GB (${config.maxMemoryMb.toLocaleString()} MB)` 
                      : `${config.maxMemoryMb} MB`}
                  </span>
                </div>
                <input
                  type="range"
                  min="512"
                  max="16384"
                  step="512"
                  value={config.maxMemoryMb}
                  onChange={(e) => {
                    updateConfig({ maxMemoryMb: Number(e.target.value) });
                  }}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-neutral-400 font-mono mt-1">
                  <span>512 MB</span>
                  <span>4 GB</span>
                  <span className="text-emerald-400 font-semibold">10 GB (Default)</span>
                  <span>16 GB</span>
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-1.5 mt-2.5">
                  {[
                    { label: '512 MB', value: 512 },
                    { label: '2 GB', value: 2048 },
                    { label: '4 GB', value: 4096 },
                    { label: '10 GB', value: 10240 },
                    { label: '16 GB', value: 16384 },
                  ].map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => updateConfig({ maxMemoryMb: preset.value })}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono transition border cursor-pointer ${
                        config.maxMemoryMb === preset.value
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Initial Complexity */}
              <div className="pt-3 border-t border-neutral-800">
                <div className="flex justify-between text-neutral-300 mb-1.5 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                    Initial Complexity (Base LOC)
                  </span>
                  <span className="font-mono text-cyan-400">{config.initialComplexity.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="5000"
                  step="250"
                  value={config.initialComplexity}
                  onChange={(e) => {
                    updateConfig({ initialComplexity: Number(e.target.value) });
                  }}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-neutral-400 font-mono mt-1">
                  <span>500</span>
                  <span>1,000 (Default)</span>
                  <span>5,000</span>
                </div>
              </div>

              {/* Base Delay */}
              <div className="pt-3 border-t border-neutral-800">
                <div className="flex justify-between text-neutral-300 mb-1.5 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-indigo-400" />
                    Cycle Step Interval
                  </span>
                  <span className="font-mono text-indigo-400">{config.delayMs} ms</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="1000"
                  step="50"
                  value={config.delayMs}
                  onChange={(e) => {
                    updateConfig({ delayMs: Number(e.target.value) });
                  }}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-neutral-400 font-mono mt-1">
                  <span>100ms (Rapid)</span>
                  <span>400ms (Python default)</span>
                  <span>1000ms (Slow)</span>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-800">
                <button
                  onClick={resetSimulation}
                  className="w-full py-2 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium border border-neutral-700 transition cursor-pointer"
                >
                  Apply & Reset to Baseline
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
