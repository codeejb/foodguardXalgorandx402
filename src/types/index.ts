export type RiskLevel = 'LOW' | 'WATCH' | 'HIGH' | 'CRITICAL';

export type UserRole =
  | 'FOOD_SAFETY_AUTHORITY'
  | 'INSPECTOR'
  | 'MANUFACTURER'
  | 'SUPPLIER'
  | 'LABORATORY'
  | 'LOGISTICS'
  | 'RESTAURANT'
  | 'CONSUMER';

export type EntityType =
  | 'SUPPLIER'
  | 'FACTORY'
  | 'LABORATORY'
  | 'WAREHOUSE'
  | 'TRANSPORT'
  | 'DISTRIBUTOR'
  | 'RETAILER'
  | 'RESTAURANT'
  | 'BATCH';

export interface FoodBatch {
  id: string; // e.g. M492
  batchId?: string;
  dnaPassportId?: string;
  productName: string;
  category: 'Dairy' | 'Meat & Poultry' | 'Spices' | 'Edible Oils' | 'Grains' | 'Beverages' | 'Produce' | 'Ready-to-Eat' | string;
  currentRiskScore: number;
  riskLevel: RiskLevel;
  safetyScore: number;
  forecastRisk24h: number;
  forecastRisk48h: number;
  forecastRisk72h: number;
  status: 'SAFE' | 'WATCH' | 'QUARANTINED' | 'RECALLED' | 'DELIVERED';
  productionDate: string;
  expiryDate: string;
  sourceOrigin: string;
  originLocation?: string;
  currentLocation?: string;
  supplierName: string;
  factoryName: string;
  manufacturer?: string;
  quantity?: string;
  warehouseLocation: string;
  transportRoute: string;
  distributorName: string;
  retailerName: string;
  batchVolume: string;
  temperatureAvg: number;
  temperatureMax: number;
  temperatureSpikeHours: number;
  humidityAvg: number;
  labVerified: boolean;
  labReportId?: string;
  labReportSummary?: { verdict: string; details?: string };
  inspectionHistoryCount: number;
  complaintCount: number;
  blockchainTx: string;
  blockchainHash?: string;
  blockchainRound?: number;
  blockchainStatus: 'VERIFIED' | 'PENDING' | 'DEMO';
  aiExplanation: string;
  journey: SupplyChainStep[];
  telemetryHistory?: { time: string; temperature: number; humidity?: number }[];
  timeline?: { stage: string; location: string; timestamp: string; details: string; sensorReading?: string; status: string }[];
}

export interface SupplyChainStep {
  stage: 'SOURCE' | 'SUPPLIER' | 'FACTORY' | 'LAB' | 'WAREHOUSE' | 'TRANSPORT' | 'DISTRIBUTOR' | 'RETAILER' | 'CONSUMER' | string;
  location: string;
  timestamp: string;
  actor: string;
  temperature: number;
  humidity: number;
  status: 'NORMAL' | 'ANOMALY' | 'ALERT';
  txHash: string;
  notes: string;
}

export interface StateRiskData {
  stateCode: string;
  stateName: string;
  riskScore: number;
  riskLevel: RiskLevel;
  riskTrend: number;
  activeIncidents: number;
  affectedBatches: number;
  complaintClusters: number;
  weatherSignal: string;
  supplyChainRisk: string;
  aiExplanation: string;
  recommendedAction: string;
  coordinates: [number, number];
}

export interface AnomalyRecord {
  id: string;
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidence: number;
  detectedAt?: string;
  discoveredAt?: string;
  category: 'TEMPERATURE' | 'COMPLAINT_CLUSTER' | 'SUPPLIER_SWITCH' | 'LAB_DRIFT' | 'TRANSPORT_DELAY' | string;
  relatedBatchId?: string;
  relatedBatches?: string[];
  batchId?: string;
  relatedEntity?: string;
  sourceEntity?: string;
  status?: 'NEW' | 'INVESTIGATING' | 'DISMISSED' | 'RESOLVED' | 'ACTIVE' | 'UNDER_REVIEW' | 'OPEN';
  suggestedAction?: string;
  actionTaken?: boolean;
  aiExplanation?: string;
  hypothesis?: string;
  rootCause?: string;
}

export type Anomaly = AnomalyRecord;

