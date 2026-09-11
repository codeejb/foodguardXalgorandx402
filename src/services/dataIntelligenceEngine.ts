import {
  RawBatchInput,
  DataQualityReport,
  BatchPrediction,
  RiskGrade,
  FoodBatch,
  SupplyChainStep,
  AnomalyRecord,
  InvestigationLead,
  InspectionPriority,
  CentralAlert,
  DatasetMetadata,
  GraphNode,
  GraphEdge
} from '../types';
import * as XLSX from 'xlsx';
import { runXGBoostInference, MODEL_NAME, MODEL_VERSION } from './xgboostEngine';

export const REQUIRED_COLUMNS = [
  'Batch_ID',
  'Product_Name',
  'Temperature_C',
  'Transport_Hours',
  'Lab_Status',
  'Complaint_Count',
  'Storage_Condition'
] as const;

export interface CleanedBatchRecord {
  batchId: string;
  productName: string;
  temperatureC: number;
  transportHours: number;
  labStatus: string;
  complaintCount: number;
  storageCondition: string;
  category: string;
  raw: RawBatchInput;
}

// Helper to deduce product category
export function inferCategory(productName: string): string {
  const p = (productName || '').toLowerCase();
  if (p.includes('milk') || p.includes('paneer') || p.includes('curd') || p.includes('yogurt') || p.includes('cheese') || p.includes('butter') || p.includes('ghee') || p.includes('dairy')) {
    return 'Dairy';
  }
  if (p.includes('chicken') || p.includes('mutton') || p.includes('fish') || p.includes('prawn') || p.includes('meat') || p.includes('poultry') || p.includes('egg')) {
    return 'Meat & Poultry';
  }
  if (p.includes('juice') || p.includes('shake') || p.includes('beverage') || p.includes('drink') || p.includes('water')) {
    return 'Beverages';
  }
  if (p.includes('oil') || p.includes('mustard') || p.includes('sunflower') || p.includes('groundnut')) {
    return 'Edible Oils';
  }
  if (p.includes('spice') || p.includes('masala') || p.includes('turmeric') || p.includes('chilli') || p.includes('pepper')) {
    return 'Spices';
  }
  if (p.includes('rice') || p.includes('wheat') || p.includes('atta') || p.includes('grain') || p.includes('flour') || p.includes('dal')) {
    return 'Grains';
  }
  if (p.includes('salad') || p.includes('sandwich') || p.includes('meal') || p.includes('ready') || p.includes('curry')) {
    return 'Ready-to-Eat';
  }
  return 'Produce';
}

