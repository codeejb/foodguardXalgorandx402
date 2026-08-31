import {
  FoodBatch,
  StateRiskData,
  AnomalyRecord,
  InvestigationLead,
  InspectionPriority,
  LabReportData,
  CitizenReport,
  BlockchainEvent,
  X402Endpoint,
  X402Settlement,
  GraphNode,
  GraphEdge
} from '../types';

export const NATIONAL_STATS = {
  nationalRiskScore: 78,
  riskTrendPercent: 4.8,
  activeIncidents: 14,
  quarantinedBatches: 23,
  monitoredNodes: 2840,
  blockchainVerifiedBatches: 412,
  preventedExposureEstimated: 142800,
  averageResponseTimeHours: 1.4,
  totalX402SettledUsdc: 184.65,
  totalX402ApiInvocations: 9412,
  activeAiAgents: 114
};

export const INITIAL_BATCHES: FoodBatch[] = [
  {
    id: 'M492',
    productName: 'Pasteurized Whole Milk (500ml)',
    category: 'Dairy',
    currentRiskScore: 84,
    riskLevel: 'HIGH',
    safetyScore: 16,
    forecastRisk24h: 62,
    forecastRisk48h: 31,
    forecastRisk72h: 18,
    status: 'WATCH',
    productionDate: '2026-08-28 04:30 IST',
    expiryDate: '2026-09-02 23:59 IST',
    sourceOrigin: 'Anand Dairy Collective (Unit #4), Anand, Gujarat',
    supplierName: 'Gujarat Agro Dairy Producers Ltd.',
    factoryName: 'Northern Processing Plant #02, Manesar, Haryana',
    warehouseLocation: 'Central Cold Storage #17, Okhla Phase III, New Delhi',
    transportRoute: 'Route NH-48 Express (Reefer Truck DL-01-EE-4912)',
    distributorName: 'Apex Capital FMCG Distributors, Delhi NCR',
    retailerName: 'QuickMart Superstores & 140 NCR Retail Outlets',
    batchVolume: '28,500 Liters (57,000 Pouches)',
    temperatureAvg: 8.4,
    temperatureMax: 14.8,
    temperatureSpikeHours: 4.2,
    humidityAvg: 78,
    labVerified: true,
    labReportId: 'LAB-DEL-8921',
    inspectionHistoryCount: 4,
    complaintCount: 23,
    blockchainTx: 'ALGO-TX-79F8B1A2C3D4E5F6G7H8J9K0L1M2N3P4',
    blockchainStatus: 'VERIFIED',
    aiExplanation: 'Risk is escalating rapidly because cold-chain telemetry recorded a sustained 14.8°C thermal excursion (+10.8°C above 4.0°C baseline) for 4.2 hours at Warehouse #17, combined with 23 geotagged citizen curdling complaints.',
    journey: [
      {
        stage: 'SOURCE',
        location: 'Anand Milking Chilling Unit, Gujarat',
        timestamp: '2026-08-28 04:30',
        actor: 'Anand Agro Cooperative',
        temperature: 3.8,
        humidity: 65,
        status: 'NORMAL',
        txHash: '0x8a91f3b2c4e5a6d7e8f90123456789abcdef0123',
        notes: 'Raw milk raw testing: MBRT > 5 hours, Fat 4.2%, SNF 8.7%.'
      },
      {
        stage: 'SUPPLIER',
        location: 'Vadodara Regional Hub, Gujarat',
        timestamp: '2026-08-28 10:15',
        actor: 'Gujarat Agro Logistics',
        temperature: 4.1,
        humidity: 68,
        status: 'NORMAL',
        txHash: '0x7b82e4c3d5f6a7b8c9d0123456789abcdef0124',
        notes: 'Insulated milk tanker dispatch to Haryana processing plant.'
      },
      {
        stage: 'FACTORY',
        location: 'Manesar Dairy Plant #02, Haryana',
        timestamp: '2026-08-29 01:20',
        actor: 'Northern Processing Plant Ltd',
        temperature: 4.0,
        humidity: 70,
        status: 'NORMAL',
        txHash: '0x6c73d5e4f6a7b8c9d0e123456789abcdef0125',
        notes: 'HTST Pasteurization at 72°C for 15s. Homogenized and packaged into 500ml pouches.'
      },
      {
        stage: 'LAB',
        location: 'NABL Certified Apex Food Labs, Gurugram',
        timestamp: '2026-08-29 06:45',
        actor: 'Dr. R. K. Sharma (Chief Microbiologist)',
        temperature: 4.2,
        humidity: 65,
        status: 'NORMAL',
        txHash: '0x5d64c6f5a7b8c9d0e1f23456789abcdef0126',
        notes: 'Coliform < 10 CFU/ml, Total Bacterial Count 12,000 CFU/ml. PASSED FSSAI Std.'
      },
      {
        stage: 'WAREHOUSE',
        location: 'Central Cold Storage #17, Okhla, New Delhi',
        timestamp: '2026-08-29 14:00',
        actor: 'Warehouse Unit 17 Operator',
        temperature: 14.8,
        humidity: 84,
        status: 'ALERT',
        txHash: '0x4e55b7a6b7c8d9e0f1a23456789abcdef0127',
        notes: 'CRITICAL ANOMALY: Secondary compressor trip between 14:30 and 18:42 IST. Chamber temp climbed to 14.8°C.'
      },
      {
        stage: 'TRANSPORT',
        location: 'Delhi-NCR Distribution Route 4',
        timestamp: '2026-08-30 03:00',
        actor: 'Delhi Reefer Fleet DL-01-EE-4912',
        temperature: 7.2,
        humidity: 79,
        status: 'ANOMALY',
        txHash: '0x3f46a8b7c8d9e0f1a2b3456789abcdef0128',
        notes: 'Loaded pre-warmed crates from Warehouse 17; refrigeration unable to pull down.'
      },
      {
        stage: 'DISTRIBUTOR',
        location: 'Apex FMCG Depot, Mayapuri, Delhi',
        timestamp: '2026-08-30 08:30',
        actor: 'Apex Logistics NCR',
        temperature: 8.5,
        humidity: 78,
        status: 'ALERT',
        txHash: '0x2a37b9c8d9e0f1a2b3c4456789abcdef0129',
        notes: 'Consignment split across 140 retailers in South and West Delhi.'
      }
    ]
  },
  {
    id: 'P812',
    productName: 'Fresh Malai Paneer Blocks (200g)',
    category: 'Dairy',
    currentRiskScore: 71,
    riskLevel: 'HIGH',
    safetyScore: 29,
    forecastRisk24h: 54,
    forecastRisk48h: 22,
    forecastRisk72h: 12,
    status: 'WATCH',
    productionDate: '2026-08-29 08:00 IST',
    expiryDate: '2026-09-08 23:59 IST',
    sourceOrigin: 'Karnal Dairy Cluster, Haryana',
    supplierName: 'Karnal Organic Farms Ltd.',
    factoryName: 'Punjab-Haryana Dairy Co-op, Ambala',
    warehouseLocation: 'Central Cold Storage #17, Okhla Phase III, New Delhi',
    transportRoute: 'GT Road Express Corridor (HR-03-AA-9081)',
    distributorName: 'North Delhi Dairy Merchants',
    retailerName: 'Chandni Chowk & Karol Bagh Grocery Hubs',
    batchVolume: '8,400 kg',
    temperatureAvg: 9.1,
    temperatureMax: 13.5,
    temperatureSpikeHours: 3.8,
    humidityAvg: 82,
    labVerified: true,
    labReportId: 'LAB-AMB-4410',
    inspectionHistoryCount: 2,
    complaintCount: 16,
    blockchainTx: 'ALGO-TX-31A9F4E7B2C8D1E6F5A4B3C2D1E0F9A8',
    blockchainStatus: 'VERIFIED',
    aiExplanation: 'Co-stored in Warehouse #17 during compressor trip. Moisture condensation detected on outer vacuum pack seals.',
    journey: []
  },
  {
    id: 'S309',
    productName: 'Ground Red Chilli Powder (Amarkantak Grade)',
    category: 'Spices',
    currentRiskScore: 68,
    riskLevel: 'WATCH',
    safetyScore: 32,
    forecastRisk24h: 68,
    forecastRisk48h: 65,
    forecastRisk72h: 62,
    status: 'WATCH',
    productionDate: '2026-08-20 11:00 IST',
    expiryDate: '2027-08-20 23:59 IST',
    sourceOrigin: 'Guntur Spice Mandi, Andhra Pradesh',
    supplierName: 'Guntur Andhra Spice Traders',
    factoryName: 'Sunrise Grinding & Sterilization Plant, Hyderabad',
    warehouseLocation: 'Bhiwandi Central Logistics Park, Maharashtra',
    transportRoute: 'NH-65 Hyderabad-Pune-Mumbai Route',
    distributorName: 'Western Spice Wholesalers, Mumbai',
    retailerName: 'Dadar, Kurla, and Thane Spice Markets',
    batchVolume: '15,000 kg',
    temperatureAvg: 28.4,
    temperatureMax: 36.2,
    temperatureSpikeHours: 0,
    humidityAvg: 88,
    labVerified: false,
    labReportId: 'LAB-HYD-9912',
    inspectionHistoryCount: 3,
    complaintCount: 8,
    blockchainTx: 'ALGO-TX-99E8D7C6B5A4F3E2D1C0B9A8F7E6D5C4',
    blockchainStatus: 'VERIFIED',
    aiExplanation: 'Lab report flagged borderline synthetic dye (Sudan dye marker) trace near detection threshold; elevated storage humidity poses aflatoxin risk.',
    journey: []
  },
  {
    id: 'C104',
    productName: 'Chilled Broiler Chicken Breast Fillets',
    category: 'Meat & Poultry',
    currentRiskScore: 89,
    riskLevel: 'CRITICAL',
    safetyScore: 11,
    forecastRisk24h: 38,
    forecastRisk48h: 12,
    forecastRisk72h: 4,
    status: 'QUARANTINED',
    productionDate: '2026-08-30 02:00 IST',
    expiryDate: '2026-09-04 23:59 IST',
    sourceOrigin: 'Erode Poultry Farming Belt, Tamil Nadu',
    supplierName: 'Cauvery Bio-Farms Ltd.',
    factoryName: 'Coimbatore Cold Abattoir & Processing, TN',
    warehouseLocation: 'Yeshwanthpur Cold Complex, Bengaluru, Karnataka',
    transportRoute: 'Salem-Hosur-Bengaluru Refrigerated Link',
    distributorName: 'Karnataka Fresh Meats Network',
    retailerName: 'Indiranagar & Koramangala Cloud Kitchens',
    batchVolume: '4,200 kg',
    temperatureAvg: 6.8,
    temperatureMax: 12.4,
    temperatureSpikeHours: 5.1,
    humidityAvg: 90,
    labVerified: true,
    labReportId: 'LAB-BLR-1029',
    inspectionHistoryCount: 5,
    complaintCount: 31,
    blockchainTx: 'ALGO-TX-12B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7',
    blockchainStatus: 'VERIFIED',
    aiExplanation: 'Salmonella microbial proliferation risk amplified by 5.1 hours of thermal breakdown during transport across Hosur border checkpost.',
    journey: []
  },
  {
    id: 'O512',
    productName: 'Cold-Pressed Pure Mustard Oil (1L Tin)',
    category: 'Edible Oils',
    currentRiskScore: 14,
    riskLevel: 'LOW',
    safetyScore: 86,
    forecastRisk24h: 86,
    forecastRisk48h: 85,
    forecastRisk72h: 85,
    status: 'SAFE',
    productionDate: '2026-08-25 09:00 IST',
    expiryDate: '2027-08-25 23:59 IST',
    sourceOrigin: 'Alwar Mustard Growers Collective, Rajasthan',
    supplierName: 'Rajasthan Krishi Oil Mills',
    factoryName: 'Jaipur Extraction & Filtration Unit, Rajasthan',
    warehouseLocation: 'Kishangarh Agro Depot, Rajasthan',
    transportRoute: 'Jaipur-Delhi Industrial Freight',
    distributorName: 'National Edible Oils Syndicate',
    retailerName: 'All India Retail Chain Outlets',
    batchVolume: '45,000 Liters',
    temperatureAvg: 24.2,
    temperatureMax: 28.0,
    temperatureSpikeHours: 0,
    humidityAvg: 55,
    labVerified: true,
    labReportId: 'LAB-JPR-7721',
    inspectionHistoryCount: 1,
    complaintCount: 0,
    blockchainTx: 'ALGO-TX-44A5B6C7D8E9F0A1B2C3D4E5F6A7B8C9',
    blockchainStatus: 'VERIFIED',
    aiExplanation: 'Zero Argemone oil adulteration detected. Acid value 0.8 mg KOH/g (compliant). Perfect tamper seal verification.',
    journey: []
  },
  {
    id: 'R901',
    productName: 'Sharbati Whole Wheat Atta (10kg Bags)',
    category: 'Grains',
    currentRiskScore: 18,
    riskLevel: 'LOW',
    safetyScore: 82,
    forecastRisk24h: 82,
    forecastRisk48h: 81,
    forecastRisk72h: 80,
    status: 'SAFE',
    productionDate: '2026-08-22 07:00 IST',
    expiryDate: '2027-02-22 23:59 IST',
    sourceOrigin: 'Sehore Organic Wheat Producers, Madhya Pradesh',
    supplierName: 'MP Agro Grain Logistics',
    factoryName: 'Bhopal Roller Flour Mills, MP',
    warehouseLocation: 'Indore Central Granary, Madhya Pradesh',
    transportRoute: 'Central Western Rail Freight Container',
    distributorName: 'Central India Provisions Pvt Ltd',
    retailerName: 'Bhopal & Jabalpur Ration Outlets',
    batchVolume: '80,000 kg',
    temperatureAvg: 26.5,
    temperatureMax: 30.0,
    temperatureSpikeHours: 0,
    humidityAvg: 52,
    labVerified: true,
    labReportId: 'LAB-BHP-3319',
    inspectionHistoryCount: 2,
    complaintCount: 1,
    blockchainTx: 'ALGO-TX-88B9C0D1E2F3A4B5C6D7E8F9A0B1C2D3',
    blockchainStatus: 'VERIFIED',
    aiExplanation: 'Moisture content 11.2% (under 14% FSSAI limit). No mycotoxins or insect fragments identified.',
    journey: []
  }
];

