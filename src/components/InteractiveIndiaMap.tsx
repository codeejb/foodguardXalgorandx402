import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Activity,
  Layers,
  Thermometer,
  ShieldAlert,
  Truck,
  Building2,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Info,
  Radio,
  Wifi,
  Compass,
  AlertOctagon,
  Eye,
  CheckCircle2,
  Navigation,
  Globe
} from 'lucide-react';
import { StateRiskData } from '../types';

interface InteractiveIndiaMapProps {
  states: StateRiskData[];
  selectedState: StateRiskData | null;
  onSelectState: (state: StateRiskData) => void;
}

// Live GPS Tanker Fleet on Indian Highways
interface LiveTanker {
  id: string;
  vehicleNo: string;
  driver: string;
  origin: string;
  destination: string;
  highway: string;
  lat: number;
  lng: number;
  temp: number;
  speedKmH: number;
  status: 'NORMAL' | 'WARNING' | 'CRITICAL';
  batchId: string;
  cargo: string;
}

// Live IoT Cold Storage Nodes
interface ColdStorageFacility {
  id: string;
  name: string;
  city: string;
  stateCode: string;
  lat: number;
  lng: number;
  temp: number;
  humidity: number;
  powerStatus: 'GRID' | 'BACKUP_GENSET' | 'OFFLINE';
  riskScore: number;
  batchCount: number;
  criticalAnomaly?: string;
}

// Real coordinates across India
const INDIA_CITIES_COORDS: Record<string, { lat: number; lng: number; name: string; stateCode: string; riskScore: number; riskLevel: string; activeIncidents: number }> = {
  DL: { lat: 28.6139, lng: 77.2090, name: 'Delhi NCR (Okhla / Anand Vihar)', stateCode: 'DL', riskScore: 94, riskLevel: 'CRITICAL', activeIncidents: 23 },
  PB: { lat: 30.7333, lng: 76.7794, name: 'Punjab & Haryana (Ambala Dairy Belt)', stateCode: 'PB', riskScore: 72, riskLevel: 'HIGH', activeIncidents: 8 },
  RJ: { lat: 26.9124, lng: 75.7873, name: 'Rajasthan (Jaipur / Alwar Dairy)', stateCode: 'RJ', riskScore: 58, riskLevel: 'WATCH', activeIncidents: 5 },
  UP: { lat: 26.8467, lng: 80.9462, name: 'Uttar Pradesh (Lucknow / Noida Depot)', stateCode: 'UP', riskScore: 78, riskLevel: 'HIGH', activeIncidents: 14 },
  GJ: { lat: 22.5645, lng: 72.9289, name: 'Gujarat (Anand - Amul Central Federation)', stateCode: 'GJ', riskScore: 28, riskLevel: 'LOW', activeIncidents: 2 },
  MH: { lat: 19.0760, lng: 72.8777, name: 'Maharashtra (Mumbai / Pune Supply Hub)', stateCode: 'MH', riskScore: 68, riskLevel: 'HIGH', activeIncidents: 11 },
  MP: { lat: 23.2599, lng: 77.4126, name: 'Madhya Pradesh (Bhopal / Indore Freight)', stateCode: 'MP', riskScore: 42, riskLevel: 'WATCH', activeIncidents: 4 },
  KA: { lat: 12.9716, lng: 77.5946, name: 'Karnataka (Bengaluru / Hosur Agro Cold)', stateCode: 'KA', riskScore: 34, riskLevel: 'LOW', activeIncidents: 3 },
  TN: { lat: 13.0827, lng: 80.2707, name: 'Tamil Nadu (Chennai / Aavin Logistics)', stateCode: 'TN', riskScore: 31, riskLevel: 'LOW', activeIncidents: 2 },
  WB: { lat: 22.5726, lng: 88.3639, name: 'West Bengal (Kolkata Mother Dairy Hub)', stateCode: 'WB', riskScore: 52, riskLevel: 'WATCH', activeIncidents: 6 },
  TG: { lat: 17.3850, lng: 78.4867, name: 'Telangana (Hyderabad Vijaya Dairy)', stateCode: 'TG', riskScore: 36, riskLevel: 'LOW', activeIncidents: 3 },
  KL: { lat: 9.9312, lng: 76.2673, name: 'Kerala (Kochi / Milma Cold Link)', stateCode: 'KL', riskScore: 22, riskLevel: 'LOW', activeIncidents: 1 }
};

