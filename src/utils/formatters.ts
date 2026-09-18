/**
 * Memory and metric formatting utilities for the Self-Improving AI Simulator.
 * Supports scaling from MB to GB, TB, and PB for unlimited internet memory paging.
 */

export function formatMemory(mb: number): string {
  if (!isFinite(mb) || mb >= 1e15) {
    return '∞ Unlimited';
  }
  if (mb < 1024) {
    return `${mb.toFixed(1)} MB`;
  }
  const gb = mb / 1024;
  if (gb < 1024) {
    return `${gb.toFixed(2)} GB`;
  }
  const tb = gb / 1024;
  if (tb < 1024) {
    return `${tb.toFixed(2)} TB`;
  }
  const pb = tb / 1024;
  return `${pb.toFixed(2)} PB`;
}

export function formatMemoryCompact(mb: number): string {
  if (!isFinite(mb) || mb >= 1e15) {
    return '∞';
  }
  if (mb < 1024) {
    return `${mb.toFixed(0)}M`;
  }
  const gb = mb / 1024;
  if (gb < 1024) {
    return `${gb.toFixed(1)}G`;
  }
  const tb = gb / 1024;
  if (tb < 1024) {
    return `${tb.toFixed(1)}T`;
  }
  const pb = tb / 1024;
  return `${pb.toFixed(1)}P`;
}

export function formatParameters(count: number): string {
  if (count < 1000) {
    return count.toString();
  }
  if (count < 1_000_000) {
    return `${(count / 1_000).toFixed(1)}K`;
  }
  if (count < 1_000_000_000) {
    return `${(count / 1_000_000).toFixed(2)}M`;
  }
  if (count < 1_000_000_000_000) {
    return `${(count / 1_000_000_000).toFixed(2)}B`;
  }
  return `${(count / 1_000_000_000_000).toFixed(2)}T`;
}
