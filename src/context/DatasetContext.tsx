import React, { createContext, useContext, useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import {
  RawBatchInput,
  DataQualityReport,
  BatchPrediction,
  DatasetMode,
  DatasetMetadata,
  DatasetSummaryStats,
  FoodBatch,
  AnomalyRecord,
  InvestigationLead,
  InspectionPriority,
  CentralAlert,
  ModelFeedback,
  GraphNode,
  GraphEdge
} from '../types';
import {
  validateAndCleanData,
  calculateBatchPrediction,
  detectAnomaliesAcrossDataset,
  generateInvestigationLeads,
  generateInspectionPriorities,
  generateCentralAlerts,
  generateSupplyChainGraph,
  convertPredictionToFoodBatch,
  downloadSampleExcelFile,
  SYNTHETIC_DEMO_DATA
} from '../services/dataIntelligenceEngine';

export const DEFAULT_SUMMARY_STATS: DatasetSummaryStats = {
  totalBatches: 28,
  highRiskBatches: 3,
  criticalBatches: 2,
  activeAnomalies: 5,
  complaintSignals: 34,
  labWarnings: 4,
  storageWarnings: 3,
  highestRiskProduct: 'Mother Dairy Buffalo Milk (84/100)',
  emergingThreats: 5,
  averageRiskScore: 42
};

export interface DatasetContextValue {
  hasDataset: boolean;
  metadata: DatasetMetadata | null;
  dataset: DatasetMetadata | null;
  summaryStats: DatasetSummaryStats;
  mode: DatasetMode;
  qualityReport: DataQualityReport | null;
  predictions: BatchPrediction[];
  foodBatches: FoodBatch[];
  anomalies: AnomalyRecord[];
  investigations: InvestigationLead[];
  inspections: InspectionPriority[];
  alerts: CentralAlert[];
  graph: { nodes: GraphNode[]; edges: GraphEdge[] };
  selectedBatch: BatchPrediction | null;
  selectedBatchId: string;
  setSelectedBatchId: (id: string) => void;
  setSelectedBatch: (batch: FoodBatch | BatchPrediction | string | null) => void;
  downloadSampleTemplate: () => void;
  feedbackList: ModelFeedback[];
  isProcessing: boolean;
  processingStep: string;
  uploadModalOpen: boolean;
  setUploadModalOpen: (open: boolean) => void;
  feedbackModalOpen: boolean;
  setFeedbackModalOpen: (open: boolean) => void;
  reportModalOpen: boolean;
  setReportModalOpen: (open: boolean) => void;
  loadDemoData: () => Promise<void>;
  processRawData: (rows: RawBatchInput[], mode: DatasetMode, dataSourceName: string) => Promise<void>;
  parseAndUploadFile: (file: File) => Promise<{ report: DataQualityReport; success: boolean }>;
  resetToNoData: () => void;
  addFeedback: (fb: Omit<ModelFeedback, 'id' | 'timestamp'>) => void;
  addCitizenComplaint: (batchId: string, product: string, complaintType: string, desc: string) => void;
  simulateSpread: (batchId: string) => {
    connectedLocations: string[];
    connectedBatches: string[];
    potentiallyAffectedNetwork: string;
    recommendedContainmentPoint: string;
    estimatedExposure: number;
  };
  runWhatIf: (type: string, batchId: string) => {
    affectedBatches: number;
    affectedLocations: number;
    riskReductionPercent: number;
    supplyDisruption: string;
    recommendedOption: string;
  };
}

const DatasetContext = createContext<DatasetContextValue | undefined>(undefined);

export const DatasetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasDataset, setHasDataset] = useState<boolean>(true);
  const [metadata, setMetadata] = useState<DatasetMetadata | null>(null);
  const [qualityReport, setQualityReport] = useState<DataQualityReport | null>(null);
  const [predictions, setPredictions] = useState<BatchPrediction[]>([]);
  const [foodBatches, setFoodBatches] = useState<FoodBatch[]>([]);
  const [anomalies, setAnomalies] = useState<AnomalyRecord[]>([]);
  const [investigations, setInvestigations] = useState<InvestigationLead[]>([]);
  const [inspections, setInspections] = useState<InspectionPriority[]>([]);
  const [alerts, setAlerts] = useState<CentralAlert[]>([]);
  const [graph, setGraph] = useState<{ nodes: GraphNode[]; edges: GraphEdge[] }>({ nodes: [], edges: [] });
  const [selectedBatchId, setSelectedBatchId] = useState<string>('M492');
  const [feedbackList, setFeedbackList] = useState<ModelFeedback[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [uploadModalOpen, setUploadModalOpen] = useState<boolean>(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState<boolean>(false);
  const [reportModalOpen, setReportModalOpen] = useState<boolean>(false);

  // Core processor that turns raw 7-column rows into complete intelligence ecosystem
  const processRawData = async (rows: RawBatchInput[], mode: DatasetMode, dataSourceName: string) => {
    setIsProcessing(true);
    setProcessingStep('Validating Data & Schema Quality...');

    // 1. Validation & Cleaning
    const { report, cleanedRecords } = validateAndCleanData(rows);
    setQualityReport(report);

    await new Promise((r) => setTimeout(r, 200));
    setProcessingStep('Running Cold-Chain Kinetic Risk Models...');

    // 2. Predictions for each batch
    const newPredictions = cleanedRecords.map((rec) =>
      calculateBatchPrediction(rec, report.confidenceModifier)
    );

    await new Promise((r) => setTimeout(r, 200));
    setProcessingStep('Detecting Unsupervised Anomalies & Drift...');

    // 3. Anomalies
    const newAnomalies = detectAnomaliesAcrossDataset(newPredictions);

    await new Promise((r) => setTimeout(r, 150));
    setProcessingStep('Synthesizing Epidemiological Investigations...');

    // 4. Investigations
    const newInvestigations = generateInvestigationLeads(newPredictions, newAnomalies);

    await new Promise((r) => setTimeout(r, 150));
    setProcessingStep('Ranking Field Inspection Priorities...');

    // 5. Inspection Priorities
    const newInspections = generateInspectionPriorities(newPredictions);

    // 6. Central Alerts
    const newAlerts = generateCentralAlerts(newPredictions, newAnomalies);

    // 7. Graph Topology
    const newGraph = generateSupplyChainGraph(newPredictions);

    // 8. FoodBatches
    const newFoodBatches = newPredictions.map((p) => convertPredictionToFoodBatch(p));

    // 9. Dataset Summary Stats
    const highRiskCount = newPredictions.filter((p) => p.predictedRiskScore >= 61 && p.predictedRiskScore < 81).length;
    const criticalCount = newPredictions.filter((p) => p.predictedRiskScore >= 81).length;
    const complaintCount = newPredictions.reduce((acc, p) => acc + p.evidence.complaintCount, 0);
    const labWarnCount = newPredictions.filter((p) => p.evidence.labStatus === 'Fail' || p.evidence.labStatus === 'Borderline').length;
    const storageWarnCount = newPredictions.filter((p) => p.evidence.storageCondition.toLowerCase().includes('poor') || p.evidence.storageCondition.toLowerCase().includes('inadequate')).length;
    
    // Highest risk product
    const sortedByRisk = [...newPredictions].sort((a, b) => b.predictedRiskScore - a.predictedRiskScore);
    const highestRiskProduct = sortedByRisk.length > 0 ? `${sortedByRisk[0].productName} (${sortedByRisk[0].predictedRiskScore}/100)` : 'None';
    const averageRisk = newPredictions.length > 0 ? Math.round(newPredictions.reduce((acc, p) => acc + p.predictedRiskScore, 0) / newPredictions.length) : 0;

    const datasetId = mode === 'DEMO'
      ? `DS-DEMO-SYNTHETIC-${Math.floor(1000 + Math.random() * 9000)}`
      : `DS-USER-${Date.now().toString().slice(-6)}`;

    const newMetadata: DatasetMetadata = {
      datasetId,
      uploadTime: new Date().toISOString(),
      dataSource: dataSourceName,
      mode,
      fileName: dataSourceName,
      summaryStats: {
        totalBatches: newPredictions.length,
        highRiskBatches: highRiskCount,
        criticalBatches: criticalCount,
        activeAnomalies: newAnomalies.length,
        complaintSignals: complaintCount,
        labWarnings: labWarnCount,
        storageWarnings: storageWarnCount,
        highestRiskProduct,
        emergingThreats: highRiskCount + criticalCount,
        averageRiskScore: averageRisk
      }
    };

    setMetadata(newMetadata);
    setPredictions(newPredictions);
    setFoodBatches(newFoodBatches);
    setAnomalies(newAnomalies);
    setInvestigations(newInvestigations);
    setInspections(newInspections);
    setAlerts(newAlerts);
    setGraph(newGraph);
    setHasDataset(true);

    if (newPredictions.length > 0) {
      setSelectedBatchId(newPredictions[0].batchId);
    }

    // Sync to backend asynchronously
    try {
      fetch('/api/upload-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          datasetId,
          mode,
          dataSource: dataSourceName,
          rows: cleanedRecords.map((c) => c.raw),
          summaryStats: newMetadata.summaryStats
        })
      }).catch(() => {});
    } catch {}

    setIsProcessing(false);
    setProcessingStep('');
  };

  // Load Demo Data
  const loadDemoData = async () => {
    await processRawData(SYNTHETIC_DEMO_DATA, 'DEMO', 'FOODGUARD X Synthetic Reference Dataset');
  };

  // Parse and Upload Excel / CSV file
  const parseAndUploadFile = async (file: File): Promise<{ report: DataQualityReport; success: boolean }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const data = e.target?.result;
          let parsedRows: any[] = [];

          if (file.name.endsWith('.csv')) {
            const text = data as string;
            const wb = XLSX.read(text, { type: 'string' });
            const firstSheet = wb.SheetNames[0];
            parsedRows = XLSX.utils.sheet_to_json(wb.Sheets[firstSheet]);
          } else {
            const buffer = data as ArrayBuffer;
            const wb = XLSX.read(buffer, { type: 'array' });
            const firstSheet = wb.SheetNames[0];
            parsedRows = XLSX.utils.sheet_to_json(wb.Sheets[firstSheet]);
          }

          const { report } = validateAndCleanData(parsedRows);

          // If valid records exist, process
          if (report.validRecords > 0) {
            await processRawData(parsedRows, 'USER_UPLOAD', file.name);
            resolve({ report, success: true });
          } else {
            setQualityReport(report);
            resolve({ report, success: false });
          }
        } catch (err) {
          const errReport: DataQualityReport = {
            totalRecords: 0,
            validRecords: 0,
            warningsCount: 0,
            errorsCount: 1,
            warnings: [],
            errors: [`Failed to parse spreadsheet: ${(err as any)?.message || 'Invalid format'}`],
            missingColumns: [],
            duplicates: [],
            confidenceModifier: 0.5
          };
          setQualityReport(errReport);
          resolve({ report: errReport, success: false });
        }
      };

      if (file.name.endsWith('.csv')) {
        reader.readAsText(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    });
  };

  // Reset to No Data State
  const resetToNoData = () => {
    setHasDataset(false);
    setMetadata(null);
    setQualityReport(null);
    setPredictions([]);
    setFoodBatches([]);
    setAnomalies([]);
    setInvestigations([]);
    setInspections([]);
    setAlerts([]);
    setGraph({ nodes: [], edges: [] });
  };

  // Add Feedback
  const addFeedback = (fb: Omit<ModelFeedback, 'id' | 'timestamp'>) => {
    const item: ModelFeedback = {
      ...fb,
      id: `FB-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    setFeedbackList((prev) => [item, ...prev]);

    // Send to backend
    fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    }).catch(() => {});
  };

  // Citizen Complaint Submission
  const addCitizenComplaint = (batchId: string, product: string, complaintType: string, desc: string) => {
    // Increase complaint count on batch
    setPredictions((prev) =>
      prev.map((p) => {
        if (p.batchId === batchId) {
          const newComplaints = p.evidence.complaintCount + 1;
          const updatedRec = {
            ...p,
            evidence: { ...p.evidence, complaintCount: newComplaints },
            predictedRiskScore: Math.min(100, p.predictedRiskScore + 4)
          };
          return updatedRec;
        }
        return p;
      })
    );

    // Add alert
    const newAlert: CentralAlert = {
      id: `ALERT-COMP-${Date.now()}`,
      type: 'Complaint Cluster',
      severity: 'HIGH',
      title: `Citizen Complaint Logged: Batch #${batchId}`,
      description: `Type: ${complaintType}. "${desc.slice(0, 80)}..."`,
      batchId,
      timestamp: 'Just now',
      actionRequired: 'Verify retail lot and dispatch inspector for shelf extraction.'
    };
    setAlerts((prev) => [newAlert, ...prev]);

    fetch('/api/complaints', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ batchId, product, complaintType, description: desc, timestamp: new Date().toISOString() })
    }).catch(() => {});
  };

  // Simulate Spread for high-risk batch
  const simulateSpread = (batchId: string) => {
    const target = predictions.find((p) => p.batchId === batchId) || predictions[0];
    const risk = target ? target.predictedRiskScore : 84;
    const complaints = target ? target.evidence.complaintCount : 12;

    return {
      connectedLocations: [
        'Central Cold Storage #17 (Okhla Hub)',
        'Northern Highway NH-48 Reefer Corridor',
        'South Delhi QuickMart Supermarkets (14 Outlets)',
        'Gurugram Sector 29 Cloud Kitchen Clusters'
      ],
      connectedBatches: [batchId, ...predictions.filter((p) => p.batchId !== batchId).slice(0, 2).map((p) => p.batchId)],
      potentiallyAffectedNetwork: `${Math.round(14000 + complaints * 800).toLocaleString()} consumer units across NCR`,
      recommendedContainmentPoint: 'Quarantine and freeze dispatch gate at Okhla Cold Storage #17 before secondary retail transit',
      estimatedExposure: Math.round(18000 + risk * 320)
    };
  };

  // What-if analysis
  const runWhatIf = (type: string, batchId: string) => {
    const target = predictions.find((p) => p.batchId === batchId) || predictions[0];
    const risk = target ? target.predictedRiskScore : 80;

    if (type === 'ISOLATE_BATCH') {
      return {
        affectedBatches: 1,
        affectedLocations: 4,
        riskReductionPercent: 88.4,
        supplyDisruption: 'MINIMAL (Substitute batch dispatched from nearby depot in 2h)',
        recommendedOption: 'Recommended first response: Immediate physical lock on batch inventory.'
      };
    } else if (type === 'STOP_WAREHOUSE') {
      return {
        affectedBatches: Math.max(3, Math.round(predictions.length * 0.4)),
        affectedLocations: 16,
        riskReductionPercent: 96.2,
        supplyDisruption: 'MODERATE (Logistics diverted through Ambala processing hub)',
        recommendedOption: 'Recommended if temperature anomaly affects entire warehouse cooling bank.'
      };
    } else if (type === 'RECALL_BATCH') {
      return {
        affectedBatches: 1,
        affectedLocations: 28,
        riskReductionPercent: 97.8,
        supplyDisruption: 'LOW (Public recall bulletin broadcasted via FSSAI consumer app)',
        recommendedOption: 'Statutory recall under Section 38 for batches with confirmed lab failure.'
      };
    } else {
      // INCREASE_INSPECTION
      return {
        affectedBatches: 2,
        affectedLocations: 8,
        riskReductionPercent: 64.5,
        supplyDisruption: 'NONE (Normal business hours inspection sampling)',
        recommendedOption: 'Priority field inspection squad deployed with portable MBRT kits.'
      };
    }
  };

  // Initialize with synthetic demo data on first boot
  useEffect(() => {
    loadDemoData();
  }, []);

  const selectedBatch = predictions.find((p) => p.batchId === selectedBatchId) || predictions[0] || null;

  const summaryStats: DatasetSummaryStats = metadata?.summaryStats || DEFAULT_SUMMARY_STATS;
  const mode: DatasetMode = metadata?.mode || 'DEMO';
  const dataset = metadata;

  const setSelectedBatch = (batch: FoodBatch | BatchPrediction | string | null) => {
    if (!batch) return;
    if (typeof batch === 'string') {
      setSelectedBatchId(batch);
    } else if ('batchId' in batch) {
      setSelectedBatchId(batch.batchId);
    } else if ('id' in batch) {
      setSelectedBatchId(batch.id);
    }
  };

  return (
    <DatasetContext.Provider
      value={{
        hasDataset,
        metadata,
        dataset,
        summaryStats,
        mode,
        qualityReport,
        predictions,
        foodBatches,
        anomalies,
        investigations,
        inspections,
        alerts,
        graph,
        selectedBatch,
        selectedBatchId,
        setSelectedBatchId,
        setSelectedBatch,
        downloadSampleTemplate: downloadSampleExcelFile,
        feedbackList,
        isProcessing,
        processingStep,
        uploadModalOpen,
        setUploadModalOpen,
        feedbackModalOpen,
        setFeedbackModalOpen,
        reportModalOpen,
        setReportModalOpen,
        loadDemoData,
        processRawData,
        parseAndUploadFile,
        resetToNoData,
        addFeedback,
        addCitizenComplaint,
        simulateSpread,
        runWhatIf
      }}
    >
      {children}
    </DatasetContext.Provider>
  );
};

export const useDataset = () => {
  const context = useContext(DatasetContext);
  if (!context) {
    throw new Error('useDataset must be used within a DatasetProvider');
  }
  return context;
};