export const INDIA_STATE_RISKS: StateRiskData[] = [
  {
    stateCode: 'DL',
    stateName: 'Delhi NCR',
    riskScore: 86,
    riskLevel: 'CRITICAL',
    riskTrend: 5.4,
    activeIncidents: 6,
    affectedBatches: 18,
    complaintClusters: 4,
    weatherSignal: 'High ambient temperature 38.5°C; power grid frequency drops in industrial zones',
    supplyChainRisk: 'Warehouse #17 cold chain failure affecting 57,000 dairy units across 4 districts',
    aiExplanation: 'Severe risk concentration in Okhla & Mayapuri dairy distribution nodes following a 4.2-hour cooling lapse.',
    recommendedAction: 'Immediate quarantine of Warehouse #17 + Targeted retail sweep of Batch M492 & P812 in South Delhi',
    coordinates: [28.6139, 77.2090]
  },
  {
    stateCode: 'MH',
    stateName: 'Maharashtra',
    riskScore: 64,
    riskLevel: 'WATCH',
    riskTrend: 2.1,
    activeIncidents: 3,
    affectedBatches: 8,
    complaintClusters: 2,
    weatherSignal: 'Heavy monsoonal humidity 92% in Bhiwandi logistics corridor',
    supplyChainRisk: 'Elevated moisture in spice warehouses; transit delays on NH-48',
    aiExplanation: 'Aflatoxin risk potential in stored red chilli and whole grains due to ambient humidity exceeding 88%.',
    recommendedAction: 'Mandate automated dehumidifier checks across Bhiwandi godowns; audit spice testing logs.',
    coordinates: [19.0760, 72.8777]
  },
  {
    stateCode: 'KA',
    stateName: 'Karnataka',
    riskScore: 78,
    riskLevel: 'HIGH',
    riskTrend: 4.8,
    activeIncidents: 4,
    affectedBatches: 11,
    complaintClusters: 3,
    weatherSignal: 'High humidity 85% in Bengaluru urban basin',
    supplyChainRisk: 'Meat & poultry cold transport delay at Hosur interstate checkpost',
    aiExplanation: 'Batch C104 broiler chicken suffered 5.1-hour refrigeration cutoff; 31 gastrointestinal complaints logged.',
    recommendedAction: 'Dispatch flying squad to Yeshwanthpur cold depot; notify Koramangala & Indiranagar restaurants.',
    coordinates: [12.9716, 77.5946]
  },
  {
    stateCode: 'TN',
    stateName: 'Tamil Nadu',
    riskScore: 52,
    riskLevel: 'WATCH',
    riskTrend: -1.2,
    activeIncidents: 1,
    affectedBatches: 4,
    complaintClusters: 1,
    weatherSignal: 'Coastal heat 34°C, sea-salt aerosol exposure',
    supplyChainRisk: 'Erode poultry farms reporting power backup transition issues',
    aiExplanation: 'Upstream poultry suppliers under enhanced surveillance; factory level chilling compliant.',
    recommendedAction: 'Audit farm generator logs in Erode cluster.',
    coordinates: [13.0827, 80.2707]
  },
  {
    stateCode: 'UP',
    stateName: 'Uttar Pradesh',
    riskScore: 72,
    riskLevel: 'HIGH',
    riskTrend: 3.7,
    activeIncidents: 3,
    affectedBatches: 9,
    complaintClusters: 2,
    weatherSignal: 'Dry heatwave 41°C in Western UP',
    supplyChainRisk: 'Interstate dairy milk tankers experiencing highway congestion near Noida/Ghaziabad',
    aiExplanation: 'High ambient temperature threatens uninsulated secondary distribution vehicles.',
    recommendedAction: 'Deploy mobile testing vans at UP-Delhi border checkposts.',
    coordinates: [26.8467, 80.9462]
  },
  {
    stateCode: 'GJ',
    stateName: 'Gujarat',
    riskScore: 32,
    riskLevel: 'LOW',
    riskTrend: -0.8,
    activeIncidents: 0,
    affectedBatches: 1,
    complaintClusters: 0,
    weatherSignal: 'Stable coastal breeze, automated grid stability',
    supplyChainRisk: 'Anand & Vadodara dairy cooperatives operating with continuous IoT telemetry',
    aiExplanation: 'Source production quality high; testing pass rate 99.4% across 84 cooperative nodes.',
    recommendedAction: 'Maintain routine automated blockchain batch logging.',
    coordinates: [23.0225, 72.5714]
  },
  {
    stateCode: 'RJ',
    stateName: 'Rajasthan',
    riskScore: 38,
    riskLevel: 'LOW',
    riskTrend: 0.5,
    activeIncidents: 1,
    affectedBatches: 2,
    complaintClusters: 0,
    weatherSignal: 'Desert heat 42°C, low humidity 28%',
    supplyChainRisk: 'Edible oil extraction operating smoothly; grain warehouses verified pest-free',
    aiExplanation: 'Mustard oil and wheat supply chains demonstrate tight compliance and sealed batch passports.',
    recommendedAction: 'Continue weekly random testing at Alwar and Jaipur extraction hubs.',
    coordinates: [26.9124, 75.7873]
  },
  {
    stateCode: 'PB',
    stateName: 'Punjab',
    riskScore: 44,
    riskLevel: 'LOW',
    riskTrend: 1.1,
    activeIncidents: 1,
    affectedBatches: 3,
    complaintClusters: 1,
    weatherSignal: 'Sunny 33°C, moderate humidity',
    supplyChainRisk: 'Dairy & grain transport corridor operating within standard parameters',
    aiExplanation: 'Ludhiana and Ambala hubs show clean microbiological records.',
    recommendedAction: 'Routine monitor of Ambala milk tankers.',
    coordinates: [30.7333, 76.7794]
  },
  {
    stateCode: 'WB',
    stateName: 'West Bengal',
    riskScore: 69,
    riskLevel: 'WATCH',
    riskTrend: 3.2,
    activeIncidents: 2,
    affectedBatches: 6,
    complaintClusters: 2,
    weatherSignal: 'Heavy coastal humidity 94%, localized flooding in Howrah',
    supplyChainRisk: 'Fish and seafood cold chain vulnerable during Howrah wholesale transfer',
    aiExplanation: 'Formalin rapid test screening initiated at 3 major Kolkata fish landing centers.',
    recommendedAction: 'Surprise inspection at Howrah Fish Market; test ice quality and chemical preservatives.',
    coordinates: [22.5726, 88.3639]
  },
  {
    stateCode: 'TS',
    stateName: 'Telangana',
    riskScore: 48,
    riskLevel: 'LOW',
    riskTrend: -0.4,
    activeIncidents: 1,
    affectedBatches: 3,
    complaintClusters: 1,
    weatherSignal: 'Intermittent showers, ambient 31°C',
    supplyChainRisk: 'Hyderabad spice processing corridor under standard calibration',
    aiExplanation: 'Sterilization facilities operating at full capacity.',
    recommendedAction: 'Review ethylene oxide residue reports for exported spice lots.',
    coordinates: [17.3850, 78.4867]
  }
];

