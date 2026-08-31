import React, { useState } from 'react';
import {
  Network,
  Activity,
  Layers,
  MapPin,
  Truck,
  Building2,
  Users,
  AlertTriangle,
  CheckCircle,
  Sparkles,
  Info
} from 'lucide-react';
import { INITIAL_BATCHES } from '../../data/mockData';

interface SupplyChainGraphViewProps {
  onNavigate: (view: string, param?: string) => void;
  onOpenCanonicalModal: () => void;
}

interface GraphNode {
  id: string;
  label: string;
  tier: 'FARM' | 'PROCESSING' | 'COLD_STORAGE' | 'LOGISTICS' | 'RETAIL' | 'CONSUMER';
  riskScore: number;
  status: 'NOMINAL' | 'WARNING' | 'CRITICAL';
  location: string;
  details: string;
  batchIds: string[];
}

const GRAPH_NODES: GraphNode[] = [
  {
    id: 'FARM-01',
    label: 'Karnal Agro Dairy Cooperative',
    tier: 'FARM',
    riskScore: 12,
    status: 'NOMINAL',
    location: 'Karnal, Haryana',
    details: 'Raw milk collection from 14 vetted village dairy clusters. Daily testing compliant.',
    batchIds: ['M492']
  },
  {
    id: 'PROC-01',
    label: 'Ambala Central Dairy Processing',
    tier: 'PROCESSING',
    riskScore: 18,
    status: 'NOMINAL',
    location: 'Ambala, Haryana',
    details: 'HTST pasteurization (72°C for 15s) and homogenization. Aseptic bagging line #2.',
    batchIds: ['M492']
  },
  {
    id: 'WH-17',
    label: 'Central Cold Storage #17 (Okhla)',
    tier: 'COLD_STORAGE',
    riskScore: 94,
    status: 'CRITICAL',
    location: 'Okhla Phase III, New Delhi',
    details: 'Chamber 3 secondary compressor failure. 14.8°C thermal excursion for 4.2 hours.',
    batchIds: ['M492', 'P812']
  },
  {
    id: 'TRUCK-04',
    label: 'Apex Reefer Fleet #DL-01-4421',
    tier: 'LOGISTICS',
    riskScore: 72,
    status: 'WARNING',
    location: 'Mathura Road Corridor',
    details: 'En-route distribution to 84 South Delhi retail points. Reefer unit operational but cargo pre-warmed.',
    batchIds: ['M492']
  },
  {
    id: 'RETAIL-DELHI',
    label: 'South Delhi Quick Commerce & Kiranas',
    tier: 'RETAIL',
    riskScore: 86,
    status: 'CRITICAL',
    location: 'Hauz Khas, Saket, Malviya Nagar',
    details: '84 retail outlets receiving milk pouches with compromised shelf stability.',
    batchIds: ['M492']
  },
  {
    id: 'CONS-CLUSTER',
    label: 'South Delhi Consumer Cluster',
    tier: 'CONSUMER',
    riskScore: 88,
    status: 'CRITICAL',
    location: 'South Delhi (Pin 110016 / 110017)',
    details: '23 geocoded souring reports and complaints of curdling upon boiling.',
    batchIds: ['M492']
  }
];