// 1. DATA VALIDATION & CLEANING
export function validateAndCleanData(rows: any[]): {
  report: DataQualityReport;
  cleanedRecords: CleanedBatchRecord[];
} {
  const warnings: string[] = [];
  const errors: string[] = [];
  const missingColumns: string[] = [];
  const seenBatchIds = new Set<string>();
  const duplicates: string[] = [];

  if (!rows || rows.length === 0) {
    return {
      report: {
        totalRecords: 0,
        validRecords: 0,
        warningsCount: 0,
        errorsCount: 1,
        warnings: [],
        errors: ['Uploaded file contains no rows or empty table.'],
        missingColumns: [...REQUIRED_COLUMNS],
        duplicates: [],
        confidenceModifier: 0.5
      },
      cleanedRecords: []
    };
  }

  // Detect column mapping (case-insensitive & whitespace tolerant)
  const firstRow = rows[0];
  const keys = Object.keys(firstRow);
  const columnMap: Record<string, string> = {};

  REQUIRED_COLUMNS.forEach((col) => {
    const normalizedTarget = col.toLowerCase().replace(/[^a-z0-9]/g, '');
    const matchedKey = keys.find(
      (k) => k.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedTarget
    );
    if (matchedKey) {
      columnMap[col] = matchedKey;
    } else {
      missingColumns.push(col);
    }
  });

  if (missingColumns.length > 0) {
    errors.push(
      `Missing required column(s): ${missingColumns.join(', ')}. Expected exactly 7 columns: ${REQUIRED_COLUMNS.join(', ')}`
    );
  }

  const cleanedRecords: CleanedBatchRecord[] = [];

  rows.forEach((row, idx) => {
    const rowNum = idx + 2; // spreadsheet index (1-based + header)
    
    // Extract values via mapped columns or fallback to direct names
    const rawBatchId = String(row[columnMap['Batch_ID'] || 'Batch_ID'] || '').trim();
    const rawProduct = String(row[columnMap['Product_Name'] || 'Product_Name'] || '').trim();
    const rawTemp = row[columnMap['Temperature_C'] || 'Temperature_C'];
    const rawTransport = row[columnMap['Transport_Hours'] || 'Transport_Hours'];
    const rawLab = String(row[columnMap['Lab_Status'] || 'Lab_Status'] || '').trim();
    const rawComplaints = row[columnMap['Complaint_Count'] || 'Complaint_Count'];
    const rawStorage = String(row[columnMap['Storage_Condition'] || 'Storage_Condition'] || '').trim();

    if (!rawBatchId) {
      errors.push(`Row #${rowNum}: Missing Batch_ID.`);
      return;
    }

    if (seenBatchIds.has(rawBatchId)) {
      duplicates.push(rawBatchId);
      warnings.push(`Row #${rowNum}: Duplicate Batch_ID "${rawBatchId}" detected. Suffix appended for tracking.`);
    }
    seenBatchIds.add(rawBatchId);

    // Parse Temperature
    const tempNum = parseFloat(rawTemp);
    if (isNaN(tempNum)) {
      warnings.push(`Row #${rowNum} (Batch ${rawBatchId}): Non-numeric Temperature_C "${rawTemp}". Assumed ambient 25°C with reduced confidence.`);
    } else if (tempNum > 60 || tempNum < -35) {
      warnings.push(`Row #${rowNum} (Batch ${rawBatchId}): Extreme Temperature_C (${tempNum}°C) detected.`);
    }

    // Parse Transport Hours
    const transportNum = parseFloat(rawTransport);
    if (isNaN(transportNum) || transportNum < 0) {
      warnings.push(`Row #${rowNum} (Batch ${rawBatchId}): Invalid Transport_Hours "${rawTransport}". Defaulted to 4 hours.`);
    }

    // Parse Complaints
    const compNum = parseInt(rawComplaints, 10);
    if (isNaN(compNum) || compNum < 0) {
      warnings.push(`Row #${rowNum} (Batch ${rawBatchId}): Invalid Complaint_Count "${rawComplaints}". Defaulted to 0.`);
    }

    // Validate Lab Status
    const normalizedLab = (rawLab || 'Pending').toLowerCase();
    let standardizedLab = 'Pending';
    if (normalizedLab.includes('pass') || normalizedLab.includes('clear') || normalizedLab.includes('compliant') || normalizedLab.includes('negative')) {
      standardizedLab = 'Pass';
    } else if (normalizedLab.includes('fail') || normalizedLab.includes('positive') || normalizedLab.includes('reject') || normalizedLab.includes('contamination')) {
      standardizedLab = 'Fail';
    } else if (normalizedLab.includes('border') || normalizedLab.includes('watch') || normalizedLab.includes('warn')) {
      standardizedLab = 'Borderline';
    } else {
      standardizedLab = 'Pending';
      if (!rawLab) {
        warnings.push(`Row #${rowNum} (Batch ${rawBatchId}): Missing Lab_Status. Marked as Pending.`);
      }
    }

    // Cleaned record
    const finalBatchId = duplicates.filter((d) => d === rawBatchId).length > 0 ? `${rawBatchId}_dup${idx}` : rawBatchId;
    const finalTemp = isNaN(tempNum) ? 25.0 : tempNum;
    const finalTransport = isNaN(transportNum) || transportNum < 0 ? 4.0 : transportNum;
    const finalComplaints = isNaN(compNum) || compNum < 0 ? 0 : compNum;
    const finalStorage = rawStorage || 'Ambient';
    const finalProduct = rawProduct || `Food Batch #${finalBatchId}`;

    cleanedRecords.push({
      batchId: finalBatchId,
      productName: finalProduct,
      temperatureC: finalTemp,
      transportHours: finalTransport,
      labStatus: standardizedLab,
      complaintCount: finalComplaints,
      storageCondition: finalStorage,
      category: inferCategory(finalProduct),
      raw: {
        Batch_ID: rawBatchId,
        Product_Name: finalProduct,
        Temperature_C: finalTemp,
        Transport_Hours: finalTransport,
        Lab_Status: standardizedLab,
        Complaint_Count: finalComplaints,
        Storage_Condition: finalStorage
      }
    });
  });

  // Calculate confidence modifier based on missing columns and warnings
  let confidenceModifier = 1.0;
  if (missingColumns.length > 0) confidenceModifier -= missingColumns.length * 0.1;
  if (errors.length > 0) confidenceModifier -= 0.15;
  if (warnings.length > 5) confidenceModifier -= 0.1;
  confidenceModifier = Math.max(0.6, Math.min(1.0, confidenceModifier));

  return {
    report: {
      totalRecords: rows.length,
      validRecords: cleanedRecords.length,
      warningsCount: warnings.length,
      errorsCount: errors.length,
      warnings: warnings.slice(0, 20),
      errors: errors.slice(0, 10),
      missingColumns,
      duplicates,
      confidenceModifier
    },
    cleanedRecords
  };
}