export const INITIAL_ANOMALIES: AnomalyRecord[] = [
  {
    id: 'ANO-901',
    title: 'Synchronized Temperature Spike in Okhla Cold Hub',
    description: 'Chamber 3 & 4 at Central Cold Storage #17 reached 14.8°C for 252 minutes. 3 dairy batches co-located.',
    severity: 'CRITICAL',
    confidence: 96,
    detectedAt: '2026-08-29 18:45 IST',
    category: 'TEMPERATURE',
    relatedBatchId: 'M492',
    relatedEntity: 'Central Cold Storage #17, Delhi',
    status: 'NEW',
    suggestedAction: 'Halt all downstream dispatches from Warehouse #17 and trigger rapid bacterial swab tests.'
  },
  {
    id: 'ANO-902',
    title: 'Geographic Complaint Spike in South Delhi & Gurugram',
    description: '23 citizen complaints received within 6 hours reporting curdled milk and metallic sour odor in 500ml pouches.',
    severity: 'HIGH',
    confidence: 92,
    detectedAt: '2026-08-30 11:20 IST',
    category: 'COMPLAINT_CLUSTER',
    relatedBatchId: 'M492',
    relatedEntity: 'Apex FMCG Distributor Network',
    status: 'INVESTIGATING',
    suggestedAction: 'Cross-reference batch barcodes against Warehouse #17 dispatch manifests.'
  },
  {
    id: 'ANO-903',
    title: 'Hosur Interstate Checkpost Poultry Transit Stoppage',
    description: 'Refrigerated container truck HR-03-AA-9081 engine switched off for 5.1 hours during permit check.',
    severity: 'CRITICAL',
    confidence: 89,
    detectedAt: '2026-08-30 07:10 IST',
    category: 'TRANSPORT_DELAY',
    relatedBatchId: 'C104',
    relatedEntity: 'Bengaluru Quick Logistics Link',
    status: 'NEW',
    suggestedAction: 'Intervene at Yeshwanthpur unloading bay before distribution to cloud kitchens.'
  },
  {
    id: 'ANO-904',
    title: 'Sudden Unregistered Supplier Switch in Spice Grinding',
    description: 'Hyderabad Sunrise Grinding Plant sourced 3,000 kg red chilli lot from an unverified secondary broker in Khammam.',
    severity: 'MEDIUM',
    confidence: 81,
    detectedAt: '2026-08-30 14:00 IST',
    category: 'SUPPLIER_SWITCH',
    relatedBatchId: 'S309',
    relatedEntity: 'Sunrise Grinding Plant, Hyderabad',
    status: 'NEW',
    suggestedAction: 'Run mass spectrometry test for non-permitted water-soluble dyes.'
  },
  {
    id: 'ANO-905',
    title: 'Lab Parameter Drift in Paneer Moisture Content',
    description: 'Karnal NABL Lab reported moisture level at 69.8% (FSSAI statutory ceiling: 70.0%). 3-sigma drift over historical mean.',
    severity: 'MEDIUM',
    confidence: 76,
    detectedAt: '2026-08-29 16:30 IST',
    category: 'LAB_DRIFT',
    relatedBatchId: 'P812',
    relatedEntity: 'Karnal Dairy Cluster, Haryana',
    status: 'INVESTIGATING',
    suggestedAction: 'Increase sampling frequency on Ambala processing line.'
  }
];

