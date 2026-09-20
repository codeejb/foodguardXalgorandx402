export type LocationType = 'MANUFACTURER' | 'WAREHOUSE' | 'DISTRIBUTOR' | 'SHOP';
export type InspectionStatus = 'PENDING' | 'INSPECTION_REQUIRED' | 'UNDER_INSPECTION' | 'CLEARED' | 'PRODUCT_SEIZED';

export interface SupplyLocation {
  locationId: string;
  type: LocationType;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
}

export interface ManufacturerDetails {
  manufacturerId: string;
  name: string;
  product: string;
  batchIds: string[];
  productionDate: string;
  labStatus: string;
}

export interface WarehouseDetails {
  warehouseId: string;
  locationId: string;
  productsReceived: string[];
  batchIds: string[];
  quantityReceived: number;
  quantityDispatched: number;
  dateReceived: string;
  dateDispatched: string;
}

export interface DistributorDetails {
  distributorId: string;
  locationId: string;
  batchIdsHandled: string[];
  quantityReceived: number;
  quantityDistributed: number;
}

export interface ShopDetails {
  shopId: string;
  locationId: string;
  batchIdReceived: string;
  quantityReceived: number;
  quantityInStock: number;
  quantitySold: number;
  dateReceived: string;
  inspectionStatus: InspectionStatus;
}

export interface Shipment {
  shipmentId: string;
  batchId: string;
  fromLocationId: string;
  toLocationId: string;
  quantity: number;
  timestamp: string;
}

export interface InspectionRecord {
  inspectionId: string;
  batchId: string;
  locationId: string;
  status: InspectionStatus;
  inspector: string;
  timestamp: string;
  notes?: string;
}

export interface TraceabilityEntry {
  timestamp: string;
  batchId: string;
  from: string;
  to: string;
  quantity: number;
  status: string;
}

export interface AffectedBatchSummary {
  batchId: string;
  affectedWarehouses: number;
  affectedDistributors: number;
  affectedShops: number;
  totalUnits: number;
}

export const SUPPLY_LOCATIONS: SupplyLocation[] = [
  {
    locationId: 'MFR-01', type: 'MANUFACTURER', name: 'Mother Dairy Processing Plant',
    address: 'Sector 24, Noida, UP', latitude: 28.5802, longitude: 77.3340, city: 'Noida', state: 'UP'
  },
  {
    locationId: 'WH-DEL-01', type: 'WAREHOUSE', name: 'Delhi Central Cold Storage',
    address: 'Okhla Phase III, New Delhi', latitude: 28.5355, longitude: 77.2730, city: 'Delhi', state: 'DL'
  },
  {
    locationId: 'WH-GUR-01', type: 'WAREHOUSE', name: 'Gurgaon Regional Depot',
    address: 'Udyog Vihar Phase IV, Gurgaon', latitude: 28.4595, longitude: 77.0266, city: 'Gurgaon', state: 'HR'
  },
  {
    locationId: 'DIST-01', type: 'DISTRIBUTOR', name: 'Apex Fresh Distributors',
    address: 'Lajpat Nagar, New Delhi', latitude: 28.5672, longitude: 77.2410, city: 'Delhi', state: 'DL'
  },
  {
    locationId: 'DIST-02', type: 'DISTRIBUTOR', name: 'QuickMove Logistics',
    address: 'Saket, New Delhi', latitude: 28.5200, longitude: 77.2090, city: 'Delhi', state: 'DL'
  },
  {
    locationId: 'DIST-03', type: 'DISTRIBUTOR', name: 'NCR Fresh Supply Co.',
    address: 'DLF Phase III, Gurgaon', latitude: 28.4420, longitude: 77.0860, city: 'Gurgaon', state: 'HR'
  },
  {
    locationId: 'SHOP-S1', type: 'SHOP', name: 'Hauz Khas Fresh Mart',
    address: 'Hauz Khas Village, New Delhi', latitude: 28.5494, longitude: 77.2001, city: 'Delhi', state: 'DL'
  },
  {
    locationId: 'SHOP-S2', type: 'SHOP', name: 'Saket Daily Needs',
    address: 'Saket District Centre, New Delhi', latitude: 28.5223, longitude: 77.2095, city: 'Delhi', state: 'DL'
  },
  {
    locationId: 'SHOP-S3', type: 'SHOP', name: 'Malviya Nagar Groceries',
    address: 'Malviya Nagar, New Delhi', latitude: 28.5362, longitude: 77.2138, city: 'Delhi', state: 'DL'
  },
  {
    locationId: 'SHOP-S4', type: 'SHOP', name: 'Noida Sector 18 Mart',
    address: 'Sector 18, Noida', latitude: 28.5700, longitude: 77.3250, city: 'Noida', state: 'UP'
  },
  {
    locationId: 'SHOP-S5', type: 'SHOP', name: 'Gurgaon Cyber Hub Fresh',
    address: 'Cyber Hub, Gurgaon', latitude: 28.4430, longitude: 77.0950, city: 'Gurgaon', state: 'HR'
  },
  {
    locationId: 'SHOP-S6', type: 'SHOP', name: 'DLF Phase IV Store',
    address: 'DLF Phase IV, Gurgaon', latitude: 28.4470, longitude: 77.0900, city: 'Gurgaon', state: 'HR'
  }
];