// 2. AI RISK PREDICTION ENGINE (POWERED BY XGBOOST & TREESHAP)
export function calculateBatchPrediction(
  record: CleanedBatchRecord,
  confidenceModifier: number = 1.0
): BatchPrediction {
  // Execute authentic XGBoost Decision Tree inference
  const xgbResult = runXGBoostInference(record.raw);

  // Apply data-quality confidence modifier
  const finalConfidence = Math.max(65, Math.min(99, Math.round(xgbResult.confidence * confidenceModifier)));

  // Anomaly check
  let anomalyFlag = xgbResult.anomalyFlag;
  const storageLower = (record.storageCondition || '').toLowerCase();
  if (!anomalyFlag) {
    if (record.complaintCount >= 5 && record.temperatureC <= 4.5 && record.labStatus === 'Pass') {
      anomalyFlag = 'High complaints with normal temperature & passed lab (Potential downstream adulteration or post-packaging breach)';
    } else if (record.labStatus === 'Fail' && record.complaintCount === 0) {
      anomalyFlag = 'Failed lab test with zero complaints (Silent biological contamination not yet reached consumer palate)';
    } else if (storageLower.includes('poor') && record.transportHours > 16) {
      anomalyFlag = 'Compounded logistics breakdown: Substandard storage combined with multi-day transit';
    } else if (xgbResult.predictedRiskScore >= 75 && record.category === 'Dairy') {
      anomalyFlag = 'Active microbial doubling curve projected in cold-chain channel';
    }
  }

  return {
    ...xgbResult,
    batchId: record.batchId,
    productName: record.productName,
    confidence: finalConfidence,
    anomalyFlag
  };
}

// 3. ANOMALY DETECTION ENGINE
export function detectAnomaliesAcrossDataset(predictions: BatchPrediction[]): AnomalyRecord[] {
  const anomalies: AnomalyRecord[] = [];

  predictions.forEach((p, idx) => {
    const { batchId, productName, predictedRiskScore, evidence } = p;
    const { temperatureC, transportHours, labStatus, complaintCount, storageCondition } = evidence;

    // Pattern 1: High Complaints + Normal Temperature
    if (complaintCount >= 6 && temperatureC <= 5.0) {
      anomalies.push({
        id: `ANOM-UNUSUAL-COMP-${batchId}`,
        title: `Consumer Sickness Cluster with Intact Cold-Chain (${batchId})`,
        category: 'COMPLAINT_DISPARITY',
        severity: 'HIGH',
        discoveredAt: 'Just now',
        description: `Batch ${batchId} (${productName}) has ${complaintCount} citizen souring complaints despite verified compliant storage temperature (${temperatureC}°C).`,
        hypothesis: 'What is unusual: High consumer complaints despite normal temperature. Why it matters: Suggests chemical adulteration, packaging hermetic seal breach, or water dilution before chilling. What should be verified: Test for post-pasteurization packaging integrity and verify raw milk MBRT logs.',
        confidence: 91,
        relatedBatches: [batchId],
        sourceEntity: `Retail Distribution Network (${productName})`,
        actionTaken: false
      });
    }

    // Pattern 2: Failed Lab + Low/Zero Complaints
    if (labStatus === 'Fail' && complaintCount <= 1) {
      anomalies.push({
        id: `ANOM-SILENT-LAB-${batchId}`,
        title: `Silent Regulatory Contamination Hazard (${batchId})`,
        category: 'LAB_DISPARITY',
        severity: 'CRITICAL',
        discoveredAt: 'Just now',
        description: `Batch ${batchId} tested positive for microbial violation in lab assay, yet zero/low consumer complaints have been received.`,
        hypothesis: 'What is unusual: Failed laboratory assay with zero complaints. Why it matters: Product has not yet reached retail shelves or spoilage is asymptomatic (pathogenic bacterial growth without immediate sour odor). High risk of severe foodborne outbreak if consumed. What should be verified: Immediate stop-sale order and trace downstream inventory before consumer sale.',
        confidence: 96,
        relatedBatches: [batchId],
        sourceEntity: `NABL Accredited Assay Portal`,
        actionTaken: false
      });
    }

    // Pattern 3: Poor Storage + Long Transport
    if ((storageCondition.toLowerCase().includes('poor') || storageCondition.toLowerCase().includes('inadequate')) && transportHours >= 10) {
      anomalies.push({
        id: `ANOM-STORAGE-TRANS-${batchId}`,
        title: `Cumulative Logistics Deterioration (${batchId})`,
        category: 'LOGISTICS_ACCELERATION',
        severity: 'HIGH',
        discoveredAt: 'Just now',
        description: `Batch ${batchId} underwent ${transportHours}h transit following substandard warehouse storage ("${storageCondition}").`,
        hypothesis: 'What is unusual: Poor storage coupled with extended highway transit. Why it matters: Thermal inertia fails after 6 hours, triggering accelerated biological degradation. What should be verified: Inspect reefer container compressor continuous operation log and measure product core temperature.',
        confidence: 89,
        relatedBatches: [batchId],
        sourceEntity: `Warehouse Transit Corridor`,
        actionTaken: false
      });
    }

    // Pattern 4: Severe Temperature Anomaly
    if (temperatureC >= 13.0 && (p.productName.toLowerCase().includes('milk') || p.productName.toLowerCase().includes('paneer') || p.productName.toLowerCase().includes('meat'))) {
      anomalies.push({
        id: `ANOM-THERMAL-EXCURSION-${batchId}`,
        title: `Critical Thermal Excursion Spike (${batchId})`,
        category: 'THERMAL_DRIFT',
        severity: 'CRITICAL',
        discoveredAt: 'Just now',
        description: `Batch ${batchId} peaked at ${temperatureC}°C, exceeding statutory 4°C limit by +${(temperatureC - 4).toFixed(1)}°C.`,
        hypothesis: 'What is unusual: Uncontrolled cold-chain temperature spike in highly perishable food. Why it matters: Bacterial colony doubling interval accelerates from 12 hours to 40 minutes at this temperature. What should be verified: Verify cold-room compressor trip logs, conduct Methylene Blue Reduction Test (MBRT).',
        confidence: 97,
        relatedBatches: [batchId],
        sourceEntity: `Cold Storage Facility / Reefer Transport`,
        actionTaken: false
      });
    }
  });

  // Outlier batch detection: Find batch with risk >= 35 points higher than category average
  const categoryRisks: Record<string, number[]> = {};
  predictions.forEach((p) => {
    const cat = inferCategory(p.productName);
    if (!categoryRisks[cat]) categoryRisks[cat] = [];
    categoryRisks[cat].push(p.predictedRiskScore);
  });

  predictions.forEach((p) => {
    const cat = inferCategory(p.productName);
    const peers = categoryRisks[cat] || [];
    if (peers.length >= 2) {
      const avg = peers.reduce((a, b) => a + b, 0) / peers.length;
      if (p.predictedRiskScore >= avg + 32 && p.predictedRiskScore >= 60) {
        anomalies.push({
          id: `ANOM-OUTLIER-${p.batchId}`,
          title: `Statistical Outlier Batch in ${cat} Category (${p.batchId})`,
          category: 'STATISTICAL_DEVIATION',
          severity: 'HIGH',
          discoveredAt: 'Just now',
          description: `Batch ${p.batchId} exhibits risk score of ${p.predictedRiskScore}/100, deviating +${(p.predictedRiskScore - avg).toFixed(1)} points from the category mean of ${avg.toFixed(1)}.`,
          hypothesis: `What is unusual: High divergence from peer batches processed under similar conditions. Why it matters: Indicates localized failure at a specific processing line, chilling unit, or transport reefer. What should be verified: Audit specific batch manufacturing record and raw milk silo assignment.`,
          confidence: 92,
          relatedBatches: [p.batchId],
          sourceEntity: `Factory Packaging Batch Line`,
          actionTaken: false
        });
      }
    }
  });

  return anomalies;
}