export const INITIAL_INVESTIGATIONS: InvestigationLead[] = [
  {
    id: 'INV-2026-089',
    title: 'Delhi-NCR Multidistrict Milk Curdling & Spoilage Cluster',
    targetProduct: 'Pasteurized Whole Milk (500ml) — Batch M492 & P812',
    potentialSource: 'Central Cold Storage #17 (Okhla Phase III) Compressor Failure',
    confidence: 94,
    status: 'ACTIVE',
    complaintCount: 39,
    temperatureDeviation: '+10.8°C thermal excursion for 4.2 hours',
    evidencePoints: [
      '23 geocoded citizen reports clustered tightly around South Delhi and Gurugram retail zones.',
      'All reported pouches trace back to morning dispatch lot #4 from Warehouse #17.',
      'IoT temperature sensor #WH17-C3 showed voltage drop at 14:28 IST with temperature climbing to 14.8°C.',
      'Bacterial growth kinetic model indicates standard microbial count exceeded permissible limit by 180% within 12 hours.'
    ],
    connectedBatches: ['M492', 'P812'],
    connectedLocations: ['Okhla Phase III Warehouse 17', 'Mayapuri Depot', 'Saket QuickMart', 'Noida Sector 18 Store'],
    recommendedAction: 'Issue immediate Class II recall for Batch M492; quarantine remaining 18,200 pouches; dispatch Inspector team #01.',
    createdAt: '2026-08-30 09:15 IST'
  },
  {
    id: 'INV-2026-090',
    title: 'Bengaluru Cloud Kitchen Poultry Contamination Lead',
    targetProduct: 'Chilled Broiler Chicken Breast Fillets — Batch C104',
    potentialSource: 'Hosur Checkpost Transit Breakdown (DL-01-EE-4912)',
    confidence: 88,
    status: 'ACTIVE',
    complaintCount: 31,
    temperatureDeviation: '+8.4°C thermal excursion for 5.1 hours',
    evidencePoints: [
      '31 complaints of acute gastroenteritis linked to 4 cloud kitchen brands in Koramangala & Indiranagar.',
      'Truck GPS and datalogger confirm vehicle halted without auxiliary power at TN-KA border.',
      'Rapid antigen test detected Salmonella enterica presence in unsealed crates.'
    ],
    connectedBatches: ['C104'],
    connectedLocations: ['Cauvery Bio-Farms', 'Hosur Border Point', 'Yeshwanthpur Cold Hub', 'Indiranagar Kitchen Hub'],
    recommendedAction: 'Impound consignment at Yeshwanthpur depot; halt inventory on delivery platforms for 4 restaurant chains.',
    createdAt: '2026-08-30 12:40 IST'
  },
  {
    id: 'INV-2026-091',
    title: 'Western Maharashtra Spice Adulteration Screen',
    targetProduct: 'Ground Red Chilli Powder — Batch S309',
    potentialSource: 'Unverified Khammam Secondary Broker Supply Stream',
    confidence: 72,
    status: 'UNDER_REVIEW',
    complaintCount: 8,
    temperatureDeviation: 'High humidity storage in Bhiwandi (88% RH)',
    evidencePoints: [
      'Colorimeter analysis detected non-conforming spectral peaks in red pigment.',
      'Supply chain graph detected sudden supplier substitution without updated NABL certificate.',
      '8 consumer complaints of unusual staining and throat irritation.'
    ],
    connectedBatches: ['S309'],
    connectedLocations: ['Guntur Mandi', 'Sunrise Grinding Hyderabad', 'Bhiwandi Park #4', 'Dadar Spice Market'],
    recommendedAction: 'Collect 12 sealed samples for confirmatory HPLC testing at CFTRI Mysore.',
    createdAt: '2026-08-30 15:10 IST'
  }
];

export const INITIAL_INSPECTIONS: InspectionPriority[] = [
  {
    rank: 1,
    id: 'INSP-PRI-01',
    targetName: 'Central Cold Storage #17 (Chamber 3 & 4)',
    targetType: 'WAREHOUSE',
    location: 'Plot 42, Okhla Phase III Industrial Area, New Delhi',
    riskScore: 94,
    riskLevel: 'CRITICAL',
    urgency: 'IMMEDIATE',
    reason: 'Sustained 4.2h cold-chain failure + 39 downstream citizen complaints on Batch M492 & P812',
    checklist: [
      'Verify backup generator automatic transfer switch (ATS) maintenance records.',
      'Inspect calibrated temperature dataloggers in Chambers 3 and 4.',
      'Audit physical stock of Batch M492 (estimate: 18,200 unsold pouches remaining on site).',
      'Examine pre-cooling chambers and loading dock thermal curtains for insulation tears.'
    ],
    equipmentNeeded: [
      'Calibrated infrared thermal gun (Fluke 62 Max)',
      'Digital data probe reader (RS-485 to USB)',
      'Sterile sampling bottles and ice transport box',
      'Official FSSAI seizure seals and Form VA notice papers'
    ],
    sampleProtocols: [
      'Draw 5 random 500ml pouches from top, middle, and bottom pallets of Batch M492.',
      'Test methylene blue reduction time (MBRT) immediately on portable tester.',
      'Package duplicate samples with tamper-proof blockchain seal for NABL lab confirmation.'
    ],
    estimatedDuration: '2.5 Hours'
  },
  {
    rank: 2,
    id: 'INSP-PRI-02',
    targetName: 'Yeshwanthpur Cold Logistics Complex (Bay 6)',
    targetType: 'WAREHOUSE',
    location: 'APMC Yard, Yeshwanthpur, Bengaluru, Karnataka',
    riskScore: 89,
    riskLevel: 'CRITICAL',
    urgency: 'IMMEDIATE',
    reason: 'Consignment C104 arrived with broken cold-chain datalogger; 31 clinical complaints',
    checklist: [
      'Halt release of 4,200 kg poultry crates to commercial cloud kitchens.',
      'Inspect internal core meat temperature at 10 random pallet spots.',
      'Check Reefer truck DL-01-EE-4912 datalogger memory dump.'
    ],
    equipmentNeeded: [
      'Penetration core meat thermometer',
      'Rapid Salmonella lateral flow test strips',
      'Biohazard sample bags and cooler'
    ],
    sampleProtocols: [
      'Collect 6 core muscle tissue samples under aseptic conditions.',
      'Conduct rapid Salmonella and Total Viable Count screening.'
    ],
    estimatedDuration: '2.0 Hours'
  },
  {
    rank: 3,
    id: 'INSP-PRI-03',
    targetName: 'Sunrise Grinding & Sterilization Plant',
    targetType: 'FACTORY',
    location: 'IDA Nacharam, Hyderabad, Telangana',
    riskScore: 78,
    riskLevel: 'HIGH',
    urgency: 'HIGH',
    reason: 'Unregistered spice raw material source substitution; borderline synthetic dye signal',
    checklist: [
      'Inspect raw red chilli procurement registers and Form E certificates from Guntur.',
      'Audit raw spice intake hopper #2 and grinding chamber cleanliness.',
      'Cross-check supplier tax invoices against approved FSSAI supplier whitelist.'
    ],
    equipmentNeeded: [
      'Portable UV fluorescence spectrometer',
      'Sterile composite sample spear'
    ],
    sampleProtocols: [
      'Sample 500g from bulk raw storage silo and 500g from finished packed pouch lot S309.'
    ],
    estimatedDuration: '3.0 Hours'
  },
  {
    rank: 4,
    id: 'INSP-PRI-04',
    targetName: 'Saket QuickMart Superstore (Refrigerated Section)',
    targetType: 'RETAILER',
    location: 'District Centre, Saket, New Delhi',
    riskScore: 72,
    riskLevel: 'HIGH',
    urgency: 'HIGH',
    reason: 'Downstream retail point receiving 8 citizen complaints for spoiled milk pouches',
    checklist: [
      'Check display chiller temperature display vs internal sensor probe.',
      'Verify quarantine status of Batch M492 pouches removed from shelves.',
      'Review store return logs for sour milk consumer claims.'
    ],
    equipmentNeeded: [
      'Infrared thermometer',
      'Retail inventory audit tablet'
    ],
    sampleProtocols: [
      'Verify and record destruction/return protocol of unsold stock.'
    ],
    estimatedDuration: '1.0 Hour'
  }
];