const INITIAL_FACILITIES: ColdStorageFacility[] = [
  {
    id: 'FAC-01',
    name: 'Okhla Cold Storage Depot #17',
    city: 'New Delhi',
    stateCode: 'DL',
    lat: 28.5355,
    lng: 77.2732,
    temp: 14.8,
    humidity: 91,
    powerStatus: 'BACKUP_GENSET',
    riskScore: 94,
    batchCount: 14,
    criticalAnomaly: 'Compressor Excursion for 4.2h (+10.8°C above 4.0°C norm)'
  },
  {
    id: 'FAC-02',
    name: 'Anand Mega Dairy Chilling Center',
    city: 'Anand, Gujarat',
    stateCode: 'GJ',
    lat: 22.5645,
    lng: 72.9289,
    temp: 3.2,
    humidity: 78,
    powerStatus: 'GRID',
    riskScore: 18,
    batchCount: 85
  },
  {
    id: 'FAC-03',
    name: 'Ambala Bulk Milk Reception Depot',
    city: 'Ambala, Haryana',
    stateCode: 'PB',
    lat: 30.3782,
    lng: 76.7767,
    temp: 7.9,
    humidity: 84,
    powerStatus: 'GRID',
    riskScore: 72,
    batchCount: 22,
    criticalAnomaly: 'Secondary Chiller Overload (7.9°C)'
  },
  {
    id: 'FAC-04',
    name: 'Bhiwandi Central Logistics Warehouse',
    city: 'Thane / Mumbai, MH',
    stateCode: 'MH',
    lat: 19.2967,
    lng: 73.0631,
    temp: 4.8,
    humidity: 80,
    powerStatus: 'GRID',
    riskScore: 68,
    batchCount: 42
  },
  {
    id: 'FAC-05',
    name: 'Whitefield Perishable Freight Terminal',
    city: 'Bengaluru, KA',
    stateCode: 'KA',
    lat: 12.9698,
    lng: 77.7500,
    temp: 3.6,
    humidity: 75,
    powerStatus: 'GRID',
    riskScore: 24,
    batchCount: 30
  }
];

const INITIAL_TANKERS: LiveTanker[] = [
  {
    id: 'TNK-492',
    vehicleNo: 'DL-01-AK-4921',
    driver: 'Rajesh Sharma (ID: DRV-882)',
    origin: 'Ambala Milk Plant',
    destination: 'Okhla Central Dairy, Delhi',
    highway: 'NH-44 (GT Karnal Road)',
    lat: 28.8955,
    lng: 77.1025,
    temp: 14.8,
    speedKmH: 52,
    status: 'CRITICAL',
    batchId: 'M492',
    cargo: '18,000 Liters Toned Milk'
  },
  {
    id: 'TNK-104',
    vehicleNo: 'GJ-04-BT-8920',
    driver: 'Mahesh Patel (ID: DRV-412)',
    origin: 'Anand Processing Unit',
    destination: 'Bhiwandi Cold Hub, Mumbai',
    highway: 'NH-48 Western Freight Line',
    lat: 20.8500,
    lng: 72.9500,
    temp: 3.8,
    speedKmH: 64,
    status: 'NORMAL',
    batchId: 'B104',
    cargo: '24,000 Liters Pasteurized Milk'
  },
  {
    id: 'TNK-772',
    vehicleNo: 'RJ-14-GH-3310',
    driver: 'Vikram Singh (ID: DRV-195)',
    origin: 'Alwar Chilling Station',
    destination: 'South Delhi Distribution Center',
    highway: 'Delhi-Jaipur Expressway',
    lat: 27.8500,
    lng: 76.5500,
    temp: 6.2,
    speedKmH: 58,
    status: 'WARNING',
    batchId: 'RJ-772',
    cargo: '12,000 Liters Raw Milk'
  },
  {
    id: 'TNK-901',
    vehicleNo: 'KA-01-MJ-9912',
    driver: 'Suresh Gowda (ID: DRV-632)',
    origin: 'Kolar Dairy Cooperative',
    destination: 'Electronic City Bengaluru',
    highway: 'NH-75 Hosur Highway',
    lat: 13.0100,
    lng: 77.8900,
    temp: 3.5,
    speedKmH: 45,
    status: 'NORMAL',
    batchId: 'KA-901',
    cargo: '15,000 Liters Standardized Milk'
  }
];

