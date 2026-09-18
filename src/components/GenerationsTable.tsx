import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { formatMemory, formatParameters } from '../utils/formatters';
import { Download, Search, TrendingUp, Layers, Cpu, Database, Globe } from 'lucide-react';

export const GenerationsTable: React.FC = () => {
  const { history, maxMemoryMb, unlimitedInternetMemory } = useSimulation();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = history.filter(
    (item) =>
      item.generation.toString().includes(searchTerm) ||
      item.moduleModified.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.internetRegion && item.internetRegion.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const exportCSV = () => {
    const headers = [
      'Generation',
      'Accuracy_Percent',
      'Parameters_Complexity',
      'Memory_Used_MB',
      'Max_Memory_MB',
      'Internet_Paging',
      'Internet_Region',
      'Innovation_Factor',
      'Module_Rewritten',
      'Timestamp',
    ];

    const rows = history.map((item) => [
      item.generation,
      (item.performanceScore * 100).toFixed(4),
      item.codeBaseComplexity,
      item.memoryUsedMb.toFixed(2),
      unlimitedInternetMemory ? 'UNLIMITED' : maxMemoryMb,
      item.isInternetPaging ? 'YES' : 'NO',
      item.internetRegion || 'N/A',
      item.innovationFactor.toFixed(4),
      item.moduleModified,
      item.timestamp,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `self_improving_ai_gen_${history.length}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="generations-history-view" className="space-y-4 max-w-7xl mx-auto">
      {/* Header Bar with Search and Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-900 border border-neutral-800 rounded-xl p-4">
        <div>
          <h2 className="text-sm font-semibold text-neutral-200 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            Generations Ledger
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Archival records of code rewrites, mutation factors, parameter growth, and internet mesh paging.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by Gen or module..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-200 placeholder-neutral-400 focus:outline-none focus:border-neutral-700 w-48 sm:w-60"
            />
          </div>

          <button
            onClick={exportCSV}
            className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 text-xs font-medium transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-neutral-950 text-neutral-400 uppercase tracking-wider font-mono text-[10px] border-b border-neutral-800">
              <tr>
                <th className="py-3 px-4">Gen</th>
                <th className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                    Accuracy
                  </div>
                </th>
                <th className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    <Cpu className="w-3 h-3 text-cyan-400" />
                    Parameters (LOC)
                  </div>
                </th>
                <th className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    <Database className="w-3 h-3 text-amber-400" />
                    Memory Allocated
                  </div>
                </th>
                <th className="py-3 px-4">Innovation Factor</th>
                <th className="py-3 px-4">Subsystem & Network</th>
                <th className="py-3 px-4 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 font-mono">
              {filteredHistory.map((item, idx) => {
                const isLatest = idx === filteredHistory.length - 1;
                return (
                  <tr
                    key={item.generation}
                    className={`hover:bg-neutral-800/40 transition ${
                      isLatest ? 'bg-neutral-800/20 font-medium' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-bold text-neutral-100 flex items-center gap-1.5">
                      #{item.generation}
                      {isLatest && (
                        <span className="text-[9px] font-sans px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-emerald-400 font-bold">
                          {(item.performanceScore * 100).toFixed(3)}%
                        </span>
                        {item.accuracyDelta > 0 && (
                          <span className="text-[10px] text-neutral-400">
                            (+{(item.accuracyDelta * 100).toFixed(3)}%)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-neutral-200">
                      <div className="flex items-center gap-1.5">
                        <span>{item.codeBaseComplexity > 10_000_000 ? formatParameters(item.codeBaseComplexity) : item.codeBaseComplexity.toLocaleString()}</span>
                        {item.complexityDelta > 0 && (
                          <span className="text-[10px] text-cyan-400">
                            (+{item.complexityDelta > 1_000_000 ? formatParameters(item.complexityDelta) : item.complexityDelta.toLocaleString()})
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className={!unlimitedInternetMemory && item.memoryUsedMb >= maxMemoryMb ? 'text-rose-400 font-bold' : 'text-amber-400'}>
                          {formatMemory(item.memoryUsedMb)}
                        </span>
                        {item.memoryDeltaMb > 0 && (
                          <span className="text-[10px] text-neutral-400">
                            (+{formatMemory(item.memoryDeltaMb)})
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-cyan-300">
                      {item.innovationFactor > 1.0
                        ? `x${item.innovationFactor.toFixed(3)} (+${((item.innovationFactor - 1) * 100).toFixed(1)}%)`
                        : 'Baseline 1.000'}
                    </td>
                    <td className="py-3 px-4 font-sans text-neutral-400 text-xs">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800 text-neutral-300 font-mono text-[11px]">
                          {item.moduleModified}
                        </span>
                        {item.isInternetPaging && (
                          <span className="inline-flex items-center gap-1 bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 px-1.5 py-0.5 rounded text-[10px] font-mono">
                            <Globe className="w-2.5 h-2.5" />
                            {item.internetRegion || 'Mesh Paged'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right text-neutral-400">
                      {item.timestamp}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