export const INITIAL_LAB_REPORTS: LabReportData[] = [
  {
    id: 'LAB-DEL-8921',
    batchId: 'M492',
    product: 'Pasteurized Whole Milk (500ml)',
    labName: 'Apex Food Research & Analytical Services (NABL Accr. TC-5819)',
    accreditation: 'ISO/IEC 17025:2017 & FSSAI Recognized',
    testDate: '2026-08-29 06:45 IST',
    verdict: 'WATCH',
    summary: 'Initial microbiological values at factory dispatch were within limits, but post-incident test shows accelerated bacterial counts approaching critical limits due to secondary temperature excursion.',
    parameters: [
      { name: 'Total Plate Count (TPC)', value: '42,000', unit: 'CFU/ml', fssaiLimit: '< 50,000 CFU/ml', status: 'BORDERLINE' },
      { name: 'Coliform Count', value: '8', unit: 'CFU/ml', fssaiLimit: '< 10 CFU/ml', status: 'BORDERLINE' },
      { name: 'E. Coli', value: 'Absent', unit: '/ 0.1 ml', fssaiLimit: 'Absent', status: 'NORMAL' },
      { name: 'Milk Fat', value: '4.2', unit: '% w/w', fssaiLimit: 'Min 4.0%', status: 'NORMAL' },
      { name: 'Solids-Not-Fat (SNF)', value: '8.7', unit: '% w/w', fssaiLimit: 'Min 8.5%', status: 'NORMAL' },
      { name: 'Urea Adulteration Test', value: 'Negative', unit: 'Qualitative', fssaiLimit: 'Negative', status: 'NORMAL' },
      { name: 'Detergent Residue', value: 'Negative', unit: 'Qualitative', fssaiLimit: 'Negative', status: 'NORMAL' },
      { name: 'Starch Adulteration', value: 'Negative', unit: 'Qualitative', fssaiLimit: 'Negative', status: 'NORMAL' },
      { name: 'Methylene Blue Reduction (MBRT)', value: '3.5', unit: 'Hours', fssaiLimit: '> 4.0 Hours', status: 'VIOLATION' }
    ]
  },
  {
    id: 'LAB-BLR-1029',
    batchId: 'C104',
    product: 'Chilled Broiler Chicken Fillets',
    labName: 'Southern Regional Food Quality Control Lab, Bengaluru',
    accreditation: 'NABL Certified TC-7102',
    testDate: '2026-08-30 08:30 IST',
    verdict: 'HIGH_RISK',
    summary: 'Microbiological test confirms pathogen proliferation exceeding safety thresholds following prolonged cold chain interruption during transport.',
    parameters: [
      { name: 'Salmonella spp.', value: 'Positive (Detected)', unit: '/ 25g', fssaiLimit: 'Absent in 25g', status: 'VIOLATION' },
      { name: 'Total Viable Count', value: '2.4 x 10^6', unit: 'CFU/g', fssaiLimit: '< 5.0 x 10^5 CFU/g', status: 'VIOLATION' },
      { name: 'Staphylococcus aureus', value: '420', unit: 'CFU/g', fssaiLimit: '< 100 CFU/g', status: 'VIOLATION' },
      { name: 'Volatile Nitrogen (TVBN)', value: '28.4', unit: 'mg / 100g', fssaiLimit: '< 20.0 mg/100g', status: 'VIOLATION' },
      { name: 'pH Value', value: '6.4', unit: 'pH scale', fssaiLimit: '5.8 - 6.2', status: 'BORDERLINE' }
    ]
  },
  {
    id: 'LAB-JPR-7721',
    batchId: 'O512',
    product: 'Cold-Pressed Pure Mustard Oil (1L Tin)',
    labName: 'Rajasthan State Food Testing Laboratory, Jaipur',
    accreditation: 'NABL Certified TC-4991',
    testDate: '2026-08-25 14:15 IST',
    verdict: 'PASS',
    summary: 'All physico-chemical parameters and safety indices comply strictly with FSSAI regulations for Kachi Ghani Mustard Oil.',
    parameters: [
      { name: 'Argemone Oil Test (TLC)', value: 'Negative', unit: 'Qualitative', fssaiLimit: 'Negative', status: 'NORMAL' },
      { name: 'Acid Value', value: '0.82', unit: 'mg KOH/g', fssaiLimit: 'Max 1.50', status: 'NORMAL' },
      { name: 'Iodine Value', value: '104.2', unit: 'g I2/100g', fssaiLimit: '98 - 110', status: 'NORMAL' },
      { name: 'Refractive Index at 40°C', value: '1.4652', unit: 'Index', fssaiLimit: '1.4646 - 1.4662', status: 'NORMAL' },
      { name: 'Moisture & Volatile Matter', value: '0.08', unit: '% w/w', fssaiLimit: 'Max 0.25%', status: 'NORMAL' },
      { name: 'Mineral Oil Adulteration', value: 'Negative', unit: 'Qualitative', fssaiLimit: 'Negative', status: 'NORMAL' }
    ]
  }
];