export interface InvestigationLead {
  id: string;
  title: string;
  targetProduct?: string;
  potentialSource?: string;
  confidence?: number;
  confidenceScore?: number;
  status: 'ACTIVE' | 'RESOLVED' | 'UNDER_REVIEW' | 'INVESTIGATING' | 'OPEN' | string;
  leadType?: string;
  sourceEntity?: string;
  relatedBatches?: string[];
  evidenceCorrelations?: string[];
  aiNarrative?: string;
  estimatedExposure?: number;
  complaintCount?: number;
  temperatureDeviation?: string;
  evidencePoints?: string[];
  evidenceItems?: { id: string; type: string; title: string; timestamp: string; description: string; metricValue: string }[];
  connectedBatches?: string[];
  connectedLocations?: string[];
  recommendedAction?: string;
  recommendedActions?: string[];
  rootCauseHypothesis?: string;
  suspectBatchId?: string;
  createdAt: string;
}

export type Investigation = InvestigationLead;

export interface InspectionPriority {
  rank?: number;
  priorityRank?: number;
  id: string;
  targetName?: string;
  entityName?: string;
  facilityName?: string;
  facilityLocation?: string;
  targetBatchId?: string;
  targetType?: 'WAREHOUSE' | 'RESTAURANT' | 'FACTORY' | 'BATCH' | 'DISTRIBUTOR' | string;
  entityType?: string;
  location: string;
  riskScore: number;
  riskLevel?: RiskLevel;
  reason?: string;
  reasons?: string[];
  checklist?: string[];
  equipmentNeeded?: string[];
  sampleProtocols?: string[];
  suggestedOfficerActions?: string[];
  estimatedDuration?: string;
  recommendedDate?: string;
  digitalPassportId?: string;
  complianceScore?: number;
  urgency: 'IMMEDIATE' | 'HIGH' | 'ROUTINE' | 'SCHEDULED';
}

export type InspectionPlan = InspectionPriority;

export interface LabReportData {
  id: string;
  batchId: string;
  product: string;
  labName: string;
  accreditation: string;
  testDate: string;
  verdict: 'PASS' | 'WATCH' | 'HIGH_RISK';
  summary: string;
  parameters: {
    name: string;
    value: string;
    unit: string;
    fssaiLimit: string;
    status: 'NORMAL' | 'BORDERLINE' | 'VIOLATION';
  }[];
}

export interface CitizenReport {
  id: string;
  productName: string;
  batchOrLotNumber?: string;
  batchIdHint?: string;
  locationCity?: string;
  locationState?: string;
  city?: string;
  location?: string;
  pinCode?: string;
  timestamp?: string;
  reportedAt?: string;
  symptoms: string[] | string;
  description?: string;
  purchaseLocation?: string;
  severity?: 'MILD' | 'MODERATE' | 'SEVERE';
  status?: 'RECEIVED' | 'VERIFIED' | 'LINKED_TO_CLUSTER';
  aiConfidence?: number;
  linkedBatchId?: string;
  anonymizedUser?: string;
  verified?: boolean;
}

export interface BlockchainEvent {
  id: string;
  batchId: string;
  productName: string;
  eventType: 'PRODUCED' | 'LAB_TESTED' | 'STORED' | 'TRANSPORT_START' | 'COLD_CHAIN_LOG' | 'INSPECTED' | 'DISTRIBUTED' | 'RECALLED' | string;
  actor: string;
  location: string;
  timestamp: string;
  txHash: string;
  blockRound: number;
  network: 'ALGORAND_TESTNET' | 'ALGORAND_DEMO' | string;
  verificationStatus: 'VERIFIED' | 'DEMO_RECORD' | string;
  status?: string;
  payloadSummary: string;
}

export interface X402Endpoint {
  id: string;
  method: 'GET' | 'POST';
  path: string;
  name: string;
  description: string;
  priceUsdc: number;
  totalCalls: number;
  revenueUsdc: number;
  avgLatencyMs: number;
  exampleRequest: string;
  exampleResponse: string;
}

export interface X402Settlement {
  id: string;
  agentName: string;
  agentType: 'Insurance AI' | 'Logistics AI' | 'Restaurant AI' | 'Government AI' | 'Supply Chain AI' | 'Risk Hedge AI' | string;
  endpoint: string;
  amountUsdc: number;
  network: string;
  txId: string;
  txHash?: string;
  status: 'SETTLED' | 'PENDING' | 'REJECTED' | string;
  timestamp: string;
  dataUnlocked: string;
}

export interface ContaminationNode {
  id: string;
  name: string;
  type: EntityType;
  city: string;
  currentExposure: number;
  riskLevel: RiskLevel;
  connectedChildren: string[];
  status: 'ACTIVE' | 'QUARANTINED' | 'REROUTED';
}

export interface GraphNode {
  id: string;
  label: string;
  type: EntityType;
  city: string;
  risk: number;
  isAnomaly?: boolean;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: 'SUPPLIES' | 'PRODUCES' | 'TESTED_BY' | 'STORED_AT' | 'TRANSPORTED_BY' | 'DISTRIBUTED_TO' | 'SOLD_TO';
  riskPassed: number;
  isHighlighted?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  role: UserRole;
  authMethod: 'google' | 'phone';
  avatarUrl?: string;
  algoWalletAddress?: string;
  algoBalance?: number;
  verifiedAt: string;
}