// 4. INVESTIGATION LEADS SYNTHESIS
export function generateInvestigationLeads(
  predictions: BatchPrediction[],
  anomalies: AnomalyRecord[]
): InvestigationLead[] {
  const leads: InvestigationLead[] = [];
  const highRiskBatches = predictions.filter((p) => p.predictedRiskScore >= 60);

  if (highRiskBatches.length > 0) {
    const primary = highRiskBatches[0];
    leads.push({
      id: `INV-${primary.batchId}`,
      title: `${primary.productName} Incident — Recommended for Investigation`,
      status: 'INVESTIGATING',
      leadType: 'COLD_CHAIN_CORRELATION',
      confidenceScore: primary.confidence,
      sourceEntity: `Consignment Route #${primary.batchId}`,
      relatedBatches: [primary.batchId, ...predictions.filter((p) => p.batchId !== primary.batchId && p.predictedRiskScore > 45).slice(0, 3).map((p) => p.batchId)],
      evidenceCorrelations: [
        `Temperature signal: ${primary.evidence.temperatureC}°C across ${primary.evidence.transportHours} transit hours.`,
        `Citizen complaint count: ${primary.evidence.complaintCount} reports verified.`,
        `Lab status: ${primary.evidence.labStatus}. Storage condition: ${primary.evidence.storageCondition}.`,
        `AI Predicted Risk: ${primary.predictedRiskScore}/100 (${primary.riskLevel}).`
      ],
      aiNarrative: `Investigation lead generated from multi-signal evidence synthesis. Cold chain telemetry indicates thermal exposure combined with ${primary.evidence.complaintCount} consumer reports. Recommended for prioritized regulatory audit without presumption of guilt.`,
      recommendedAction: primary.recommendedAction,
      estimatedExposure: 18000 + primary.evidence.complaintCount * 650,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    });
  }

  // Additional lead if multiple anomalies detected
  if (anomalies.length >= 2) {
    const anom = anomalies[1];
    leads.push({
      id: `INV-CLUSTER-${Date.now().toString().slice(-4)}`,
      title: `${anom.title} — Cross-Batch Correlation Lead`,
      status: 'OPEN',
      leadType: 'SUPPLIER_DRIFT',
      confidenceScore: anom.confidence,
      sourceEntity: anom.sourceEntity,
      relatedBatches: anom.relatedBatches,
      evidenceCorrelations: [
        anom.description,
        anom.hypothesis
      ],
      aiNarrative: `System detected statistical clustering across monitored distribution points. Evidence indicates potential upstream operational drift requiring physical inspection.`,
      recommendedAction: 'Dispatch field inspection team to audit facility cold rooms and loggers.',
      estimatedExposure: 12500,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    });
  }

  return leads;
}