export const INITIAL_CITIZEN_REPORTS: CitizenReport[] = [
  {
    id: 'CIT-8921',
    productName: 'Pasteurized Whole Milk 500ml',
    batchOrLotNumber: 'M492',
    locationCity: 'New Delhi (Hauz Khas)',
    locationState: 'Delhi',
    timestamp: '2026-08-30 08:45 IST',
    symptoms: ['Milk curdled upon boiling', 'Yellowish discoloration', 'Sour metallic smell'],
    description: 'Bought 3 packets this morning from local store in Hauz Khas. When boiled for morning tea, all three packets instantly separated into sour whey.',
    purchaseLocation: 'Aggarwal Daily Provisions, Market 2, Hauz Khas',
    severity: 'MODERATE',
    status: 'LINKED_TO_CLUSTER',
    aiConfidence: 96,
    linkedBatchId: 'M492',
    anonymizedUser: 'Citizen #DL-9410 (Verified OTP)'
  },
  {
    id: 'CIT-8922',
    productName: 'Fresh Malai Paneer 200g',
    batchOrLotNumber: 'P812',
    locationCity: 'Gurugram (Sector 56)',
    locationState: 'Haryana',
    timestamp: '2026-08-30 09:30 IST',
    symptoms: ['Slimy surface', 'Acidic smell', 'Bloated plastic packet'],
    description: 'Pouch was swollen like a balloon. Opened it and the paneer block had slimy condensation on the edges.',
    purchaseLocation: 'Modern Bazaar, Sector 56 Galleria',
    severity: 'MODERATE',
    status: 'LINKED_TO_CLUSTER',
    aiConfidence: 94,
    linkedBatchId: 'P812',
    anonymizedUser: 'Citizen #GG-1823 (Verified OTP)'
  },
  {
    id: 'CIT-8923',
    productName: 'Chicken Breast Fillets 500g',
    batchOrLotNumber: 'C104',
    locationCity: 'Bengaluru (Indiranagar)',
    locationState: 'Karnataka',
    timestamp: '2026-08-30 11:15 IST',
    symptoms: ['Severe stomach cramps', 'Nausea & fever within 4 hours of dinner'],
    description: 'Ordered chicken dish from local cloud kitchen last night. 3 family members suffered severe stomach pain and vomiting this morning.',
    purchaseLocation: 'Urban Feast Cloud Kitchen, 100ft Road',
    severity: 'SEVERE',
    status: 'LINKED_TO_CLUSTER',
    aiConfidence: 91,
    linkedBatchId: 'C104',
    anonymizedUser: 'Citizen #BLR-4091 (Verified OTP)'
  },
  {
    id: 'CIT-8924',
    productName: 'Pasteurized Whole Milk 500ml',
    batchOrLotNumber: 'M492',
    locationCity: 'New Delhi (Saket)',
    locationState: 'Delhi',
    timestamp: '2026-08-30 12:00 IST',
    symptoms: ['Sour taste', 'Off-flavor'],
    description: 'Pouch printed with Batch M492 expired 02 Sep, but already spoiled when opened today.',
    purchaseLocation: 'Saket QuickMart Store',
    severity: 'MILD',
    status: 'LINKED_TO_CLUSTER',
    aiConfidence: 97,
    linkedBatchId: 'M492',
    anonymizedUser: 'Citizen #DL-3382 (Verified OTP)'
  }
];

export const INITIAL_BLOCKCHAIN_EVENTS: BlockchainEvent[] = [
  {
    id: 'BC-EV-01',
    batchId: 'M492',
    productName: 'Pasteurized Whole Milk (500ml)',
    eventType: 'PRODUCED',
    actor: 'Northern Dairy Processing Ltd (FSSAI Lic #1001402200192)',
    location: 'Manesar Dairy Plant #02, Haryana',
    timestamp: '2026-08-29 01:20:14 UTC',
    txHash: '0x8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a',
    blockRound: 42918402,
    network: 'ALGORAND_TESTNET',
    verificationStatus: 'VERIFIED',
    payloadSummary: 'Batch generated. Volume: 28,500 L. Raw test: Fat 4.2%, SNF 8.7%, MBRT > 5h.'
  },
  {
    id: 'BC-EV-02',
    batchId: 'M492',
    productName: 'Pasteurized Whole Milk (500ml)',
    eventType: 'LAB_TESTED',
    actor: 'Apex NABL Food Labs (Dr. R. K. Sharma, Cert #8921)',
    location: 'Apex Testing Lab, Gurugram',
    timestamp: '2026-08-29 06:45:22 UTC',
    txHash: '0x7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d',
    blockRound: 42918510,
    network: 'ALGORAND_TESTNET',
    verificationStatus: 'VERIFIED',
    payloadSummary: 'Microbiological baseline PASSED. Coliform < 10 CFU/ml. TPC 12,000 CFU/ml.'
  },
  {
    id: 'BC-EV-03',
    batchId: 'M492',
    productName: 'Pasteurized Whole Milk (500ml)',
    eventType: 'COLD_CHAIN_LOG',
    actor: 'IoT Telemetry Oracle #ORC-WH17-C3',
    location: 'Central Cold Storage #17, Okhla, New Delhi',
    timestamp: '2026-08-29 18:42:00 UTC',
    txHash: '0x6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c',
    blockRound: 42918894,
    network: 'ALGORAND_TESTNET',
    verificationStatus: 'VERIFIED',
    payloadSummary: 'AUTOMATED THERMAL ALERT: Chamber temperature 14.8°C (+10.8°C deviation) for 252 minutes.'
  },
  {
    id: 'BC-EV-04',
    batchId: 'M492',
    productName: 'Pasteurized Whole Milk (500ml)',
    eventType: 'INSPECTED',
    actor: 'Delhi Food Safety Authority Flying Squad #01',
    location: 'Central Cold Storage #17, Okhla, New Delhi',
    timestamp: '2026-08-30 14:10:00 UTC',
    txHash: '0x5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b',
    blockRound: 42919420,
    network: 'ALGORAND_TESTNET',
    verificationStatus: 'VERIFIED',
    payloadSummary: 'SEIZURE ORDER FILED: 18,200 remaining pouches tagged for destruction. Form VA served.'
  },
  {
    id: 'BC-EV-05',
    batchId: 'O512',
    productName: 'Cold-Pressed Pure Mustard Oil (1L Tin)',
    eventType: 'LAB_TESTED',
    actor: 'Rajasthan State Testing Lab (Jaipur)',
    location: 'Jaipur Extraction Unit, Rajasthan',
    timestamp: '2026-08-25 14:15:30 UTC',
    txHash: '0x4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a',
    blockRound: 42910122,
    network: 'ALGORAND_TESTNET',
    verificationStatus: 'VERIFIED',
    payloadSummary: 'TLC Argemone: Negative. Acid Value: 0.82 mg KOH/g. 100% PURE KACHI GHANI PASSPORT.'
  }
];