export interface AlgoTransactionRecord {
  txId: string;
  round: number;
  from: string;
  to: string;
  amountAlgo: number;
  amountUsdc?: number;
  purpose: string;
  timestamp: string;
  status: 'CONFIRMED' | 'PENDING' | 'FAILED';
  note?: string;
}

// 7 Required Upload Columns
export interface RawBatchInput {
  Batch_ID: string;
  Product_Name: string;
  Temperature_C: number | string;
  Transport_Hours: number | string;
  Lab_Status: string;
  Complaint_Count: number | string;
  Storage_Condition: string;
  [key: string]: any;
}

export interface DataQualityReport {
  totalRecords: number;
  validRecords: number;
  warningsCount: number;
  errorsCount: number;
  warnings: string[];
  errors: string[];
  missingColumns: string[];
  duplicates: string[];
  confidenceModifier: number; // 0.6 - 1.0 based on completeness
}

export type RiskGrade = 'Low' | 'Watch' | 'Moderate' | 'High' | 'Critical';

export interface BatchPrediction {
  batchId: string;
  productName: string;
  predictedRiskScore: number; // 0 - 100
  riskLevel: RiskGrade;
  confidence: number; // e.g. 84%
  whyFlagged: string[];
  evidence: {
    temperatureC: number;
    transportHours: number;
    labStatus: string;
    complaintCount: number;
    storageCondition: string;
  };
  recommendedAction: string;
  verificationRequired: string;
  aiLimitation: string;
  timeMachine: {
    now: number;
    h6: number;
    h12: number;
    h24: number;
    h48: number;
    h72: number;
  };
  anomalyFlag?: string;
  shapExplanations?: ShapFeatureExplanation[];
  engineeredFeatures?: Record<string, number>;
  modelVersion?: string;
  featureVersion?: string;
  riskProbability?: number;
  escalationProbability?: number;
  complaintSpikeProbability?: number;
  verificationPriority?: string;
}

export interface ShapFeatureExplanation {
  feature: string;
  displayName: string;
  shapValue: number;
  percentageContribution: number;
  impactLevel: 'HIGH IMPACT' | 'MEDIUM IMPACT' | 'LOW IMPACT';
  direction: 'INCREASED RISK' | 'REDUCED RISK';
  observedValue: number;
}

export interface WhatIfSimulationResult {
  scenario: string;
  batchId: string;
  baselineRisk: number;
  scenarioRisk: number;
  estimatedChangePoints: number;
  percentageReduction: number;
  baselineLevel: string;
  scenarioLevel: string;
  disclaimer: string;
}

export interface ModelEvaluationMetrics {
  modelName: string;
  modelVersion: string;
  datasetLabel: string;
  trainingRecordsCount: number;
  testRecordsCount: number;
  classificationMetrics: {
    precision: number;
    recall: number;
    f1Score: number;
    rocAuc: number;
    prAuc: number;
    confusionMatrix: {
      truePositive: number;
      falsePositive: number;
      trueNegative: number;
      falseNegative: number;
    };
    calibrationBrierScore: number;
  };
  regressionMetrics: {
    mae: number;
    rmse: number;
    r2Score: number;
  };
  topShapFeatures: {
    feature: string;
    meanAbsShap: number;
  }[];
}

export type DatasetMode = 'USER_UPLOAD' | 'DEMO';

export type DatasetSummaryStats = {
  totalBatches: number;
  highRiskBatches: number;
  criticalBatches: number;
  activeAnomalies: number;
  complaintSignals: number;
  labWarnings: number;
  storageWarnings: number;
  highestRiskProduct: string;
  emergingThreats: number;
  averageRiskScore: number;
};

export interface DatasetMetadata {
  datasetId: string;
  uploadTime: string;
  dataSource: string;
  mode: DatasetMode;
  fileName?: string;
  summaryStats: DatasetSummaryStats;
}

export interface CentralAlert {
  id: string;
  type: 'High-Risk Batch' | 'Temperature Anomaly' | 'Complaint Cluster' | 'Lab Warning' | 'Storage Warning' | 'Supply-Chain Anomaly' | 'Data Mismatch' | 'Emerging Risk';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  batchId?: string;
  timestamp: string;
  actionRequired: string;
}

export interface ModelFeedback {
  id: string;
  batchId: string;
  predictedRisk: number;
  actualResult: string;
  predictionCorrect: boolean;
  labResult: string;
  actionTaken: string;
  timestamp: string;
}