// 5. INSPECTION PRIORITIZATION COPILOT
export function generateInspectionPriorities(predictions: BatchPrediction[]): InspectionPriority[] {
  // Sort descending by risk score
  const sorted = [...predictions].sort((a, b) => b.predictedRiskScore - a.predictedRiskScore);

  return sorted.slice(0, 6).map((p, index) => {
    let urgency: 'IMMEDIATE' | 'HIGH' | 'SCHEDULED' = 'SCHEDULED';
    if (p.predictedRiskScore >= 75) urgency = 'IMMEDIATE';
    else if (p.predictedRiskScore >= 50) urgency = 'HIGH';

    return {
      id: `INSP-PRIORITY-${p.batchId}`,
      entityName: `${p.productName} (Batch #${p.batchId})`,
      entityType: 'BATCH',
      location: `Supply Chain Hub / Node #${p.batchId}`,
      riskScore: p.predictedRiskScore,
      urgency,
      recommendedDate: urgency === 'IMMEDIATE' ? 'Today (Next 2 Hours)' : 'Within 24 Hours',
      reasons: p.whyFlagged,
      suggestedOfficerActions: [
        'Inspect physical temperature loggers on refrigeration units',
        'Extract 3 random sample pouches for NABL accredited lab culture test',
        'Issue provisional inventory holding order under FSSAI regulations pending lab results'
      ],
      digitalPassportId: `ALGO-PASSPORT-${p.batchId}`,
      complianceScore: Math.max(10, 100 - p.predictedRiskScore)
    };
  });
}

// 6. CENTRAL ALERTS GENERATOR
export function generateCentralAlerts(
  predictions: BatchPrediction[],
  anomalies: AnomalyRecord[]
): CentralAlert[] {
  const alerts: CentralAlert[] = [];

  // High risk batches alerts
  predictions.filter((p) => p.predictedRiskScore >= 61).forEach((p) => {
    alerts.push({
      id: `ALERT-HIGH-RISK-${p.batchId}`,
      type: p.predictedRiskScore >= 81 ? 'High-Risk Batch' : 'Emerging Risk',
      severity: p.predictedRiskScore >= 81 ? 'CRITICAL' : 'HIGH',
      title: `${p.riskLevel.toUpperCase()} RISK: Batch #${p.batchId} (${p.productName})`,
      description: `Predicted Risk: ${p.predictedRiskScore}/100. ${p.whyFlagged[0] || 'Multiple indicators elevated.'}`,
      batchId: p.batchId,
      timestamp: 'Active Now',
      actionRequired: p.recommendedAction
    });
  });

  // Anomaly alerts
  anomalies.forEach((a) => {
    alerts.push({
      id: `ALERT-ANOM-${a.id}`,
      type: 'Supply-Chain Anomaly',
      severity: a.severity,
      title: a.title,
      description: a.description,
      batchId: a.relatedBatches[0],
      timestamp: 'Detected recently',
      actionRequired: 'Review in Unknown Risk Detector & verify with field officer.'
    });
  });

  // Complaint cluster alert
  const complaintBatches = predictions.filter((p) => p.evidence.complaintCount >= 5);
  complaintBatches.forEach((cb) => {
    alerts.push({
      id: `ALERT-COMP-${cb.batchId}`,
      type: 'Complaint Cluster',
      severity: cb.evidence.complaintCount >= 15 ? 'CRITICAL' : 'HIGH',
      title: `Citizen Complaint Cluster: ${cb.evidence.complaintCount} Reports on Batch #${cb.batchId}`,
      description: `Multiple consumer souring/sickness reports submitted for ${cb.productName}.`,
      batchId: cb.batchId,
      timestamp: 'Today',
      actionRequired: 'Verify retail lot and dispatch inspector for shelf extraction.'
    });
  });

  return alerts;
}