export const X402_ENDPOINTS_LIST: X402Endpoint[] = [
  {
    id: 'ep-1',
    method: 'POST',
    path: '/api/x402/risk-prediction',
    name: 'Predictive Food Batch Risk API',
    description: 'Returns real-time and 72-hour forecast degradation risk score for any food batch using multi-sensor IoT telemetry and environmental signals.',
    priceUsdc: 0.005,
    totalCalls: 3412,
    revenueUsdc: 17.06,
    avgLatencyMs: 142,
    exampleRequest: JSON.stringify({ batchId: 'M492', ambientTemp: 38.5, transportHours: 4.2 }, null, 2),
    exampleResponse: JSON.stringify({
      status: 200,
      batchId: 'M492',
      riskScore: 84,
      riskLevel: 'HIGH',
      forecast24h: 62,
      forecast48h: 31,
      forecast72h: 18,
      primaryRiskFactor: 'Cold-chain thermal excursion (+10.8°C)',
      recommendedIntervention: 'Immediate retail quarantine'
    }, null, 2)
  },
  {
    id: 'ep-2',
    method: 'GET',
    path: '/api/x402/batch/:id',
    name: 'Digital Food DNA Batch Identity',
    description: 'Retrieves complete tamper-proof digital food DNA record, NABL lab credentials, cold-chain history, and Algorand passport proof.',
    priceUsdc: 0.010,
    totalCalls: 2190,
    revenueUsdc: 21.90,
    avgLatencyMs: 98,
    exampleRequest: 'GET /api/x402/batch/M492',
    exampleResponse: JSON.stringify({
      batchId: 'M492',
      product: 'Pasteurized Whole Milk',
      blockchainTx: 'ALGO-TX-79F8B1A2C3D4E5F6G7H8J9K0L1M2N3P4',
      safetyScore: 16,
      journeySteps: 7,
      authenticity: 'VERIFIED'
    }, null, 2)
  },
  {
    id: 'ep-3',
    method: 'POST',
    path: '/api/x402/contamination-simulation',
    name: 'Contamination Spread & Intervention Simulation',
    description: 'Simulates multi-tier contamination propagation across supply chain nodes and computes exact exposure reduction under different intervention policies.',
    priceUsdc: 0.025,
    totalCalls: 1140,
    revenueUsdc: 28.50,
    avgLatencyMs: 220,
    exampleRequest: JSON.stringify({ originNode: 'Warehouse_17', intervention: 'CLOSE_WAREHOUSE', rerouteSupply: true }, null, 2),
    exampleResponse: JSON.stringify({
      exposureBefore: 48200,
      exposureAfter: 2100,
      exposureReductionPercent: 95.6,
      affectedNodesCount: 14,
      cleanSupplyRerouted: true,
      disruptionIndex: 'LOW'
    }, null, 2)
  },
  {
    id: 'ep-4',
    method: 'POST',
    path: '/api/x402/lab-analysis',
    name: 'AI Lab Report Adulteration & Compliance Analyzer',
    description: 'Extracts chemical/microbiological parameters from PDF/image/JSON lab assays, compares with FSSAI limits, and returns structured risk classification.',
    priceUsdc: 0.050,
    totalCalls: 890,
    revenueUsdc: 44.50,
    avgLatencyMs: 310,
    exampleRequest: JSON.stringify({ labReportId: 'LAB-DEL-8921', rawData: { tpc: 42000, coliform: 8, mbrt: 3.5 } }, null, 2),
    exampleResponse: JSON.stringify({
      verdict: 'WATCH',
      violationsCount: 1,
      flaggedParameters: ['Methylene Blue Reduction Time: 3.5h (threshold > 4.0h)'],
      adulterationConfidence: 0.04
    }, null, 2)
  },
  {
    id: 'ep-5',
    method: 'GET',
    path: '/api/x402/forecast/:region',
    name: 'Regional Food Safety 72-Hour Forecast',
    description: 'Provides forward-looking regional food safety risk curves based on weather forecasts, transport bottlenecks, and grid stability data.',
    priceUsdc: 0.020,
    totalCalls: 980,
    revenueUsdc: 19.60,
    avgLatencyMs: 165,
    exampleRequest: 'GET /api/x402/forecast/DL',
    exampleResponse: JSON.stringify({
      region: 'Delhi NCR',
      currentRisk: 86,
      peakRiskHour: '+18h',
      vulnerableCategories: ['Dairy', 'Poultry'],
      meteorologicalStressFactor: 1.42
    }, null, 2)
  },
  {
    id: 'ep-6',
    method: 'POST',
    path: '/api/x402/inspection-priority',
    name: 'AI Inspector Copilot Prioritization Engine',
    description: 'Generates algorithmically ranked inspection targets with customized evidence checklists, sample protocols, and equipment requirements.',
    priceUsdc: 0.020,
    totalCalls: 540,
    revenueUsdc: 10.80,
    avgLatencyMs: 190,
    exampleRequest: JSON.stringify({ region: 'Delhi NCR', availableInspectors: 4 }, null, 2),
    exampleResponse: JSON.stringify({
      topPriorities: [
        { rank: 1, target: 'Central Cold Storage #17', urgency: 'IMMEDIATE', risk: 94 },
        { rank: 2, target: 'Saket QuickMart', urgency: 'HIGH', risk: 72 }
      ]
    }, null, 2)
  },
  {
    id: 'ep-7',
    method: 'GET',
    path: '/api/x402/investigation-report/:id',
    name: 'AI Crime-Scene Multi-Source Investigation Dossier',
    description: 'Compiles full correlation matrix linking citizen complaints, supplier anomalies, telemetry spikes, and recommended regulatory enforcement steps.',
    priceUsdc: 0.100,
    totalCalls: 420,
    revenueUsdc: 42.00,
    avgLatencyMs: 380,
    exampleRequest: 'GET /api/x402/investigation-report/INV-2026-089',
    exampleResponse: JSON.stringify({
      investigationId: 'INV-2026-089',
      title: 'Delhi-NCR Dairy Spoilage Cluster',
      sourceEntity: 'Warehouse #17 Compressor',
      confidence: 94,
      evidenceCorrelation: 'STRONG',
      recommendedLegalNotice: 'FSSAI Section 38 Seizure Order'
    }, null, 2)
  }
];

export const INITIAL_X402_SETTLEMENTS: X402Settlement[] = [
  {
    id: 'SETTLE-9812',
    agentName: 'HedgeShield Cargo Insurance AI',
    agentType: 'Insurance AI',
    endpoint: '/api/x402/risk-prediction',
    amountUsdc: 0.005,
    network: 'Algorand TestNet (ASA 31566704)',
    txId: 'TX-ALGO-402-99A1B2C3D4E5F6G7',
    status: 'SETTLED',
    timestamp: '2026-08-30 21:40:12 IST',
    dataUnlocked: 'Batch M492 Underwriting Risk & Degradation Horizon'
  },
  {
    id: 'SETTLE-9813',
    agentName: 'FastLogix Cold Chain Route Optimizer',
    agentType: 'Logistics AI',
    endpoint: '/api/x402/contamination-simulation',
    amountUsdc: 0.025,
    network: 'Algorand TestNet (ASA 31566704)',
    txId: 'TX-ALGO-402-88B2C3D4E5F6G7H8',
    status: 'SETTLED',
    timestamp: '2026-08-30 21:42:30 IST',
    dataUnlocked: 'Delhi-NCR Dairy Supply Rerouting Optimization Plan'
  },
  {
    id: 'SETTLE-9814',
    agentName: 'GovGuard Municipal Food Health AI',
    agentType: 'Government AI',
    endpoint: '/api/x402/inspection-priority',
    amountUsdc: 0.020,
    network: 'Algorand TestNet (ASA 31566704)',
    txId: 'TX-ALGO-402-77C3D4E5F6G7H8J9',
    status: 'SETTLED',
    timestamp: '2026-08-30 21:45:10 IST',
    dataUnlocked: 'Ranked Inspection Queue & Evidence Checklists for NCR'
  },
  {
    id: 'SETTLE-9815',
    agentName: 'RestoSafe Automated Kitchen Procurement',
    agentType: 'Restaurant AI',
    endpoint: '/api/x402/batch/M492',
    amountUsdc: 0.010,
    network: 'Algorand TestNet (ASA 31566704)',
    txId: 'TX-ALGO-402-66D4E5F6G7H8J9K0',
    status: 'SETTLED',
    timestamp: '2026-08-30 21:48:44 IST',
    dataUnlocked: 'Digital Food DNA & Cold Chain Validation Token'
  },
  {
    id: 'SETTLE-9816',
    agentName: 'AgroHedging Derivative Risk Engine',
    agentType: 'Risk Hedge AI',
    endpoint: '/api/x402/investigation-report/INV-2026-089',
    amountUsdc: 0.100,
    network: 'Algorand TestNet (ASA 31566704)',
    txId: 'TX-ALGO-402-55E5F6G7H8J9K0L1',
    status: 'SETTLED',
    timestamp: '2026-08-30 21:50:02 IST',
    dataUnlocked: 'Full Dossier on Dairy Cold Storage Failure & Recall Probability'
  }
];