export const SUPPLY_MANUFACTURER_DETAILS: Record<string, ManufacturerDetails> = {
  'MFR-01': {
    manufacturerId: 'MFR-01', name: 'Mother Dairy Processing Plant',
    product: 'Pasteurized Whole Milk (500ml)', batchIds: ['MILK-2026-0920-001'],
    productionDate: '2026-09-20T06:00:00Z', labStatus: 'COMPLIANT'
  }
};

export const SUPPLY_WAREHOUSE_DETAILS: Record<string, WarehouseDetails> = {
  'WH-DEL-01': {
    warehouseId: 'WH-DEL-01', locationId: 'WH-DEL-01',
    productsReceived: ['Pasteurized Whole Milk (500ml)'], batchIds: ['MILK-2026-0920-001'],
    quantityReceived: 2000, quantityDispatched: 1800,
    dateReceived: '2026-09-20T08:30:00Z', dateDispatched: '2026-09-20T14:00:00Z'
  },
  'WH-GUR-01': {
    warehouseId: 'WH-GUR-01', locationId: 'WH-GUR-01',
    productsReceived: ['Pasteurized Whole Milk (500ml)'], batchIds: ['MILK-2026-0920-001'],
    quantityReceived: 800, quantityDispatched: 750,
    dateReceived: '2026-09-20T15:30:00Z', dateDispatched: '2026-09-20T18:00:00Z'
  }
};

export const SUPPLY_DISTRIBUTOR_DETAILS: Record<string, DistributorDetails> = {
  'DIST-01': { distributorId: 'DIST-01', locationId: 'DIST-01', batchIdsHandled: ['MILK-2026-0920-001'], quantityReceived: 800, quantityDistributed: 800 },
  'DIST-02': { distributorId: 'DIST-02', locationId: 'DIST-02', batchIdsHandled: ['MILK-2026-0920-001'], quantityReceived: 600, quantityDistributed: 600 },
  'DIST-03': { distributorId: 'DIST-03', locationId: 'DIST-03', batchIdsHandled: ['MILK-2026-0920-001'], quantityReceived: 400, quantityDistributed: 350 }
};

