import React, { useState, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type NodeTypes,
  MarkerType,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  Factory, Warehouse, Truck, Store, Search, AlertTriangle,
  Shield, ChevronRight, Clock, Package, X, CheckCircle,
  ArrowRight, MapPin, Activity, Eye, Play, Ban, FileCheck,
  ChevronDown, ChevronUp, Sparkles
} from 'lucide-react';
import {
  SUPPLY_LOCATIONS,
  SUPPLY_SHIPMENTS,
  SUPPLY_MANUFACTURER_DETAILS,
  SUPPLY_WAREHOUSE_DETAILS,
  SUPPLY_DISTRIBUTOR_DETAILS,
  SUPPLY_SHOP_DETAILS,
  SUPPLY_TRACEABILITY_LOG,
  getLocationById,
  traceBatchDownstream,
  getAffectedSummary,
  type SupplyLocation,
  type ShopDetails,
  type InspectionStatus,
} from '../../data/supplyChainData';

interface SupplyChainGraphViewProps {
  onNavigate: (view: string, param?: string) => void;
  onOpenCanonicalModal: () => void;
}

const DEMO_BATCH = 'MILK-2026-0920-001';

const NODE_ICONS: Record<string, React.ReactNode> = {
  MANUFACTURER: <Factory className="w-4 h-4" />,
  WAREHOUSE: <Warehouse className="w-4 h-4" />,
  DISTRIBUTOR: <Truck className="w-4 h-4" />,
  SHOP: <Store className="w-4 h-4" />,
};

const NODE_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  MANUFACTURER: { bg: 'bg-blue-900/30', border: 'border-blue-500/50', text: 'text-blue-400' },
  WAREHOUSE: { bg: 'bg-amber-900/30', border: 'border-amber-500/50', text: 'text-amber-400' },
  DISTRIBUTOR: { bg: 'bg-purple-900/30', border: 'border-purple-500/50', text: 'text-purple-400' },
  SHOP: { bg: 'bg-emerald-900/30', border: 'border-emerald-500/50', text: 'text-emerald-400' },
};