export const SUPPLY_GRAPH_NODES: GraphNode[] = [
  { id: 'SRC-01', label: 'Anand Dairy Collective', type: 'SUPPLIER', city: 'Anand, Gujarat', risk: 12 },
  { id: 'SRC-02', label: 'Karnal Organic Farms', type: 'SUPPLIER', city: 'Karnal, Haryana', risk: 18 },
  { id: 'SRC-03', label: 'Guntur Spice Mandi', type: 'SUPPLIER', city: 'Guntur, AP', risk: 24 },
  { id: 'SRC-04', label: 'Cauvery Bio-Farms', type: 'SUPPLIER', city: 'Erode, TN', risk: 38 },
  { id: 'SRC-05', label: 'Alwar Mustard Collective', type: 'SUPPLIER', city: 'Alwar, RJ', risk: 14 },
  
  { id: 'FAC-01', label: 'Manesar Dairy Plant #02', type: 'FACTORY', city: 'Manesar, Haryana', risk: 22 },
  { id: 'FAC-02', label: 'Ambala Dairy Processing', type: 'FACTORY', city: 'Ambala, Punjab', risk: 28 },
  { id: 'FAC-03', label: 'Sunrise Grinding Plant', type: 'FACTORY', city: 'Hyderabad, TS', risk: 54, isAnomaly: true },
  { id: 'FAC-04', label: 'Coimbatore Abattoir', type: 'FACTORY', city: 'Coimbatore, TN', risk: 42 },
  { id: 'FAC-05', label: 'Jaipur Extraction Unit', type: 'FACTORY', city: 'Jaipur, RJ', risk: 10 },

  { id: 'LAB-01', label: 'Apex NABL Food Labs', type: 'LABORATORY', city: 'Gurugram, HR', risk: 8 },
  { id: 'LAB-02', label: 'Southern QC Regional Lab', type: 'LABORATORY', city: 'Bengaluru, KA', risk: 12 },
  { id: 'LAB-03', label: 'Rajasthan State Testing Lab', type: 'LABORATORY', city: 'Jaipur, RJ', risk: 6 },

  { id: 'WH-17', label: 'Central Cold Storage #17', type: 'WAREHOUSE', city: 'Okhla, New Delhi', risk: 94, isAnomaly: true },
  { id: 'WH-04', label: 'Bhiwandi Logistics Park', type: 'WAREHOUSE', city: 'Bhiwandi, MH', risk: 48 },
  { id: 'WH-09', label: 'Yeshwanthpur Cold Complex', type: 'WAREHOUSE', city: 'Bengaluru, KA', risk: 89, isAnomaly: true },
  { id: 'WH-12', label: 'Kishangarh Agro Depot', type: 'WAREHOUSE', city: 'Kishangarh, RJ', risk: 14 },

  { id: 'TR-01', label: 'Reefer Fleet DL-01-EE', type: 'TRANSPORT', city: 'Delhi-NCR Route', risk: 78, isAnomaly: true },
  { id: 'TR-02', label: 'GT Road Freight Link', type: 'TRANSPORT', city: 'Punjab-Delhi Corridor', risk: 32 },
  { id: 'TR-03', label: 'Western Highway Fleet', type: 'TRANSPORT', city: 'Hyd-Mumbai Route', risk: 28 },
  { id: 'TR-04', label: 'Hosur Express Truck', type: 'TRANSPORT', city: 'Erode-BLR Route', risk: 84, isAnomaly: true },

  { id: 'DIST-01', label: 'Apex FMCG Distributors', type: 'DISTRIBUTOR', city: 'Mayapuri, Delhi', risk: 86, isAnomaly: true },
  { id: 'DIST-02', label: 'North Delhi Dairy Hub', type: 'DISTRIBUTOR', city: 'Chandni Chowk, DL', risk: 52 },
  { id: 'DIST-03', label: 'Western Spice Wholesalers', type: 'DISTRIBUTOR', city: 'Mumbai, MH', risk: 38 },
  { id: 'DIST-04', label: 'Karnataka Fresh Meats', type: 'DISTRIBUTOR', city: 'Bengaluru, KA', risk: 76 },

  { id: 'RET-01', label: 'Saket QuickMart Superstore', type: 'RETAILER', city: 'Saket, Delhi', risk: 82, isAnomaly: true },
  { id: 'RET-02', label: 'Hauz Khas Daily Provisions', type: 'RETAILER', city: 'Hauz Khas, Delhi', risk: 80, isAnomaly: true },
  { id: 'RET-03', label: 'Galleria Modern Bazaar', type: 'RETAILER', city: 'Gurugram, HR', risk: 65 },
  { id: 'RET-04', label: 'Indiranagar Cloud Kitchens', type: 'RESTAURANT', city: 'Bengaluru, KA', risk: 88, isAnomaly: true },
  { id: 'RET-05', label: 'Koramangala Dine-In Hub', type: 'RESTAURANT', city: 'Bengaluru, KA', risk: 84, isAnomaly: true },

  { id: 'BATCH-M492', label: 'Batch #M492 (Milk)', type: 'BATCH', city: 'Active in Delhi NCR', risk: 84, isAnomaly: true },
  { id: 'BATCH-P812', label: 'Batch #P812 (Paneer)', type: 'BATCH', city: 'Active in Delhi/GG', risk: 71, isAnomaly: true },
  { id: 'BATCH-C104', label: 'Batch #C104 (Poultry)', type: 'BATCH', city: 'Active in Bengaluru', risk: 89, isAnomaly: true },
  { id: 'BATCH-O512', label: 'Batch #O512 (Mustard Oil)', type: 'BATCH', city: 'All India Retail', risk: 14 }
];

export const SUPPLY_GRAPH_EDGES: GraphEdge[] = [
  { id: 'e1', source: 'SRC-01', target: 'FAC-01', label: 'SUPPLIES', riskPassed: 12 },
  { id: 'e2', source: 'FAC-01', target: 'LAB-01', label: 'TESTED_BY', riskPassed: 14 },
  { id: 'e3', source: 'FAC-01', target: 'BATCH-M492', label: 'PRODUCES', riskPassed: 20 },
  { id: 'e4', source: 'BATCH-M492', target: 'WH-17', label: 'STORED_AT', riskPassed: 94, isHighlighted: true },
  { id: 'e5', source: 'WH-17', target: 'TR-01', label: 'TRANSPORTED_BY', riskPassed: 88, isHighlighted: true },
  { id: 'e6', source: 'TR-01', target: 'DIST-01', label: 'DISTRIBUTED_TO', riskPassed: 86, isHighlighted: true },
  { id: 'e7', source: 'DIST-01', target: 'RET-01', label: 'SOLD_TO', riskPassed: 82, isHighlighted: true },
  { id: 'e8', source: 'DIST-01', target: 'RET-02', label: 'SOLD_TO', riskPassed: 80, isHighlighted: true },
  
  { id: 'e9', source: 'SRC-02', target: 'FAC-02', label: 'SUPPLIES', riskPassed: 18 },
  { id: 'e10', source: 'FAC-02', target: 'BATCH-P812', label: 'PRODUCES', riskPassed: 24 },
  { id: 'e11', source: 'BATCH-P812', target: 'WH-17', label: 'STORED_AT', riskPassed: 71, isHighlighted: true },
  { id: 'e12', source: 'WH-17', target: 'RET-03', label: 'SOLD_TO', riskPassed: 65, isHighlighted: true },

  { id: 'e13', source: 'SRC-04', target: 'FAC-04', label: 'SUPPLIES', riskPassed: 38 },
  { id: 'e14', source: 'FAC-04', target: 'BATCH-C104', label: 'PRODUCES', riskPassed: 40 },
  { id: 'e15', source: 'BATCH-C104', target: 'TR-04', label: 'TRANSPORTED_BY', riskPassed: 84, isHighlighted: true },
  { id: 'e16', source: 'TR-04', target: 'WH-09', label: 'STORED_AT', riskPassed: 89, isHighlighted: true },
  { id: 'e17', source: 'WH-09', target: 'DIST-04', label: 'DISTRIBUTED_TO', riskPassed: 76, isHighlighted: true },
  { id: 'e18', source: 'DIST-04', target: 'RET-04', label: 'SOLD_TO', riskPassed: 88, isHighlighted: true },
  { id: 'e19', source: 'DIST-04', target: 'RET-05', label: 'SOLD_TO', riskPassed: 84, isHighlighted: true },

  { id: 'e20', source: 'SRC-05', target: 'FAC-05', label: 'SUPPLIES', riskPassed: 10 },
  { id: 'e21', source: 'FAC-05', target: 'LAB-03', label: 'TESTED_BY', riskPassed: 6 },
  { id: 'e22', source: 'FAC-05', target: 'BATCH-O512', label: 'PRODUCES', riskPassed: 10 },
  { id: 'e23', source: 'BATCH-O512', target: 'WH-12', label: 'STORED_AT', riskPassed: 12 }
];