export const SUPPLY_SHOP_DETAILS: Record<string, ShopDetails> = {
  'SHOP-S1': { shopId: 'SHOP-S1', locationId: 'SHOP-S1', batchIdReceived: 'MILK-2026-0920-001', quantityReceived: 200, quantityInStock: 45, quantitySold: 155, dateReceived: '2026-09-20T10:00:00Z', inspectionStatus: 'PENDING' },
  'SHOP-S2': { shopId: 'SHOP-S2', locationId: 'SHOP-S2', batchIdReceived: 'MILK-2026-0920-001', quantityReceived: 150, quantityInStock: 30, quantitySold: 120, dateReceived: '2026-09-20T10:30:00Z', inspectionStatus: 'PENDING' },
  'SHOP-S3': { shopId: 'SHOP-S3', locationId: 'SHOP-S3', batchIdReceived: 'MILK-2026-0920-001', quantityReceived: 200, quantityInStock: 80, quantitySold: 120, dateReceived: '2026-09-20T11:00:00Z', inspectionStatus: 'PENDING' },
  'SHOP-S4': { shopId: 'SHOP-S4', locationId: 'SHOP-S4', batchIdReceived: 'MILK-2026-0920-001', quantityReceived: 200, quantityInStock: 60, quantitySold: 140, dateReceived: '2026-09-20T12:00:00Z', inspectionStatus: 'PENDING' },
  'SHOP-S5': { shopId: 'SHOP-S5', locationId: 'SHOP-S5', batchIdReceived: 'MILK-2026-0920-001', quantityReceived: 200, quantityInStock: 70, quantitySold: 130, dateReceived: '2026-09-20T16:00:00Z', inspectionStatus: 'PENDING' },
  'SHOP-S6': { shopId: 'SHOP-S6', locationId: 'SHOP-S6', batchIdReceived: 'MILK-2026-0920-001', quantityReceived: 150, quantityInStock: 50, quantitySold: 100, dateReceived: '2026-09-20T16:30:00Z', inspectionStatus: 'PENDING' }
};

export const SUPPLY_SHIPMENTS: Shipment[] = [
  { shipmentId: 'SHP-001', batchId: 'MILK-2026-0920-001', fromLocationId: 'MFR-01', toLocationId: 'WH-DEL-01', quantity: 2000, timestamp: '2026-09-20T07:00:00Z' },
  { shipmentId: 'SHP-002', batchId: 'MILK-2026-0920-001', fromLocationId: 'WH-DEL-01', toLocationId: 'DIST-01', quantity: 800, timestamp: '2026-09-20T09:30:00Z' },
  { shipmentId: 'SHP-003', batchId: 'MILK-2026-0920-001', fromLocationId: 'WH-DEL-01', toLocationId: 'DIST-02', quantity: 600, timestamp: '2026-09-20T11:15:00Z' },
  { shipmentId: 'SHP-004', batchId: 'MILK-2026-0920-001', fromLocationId: 'WH-DEL-01', toLocationId: 'WH-GUR-01', quantity: 600, timestamp: '2026-09-20T14:00:00Z' },
  { shipmentId: 'SHP-005', batchId: 'MILK-2026-0920-001', fromLocationId: 'DIST-01', toLocationId: 'SHOP-S1', quantity: 200, timestamp: '2026-09-20T10:00:00Z' },
  { shipmentId: 'SHP-006', batchId: 'MILK-2026-0920-001', fromLocationId: 'DIST-01', toLocationId: 'SHOP-S2', quantity: 150, timestamp: '2026-09-20T10:30:00Z' },
  { shipmentId: 'SHP-007', batchId: 'MILK-2026-0920-001', fromLocationId: 'DIST-02', toLocationId: 'SHOP-S3', quantity: 200, timestamp: '2026-09-20T11:00:00Z' },
  { shipmentId: 'SHP-008', batchId: 'MILK-2026-0920-001', fromLocationId: 'DIST-02', toLocationId: 'SHOP-S4', quantity: 200, timestamp: '2026-09-20T12:00:00Z' },
  { shipmentId: 'SHP-009', batchId: 'MILK-2026-0920-001', fromLocationId: 'WH-GUR-01', toLocationId: 'DIST-03', quantity: 400, timestamp: '2026-09-20T15:30:00Z' },
  { shipmentId: 'SHP-010', batchId: 'MILK-2026-0920-001', fromLocationId: 'DIST-03', toLocationId: 'SHOP-S5', quantity: 200, timestamp: '2026-09-20T16:00:00Z' },
  { shipmentId: 'SHP-011', batchId: 'MILK-2026-0920-001', fromLocationId: 'DIST-03', toLocationId: 'SHOP-S6', quantity: 150, timestamp: '2026-09-20T16:30:00Z' }
];

export const SUPPLY_INSPECTIONS: InspectionRecord[] = [];