function CustomNode({ data }: { data: any }) {
  const loc = data.location as SupplyLocation;
  const isAffected = data.isAffected as boolean;
  const colors = NODE_COLORS[loc.type] || NODE_COLORS.SHOP;

  return (
    <div
      className={`relative px-3 py-2 rounded-xl border-2 transition-all cursor-pointer min-w-[140px] ${
        isAffected
          ? 'bg-red-900/40 border-red-500 shadow-lg shadow-red-500/20'
          : `${colors.bg} ${colors.border}`
      }`}
    >
      <Handle type="target" position={Position.Top} className="!bg-gray-500 !w-2 !h-2" />
      <div className="flex items-center gap-2">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
          isAffected ? 'bg-red-600 text-white' : `${colors.bg} ${colors.text}`
        }`}>
          {NODE_ICONS[loc.type]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-mono font-bold text-gray-300 truncate">{loc.name}</div>
          <div className="text-[9px] font-mono text-gray-500">{loc.city}</div>
        </div>
      </div>
      {isAffected && (
        <div className="absolute -top-2 -right-2 bg-red-600 text-white text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-full uppercase">
          AFFECTED
        </div>
      )}
      <Handle type="source" position={Position.Bottom} className="!bg-gray-500 !w-2 !h-2" />
    </div>
  );
}

const customNodeTypes: NodeTypes = { supplyNode: CustomNode };

function buildGraphLayout(locations: SupplyLocation[], shipments: any[], affectedIds: Set<string>) {
  const tiers: Record<string, number> = { MANUFACTURER: 0, WAREHOUSE: 1, DISTRIBUTOR: 2, SHOP: 3 };
  const tierGroups: Record<number, SupplyLocation[]> = { 0: [], 1: [], 2: [], 3: [] };
  for (const loc of locations) {
    const tier = tiers[loc.type] ?? 3;
    tierGroups[tier].push(loc);
  }
  const nodes: Node[] = [];
  const tierY = [50, 200, 380, 560];
  for (let tier = 0; tier <= 3; tier++) {
    const group = tierGroups[tier];
    const totalWidth = group.length * 200;
    const startX = (800 - totalWidth) / 2 + 100;
    group.forEach((loc, i) => {
      nodes.push({
        id: loc.locationId,
        type: 'supplyNode',
        position: { x: startX + i * 200, y: tierY[tier] },
        data: { location: loc, isAffected: affectedIds.has(loc.locationId) },
      });
    });
  }
  const edges: Edge[] = shipments.map((s) => ({
    id: s.shipmentId,
    source: s.fromLocationId,
    target: s.toLocationId,
    label: `${s.quantity} units`,
    animated: affectedIds.has(s.fromLocationId) && affectedIds.has(s.toLocationId),
    style: affectedIds.has(s.fromLocationId) && affectedIds.has(s.toLocationId)
      ? { stroke: '#ef4444', strokeWidth: 2 }
      : { stroke: '#4B5563', strokeWidth: 1 },
    labelStyle: { fill: '#9CA3AF', fontSize: 9, fontFamily: 'monospace' },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#6B7280', width: 12, height: 12 },
  }));
  return { nodes, edges };
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

const STATUS_BADGES: Record<string, string> = {
  PENDING: 'bg-gray-800 text-gray-400 border-gray-600',
  INSPECTION_REQUIRED: 'bg-red-900/30 text-red-400 border-red-500/50',
  UNDER_INSPECTION: 'bg-amber-900/30 text-amber-400 border-amber-500/50',
  CLEARED: 'bg-emerald-900/30 text-emerald-400 border-emerald-500/50',
  PRODUCT_SEIZED: 'bg-red-900/50 text-red-300 border-red-400',
};

export const SupplyChainGraphView: React.FC<SupplyChainGraphViewProps> = ({
  onNavigate,
  onOpenCanonicalModal,
}) => {
  const [batchInput, setBatchInput] = useState(DEMO_BATCH);
  const [tracedBatch, setTracedBatch] = useState<string | null>(null);
  const [affectedIds, setAffectedIds] = useState<Set<string>>(new Set());
  const [selectedLocation, setSelectedLocation] = useState<SupplyLocation | null>(null);
  const [shopDetails, setShopDetails] = useState<Record<string, ShopDetails>>({ ...SUPPLY_SHOP_DETAILS });
  const [inspectionShop, setInspectionShop] = useState<string | null>(null);
  const [inspectionStatus, setInspectionStatus] = useState<InspectionStatus>('INSPECTION_REQUIRED');
  const [showTraceLog, setShowTraceLog] = useState(false);

  const { nodes: initNodes, edges: initEdges } = useMemo(
    () => buildGraphLayout(SUPPLY_LOCATIONS, SUPPLY_SHIPMENTS, affectedIds),
    [affectedIds]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);

  React.useEffect(() => {
    const { nodes: n, edges: e } = buildGraphLayout(SUPPLY_LOCATIONS, SUPPLY_SHIPMENTS, affectedIds);
    setNodes(n);
    setEdges(e);
  }, [affectedIds, setNodes, setEdges]);

  const handleTraceBatch = useCallback(() => {
    const batchId = batchInput.trim();
    if (!batchId) return;
    const affected = traceBatchDownstream(batchId);
    setAffectedIds(affected);
    setTracedBatch(batchId);
    const updated = { ...SUPPLY_SHOP_DETAILS };
    for (const locId of affected) {
      if (updated[locId]) {
        updated[locId] = { ...updated[locId], inspectionStatus: 'INSPECTION_REQUIRED' };
      }
    }
    setShopDetails(updated);
  }, [batchInput]);

  const handleClearTrace = useCallback(() => {
    setAffectedIds(new Set());
    setTracedBatch(null);
    setSelectedLocation(null);
    setShopDetails({ ...SUPPLY_SHOP_DETAILS });
  }, []);

  const handleNodeClick = useCallback((_: any, node: Node) => {
    const loc = SUPPLY_LOCATIONS.find(l => l.locationId === node.id);
    if (loc) setSelectedLocation(loc);
  }, []);

  const handleShopInspection = useCallback((shopId: string, status: InspectionStatus) => {
    setShopDetails(prev => ({
      ...prev,
      [shopId]: { ...prev[shopId], inspectionStatus: status }
    }));
  }, []);

  const summary = tracedBatch ? getAffectedSummary(tracedBatch) : null;
  const affectedShopIds = useMemo(
    () => [...affectedIds].filter(id => id.startsWith('SHOP-')),
    [affectedIds]
  );

  const renderDetailPanel = () => {
    if (!selectedLocation) return null;
    const loc = selectedLocation;
    const colors = NODE_COLORS[loc.type];

    return (
      <div className="bg-[#18181C] border border-[#2A2A30] rounded-xl p-5 shadow-md shadow-black/20 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors.bg} ${colors.text}`}>
              {NODE_ICONS[loc.type]}
            </div>
            <div>
              <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider">{loc.type}</span>
              <h3 className="font-display font-bold text-sm text-gray-100">{loc.name}</h3>
            </div>
          </div>
          <button onClick={() => setSelectedLocation(null)} className="text-gray-500 hover:text-gray-300 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2 text-gray-400">
            <MapPin className="w-3 h-3" />
            <span>{loc.address}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Activity className="w-3 h-3" />
            <span>{loc.city}, {loc.state}</span>
          </div>
        </div>

        {loc.type === 'MANUFACTURER' && SUPPLY_MANUFACTURER_DETAILS[loc.locationId] && (() => {
          const d = SUPPLY_MANUFACTURER_DETAILS[loc.locationId];
          return (
            <div className="space-y-3">
              <div className="bg-blue-900/10 border border-blue-500/20 rounded-lg p-3 space-y-1.5">
                <span className="text-[9px] font-mono text-blue-400 font-bold uppercase">Production Details</span>
                <div className="text-[11px] text-gray-300">Product: {d.product}</div>
                <div className="text-[11px] text-gray-300">Produced: {new Date(d.productionDate).toLocaleDateString()}</div>
                <div className="text-[11px] text-gray-300">Lab Status: <span className="text-emerald-400 font-bold">{d.labStatus}</span></div>
              </div>
              <div className="text-[10px] font-mono text-gray-500">Batches: {d.batchIds.join(', ')}</div>
            </div>
          );
        })()}

        {loc.type === 'WAREHOUSE' && SUPPLY_WAREHOUSE_DETAILS[loc.locationId] && (() => {
          const d = SUPPLY_WAREHOUSE_DETAILS[loc.locationId];
          return (
            <div className="bg-amber-900/10 border border-amber-500/20 rounded-lg p-3 space-y-1.5">
              <span className="text-[9px] font-mono text-amber-400 font-bold uppercase">Warehouse Inventory</span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="text-gray-400">Received: <span className="text-gray-200">{d.quantityReceived.toLocaleString()} units</span></div>
                <div className="text-gray-400">Dispatched: <span className="text-gray-200">{d.quantityDispatched.toLocaleString()} units</span></div>
                <div className="text-gray-400">In Stock: <span className="text-amber-400 font-bold">{(d.quantityReceived - d.quantityDispatched).toLocaleString()}</span></div>
                <div className="text-gray-400">Batches: <span className="text-gray-200">{d.batchIds.length}</span></div>
              </div>
              <div className="text-[10px] text-gray-500">Received: {new Date(d.dateReceived).toLocaleString()}</div>
              <div className="text-[10px] text-gray-500">Dispatched: {new Date(d.dateDispatched).toLocaleString()}</div>
            </div>
          );
        })()}

        {loc.type === 'DISTRIBUTOR' && SUPPLY_DISTRIBUTOR_DETAILS[loc.locationId] && (() => {
          const d = SUPPLY_DISTRIBUTOR_DETAILS[loc.locationId];
          return (
            <div className="bg-purple-900/10 border border-purple-500/20 rounded-lg p-3 space-y-1.5">
              <span className="text-[9px] font-mono text-purple-400 font-bold uppercase">Distribution Details</span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="text-gray-400">Received: <span className="text-gray-200">{d.quantityReceived.toLocaleString()} units</span></div>
                <div className="text-gray-400">Distributed: <span className="text-gray-200">{d.quantityDistributed.toLocaleString()} units</span></div>
              </div>
              <div className="text-[10px] text-gray-500">Batches: {d.batchIdsHandled.join(', ')}</div>
            </div>
          );
        })()}

        {loc.type === 'SHOP' && shopDetails[loc.locationId] && (() => {
          const d = shopDetails[loc.locationId];
          const badge = STATUS_BADGES[d.inspectionStatus] || STATUS_BADGES.PENDING;
          return (
            <div className="space-y-3">
              <div className="bg-emerald-900/10 border border-emerald-500/20 rounded-lg p-3 space-y-1.5">
                <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase">Shop Inventory</span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="text-gray-400">Received: <span className="text-gray-200">{d.quantityReceived} units</span></div>
                  <div className="text-gray-400">In Stock: <span className="text-amber-400 font-bold">{d.quantityInStock}</span></div>
                  <div className="text-gray-400">Sold: <span className="text-gray-200">{d.quantitySold}</span></div>
                  <div className="text-gray-400">Batch: <span className="text-gray-200">{d.batchIdReceived}</span></div>
                </div>
                <div className="text-[10px] text-gray-500">Received: {new Date(d.dateReceived).toLocaleString()}</div>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${badge}`}>
                  {d.inspectionStatus.replace('_', ' ')}
                </span>
                <button
                  onClick={() => { setInspectionShop(loc.locationId); setInspectionStatus(d.inspectionStatus); }}
                  className="bg-amber-500 hover:bg-amber-400 text-white px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors"
                >
                  Start Inspection
                </button>
              </div>
            </div>
          );
        })()}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-[#18181C] border border-[#2A2A30] rounded-xl p-6 shadow-md shadow-black/20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-[#18181C] border border-[#2A2A30] text-[10px] font-mono font-medium text-[#8F6B00] mb-2">
              <span>TRACEABILITY ENGINE: /supply-chain</span>
              <span className="text-gray-600">|</span>
              <span className="text-gray-100">BATCH-LEVEL DOWNSTREAM TRACING</span>
            </div>
            <h1 className="font-display font-black text-3xl uppercase tracking-tight text-gray-100">
              Supply Chain Traceability
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 font-mono mt-1">
              Trace affected batches from manufacturer through warehouses, distributors to every shop.
            </p>
          </div>
          <button
            onClick={onOpenCanonicalModal}
            className="bg-amber-500 hover:bg-amber-400 text-white px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer shadow-lg shadow-black/30"
          >
            <Sparkles className="w-4 h-4" />
            <span>Walkthrough Traceability</span>
          </button>
        </div>
      </div>

      {/* Batch Trace Controls */}
      <div className="bg-[#18181C] border border-[#2A2A30] rounded-xl p-4 shadow-md shadow-black/20 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-[#0F0F12] border border-[#2A2A30] rounded-lg px-3 py-2 flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={batchInput}
            onChange={(e) => setBatchInput(e.target.value)}
            placeholder="Enter Batch ID (e.g. MILK-2026-0920-001)"
            className="bg-transparent text-sm font-mono text-gray-200 outline-none w-full placeholder:text-gray-600"
          />
        </div>
        <button
          onClick={handleTraceBatch}
          className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors shadow-md shadow-black/30"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Trace Affected Batch</span>
        </button>
        <button
          onClick={handleTraceBatch}
          className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Mark as Affected</span>
        </button>
        {tracedBatch && (
          <button
            onClick={handleClearTrace}
            className="bg-[#2A2A30] hover:bg-[#3A3A42] text-gray-300 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Affected Summary Cards */}
      {summary && tracedBatch && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Affected Warehouses', value: summary.affectedWarehouses, icon: <Warehouse className="w-4 h-4" />, color: 'text-amber-400 bg-amber-900/20 border-amber-500/30' },
            { label: 'Affected Distributors', value: summary.affectedDistributors, icon: <Truck className="w-4 h-4" />, color: 'text-purple-400 bg-purple-900/20 border-purple-500/30' },
            { label: 'Affected Shops', value: summary.affectedShops, icon: <Store className="w-4 h-4" />, color: 'text-red-400 bg-red-900/20 border-red-500/30' },
            { label: 'Potentially Affected Units', value: summary.totalUnits.toLocaleString(), icon: <Package className="w-4 h-4" />, color: 'text-red-300 bg-red-900/30 border-red-400/30' },
          ].map((card) => (
            <div key={card.label} className={`rounded-xl border p-4 ${card.color}`}>
              <div className="flex items-center gap-2 mb-1">{card.icon}<span className="text-[9px] font-mono uppercase tracking-wider font-bold">{card.label}</span></div>
              <div className="text-2xl font-display font-black">{card.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Main Layout: Graph + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Graph Area */}
        <div className="lg:col-span-8 bg-[#18181C] border border-[#2A2A30] rounded-xl shadow-md shadow-black/20 overflow-hidden">
          <div className="px-5 py-3 border-b border-[#2A2A30] flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-sm text-gray-100">Supply Chain Network Graph</h3>
              <p className="text-[10px] text-gray-500 font-mono">Click any node to inspect. Zoom and pan to explore.</p>
            </div>
            {tracedBatch && (
              <span className="text-[10px] font-mono font-bold text-red-400 bg-red-900/20 border border-red-800/40 px-2.5 py-1 rounded">
                TRACING: {tracedBatch}
              </span>
            )}
          </div>
          <div style={{ height: 520 }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={handleNodeClick}
              nodeTypes={customNodeTypes}
              fitView
              fitViewOptions={{ padding: 0.3 }}
              proOptions={{ hideAttribution: true }}
              className="bg-[#0A0A0F]"
            >
              <Background color="#1A1A24" gap={20} />
              <Controls className="!bg-[#18181C] !border-[#2A2A30] !rounded-lg" />
              <MiniMap
                nodeColor={(n: any) => {
                  if (n.data?.isAffected) return '#ef4444';
                  const t = n.data?.location?.type;
                  if (t === 'MANUFACTURER') return '#3B82F6';
                  if (t === 'WAREHOUSE') return '#F59E0B';
                  if (t === 'DISTRIBUTOR') return '#A855F7';
                  return '#10B981';
                }}
                maskColor="rgba(10,10,15,0.8)"
                className="!bg-[#0F0F12] !border-[#2A2A30] !rounded-lg"
              />
            </ReactFlow>
          </div>
          <div className="px-5 py-2 border-t border-[#2A2A30] flex items-center justify-between text-[10px] font-mono text-gray-500">
            <span>{SUPPLY_LOCATIONS.length} nodes | {SUPPLY_SHIPMENTS.length} shipments</span>
            <span className="text-[#8F6B00]">Algorithm: Batch-Level Downstream Trace</span>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          {selectedLocation ? renderDetailPanel() : (
            <div className="bg-[#18181C] border border-[#2A2A30] rounded-xl p-5 shadow-md shadow-black/20 text-center">
              <Eye className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p className="text-xs text-gray-500 font-mono">Click a node in the graph to inspect its details</p>
            </div>
          )}

          {/* Affected Shops List */}
          {affectedShopIds.length > 0 && (
            <div className="bg-[#18181C] border border-red-500/30 rounded-xl p-4 shadow-md shadow-black/20 space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-wider">
                  {affectedShopIds.length} shops require inspection
                </span>
              </div>
              <div className="space-y-2 max-h-[240px] overflow-y-auto">
                {affectedShopIds.map(shopId => {
                  const loc = getLocationById(shopId);
                  const detail = shopDetails[shopId];
                  if (!loc || !detail) return null;
                  const badge = STATUS_BADGES[detail.inspectionStatus] || STATUS_BADGES.PENDING;
                  return (
                    <div key={shopId} className="bg-[#0F0F12] border border-[#2A2A30] rounded-lg p-2.5 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-[10px] font-mono font-bold text-gray-300 truncate">{loc.name}</div>
                        <div className="text-[9px] text-gray-500">{loc.city} | {detail.quantityInStock} in stock</div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border ${badge}`}>
                          {detail.inspectionStatus.replace('_', ' ')}
                        </span>
                        <button
                          onClick={() => { setSelectedLocation(loc); setInspectionShop(shopId); setInspectionStatus(detail.inspectionStatus); }}
                          className="bg-amber-500 hover:bg-amber-400 text-white px-2 py-1 rounded text-[8px] font-bold cursor-pointer"
                        >
                          INSPECT
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Inspection Modal */}
      {inspectionShop && shopDetails[inspectionShop] && (() => {
        const loc = getLocationById(inspectionShop);
        const detail = shopDetails[inspectionShop];
        if (!loc) return null;
        return (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setInspectionShop(null)}>
            <div className="bg-[#18181C] border border-[#2A2A30] rounded-xl p-6 max-w-lg w-full shadow-2xl space-y-5" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-900/30 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-gray-100">Inspection Panel</h3>
                    <p className="text-[10px] text-gray-500 font-mono">{loc.name}</p>
                  </div>
                </div>
                <button onClick={() => setInspectionShop(null)} className="text-gray-500 hover:text-gray-300 cursor-pointer"><X className="w-5 h-5" /></button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                {[
                  { label: 'Shop ID', value: detail.shopId },
                  { label: 'Location', value: `${loc.city}, ${loc.state}` },
                  { label: 'Batch ID', value: detail.batchIdReceived },
                  { label: 'Received', value: new Date(detail.dateReceived).toLocaleDateString() },
                  { label: 'Qty Received', value: `${detail.quantityReceived} units` },
                  { label: 'Qty In Stock', value: `${detail.quantityInStock} units` },
                  { label: 'Qty Sold', value: `${detail.quantitySold} units` },
                  { label: 'Address', value: loc.address },
                ].map(item => (
                  <div key={item.label} className="bg-[#0F0F12] border border-[#2A2A30] rounded-lg p-2.5">
                    <span className="text-[9px] font-mono text-gray-500 uppercase">{item.label}</span>
                    <div className="text-[11px] text-gray-200 font-mono mt-0.5">{item.value}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider font-bold">Inspection Status</span>
                <div className="flex flex-wrap gap-1.5">
                  {(['PENDING', 'INSPECTION_REQUIRED', 'UNDER_INSPECTION', 'CLEARED', 'PRODUCT_SEIZED'] as InspectionStatus[]).map(s => (
                    <button
                      key={s}
                      onClick={() => setInspectionStatus(s)}
                      className={`text-[9px] font-mono font-bold px-2.5 py-1.5 rounded border cursor-pointer transition-all ${
                        inspectionStatus === s
                          ? STATUS_BADGES[s] + ' ring-1 ring-white/20'
                          : 'bg-[#0F0F12] text-gray-500 border-[#2A2A30] hover:border-gray-500'
                      }`}
                    >
                      {s.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => { handleShopInspection(inspectionShop, inspectionStatus); setInspectionShop(null); }}
                className="w-full bg-amber-500 hover:bg-amber-400 text-white py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors"
              >
                Update Status
              </button>
            </div>
          </div>
        );
      })()}

      {/* Traceability History */}
      <div className="bg-[#18181C] border border-[#2A2A30] rounded-xl shadow-md shadow-black/20 overflow-hidden">
        <button
          onClick={() => setShowTraceLog(!showTraceLog)}
          className="w-full px-5 py-3 flex items-center justify-between text-left cursor-pointer hover:bg-[#1A1A24] transition-colors"
        >
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#8F6B00]" />
            <span className="text-xs font-display font-bold text-gray-100 uppercase tracking-wider">Traceability History</span>
            <span className="text-[10px] font-mono text-gray-500">({SUPPLY_TRACEABILITY_LOG.length} entries)</span>
          </div>
          {showTraceLog ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </button>
        {showTraceLog && (
          <div className="border-t border-[#2A2A30]">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-[9px] font-mono text-gray-500 uppercase tracking-wider border-b border-[#2A2A30]">
                    <th className="px-4 py-2 text-left">Time</th>
                    <th className="px-4 py-2 text-left">Batch ID</th>
                    <th className="px-4 py-2 text-left">From</th>
                    <th className="px-4 py-2 text-left">To</th>
                    <th className="px-4 py-2 text-right">Qty</th>
                    <th className="px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {SUPPLY_TRACEABILITY_LOG.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()).map((entry, i) => (
                    <tr key={i} className="border-b border-[#2A2A30]/50 hover:bg-[#0F0F12] transition-colors">
                      <td className="px-4 py-2 font-mono text-gray-400">{formatTime(entry.timestamp)}</td>
                      <td className="px-4 py-2 font-mono text-amber-400">{entry.batchId}</td>
                      <td className="px-4 py-2 text-gray-300">{entry.from}</td>
                      <td className="px-4 py-2 text-gray-300">{entry.to}</td>
                      <td className="px-4 py-2 text-right font-mono text-gray-400">{entry.quantity.toLocaleString()}</td>
                      <td className="px-4 py-2"><span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-900/20 border border-emerald-500/30 px-2 py-0.5 rounded">{entry.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