export const SupplyChainGraphView: React.FC<SupplyChainGraphViewProps> = ({
  onNavigate,
  onOpenCanonicalModal
}) => {
  const [selectedNode, setSelectedNode] = useState<GraphNode>(GRAPH_NODES[2]); // Warehouse #17 default

  const getNodeColor = (status: GraphNode['status']) => {
    switch (status) {
      case 'CRITICAL':
        return 'border-red-500 bg-red-50 text-red-700 shadow-md ring-2 ring-red-200';
      case 'WARNING':
        return 'border-amber-500 bg-amber-50 text-amber-800 ring-2 ring-amber-200';
      default:
        return 'border-emerald-500 bg-emerald-50 text-emerald-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-[#FAFAF7] border border-[#EBEBE6] rounded-xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-white border border-[#EBEBE6] text-xs font-mono font-medium text-[#8F6B00] mb-2">
            <span>GRAPH TOPOLOGY ENGINE: /supply-chain</span>
            <span>•</span>
            <span className="text-[#1A1A18]">MULTI-TIER BOTTLENECK DISCOVERY</span>
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-[#1A1A18]">
            Interactive Supply Chain Graph
          </h1>
          <p className="text-xs sm:text-sm text-[#666660] font-sans mt-1">
            Traverse interconnected suppliers, cold storage hubs, logistics routes, and retail clusters to isolate failure points.
          </p>
        </div>

        <button
          onClick={onOpenCanonicalModal}
          className="bg-[#1A1A18] hover:bg-[#8F6B00] text-white px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
        >
          <Sparkles className="w-4 h-4 text-[#C49200]" />
          <span>Walkthrough Graph Discovery</span>
        </button>
      </div>

      {/* Graph Visualizer Canvas & Detail Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Canvas: Tiered Visual Graph */}
        <div className="lg:col-span-8 bg-white border border-[#EBEBE6] rounded-xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#F0F0EB] pb-4 mb-6">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#1A1A18]">
                Batch M492 Multi-Tier Graph Topology
              </h3>
              <p className="text-xs text-[#777]">
                Click any node in the flow to inspect telemetry and attached lots.
              </p>
            </div>
            <span className="font-mono text-xs text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded font-semibold">
              CRITICAL BOTTLENECK: WH-17
            </span>
          </div>

          {/* Node Journey Flow */}
          <div className="space-y-4 my-2">
            {GRAPH_NODES.map((node, idx) => {
              const isSelected = selectedNode.id === node.id;
              const isCulprit = node.id === 'WH-17';
              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-[#FDF9EE] border-[#8F6B00] shadow-md ring-2 ring-[#8F6B00]/20'
                      : isCulprit
                      ? 'bg-red-50/60 border-red-300 hover:bg-red-50 shadow-2xs'
                      : 'bg-[#FAFAF7] hover:bg-white border-[#EBEBE6]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                          node.status === 'CRITICAL'
                            ? 'bg-red-600 text-white'
                            : node.status === 'WARNING'
                            ? 'bg-[#8F6B00] text-white'
                            : 'bg-[#1A1A18] text-white'
                        }`}
                      >
                        T{idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-[#1A1A18]">
                            {node.label}
                          </span>
                          <span className="text-[10px] font-mono text-[#888]">
                            ({node.tier})
                          </span>
                        </div>
                        <p className="text-[11px] text-[#666] mt-0.5">
                          {node.location}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`px-2.5 py-1 rounded text-xs font-mono font-bold border ${
                          node.status === 'CRITICAL'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : node.status === 'WARNING'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        RISK {node.riskScore}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-[#F0F0EB] text-xs text-[#777] flex items-center justify-between font-mono">
            <span>Root Causality: Common Cold Storage Chamber 3</span>
            <span className="text-[#8F6B00]">Algorithm: Bidirectional Graph Traversal</span>
          </div>
        </div>

        {/* Right Sidebar: Selected Node Telemetry */}
        <div className="lg:col-span-4 bg-[#FAFAF7] border border-[#EBEBE6] rounded-xl p-6 shadow-xs space-y-6">
          <div>
            <span className="text-[10px] font-mono text-[#777] uppercase tracking-wider block">
              Node Forensic Inspector
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#1A1A18] mt-0.5">
              {selectedNode.label}
            </h3>
            <p className="text-xs text-[#666] font-sans">
              Tier: {selectedNode.tier} • Location: {selectedNode.location}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#EBEBE6] space-y-2">
            <span className="text-[10px] font-mono text-[#8F6B00] uppercase font-semibold block">
              TELEMETRY & OPERATIONAL STATUS
            </span>
            <p className="text-xs text-[#333] leading-relaxed">
              {selectedNode.details}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#EBEBE6] space-y-2">
            <span className="text-[10px] font-mono text-[#1A1A18] uppercase font-semibold block">
              ATTACHED BATCHES
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedNode.batchIds.map((bId) => (
                <button
                  key={bId}
                  onClick={() => onNavigate('food-dna')}
                  className="font-mono text-xs bg-[#FDF9EE] hover:bg-[#F9F0D9] text-[#8F6B00] border border-[#EEDBB3] px-2.5 py-1 rounded transition-colors cursor-pointer"
                >
                  Batch #{bId} →
                </button>
              ))}
            </div>
          </div>

          {selectedNode.id === 'WH-17' && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-2">
              <span className="text-[10px] font-mono text-red-700 uppercase font-bold block">
                CRITICAL ACTION REQUIRED
              </span>
              <p className="text-xs text-red-800 leading-relaxed">
                Warehouse #17 Chamber 3 is the common bottleneck causing milk spoilage in South Delhi. Immediate quarantine recommended.
              </p>
              <button
                onClick={() => onNavigate('simulator')}
                className="w-full bg-red-700 hover:bg-red-800 text-white py-2 rounded text-xs font-semibold transition-colors mt-2 cursor-pointer"
              >
                Simulate Quarantine Policy →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