// 7. SUPPLY CHAIN GRAPH BUILDER
export function generateSupplyChainGraph(predictions: BatchPrediction[]): {
  nodes: GraphNode[];
  edges: GraphEdge[];
} {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const seenNodes = new Set<string>();

  predictions.forEach((p, idx) => {
    const bId = p.batchId;
    const pRisk = p.predictedRiskScore;

    // Build realistic nodes for this batch
    const farmId = `FARM-${bId}`;
    const factId = `FACT-${bId}`;
    const whId = `WH-${bId}`;
    const distId = `DIST-${bId}`;
    const retId = `RET-${bId}`;

    if (!seenNodes.has(farmId)) {
      seenNodes.add(farmId);
      nodes.push({
        id: farmId,
        label: `Supplier Collective #${bId.slice(-3)}`,
        type: 'SUPPLIER',
        city: 'Source Origin',
        risk: Math.max(10, Math.round(pRisk * 0.2)),
        isAnomaly: false
      });
    }

    if (!seenNodes.has(factId)) {
      seenNodes.add(factId);
      nodes.push({
        id: factId,
        label: `Processing Plant #${bId.slice(-3)}`,
        type: 'FACTORY',
        city: 'Industrial Zone',
        risk: Math.max(15, Math.round(pRisk * 0.35)),
        isAnomaly: false
      });
    }

    if (!seenNodes.has(whId)) {
      seenNodes.add(whId);
      nodes.push({
        id: whId,
        label: `Cold Hub Depot #${bId}`,
        type: 'WAREHOUSE',
        city: 'Regional Logistics Center',
        risk: pRisk,
        isAnomaly: pRisk >= 60
      });
    }

    if (!seenNodes.has(distId)) {
      seenNodes.add(distId);
      nodes.push({
        id: distId,
        label: `Fleet Route (${p.evidence.transportHours}h)`,
        type: 'TRANSPORT',
        city: 'Highway Corridor',
        risk: Math.round(pRisk * 0.8),
        isAnomaly: p.evidence.transportHours > 12
      });
    }

    if (!seenNodes.has(retId)) {
      seenNodes.add(retId);
      nodes.push({
        id: retId,
        label: `Retail Superstores #${bId}`,
        type: 'RETAILER',
        city: 'Metro Consumption Area',
        risk: Math.round(pRisk * 0.7),
        isAnomaly: p.evidence.complaintCount >= 5
      });
    }

    // Edges
    edges.push(
      { id: `e-farm-fact-${bId}`, source: farmId, target: factId, label: 'SUPPLIES', riskPassed: Math.round(pRisk * 0.2) },
      { id: `e-fact-wh-${bId}`, source: factId, target: whId, label: 'PRODUCES', riskPassed: Math.round(pRisk * 0.4) },
      { id: `e-wh-dist-${bId}`, source: whId, target: distId, label: 'STORED_AT', riskPassed: pRisk },
      { id: `e-dist-ret-${bId}`, source: distId, target: retId, label: 'DISTRIBUTED_TO', riskPassed: Math.round(pRisk * 0.75), isHighlighted: pRisk >= 60 }
    );
  });

  return { nodes, edges };
}