export const SUPPLY_TRACEABILITY_LOG: TraceabilityEntry[] = [
  { timestamp: '2026-09-20T07:00:00Z', batchId: 'MILK-2026-0920-001', from: 'Mother Dairy Processing Plant', to: 'Delhi Central Cold Storage', quantity: 2000, status: 'COMPLETED' },
  { timestamp: '2026-09-20T09:30:00Z', batchId: 'MILK-2026-0920-001', from: 'Delhi Central Cold Storage', to: 'Apex Fresh Distributors', quantity: 800, status: 'COMPLETED' },
  { timestamp: '2026-09-20T11:15:00Z', batchId: 'MILK-2026-0920-001', from: 'Delhi Central Cold Storage', to: 'QuickMove Logistics', quantity: 600, status: 'COMPLETED' },
  { timestamp: '2026-09-20T14:00:00Z', batchId: 'MILK-2026-0920-001', from: 'Delhi Central Cold Storage', to: 'Gurgaon Regional Depot', quantity: 600, status: 'COMPLETED' },
  { timestamp: '2026-09-20T10:00:00Z', batchId: 'MILK-2026-0920-001', from: 'Apex Fresh Distributors', to: 'Hauz Khas Fresh Mart', quantity: 200, status: 'COMPLETED' },
  { timestamp: '2026-09-20T10:30:00Z', batchId: 'MILK-2026-0920-001', from: 'Apex Fresh Distributors', to: 'Saket Daily Needs', quantity: 150, status: 'COMPLETED' },
  { timestamp: '2026-09-20T11:00:00Z', batchId: 'MILK-2026-0920-001', from: 'QuickMove Logistics', to: 'Malviya Nagar Groceries', quantity: 200, status: 'COMPLETED' },
  { timestamp: '2026-09-20T12:00:00Z', batchId: 'MILK-2026-0920-001', from: 'QuickMove Logistics', to: 'Noida Sector 18 Mart', quantity: 200, status: 'COMPLETED' },
  { timestamp: '2026-09-20T15:30:00Z', batchId: 'MILK-2026-0920-001', from: 'Gurgaon Regional Depot', to: 'NCR Fresh Supply Co.', quantity: 400, status: 'COMPLETED' },
  { timestamp: '2026-09-20T16:00:00Z', batchId: 'MILK-2026-0920-001', from: 'NCR Fresh Supply Co.', to: 'Gurgaon Cyber Hub Fresh', quantity: 200, status: 'COMPLETED' },
  { timestamp: '2026-09-20T16:30:00Z', batchId: 'MILK-2026-0920-001', from: 'NCR Fresh Supply Co.', to: 'DLF Phase IV Store', quantity: 150, status: 'COMPLETED' }
];

export function getLocationById(id: string): SupplyLocation | undefined {
  return SUPPLY_LOCATIONS.find(l => l.locationId === id);
}

export function getShipmentsForBatch(batchId: string): Shipment[] {
  return SUPPLY_SHIPMENTS.filter(s => s.batchId === batchId);
}

export function traceBatchDownstream(batchId: string): Set<string> {
  const affected = new Set<string>();
  const shipments = getShipmentsForBatch(batchId);
  const queue = shipments.map(s => s.fromLocationId);
  while (queue.length > 0) {
    const locId = queue.shift()!;
    if (affected.has(locId)) continue;
    affected.add(locId);
    for (const s of shipments) {
      if (s.fromLocationId === locId) {
        queue.push(s.toLocationId);
      }
    }
  }
  for (const s of shipments) {
    affected.add(s.fromLocationId);
    affected.add(s.toLocationId);
  }
  return affected;
}

export function getAffectedSummary(batchId: string): AffectedBatchSummary {
  const affected = traceBatchDownstream(batchId);
  let warehouses = 0, distributors = 0, shops = 0, totalUnits = 0;
  const shipments = getShipmentsForBatch(batchId);
  for (const locId of affected) {
    const loc = getLocationById(locId);
    if (loc?.type === 'WAREHOUSE') warehouses++;
    if (loc?.type === 'DISTRIBUTOR') distributors++;
    if (loc?.type === 'SHOP') shops++;
  }
  for (const s of shipments) {
    const toLoc = getLocationById(s.toLocationId);
    if (toLoc?.type === 'SHOP') totalUnits += s.quantity;
  }
  return { batchId, affectedWarehouses: warehouses, affectedDistributors: distributors, affectedShops: shops, totalUnits };
}