export const InteractiveIndiaMap: React.FC<InteractiveIndiaMapProps> = ({
  states,
  selectedState,
  onSelectState
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const [mapMode, setMapMode] = useState<'LEAFLET_LIVE' | 'DIGITAL_TWIN'>('LEAFLET_LIVE');
  const [mapStyle, setMapStyle] = useState<'VOYAGER' | 'SATELLITE' | 'DARK'>('VOYAGER');
  const [activeLayer, setActiveLayer] = useState<'ALL' | 'THERMAL' | 'FLEET' | 'FACILITIES'>('ALL');
  const [tankers, setTankers] = useState<LiveTanker[]>(INITIAL_TANKERS);
  const [selectedEntity, setSelectedEntity] = useState<{
    type: 'STATE' | 'TANKER' | 'FACILITY';
    data: any;
  } | null>(null);
  const [liveRound, setLiveRound] = useState(42918894);
  const [gpsLockedCount, setGpsLockedCount] = useState(84);

  // Live GPS Simulation Drift Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveRound((r) => r + 1);
      setTankers((prev) =>
        prev.map((t) => {
          // slight coordinate drift towards destination
          const latDrift = (Math.random() - 0.48) * 0.003;
          const lngDrift = (Math.random() - 0.48) * 0.003;
          const speedDrift = Math.floor((Math.random() - 0.5) * 4);
          return {
            ...t,
            lat: Number((t.lat + latDrift).toFixed(5)),
            lng: Number((t.lng + lngDrift).toFixed(5)),
            speedKmH: Math.max(35, Math.min(75, t.speedKmH + speedDrift))
          };
        })
      );
    }, 2800);

    return () => clearInterval(timer);
  }, []);

  // Initialize & update Leaflet Map
  useEffect(() => {
    if (mapMode !== 'LEAFLET_LIVE' || !mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Create Leaflet instance centered over India
      const map = L.map(mapContainerRef.current, {
        center: [22.8, 79.5],
        zoom: 5,
        minZoom: 4,
        maxZoom: 14,
        zoomControl: false,
        attributionControl: false
      });

      // Add Tile Layer
      const tileUrl =
        mapStyle === 'SATELLITE'
          ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          : mapStyle === 'DARK'
          ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
          : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

      L.tileLayer(tileUrl, { maxZoom: 18 }).addTo(map);

      // Add Custom Zoom Control in bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerGroupRef.current = markersGroup;
      mapInstanceRef.current = map;
    } else {
      // Update tile layer if style changed
      mapInstanceRef.current.eachLayer((layer) => {
        if (layer instanceof L.TileLayer) {
          mapInstanceRef.current?.removeLayer(layer);
        }
      });

      const tileUrl =
        mapStyle === 'SATELLITE'
          ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          : mapStyle === 'DARK'
          ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
          : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

      L.tileLayer(tileUrl, { maxZoom: 18 }).addTo(mapInstanceRef.current);
    }

    return () => {
      // Do not destroy on every re-render; we manage layers manually
    };
  }, [mapMode, mapStyle]);

  // Re-render Leaflet Markers when layer, tankers, or states change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerGroupRef.current) return;
    const markersGroup = markersLayerGroupRef.current;
    markersGroup.clearLayers();

    // 1. Draw Highway Corridor Polylines
    if (activeLayer === 'ALL' || activeLayer === 'FLEET') {
      const highwayLines = [
        // NH-44 Ambala to Delhi
        { coords: [[30.3782, 76.7767], [29.9695, 76.8783], [28.9931, 77.0151], [28.6139, 77.2090]], color: '#DC2626', name: 'NH-44 Milk Corridor' },
        // NH-48 Anand to Mumbai
        { coords: [[22.5645, 72.9289], [21.1702, 72.8311], [20.8500, 72.9500], [19.2967, 73.0631], [19.0760, 72.8777]], color: '#854D0E', name: 'NH-48 Western Dairy Highway' },
        // Delhi to Jaipur
        { coords: [[28.6139, 77.2090], [27.8500, 76.5500], [26.9124, 75.7873]], color: '#D97706', name: 'Delhi-Jaipur Freight Line' },
        // Bengaluru to Hosur
        { coords: [[12.9716, 77.5946], [12.9698, 77.7500], [12.7409, 77.8253]], color: '#059669', name: 'Bengaluru-Hosur Agro Line' }
      ];

      highwayLines.forEach((h) => {
        L.polyline(h.coords as [number, number][], {
          color: h.color,
          weight: 4,
          opacity: 0.85,
          dashArray: h.color === '#DC2626' ? '6,6' : undefined
        }).bindTooltip(h.name, { sticky: true, className: 'leaflet-custom-tooltip' }).addTo(markersGroup);
      });

      // 2. Active Excursion Geofence Circle around Okhla Depot (Delhi)
      L.circle([28.5355, 77.2732], {
        color: '#DC2626',
        fillColor: '#FEE2E2',
        fillOpacity: 0.4,
        radius: 14000,
        weight: 2,
        dashArray: '4,4'
      }).bindTooltip('⚠️ ACTIVE GEOFENCE: Okhla 14.8°C Contamination Risk Zone', { permanent: true, direction: 'top', className: 'geofence-tooltip' }).addTo(markersGroup);
    }

    // 3. Render State Regional Telemetry Markers
    if (activeLayer === 'ALL' || activeLayer === 'THERMAL') {
      Object.entries(INDIA_CITIES_COORDS).forEach(([code, node]) => {
        const stateData = states.find((s) => s.stateCode === code);
        const riskLevel = stateData?.riskLevel || node.riskLevel;
        const riskScore = stateData?.riskScore || node.riskScore;

        const isCritical = riskLevel === 'CRITICAL';
        const isHigh = riskLevel === 'HIGH';
        const color = isCritical ? '#DC2626' : isHigh ? '#EA580C' : riskLevel === 'WATCH' ? '#D97706' : '#059669';

        const customHtml = `
          <div class="relative cursor-pointer group select-none">
            ${isCritical ? `<div class="absolute -inset-2.5 rounded-full bg-red-500 opacity-75 animate-ping"></div>` : ''}
            <div class="relative flex items-center gap-1.5 bg-white border-2 px-2 py-1 rounded-md shadow-md" style="border-color: ${color};">
              <span class="w-2.5 h-2.5 rounded-full" style="background-color: ${color};"></span>
              <div class="font-mono text-[10px] font-black leading-tight text-neutral-900">
                <span>${code}</span>
                <span style="color: ${color};"> ${riskScore}</span>
              </div>
            </div>
          </div>
        `;

        const icon = L.divIcon({
          className: 'custom-state-pin',
          html: customHtml,
          iconSize: [60, 24],
          iconAnchor: [30, 12]
        });

        const marker = L.marker([node.lat, node.lng], { icon }).addTo(markersGroup);
        marker.on('click', () => {
          if (stateData) {
            onSelectState(stateData);
            setSelectedEntity({ type: 'STATE', data: stateData });
          }
        });
      });
    }

    // 4. Render Live Cold Storage Warehouses
    if (activeLayer === 'ALL' || activeLayer === 'FACILITIES') {
      INITIAL_FACILITIES.forEach((fac) => {
        const isExcursion = fac.temp > 4.5;
        const color = isExcursion ? '#DC2626' : '#059669';

        const customHtml = `
          <div class="relative cursor-pointer select-none">
            ${isExcursion ? `<div class="absolute -inset-2 rounded-full bg-red-500 opacity-60 animate-ping"></div>` : ''}
            <div class="w-8 h-8 rounded-lg bg-neutral-900 border-2 text-white flex items-center justify-center shadow-lg" style="border-color: ${color};">
              <span class="text-[10px] font-mono font-bold">${fac.temp}°</span>
            </div>
          </div>
        `;

        const icon = L.divIcon({
          className: 'custom-facility-pin',
          html: customHtml,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const marker = L.marker([fac.lat, fac.lng], { icon }).addTo(markersGroup);
        marker.on('click', () => {
          setSelectedEntity({ type: 'FACILITY', data: fac });
        });
      });
    }

    // 5. Render Live Tanker Fleet with Dynamic GPS updates
    if (activeLayer === 'ALL' || activeLayer === 'FLEET') {
      tankers.forEach((tanker) => {
        const isCritical = tanker.status === 'CRITICAL';
        const color = isCritical ? '#DC2626' : tanker.status === 'WARNING' ? '#D97706' : '#059669';

        const customHtml = `
          <div class="relative cursor-pointer select-none transform transition-transform hover:scale-110">
            ${isCritical ? `<div class="absolute -inset-3 rounded-full bg-red-600 opacity-80 animate-ping"></div>` : ''}
            <div class="px-2 py-1 bg-neutral-900 border-2 rounded-full text-white flex items-center gap-1.5 shadow-xl font-mono text-[9px] font-bold whitespace-nowrap" style="border-color: ${color};">
              <span class="w-2 h-2 rounded-full ${isCritical ? 'bg-red-500 animate-pulse' : 'bg-emerald-400'}"></span>
              <span>🚛 ${tanker.vehicleNo}</span>
              <span class="px-1 py-0.2 rounded font-black ${isCritical ? 'bg-red-600 text-white' : 'bg-neutral-800 text-neutral-300'}">${tanker.temp}°C</span>
            </div>
          </div>
        `;

        const icon = L.divIcon({
          className: 'custom-tanker-pin',
          html: customHtml,
          iconSize: [110, 24],
          iconAnchor: [55, 12]
        });

        const marker = L.marker([tanker.lat, tanker.lng], { icon }).addTo(markersGroup);
        marker.on('click', () => {
          setSelectedEntity({ type: 'TANKER', data: tanker });
        });
      });
    }
  }, [activeLayer, tankers, states, mapMode]);

  const handleQuickZoom = (lat: number, lng: number, zoom = 8) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], zoom, { duration: 1.2 });
    }
  };

  const handleResetMap = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([22.8, 79.5], 5, { duration: 1.2 });
    }
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-amber-300 shadow-xl overflow-hidden flex flex-col text-neutral-900">
      {/* Top Map HUD & Controls Bar with Dark Yellow Accents */}
      <div className="bg-[#FAF8F2] border-b border-amber-200/90 p-4 flex flex-wrap items-center justify-between gap-3">
        {/* Title & Live Status Indicator */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#854D0E] text-white flex items-center justify-center font-bold shadow-xs">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-sm uppercase tracking-wider text-neutral-900">
                Live National GPS Telemetry Map (India)
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold border border-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                LIVE STREAM
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 font-mono">
              Real-Time IoT Sensors, Milk Tanker Fleet GPS & Cold-Chain Highways
            </p>
          </div>
        </div>

        {/* Quick Regional Hotspots Jump Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          <span className="text-[10px] font-mono uppercase text-neutral-500 font-bold mr-1">
            Focus:
          </span>
          {[
            { label: 'All India', lat: 22.8, lng: 79.5, zoom: 5 },
            { label: 'Delhi NCR (Alert)', lat: 28.6139, lng: 77.2090, zoom: 9, critical: true },
            { label: 'Gujarat Hub', lat: 22.5645, lng: 72.9289, zoom: 8 },
            { label: 'Mumbai Belt', lat: 19.15, lng: 72.95, zoom: 8 },
            { label: 'Punjab NH-44', lat: 30.5, lng: 76.8, zoom: 8 }
          ].map((btn, bIdx) => (
            <button
              key={bIdx}
              onClick={() => handleQuickZoom(btn.lat, btn.lng, btn.zoom)}
              className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                btn.critical
                  ? 'bg-red-100 hover:bg-red-200 text-red-800 border border-red-300 animate-pulse'
                  : 'bg-white hover:bg-[#FEF3C7] text-neutral-800 border border-neutral-300'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Map View Mode & Layers Filter */}
        <div className="flex items-center gap-2">
          {/* Layer Switcher */}
          <div className="flex items-center bg-white border border-neutral-300 rounded-lg p-0.5 text-xs font-mono">
            {[
              { id: 'ALL', label: 'All Feeds' },
              { id: 'FLEET', label: '🚛 Live Fleet' },
              { id: 'THERMAL', label: '🌡️ Hotspots' },
              { id: 'FACILITIES', label: '🏭 Depots' }
            ].map((layer) => (
              <button
                key={layer.id}
                onClick={() => setActiveLayer(layer.id as any)}
                className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                  activeLayer === layer.id
                    ? 'bg-[#854D0E] text-white shadow-xs'
                    : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                {layer.label}
              </button>
            ))}
          </div>

          {/* Satellite / Street Style Toggle */}
          <div className="flex items-center bg-white border border-neutral-300 rounded-lg p-0.5 text-xs font-mono">
            <button
              onClick={() => setMapStyle('VOYAGER')}
              className={`px-2 py-1 rounded text-[10px] font-bold uppercase cursor-pointer ${
                mapStyle === 'VOYAGER' ? 'bg-[#854D0E] text-white' : 'text-neutral-600'
              }`}
            >
              Street
            </button>
            <button
              onClick={() => setMapStyle('SATELLITE')}
              className={`px-2 py-1 rounded text-[10px] font-bold uppercase cursor-pointer ${
                mapStyle === 'SATELLITE' ? 'bg-[#854D0E] text-white' : 'text-neutral-600'
              }`}
            >
              Satellite
            </button>
          </div>

          {/* Reset Zoom */}
          <button
            onClick={handleResetMap}
            className="p-1.5 bg-white border border-neutral-300 hover:bg-neutral-100 rounded-lg text-neutral-600 cursor-pointer shadow-2xs"
            title="Reset Map to All India"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Map Canvas Area with Leaflet & Real-Time Live Overlay HUD */}
      <div className="relative w-full h-[520px] bg-[#E5E3DF] overflow-hidden">
        {/* Leaflet Map Canvas Container */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Top-Right Floating Live Telemetry HUD */}
        <div className="absolute top-4 right-4 z-10 bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-amber-300 shadow-lg space-y-2 max-w-xs font-mono text-xs">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-1.5">
            <span className="font-bold text-[#854D0E] uppercase text-[10px] flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5 text-emerald-600" />
              <span>Telemetry Node Feed</span>
            </span>
            <span className="text-[9px] text-neutral-500 font-bold">Round #{liveRound}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="bg-[#FAF8F2] p-1.5 rounded border border-neutral-200">
              <span className="text-neutral-500 block font-bold">Active GPS Tankers</span>
              <span className="text-neutral-900 font-black text-xs">84 Vehicles</span>
            </div>
            <div className="bg-[#FAF8F2] p-1.5 rounded border border-neutral-200">
              <span className="text-neutral-500 block font-bold">Cold Storage IoT</span>
              <span className="text-neutral-900 font-black text-xs">1,480 Nodes</span>
            </div>
          </div>

          <div className="p-2 rounded bg-red-50 border border-red-200 space-y-0.5">
            <span className="font-bold text-red-700 text-[10px] flex items-center gap-1">
              <AlertOctagon className="w-3 h-3 text-red-600" />
              <span>CRITICAL ALERT: TANKER #DL-01-AK-4921</span>
            </span>
            <p className="text-[9px] text-red-900">
              Temp spike at 14.8°C approaching Okhla Depot. Immediate quarantine dispatched.
            </p>
          </div>
        </div>

        {/* Real Field Inspection Handwritten Stamp (Top Left) */}
        <div className="absolute top-4 left-4 z-10 bg-[#FEF3C7]/95 backdrop-blur-md border border-[#FDE68A] p-3 rounded-lg max-w-[240px] shadow-md hidden sm:block rotate-[-1deg]">
          <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-[#78350F] uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-[#854D0E]" />
            <span>FSSAI LIVE SURVEILLANCE NOTE</span>
          </div>
          <p className="handwriting-note text-xs mt-1 text-[#854D0E]">
            "NH-44 & Delhi Okhla sector 17 under 24x7 satellite and IoT watch. Live sub-second GPS tracking active."
          </p>
        </div>

        {/* Selected Entity Popup Drawer (Bottom Left) */}
        {selectedEntity && (
          <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-md p-4 rounded-xl border-2 border-amber-300 shadow-2xl max-w-sm animate-in fade-in zoom-in-95 duration-150">
            {selectedEntity.type === 'TANKER' && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#854D0E]" />
                    <span className="font-display font-black text-xs uppercase tracking-tight text-neutral-900">
                      {selectedEntity.data.vehicleNo}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                    selectedEntity.data.status === 'CRITICAL' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {selectedEntity.data.temp}°C • {selectedEntity.data.status}
                  </span>
                </div>

                <div className="space-y-1 text-[11px] font-mono text-neutral-700">
                  <div><strong>Route:</strong> {selectedEntity.data.origin} → {selectedEntity.data.destination}</div>
                  <div><strong>Highway:</strong> {selectedEntity.data.highway}</div>
                  <div><strong>Driver:</strong> {selectedEntity.data.driver}</div>
                  <div><strong>Speed:</strong> {selectedEntity.data.speedKmH} km/h • <strong>Batch:</strong> #{selectedEntity.data.batchId}</div>
                  <div><strong>Cargo:</strong> {selectedEntity.data.cargo}</div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => setSelectedEntity(null)}
                    className="flex-1 bg-[#854D0E] hover:bg-[#A16207] text-white py-1.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono cursor-pointer"
                  >
                    Lock GPS Track
                  </button>
                  <button
                    onClick={() => setSelectedEntity(null)}
                    className="px-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 py-1.5 rounded text-[10px] font-mono uppercase cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {selectedEntity.type === 'FACILITY' && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#854D0E]" />
                    <span className="font-display font-black text-xs uppercase tracking-tight text-neutral-900">
                      {selectedEntity.data.name}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                    selectedEntity.data.temp > 4.5 ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    TEMP: {selectedEntity.data.temp}°C
                  </span>
                </div>

                <div className="space-y-1 text-[11px] font-mono text-neutral-700">
                  <div><strong>Location:</strong> {selectedEntity.data.city}</div>
                  <div><strong>Storage Batches:</strong> {selectedEntity.data.batchCount} Lots</div>
                  <div><strong>Power Source:</strong> {selectedEntity.data.powerStatus}</div>
                  {selectedEntity.data.criticalAnomaly && (
                    <div className="text-red-700 font-bold bg-red-50 p-1.5 rounded border border-red-200">
                      ⚠️ {selectedEntity.data.criticalAnomaly}
                    </div>
                  )}
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => setSelectedEntity(null)}
                    className="flex-1 bg-[#854D0E] hover:bg-[#A16207] text-white py-1.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono cursor-pointer"
                  >
                    Dispatch Field Inspector
                  </button>
                  <button
                    onClick={() => setSelectedEntity(null)}
                    className="px-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 py-1.5 rounded text-[10px] font-mono uppercase cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {selectedEntity.type === 'STATE' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-1.5">
                  <span className="font-display font-black text-xs uppercase tracking-tight text-neutral-900">
                    {selectedEntity.data.stateName}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-black bg-red-100 text-red-800 border border-red-200">
                    SCORE {selectedEntity.data.riskScore}
                  </span>
                </div>
                <p className="text-[10px] font-mono text-neutral-600 line-clamp-3">
                  {selectedEntity.data.aiExplanation}
                </p>
                <div className="pt-1 flex justify-between items-center text-[10px] font-mono">
                  <span className="text-neutral-500">{selectedEntity.data.activeIncidents} Active Cases</span>
                  <button
                    onClick={() => setSelectedEntity(null)}
                    className="text-[#854D0E] font-bold uppercase hover:underline cursor-pointer"
                  >
                    Close ✕
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Map Legend Footer Bar */}
      <div className="bg-[#FAF8F2] border-t border-amber-200/90 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-4 text-[10px]">
          <span className="flex items-center gap-1.5 text-neutral-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> Low Risk (0-40)
          </span>
          <span className="flex items-center gap-1.5 text-neutral-700">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Watch (41-65)
          </span>
          <span className="flex items-center gap-1.5 text-neutral-700">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> High (66-80)
          </span>
          <span className="flex items-center gap-1.5 text-neutral-700">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" /> Critical Excursion (81-100)
          </span>
        </div>

        <div className="flex items-center gap-4 text-[10px] text-neutral-600 font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1">
            <span className="w-3 h-1 bg-[#DC2626] rounded-full inline-block" /> NH-44 Cold Corridor
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-1 bg-[#854D0E] rounded-full inline-block" /> NH-48 Western Freight
          </span>
          <span className="text-[#854D0E]">3.3s Algorand TestNet Finality</span>
        </div>
      </div>
    </div>
  );
};