// 8. CONVERT PREDICTION TO COMPLETE FOODBATCH (for compatibility with existing FoodDnaView)
export function convertPredictionToFoodBatch(prediction: BatchPrediction): FoodBatch {
  const { batchId, productName, predictedRiskScore, riskLevel, confidence, whyFlagged, evidence, recommendedAction, timeMachine } = prediction;
  const category = inferCategory(productName);

  let status: 'SAFE' | 'WATCH' | 'QUARANTINED' | 'RECALLED' | 'DELIVERED' = 'SAFE';
  if (predictedRiskScore >= 81) status = 'QUARANTINED';
  else if (predictedRiskScore >= 61) status = 'RECALLED';
  else if (predictedRiskScore >= 41) status = 'WATCH';
  else if (predictedRiskScore >= 21) status = 'WATCH';
  else status = 'SAFE';

  // Build journey steps with simulated demo relationships
  const journey: SupplyChainStep[] = [
    {
      stage: 'SOURCE',
      location: 'Primary Agricultural Farm / Cooperative',
      timestamp: '2026-09-08 05:30',
      actor: 'Registered Producer Cooperative',
      temperature: 3.9,
      humidity: 62,
      status: 'NORMAL',
      txHash: '0x8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f91',
      notes: 'Harvest / milking quality intake: Standard acidity & density tests compliant.'
    },
    {
      stage: 'FACTORY',
      location: 'Regional Food Processing Facility',
      timestamp: '2026-09-08 14:00',
      actor: 'Licensed Manufacturing Unit',
      temperature: 4.1,
      humidity: 65,
      status: 'NORMAL',
      txHash: '0x7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9872',
      notes: 'Pasteurization & hygienic packaging line. Quality sealed.'
    },
    {
      stage: 'WAREHOUSE',
      location: `Cold Chain Depot (${evidence.storageCondition})`,
      timestamp: '2026-09-09 08:30',
      actor: 'Central Storage Operator',
      temperature: evidence.temperatureC,
      humidity: 82,
      status: evidence.temperatureC > 4.0 ? 'ALERT' : 'NORMAL',
      txHash: '0x6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9873',
      notes: `Recorded storage condition: "${evidence.storageCondition}". Average chamber temp: ${evidence.temperatureC}°C.`
    },
    {
      stage: 'TRANSPORT',
      location: `Transit Corridor (${evidence.transportHours} Hours)`,
      timestamp: '2026-09-10 02:15',
      actor: 'Logistics Fleet Vehicle',
      temperature: evidence.temperatureC + 0.8,
      humidity: 80,
      status: evidence.transportHours > 12 || evidence.temperatureC > 6.0 ? 'ALERT' : 'NORMAL',
      txHash: '0x5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9874',
      notes: `Total transit hours logged: ${evidence.transportHours}h. Refrigerator unit telemetry synchronized.`
    },
    {
      stage: 'LAB',
      location: 'NABL Accredited Food Testing Lab',
      timestamp: '2026-09-10 11:00',
      actor: 'Chief Quality Assessor',
      temperature: 4.0,
      humidity: 60,
      status: evidence.labStatus === 'Fail' ? 'ALERT' : 'NORMAL',
      txHash: '0x4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9875',
      notes: `Assay verdict: ${evidence.labStatus}. Test result verification filed with FSSAI.`
    },
    {
      stage: 'RETAILER',
      location: 'Metro Supermarkets & Retail Outlets',
      timestamp: '2026-09-10 17:45',
      actor: 'Retail Operations Manager',
      temperature: Math.min(18, evidence.temperatureC + 1.5),
      humidity: 75,
      status: evidence.complaintCount > 3 ? 'ALERT' : 'NORMAL',
      txHash: '0x3a2f1e0d9c8b7a6f5e4d3c2b1a0f9876',
      notes: `Active consumer complaints: ${evidence.complaintCount}. Surveillance flag active.`
    }
  ];

  return {
    id: batchId,
    batchId,
    productName,
    category,
    currentRiskScore: predictedRiskScore,
    riskLevel: riskLevel.toUpperCase() as any,
    safetyScore: Math.max(0, 100 - predictedRiskScore),
    forecastRisk24h: timeMachine.h24,
    forecastRisk48h: timeMachine.h48,
    forecastRisk72h: timeMachine.h72,
    status,
    productionDate: '2026-09-08 05:30 IST',
    expiryDate: '2026-09-15 23:59 IST',
    sourceOrigin: 'Verified Agricultural Supply Network',
    supplierName: `Agro Producers Unit #${batchId.slice(-3)}`,
    factoryName: `National Processing Plant #${batchId.slice(-3)}`,
    warehouseLocation: `Regional Depot (${evidence.storageCondition})`,
    transportRoute: `Interstate Express Highway (${evidence.transportHours}h Transit)`,
    distributorName: `Apex Food Logistics Network`,
    retailerName: `Metro Supermarket Chain & Retailers`,
    batchVolume: '24,000 Units',
    temperatureAvg: evidence.temperatureC,
    temperatureMax: evidence.temperatureC + 2.5,
    temperatureSpikeHours: evidence.temperatureC > 4.0 ? Math.min(evidence.transportHours, 6.5) : 0,
    humidityAvg: 76,
    labVerified: evidence.labStatus !== 'Pending',
    labReportId: `LAB-REP-${batchId}`,
    inspectionHistoryCount: evidence.complaintCount > 0 ? 3 : 1,
    complaintCount: evidence.complaintCount,
    blockchainTx: `ALGO-TX-${batchId}-BLOCKCHAIN-DEMO`,
    blockchainStatus: 'VERIFIED',
    aiExplanation: `Predicted Risk: ${predictedRiskScore}/100 (${riskLevel}). Factors: ${whyFlagged.join('; ')}. Recommended: ${recommendedAction}`,
    journey,
    telemetryHistory: [
      { time: '00:00', temperature: Math.max(2, evidence.temperatureC - 3) },
      { time: '04:00', temperature: Math.max(3, evidence.temperatureC - 1.5) },
      { time: '08:00', temperature: evidence.temperatureC },
      { time: '12:00', temperature: evidence.temperatureC + 1.2 },
      { time: '16:00', temperature: evidence.temperatureC + 0.8 },
      { time: '20:00', temperature: evidence.temperatureC }
    ]
  };
}

