import React, { useRef, useEffect, useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Terminal, Copy, Check, Trash2, ArrowDownCircle } from 'lucide-react';

export const TerminalConsole: React.FC = () => {
  const { logs, clearLogs, status } = useSimulation();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  const handleCopy = () => {
    const rawText = logs
      .map((log) => {
        let text = `[${log.timestamp}] ${log.message}`;
        if (log.detail && log.detail.length > 0) {
          text += '\n' + log.detail.join('\n');
        }
        return text;
      })
      .join('\n');

    navigator.clipboard.writeText(rawText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div id="terminal-view" className="space-y-4 max-w-7xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      {/* Top Console Bar */}
      <div className="flex items-center justify-between bg-neutral-900 border border-neutral-800 rounded-t-xl px-4 py-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <div className="h-4 w-px bg-neutral-800 mx-1" />
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-300">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>self_improving_ai.py — stdout stream</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`px-2.5 py-1 text-xs rounded border transition flex items-center gap-1.5 cursor-pointer ${
              autoScroll
                ? 'bg-neutral-800 text-neutral-200 border-neutral-700'
                : 'text-neutral-400 hover:text-neutral-200 border-transparent'
            }`}
            title="Auto scroll to bottom"
          >
            <ArrowDownCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Auto-scroll</span>
          </button>

          <button
            onClick={handleCopy}
            className="px-2.5 py-1 text-xs rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition flex items-center gap-1.5 cursor-pointer"
            title="Copy logs to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={clearLogs}
            className="p-1.5 text-neutral-400 hover:text-rose-400 rounded hover:bg-neutral-800 transition cursor-pointer"
            title="Clear terminal"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Screen Container */}
      <div 
        id="terminal-stdout-container"
        className="flex-1 bg-neutral-950 border-x border-b border-neutral-800 rounded-b-xl p-5 font-mono text-xs overflow-y-auto leading-relaxed space-y-3 select-text shadow-inner shadow-black"
      >
        {logs.map((log) => {
          if (log.type === 'final') {
            return (
              <div 
                key={log.id} 
                className="my-4 p-4 rounded-lg bg-neutral-900/90 border border-emerald-500/40 text-emerald-400 shadow-md"
              >
                <div className="font-bold text-sm text-neutral-100 mb-2">{log.message}</div>
                {log.detail?.map((line, idx) => (
                  <div key={idx} className="text-emerald-300 font-semibold text-xs py-0.5">
                    {line}
                  </div>
                ))}
                <div className="mt-2 text-neutral-400 text-[11px]">=================================</div>
              </div>
            );
          }

          if (log.type === 'oom') {
            return (
              <div 
                key={log.id} 
                className="my-2 p-3 rounded-lg bg-rose-950/40 border border-rose-500/60 text-rose-300 font-bold text-xs"
              >
                {log.message}
              </div>
            );
          }

          if (log.type === 'warning') {
            return (
              <div key={log.id} className="text-amber-400 font-semibold">
                <span className="text-neutral-400 mr-2">[{log.timestamp}]</span>
                {log.message}
              </div>
            );
          }

          return (
            <div key={log.id} className="group hover:bg-neutral-900/40 py-1 rounded px-1 transition">
              <div className="text-neutral-200 flex items-start gap-2">
                <span className="text-neutral-400 select-none shrink-0">[{log.timestamp}]</span>
                <span className={log.type === 'cycle' ? 'text-cyan-300 font-medium' : 'text-neutral-300'}>
                  {log.message}
                </span>
              </div>
              {log.detail && log.detail.length > 0 && (
                <div className="pl-6 pt-1 space-y-0.5 text-neutral-400">
                  {log.detail.map((d, i) => (
                    <div key={i} className="text-neutral-400 hover:text-neutral-300">
                      {d}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {status === 'running' && (
          <div className="flex items-center gap-2 text-emerald-400 pt-2 animate-pulse">
            <span className="w-2 h-4 bg-emerald-400 inline-block" />
            <span className="text-neutral-400 text-xs">SelfImprovingAI cycle executing...</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
};
