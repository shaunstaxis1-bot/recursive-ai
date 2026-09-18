import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import { useSimulation } from '../context/SimulationContext';
import { ConceptNode, ConceptLink, ConceptCategory } from '../types';
import { INITIAL_CONCEPTS, INITIAL_LINKS, CATEGORY_METAS } from '../data/conceptsData';
import {
  Search,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RefreshCw,
  Sparkles,
  Sliders,
  Cpu,
  Brain,
  Globe,
  Zap,
  Activity,
  X,
  Info,
  Layers,
  ArrowRight,
  Eye,
  CheckCircle2,
  Lock,
  Radio
} from 'lucide-react';

interface SimulationNode extends ConceptNode, d3.SimulationNodeDatum {
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
  isUnlocked: boolean;
  isActive: boolean;
  connectedCount: number;
}

interface SimulationLink extends d3.SimulationLinkDatum<SimulationNode> {
  source: SimulationNode;
  target: SimulationNode;
  weight: number;
  minGeneration: number;
  synapticType: string;
  isUnlocked: boolean;
}

export const CognitiveNodeGraph: React.FC = () => {
  const { generation, performanceScore, unlimitedInternetMemory, status } = useSimulation();

  // Graph state
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 900, height: 560 });
  const [selectedCategory, setSelectedCategory] = useState<ConceptCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [showParticles, setShowParticles] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [isPhysicsActive, setIsPhysicsActive] = useState(true);
  const [recentDiscovery, setRecentDiscovery] = useState<ConceptNode | null>(null);
  const [activeSignalNodeId, setActiveSignalNodeId] = useState<string | null>(null);

  // Zoom transform state
  const [transform, setTransform] = useState<d3.ZoomTransform>(d3.zoomIdentity);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const simulationRef = useRef<d3.Simulation<SimulationNode, SimulationLink> | null>(null);

  // Track discovered nodes to pop celebration notifications
  const prevUnlockedIdsRef = useRef<Set<string>>(new Set());

  // Determine which nodes and links are unlocked based on simulation state
  const { activeNodes, activeLinks, allNodesMap, highestTierUnlocked } = useMemo(() => {
    let highestTier = 1;
    const nodes: SimulationNode[] = INITIAL_CONCEPTS.map((c) => {
      // Mesh nodes can unlock early if unlimited internet memory is toggled
      const isMeshEligible = c.category === 'mesh' && unlimitedInternetMemory;
      const isUnlocked =
        generation >= c.minGeneration ||
        performanceScore >= c.minAccuracy ||
        isMeshEligible;

      if (isUnlocked && c.tier > highestTier) {
        highestTier = c.tier;
      }

      // Initial position seed based on tier ring
      const angle = (c.tier * 0.9 + Math.random() * 0.4) * Math.PI * 2;
      const radius = 60 + c.tier * 48;

      return {
        ...c,
        x: dimensions.width / 2 + Math.cos(angle) * radius,
        y: dimensions.height / 2 + Math.sin(angle) * radius,
        isUnlocked,
        isActive: isUnlocked && (status === 'running' || Math.random() > 0.3),
        connectedCount: 0,
      };
    });

    const nodeMap = new Map<string, SimulationNode>();
    nodes.forEach((n) => nodeMap.set(n.id, n));

    const links: SimulationLink[] = [];
    INITIAL_LINKS.forEach((l) => {
      const sourceId = typeof l.source === 'string' ? l.source : l.source.id;
      const targetId = typeof l.target === 'string' ? l.target : l.target.id;
      const sourceNode = nodeMap.get(sourceId);
      const targetNode = nodeMap.get(targetId);

      if (sourceNode && targetNode) {
        const isMeshEligible =
          (sourceNode.category === 'mesh' || targetNode.category === 'mesh') &&
          unlimitedInternetMemory;
        const isUnlocked =
          (sourceNode.isUnlocked && targetNode.isUnlocked) || isMeshEligible;

        if (isUnlocked) {
          sourceNode.connectedCount += 1;
          targetNode.connectedCount += 1;
        }

        links.push({
          source: sourceNode,
          target: targetNode,
          weight: l.weight,
          minGeneration: l.minGeneration,
          synapticType: l.synapticType,
          isUnlocked,
        });
      }
    });

    return {
      activeNodes: nodes,
      activeLinks: links,
      allNodesMap: nodeMap,
      highestTierUnlocked: highestTier,
    };
  }, [generation, performanceScore, unlimitedInternetMemory, status, dimensions.width, dimensions.height]);

  // Check for newly discovered concepts and notify user
  useEffect(() => {
    const currentlyUnlocked = new Set(
      activeNodes.filter((n) => n.isUnlocked).map((n) => n.id)
    );

    // Find newly unlocked
    for (const node of activeNodes) {
      if (node.isUnlocked && !prevUnlockedIdsRef.current.has(node.id)) {
        if (prevUnlockedIdsRef.current.size > 0) {
          setRecentDiscovery(node);
          const timer = setTimeout(() => setRecentDiscovery(null), 5000);
          break;
        }
      }
    }
    prevUnlockedIdsRef.current = currentlyUnlocked;
  }, [activeNodes]);

  // Measure container dimensions
  useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width > 0) {
          setDimensions({
            width: rect.width,
            height: Math.max(520, Math.min(640, window.innerHeight * 0.65)),
          });
        }
      }
    };
    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Filtered nodes based on category and search
  const visibleNodeIds = useMemo(() => {
    const ids = new Set<string>();
    activeNodes.forEach((node) => {
      const matchesCategory =
        selectedCategory === 'all' || node.category === selectedCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.category.toLowerCase().includes(searchQuery.toLowerCase());

      if (matchesCategory && matchesSearch) {
        ids.add(node.id);
      }
    });
    return ids;
  }, [activeNodes, selectedCategory, searchQuery]);

  // Nodes currently connected to hovered or selected node
  const directConnectedIds = useMemo(() => {
    const focusId = hoveredNodeId || selectedNodeId;
    if (!focusId) return null;
    const set = new Set<string>([focusId]);
    activeLinks.forEach((link) => {
      if (link.isUnlocked) {
        const sId = link.source.id;
        const tId = link.target.id;
        if (sId === focusId) set.add(tId);
        if (tId === focusId) set.add(sId);
      }
    });
    return set;
  }, [hoveredNodeId, selectedNodeId, activeLinks]);

  // Setup D3 Force Simulation
  useEffect(() => {
    const simulationNodes = activeNodes.map((d) => ({ ...d }));
    const nodeLookup = new Map<string, SimulationNode>();
    simulationNodes.forEach((n) => nodeLookup.set(n.id, n));

    const simulationLinks = activeLinks
      .filter((l) => l.isUnlocked)
      .map((l) => ({
        ...l,
        source: nodeLookup.get(l.source.id)!,
        target: nodeLookup.get(l.target.id)!,
      }))
      .filter((l) => l.source && l.target);

    const sim = d3
      .forceSimulation<SimulationNode>(simulationNodes)
      .force(
        'link',
        d3
          .forceLink<SimulationNode, SimulationLink>(simulationLinks)
          .id((d) => d.id)
          .distance((d) => 90 / (d.weight || 1))
          .strength(0.65)
      )
      .force('charge', d3.forceManyBody().strength(-240))
      .force(
        'collide',
        d3.forceCollide().radius((d: any) => (d.isUnlocked ? 34 : 24)).iterations(2)
      )
      .force('center', d3.forceCenter(dimensions.width / 2, dimensions.height / 2).strength(0.08))
      .alphaDecay(0.025);

    simulationRef.current = sim;

    sim.on('tick', () => {
      // Force re-render positions by mutating or trigger
      setFrame((f) => f + 1);
    });

    return () => {
      sim.stop();
    };
  }, [activeNodes, activeLinks, dimensions.width, dimensions.height]);

  const [, setFrame] = useState(0);

  // Setup D3 Zoom & Pan
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3.5])
      .on('zoom', (event) => {
        setTransform(event.transform);
      });

    zoomBehaviorRef.current = zoom;
    svg.call(zoom);

    // Initial center fit
    return () => {
      svg.on('.zoom', null);
    };
  }, []);

  const handleZoomIn = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current)
      .transition()
      .duration(250)
      .call(zoomBehaviorRef.current.scaleBy, 1.3);
  };

  const handleZoomOut = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current)
      .transition()
      .duration(250)
      .call(zoomBehaviorRef.current.scaleBy, 0.75);
  };

  const handleResetZoom = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current)
      .transition()
      .duration(400)
      .call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
  };

  const handleFocusNode = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    const node = simulationRef.current?.nodes().find((n) => n.id === nodeId);
    if (node && svgRef.current && zoomBehaviorRef.current) {
      const scale = 1.4;
      const x = dimensions.width / 2 - node.x * scale;
      const y = dimensions.height / 2 - node.y * scale;
      d3.select(svgRef.current)
        .transition()
        .duration(600)
        .call(
          zoomBehaviorRef.current.transform,
          d3.zoomIdentity.translate(x, y).scale(scale)
        );
    }
  };

  const handleFireSignal = (nodeId: string) => {
    setActiveSignalNodeId(nodeId);
    setTimeout(() => setActiveSignalNodeId(null), 1800);
  };

  // Node Drag handlers
  const handleDragStart = (e: React.MouseEvent, node: SimulationNode) => {
    e.stopPropagation();
    if (!simulationRef.current) return;
    simulationRef.current.alphaTarget(0.3).restart();
    node.fx = node.x;
    node.fy = node.y;

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!svgRef.current) return;
      const svgPoint = svgRef.current.createSVGPoint();
      svgPoint.x = moveEvent.clientX;
      svgPoint.y = moveEvent.clientY;
      const ctm = svgRef.current.getScreenCTM();
      if (ctm) {
        const transformedPoint = svgPoint.matrixTransform(ctm.inverse());
        // Reverse zoom transform
        const finalX = (transformedPoint.x - transform.x) / transform.k;
        const finalY = (transformedPoint.y - transform.y) / transform.k;
        node.fx = finalX;
        node.fy = finalY;
      }
    };

    const onMouseUp = () => {
      if (simulationRef.current) {
        simulationRef.current.alphaTarget(0);
      }
      node.fx = null;
      node.fy = null;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Selected node details
  const selectedNode = useMemo(() => {
    if (!selectedNodeId) return null;
    return allNodesMap.get(selectedNodeId) || null;
  }, [selectedNodeId, allNodesMap]);

  // Neighbors of selected node
  const selectedNeighbors = useMemo(() => {
    if (!selectedNodeId) return [];
    const neighbors: { node: SimulationNode; link: SimulationLink; isTarget: boolean }[] = [];
    activeLinks.forEach((link) => {
      if (link.isUnlocked) {
        if (link.source.id === selectedNodeId) {
          neighbors.push({ node: link.target, link, isTarget: true });
        } else if (link.target.id === selectedNodeId) {
          neighbors.push({ node: link.source, link, isTarget: false });
        }
      }
    });
    return neighbors;
  }, [selectedNodeId, activeLinks]);

  // Stats calculation
  const totalUnlockedNodes = activeNodes.filter((n) => n.isUnlocked).length;
  const totalUnlockedLinks = activeLinks.filter((l) => l.isUnlocked).length;
  const totalNodesCount = activeNodes.length;

  return (
    <div
      id="cognitive-node-graph-container"
      ref={containerRef}
      className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col relative"
    >
      {/* Top Header Bar & Telemetry HUD */}
      <div className="bg-neutral-950 px-4 py-3 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500/20 via-cyan-500/20 to-emerald-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 shadow-inner">
            <Brain className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-neutral-100 flex items-center gap-1.5">
                <span>Cognitive Architecture Graph</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold">
                  Tier {highestTierUnlocked}/7
                </span>
              </h2>
            </div>
            <p className="text-[11px] text-neutral-400">
              Interactive synaptic mesh mapping newly unlocked concepts and emergent intelligence links.
            </p>
          </div>
        </div>

        {/* Live Network Metric Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center gap-1.5 text-xs font-mono">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-neutral-400">Active Concepts:</span>
            <span className="text-emerald-300 font-bold">
              {totalUnlockedNodes} <span className="text-neutral-500 font-normal">/ {totalNodesCount}</span>
            </span>
          </div>

          <div className="px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center gap-1.5 text-xs font-mono">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-neutral-400">Synaptic Links:</span>
            <span className="text-amber-300 font-bold">{totalUnlockedLinks}</span>
          </div>

          {unlimitedInternetMemory && (
            <div className="px-2 py-1 rounded-lg bg-blue-950/60 border border-blue-500/40 text-blue-300 text-[11px] font-mono flex items-center gap-1">
              <Globe className="w-3 h-3 text-blue-400 animate-pulse" />
              <span>Mesh Fabric Active</span>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Controls & Category Filter Bar */}
      <div className="bg-neutral-950/90 px-4 py-2 border-b border-neutral-800/80 flex flex-wrap items-center justify-between gap-2.5 text-xs z-10">
        {/* Category Pills */}
        <div className="flex items-center gap-1 overflow-x-auto py-0.5 max-w-full scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition cursor-pointer border whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-neutral-700/80 border-neutral-500 text-white shadow-sm'
                : 'bg-neutral-900/80 border-neutral-800 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            All Tiers ({totalUnlockedNodes})
          </button>
          {Object.values(CATEGORY_METAS).map((cat) => {
            const countInCat = activeNodes.filter(
              (n) => n.category === cat.id && n.isUnlocked
            ).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(isSelected ? 'all' : cat.id)}
                className={`px-2 py-1 rounded-md text-[11px] font-medium transition cursor-pointer border flex items-center gap-1.5 whitespace-nowrap ${
                  isSelected
                    ? `${cat.bgColor} ${cat.borderColor} text-white font-semibold shadow-sm`
                    : 'bg-neutral-900/80 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                }`}
                title={cat.description}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span>{cat.name}</span>
                <span className="text-[10px] font-mono opacity-70">({countInCat})</span>
              </button>
            );
          })}
        </div>

        {/* Search & Graph Physics Toggles */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts..."
              className="pl-8 pr-6 py-1 bg-neutral-900 border border-neutral-800 rounded-md text-[11px] text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-cyan-500 w-36 sm:w-44 transition-all font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1.5 text-neutral-500 hover:text-neutral-300"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Quick Graph View Controls */}
          <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-md p-0.5">
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-neutral-100 transition cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-neutral-100 transition cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-neutral-100 transition cursor-pointer"
              title="Reset View"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Particle Signals Toggle */}
          <button
            type="button"
            onClick={() => setShowParticles(!showParticles)}
            className={`p-1.5 rounded-md border text-[11px] transition cursor-pointer flex items-center gap-1 ${
              showParticles
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:text-neutral-300'
            }`}
            title="Toggle animated synaptic transmission pulses"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Signals</span>
          </button>

          {/* Labels Toggle */}
          <button
            type="button"
            onClick={() => setShowLabels(!showLabels)}
            className={`p-1.5 rounded-md border text-[11px] transition cursor-pointer flex items-center gap-1 ${
              showLabels
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                : 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:text-neutral-300'
            }`}
            title="Toggle concept text labels"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Labels</span>
          </button>
        </div>
      </div>

      {/* Discovery Toast Notification */}
      {recentDiscovery && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-30 pointer-events-auto animate-in fade-in slide-in-from-top-3 duration-300">
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-neutral-900/95 border border-purple-500/50 shadow-2xl shadow-purple-950/80 text-xs backdrop-blur-md">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-500" />
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-purple-300 font-bold">New Concept Discovered:</span>
              <span className="text-white font-semibold underline decoration-purple-400/60">
                {recentDiscovery.label}
              </span>
              <span className="text-neutral-400 font-mono text-[10px]">
                (Tier {recentDiscovery.tier} · {CATEGORY_METAS[recentDiscovery.category].name})
              </span>
            </div>
            <button
              onClick={() => handleFocusNode(recentDiscovery.id)}
              className="ml-1 px-2 py-0.5 rounded bg-purple-500/30 hover:bg-purple-500/50 text-purple-200 text-[10px] font-bold cursor-pointer transition border border-purple-400/40"
            >
              Focus
            </button>
            <button
              onClick={() => setRecentDiscovery(null)}
              className="text-neutral-400 hover:text-neutral-200 ml-1"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* SVG Canvas Area */}
      <div className="relative flex-1 min-h-[480px] bg-radial from-neutral-900 via-neutral-950 to-black overflow-hidden select-none">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `radial-gradient(#4b5563 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Ambient Radial Core Light */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <svg
          ref={svgRef}
          className="w-full h-full cursor-grab active:cursor-grabbing block"
          style={{ minHeight: '520px' }}
        >
          <defs>
            {/* Edge Gradients */}
            <linearGradient id="link-grad-default" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.4" />
            </linearGradient>

            <linearGradient id="link-grad-active" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.8" />
            </linearGradient>

            {/* Glowing filters for active nodes */}
            <filter id="node-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="node-glow-super" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="7" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Zoomable / Pannable Root Group */}
          <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.k})`}>
            {/* Concentric Cognitive Horizon Orbital Rings */}
            {[1, 2, 3, 4, 5, 6, 7].map((tier) => {
              const radius = 60 + tier * 50;
              return (
                <circle
                  key={`orbital-${tier}`}
                  cx={dimensions.width / 2}
                  cy={dimensions.height / 2}
                  r={radius}
                  fill="none"
                  stroke={tier <= highestTierUnlocked ? 'rgba(168, 85, 247, 0.12)' : 'rgba(75, 85, 99, 0.08)'}
                  strokeDasharray="4 6"
                  strokeWidth="1"
                  className="pointer-events-none"
                />
              );
            })}

            {/* Synaptic Links (Edges) */}
            <g className="synaptic-links">
              {activeLinks.map((link, idx) => {
                const source = link.source as SimulationNode;
                const target = link.target as SimulationNode;
                if (!source || !target || typeof source.x !== 'number' || typeof target.x !== 'number') {
                  return null;
                }

                const isVisible =
                  visibleNodeIds.has(source.id) || visibleNodeIds.has(target.id);
                const isHighlight =
                  directConnectedIds &&
                  directConnectedIds.has(source.id) &&
                  directConnectedIds.has(target.id);
                const isDimmed =
                  directConnectedIds && !isHighlight && visibleNodeIds.size > 0;

                if (!isVisible) return null;

                const catMeta = CATEGORY_METAS[source.category] || CATEGORY_METAS.kernel;
                const strokeColor = !link.isUnlocked
                  ? '#374151'
                  : isHighlight
                  ? '#f59e0b'
                  : catMeta.color;

                const strokeWidth = !link.isUnlocked
                  ? 1
                  : isHighlight
                  ? 2.5
                  : Math.max(1.2, link.weight * 2.2);

                const strokeOpacity = !link.isUnlocked
                  ? 0.15
                  : isDimmed
                  ? 0.15
                  : isHighlight
                  ? 0.95
                  : 0.45;

                return (
                  <g key={`link-${idx}`}>
                    <line
                      x1={source.x}
                      y1={source.y}
                      x2={target.x}
                      y2={target.y}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      strokeOpacity={strokeOpacity}
                      strokeDasharray={!link.isUnlocked ? '3 3' : link.synapticType === 'mesh' ? '5 3' : undefined}
                      className="transition-all duration-300"
                    />

                    {/* Animated Synaptic Signal Particle */}
                    {showParticles && link.isUnlocked && (!isDimmed || isHighlight) && (
                      <circle
                        r={isHighlight ? 3.5 : 2}
                        fill={isHighlight ? '#facc15' : catMeta.color}
                        filter="url(#node-glow)"
                        className="pointer-events-none"
                      >
                        <animate
                          attributeName="cx"
                          from={source.x}
                          to={target.x}
                          dur={`${2.2 / (link.weight || 0.8)}s`}
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="cy"
                          from={source.y}
                          to={target.y}
                          dur={`${2.2 / (link.weight || 0.8)}s`}
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}
                  </g>
                );
              })}
            </g>

            {/* Concept Nodes */}
            <g className="concept-nodes">
              {activeNodes.map((node) => {
                if (typeof node.x !== 'number' || typeof node.y !== 'number') return null;

                const isVisible = visibleNodeIds.has(node.id);
                const isSelected = selectedNodeId === node.id;
                const isHovered = hoveredNodeId === node.id;
                const isDirect = directConnectedIds && directConnectedIds.has(node.id);
                const isDimmed =
                  directConnectedIds && !isDirect && visibleNodeIds.size > 0;
                const catMeta = CATEGORY_METAS[node.category] || CATEGORY_METAS.kernel;
                const isSuper = node.category === 'superintelligence';
                const isSignaling = activeSignalNodeId === node.id;

                const nodeRadius = isSelected ? 22 : isHovered ? 20 : node.isUnlocked ? 16 : 12;

                return (
                  <g
                    key={`node-${node.id}`}
                    transform={`translate(${node.x}, ${node.y})`}
                    className={`cursor-pointer transition-transform duration-200 ${
                      isDimmed ? 'opacity-25' : 'opacity-100'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedNodeId(isSelected ? null : node.id);
                    }}
                    onMouseEnter={() => setHoveredNodeId(node.id)}
                    onMouseLeave={() => setHoveredNodeId(null)}
                    onMouseDown={(e) => handleDragStart(e, node)}
                  >
                    {/* Pulsing Aura if unlocked or signaling */}
                    {node.isUnlocked && (
                      <circle
                        r={nodeRadius + (isSuper ? 12 : 6)}
                        fill={catMeta.color}
                        fillOpacity={isSuper ? 0.25 : 0.12}
                        className={isSuper || isSignaling ? 'animate-ping' : ''}
                      />
                    )}

                    {/* Outer Border Halo */}
                    <circle
                      r={nodeRadius + (isSelected ? 5 : 2)}
                      fill="none"
                      stroke={isSelected ? '#facc15' : catMeta.color}
                      strokeWidth={isSelected ? 2.5 : node.isUnlocked ? 1.5 : 1}
                      strokeDasharray={!node.isUnlocked ? '3 3' : undefined}
                      filter={node.isUnlocked ? (isSuper ? 'url(#node-glow-super)' : 'url(#node-glow)') : undefined}
                    />

                    {/* Main Node Core Circle */}
                    <circle
                      r={nodeRadius}
                      fill={
                        !node.isUnlocked
                          ? '#171717'
                          : isSelected
                          ? '#262626'
                          : '#0a0a0a'
                      }
                      stroke={catMeta.color}
                      strokeWidth={node.isUnlocked ? 2 : 1}
                    />

                    {/* Center Glyph / Icon representation */}
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={isSelected ? '12px' : '10px'}
                      fill={node.isUnlocked ? catMeta.color : '#6b7280'}
                      fontWeight="bold"
                      className="pointer-events-none font-mono select-none"
                    >
                      {node.isUnlocked ? (isSuper ? 'Ω' : `T${node.tier}`) : '•'}
                    </text>

                    {/* Concept Label */}
                    {showLabels && (
                      <g className="pointer-events-none select-none">
                        <text
                          y={nodeRadius + 14}
                          textAnchor="middle"
                          fontSize="10px"
                          fontWeight={isSelected || isHovered ? 'bold' : '500'}
                          fill={
                            !node.isUnlocked
                              ? '#6b7280'
                              : isSelected
                              ? '#facc15'
                              : isHovered
                              ? '#ffffff'
                              : '#d1d5db'
                          }
                          className="font-sans drop-shadow-md"
                        >
                          {node.label}
                        </text>
                        {/* Sub-label showing tier or lock */}
                        <text
                          y={nodeRadius + 25}
                          textAnchor="middle"
                          fontSize="8px"
                          fill={node.isUnlocked ? catMeta.color : '#4b5563'}
                          className="font-mono"
                        >
                          {node.isUnlocked ? `${catMeta.name}` : `Locked (Gen ${node.minGeneration})`}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </g>
          </g>
        </svg>

        {/* Bottom Legend / Cognitive Tier Spectrum */}
        <div className="absolute bottom-3 left-3 bg-neutral-950/85 backdrop-blur-md border border-neutral-800 rounded-xl px-3 py-2 text-[10px] hidden sm:flex items-center gap-3 z-10 shadow-lg">
          <span className="text-neutral-400 font-mono uppercase tracking-wider font-semibold">
            Tiers:
          </span>
          <div className="flex items-center gap-2.5">
            {Object.values(CATEGORY_METAS).map((cat) => (
              <div key={cat.id} className="flex items-center gap-1">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-neutral-300 font-medium">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Node Detail Inspector Drawer */}
        {selectedNode && (
          <div className="absolute top-3 right-3 bottom-3 w-80 max-w-[90%] bg-neutral-950/95 backdrop-blur-md border border-neutral-800 rounded-2xl p-4 shadow-2xl flex flex-col z-20 overflow-y-auto animate-in slide-in-from-right-4 duration-200">
            {/* Drawer Header */}
            <div className="flex items-start justify-between gap-2 pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-bold font-mono text-sm border shadow-inner"
                  style={{
                    backgroundColor: `${CATEGORY_METAS[selectedNode.category].color}20`,
                    borderColor: `${CATEGORY_METAS[selectedNode.category].color}50`,
                    color: CATEGORY_METAS[selectedNode.category].color,
                  }}
                >
                  T{selectedNode.tier}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white leading-tight">
                    {selectedNode.label}
                  </h3>
                  <span
                    className="text-[10px] font-mono px-1.5 py-0.2 rounded border inline-block mt-0.5"
                    style={{
                      borderColor: `${CATEGORY_METAS[selectedNode.category].color}40`,
                      color: CATEGORY_METAS[selectedNode.category].color,
                      backgroundColor: `${CATEGORY_METAS[selectedNode.category].color}15`,
                    }}
                  >
                    {CATEGORY_METAS[selectedNode.category].name}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedNodeId(null)}
                className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Status & Unlocked Metric */}
            <div className="py-3 border-b border-neutral-800/80 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Evolution Status:</span>
                <span
                  className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${
                    selectedNode.isUnlocked
                      ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300'
                      : 'bg-neutral-900 border-neutral-700 text-neutral-400'
                  }`}
                >
                  {selectedNode.isUnlocked ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>ONLINE & EVOLVING</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3 text-neutral-500" />
                      <span>HORIZON LOCKED</span>
                    </>
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Unlock Condition:</span>
                <span className="font-mono text-neutral-200 text-[11px]">
                  Gen #{selectedNode.minGeneration} or {(selectedNode.minAccuracy * 100).toFixed(1)}% Acc
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Parameter Allocation:</span>
                <span className="font-mono text-cyan-400 text-[11px] font-semibold">
                  ~{selectedNode.parametersBase.toLocaleString()} base weights
                </span>
              </div>
            </div>

            {/* Role & Description */}
            <div className="py-3 border-b border-neutral-800/80 space-y-1.5 text-xs">
              <span className="text-neutral-400 font-semibold block text-[11px]">
                Architectural Role:
              </span>
              <p className="text-neutral-200 text-xs leading-relaxed bg-neutral-900 p-2.5 rounded-lg border border-neutral-800 font-sans">
                {selectedNode.role}
              </p>

              <span className="text-neutral-400 font-semibold block text-[11px] pt-1">
                Cognitive Function:
              </span>
              <p className="text-neutral-400 text-[11px] leading-relaxed">
                {selectedNode.description}
              </p>
            </div>

            {/* Interconnected Neighboring Synapses */}
            <div className="py-3 flex-1 overflow-y-auto space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-neutral-300 font-semibold text-[11px] flex items-center gap-1">
                  <Layers className="w-3 h-3 text-purple-400" />
                  <span>Interconnected Nodes ({selectedNeighbors.length})</span>
                </span>
                <button
                  onClick={() => handleFireSignal(selectedNode.id)}
                  className="text-[10px] text-amber-400 hover:text-amber-300 font-mono flex items-center gap-1 underline cursor-pointer"
                >
                  <Radio className="w-3 h-3 animate-pulse" />
                  <span>Pulse Synapse</span>
                </button>
              </div>

              <div className="space-y-1.5">
                {selectedNeighbors.length === 0 ? (
                  <p className="text-[11px] text-neutral-500 italic py-1">
                    No active synaptic connections established yet at current generation.
                  </p>
                ) : (
                  selectedNeighbors.map(({ node: n, link, isTarget }) => {
                    const catMeta = CATEGORY_METAS[n.category] || CATEGORY_METAS.kernel;
                    return (
                      <div
                        key={n.id}
                        onClick={() => handleFocusNode(n.id)}
                        className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 transition flex items-center justify-between cursor-pointer group"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: catMeta.color }}
                          />
                          <span className="text-[11px] font-medium text-neutral-200 group-hover:text-white truncate">
                            {n.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[9px] font-mono px-1 rounded bg-neutral-800 text-neutral-400">
                            {isTarget ? '→ OUT' : '← IN'}
                          </span>
                          <span className="text-[10px] font-mono text-amber-400 font-semibold">
                            {(link.weight * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Close Drawer Button */}
            <div className="pt-2">
              <button
                onClick={() => setSelectedNodeId(null)}
                className="w-full py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs font-medium transition cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