// 9. SYNTHETIC DEMO DATASET
// Realistic FOODGUARD X dataset with meaningful patterns
export const SYNTHETIC_DEMO_DATA: RawBatchInput[] = [
  {
    Batch_ID: 'FGX2026001',
    Product_Name: 'Organic Cow Milk (1L Bottle)',
    Temperature_C: 13.8,
    Transport_Hours: 15.2,
    Lab_Status: 'Fail',
    Complaint_Count: 19,
    Storage_Condition: 'Poor / Secondary Compressor Trip'
  },
  {
    Batch_ID: 'M492',
    Product_Name: 'Pasteurized Whole Milk (500ml)',
    Temperature_C: 14.8,
    Transport_Hours: 16.5,
    Lab_Status: 'Fail',
    Complaint_Count: 23,
    Storage_Condition: 'Poor / Secondary Compressor Trip'
  },
  {
    Batch_ID: 'P812',
    Product_Name: 'Fresh Malai Paneer (200g)',
    Temperature_C: 12.4,
    Transport_Hours: 14.0,
    Lab_Status: 'Borderline',
    Complaint_Count: 17,
    Storage_Condition: 'Poor / Inadequate Air Circulation'
  },
  {
    Batch_ID: 'C104',
    Product_Name: 'Fresh Chilled Poultry Cuts',
    Temperature_C: 11.2,
    Transport_Hours: 18.2,
    Lab_Status: 'Fail',
    Complaint_Count: 14,
    Storage_Condition: 'Poor / Defective Reefer Unit'
  },
  {
    Batch_ID: 'D305',
    Product_Name: 'Probiotic Set Curd (400g)',
    Temperature_C: 9.5,
    Transport_Hours: 11.0,
    Lab_Status: 'Pass',
    Complaint_Count: 8,
    Storage_Condition: 'Inadequate Cold Storage'
  },
  {
    Batch_ID: 'B201',
    Product_Name: 'Fresh Squeezed Mango Juice',
    Temperature_C: 8.2,
    Transport_Hours: 8.5,
    Lab_Status: 'Borderline',
    Complaint_Count: 5,
    Storage_Condition: 'Cold Storage (Intermittent)'
  },
  {
    Batch_ID: 'M308',
    Product_Name: 'Toned Skimmed Milk (1L)',
    Temperature_C: 7.1,
    Transport_Hours: 6.0,
    Lab_Status: 'Pending',
    Complaint_Count: 3,
    Storage_Condition: 'Cold Storage'
  },
  {
    Batch_ID: 'R441',
    Product_Name: 'Ready-to-Eat Paneer Butter Masala',
    Temperature_C: 6.8,
    Transport_Hours: 9.2,
    Lab_Status: 'Pass',
    Complaint_Count: 2,
    Storage_Condition: 'Controlled Chilled Hub'
  },
  {
    Batch_ID: 'O512',
    Product_Name: 'Cold-Pressed Kachi Ghani Mustard Oil',
    Temperature_C: 24.5,
    Transport_Hours: 14.0,
    Lab_Status: 'Pass',
    Complaint_Count: 0,
    Storage_Condition: 'Controlled Ambient Warehouse'
  },
  {
    Batch_ID: 'R901',
    Product_Name: 'Whole Wheat Chakki Atta (5kg)',
    Temperature_C: 26.0,
    Transport_Hours: 20.0,
    Lab_Status: 'Pass',
    Complaint_Count: 0,
    Storage_Condition: 'Dry Aerated Silo'
  },
  {
    Batch_ID: 'S302',
    Product_Name: 'High Curcumin Turmeric Powder (500g)',
    Temperature_C: 25.2,
    Transport_Hours: 16.5,
    Lab_Status: 'Pass',
    Complaint_Count: 0,
    Storage_Condition: 'Dry Controlled Humidity'
  },
  {
    Batch_ID: 'F619',
    Product_Name: 'Frozen Green Peas (1kg)',
    Temperature_C: -12.4,
    Transport_Hours: 12.0,
    Lab_Status: 'Pass',
    Complaint_Count: 1,
    Storage_Condition: 'Deep Frozen (-18°C Target)'
  },
  {
    Batch_ID: 'T108',
    Product_Name: 'Organic Green Tea Infusion (250g)',
    Temperature_C: 23.0,
    Transport_Hours: 24.0,
    Lab_Status: 'Pass',
    Complaint_Count: 0,
    Storage_Condition: 'Ambient Sealed Storage'
  }
];

// 10. GENERATE SAMPLE TEMPLATES FOR USER DOWNLOAD
export function generateSampleCsvString(): string {
  const headers = REQUIRED_COLUMNS.join(',');
  const sampleRows = SYNTHETIC_DEMO_DATA.slice(0, 8).map((r) =>
    `"${r.Batch_ID}","${r.Product_Name}",${r.Temperature_C},${r.Transport_Hours},"${r.Lab_Status}",${r.Complaint_Count},"${r.Storage_Condition}"`
  );
  return [headers, ...sampleRows].join('\n');
}

export function downloadSampleExcelFile(): void {
  const wb = XLSX.utils.book_new();
  const wsData = [
    [...REQUIRED_COLUMNS],
    ...SYNTHETIC_DEMO_DATA.map((r) => [
      r.Batch_ID,
      r.Product_Name,
      r.Temperature_C,
      r.Transport_Hours,
      r.Lab_Status,
      r.Complaint_Count,
      r.Storage_Condition
    ])
  ];
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  XLSX.utils.book_append_sheet(wb, ws, 'Food_Batches_Input');
  XLSX.writeFile(wb, 'FOODGUARD_X_Sample_Template.xlsx');
}

export function downloadSampleCsvFile(): void {
  const csvContent = generateSampleCsvString();
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'FOODGUARD_X_Sample_Template.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
