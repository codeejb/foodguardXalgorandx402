import React, { useState } from 'react';
import {
  Users,
  AlertTriangle,
  MapPin,
  Send,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Cpu,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { INITIAL_CITIZEN_REPORTS } from '../../data/mockData';
import { CitizenReport } from '../../types';

interface CitizenNetworkViewProps {
  onNavigate: (view: string, param?: string) => void;
  onOpenCanonicalModal: () => void;
}

export const CitizenNetworkView: React.FC<CitizenNetworkViewProps> = ({
  onNavigate,
  onOpenCanonicalModal
}) => {
  const [reports, setReports] = useState<CitizenReport[]>(INITIAL_CITIZEN_REPORTS);
  const [newCity, setNewCity] = useState('New Delhi');
  const [newLocation, setNewLocation] = useState('Hauz Khas');
  const [newProduct, setNewProduct] = useState('FarmFresh Toned Milk 500ml');
  const [newSymptoms, setNewSymptoms] = useState('Sour taste, curdling upon boiling in morning tea');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSymptoms.trim()) return;

    const newRep: CitizenReport = {
      id: `CIT-${Math.floor(1000 + Math.random() * 9000)}`,
      productName: newProduct,
      batchOrLotNumber: 'M492',
      locationCity: `${newCity} (${newLocation})`,
      locationState: 'Delhi',
      timestamp: 'Just now',
      symptoms: [newSymptoms],
      description: newSymptoms,
      purchaseLocation: `${newLocation} Market`,
      severity: 'MODERATE',
      status: 'LINKED_TO_CLUSTER',
      aiConfidence: 95,
      linkedBatchId: 'M492',
      anonymizedUser: 'Verified Citizen (Zero-Knowledge)'
    };

    setReports([newRep, ...reports]);
    setSubmitted(true);
    setNewSymptoms('');

    try {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#A67C00', '#1A1A18', '#10B981']
      });
    } catch {}
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-[#FAFAF7] border border-[#EBEBE6] rounded-xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-white border border-[#EBEBE6] text-xs font-mono font-medium text-[#8F6B00] mb-2">
            <span>GRASSROOTS INTELLIGENCE: /citizen</span>
            <span>•</span>
            <span className="text-[#1A1A18]">GEOCODED EPIDEMIC CLUSTERING</span>
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-[#1A1A18]">
            Citizen Food Safety Intelligence Network
          </h1>
          <p className="text-xs sm:text-sm text-[#666660] font-sans mt-1">
            Privacy-preserving community reports aggregated in real-time to alert authorities before clinical hospitalizations spike.
          </p>
        </div>

        <button
          onClick={onOpenCanonicalModal}
          className="bg-[#1A1A18] hover:bg-[#8F6B00] text-white px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
        >
          <Sparkles className="w-4 h-4 text-[#C49200]" />
          <span>Walkthrough South Delhi Cluster</span>
        </button>
      </div>

      {/* Main Grid: Submit Report & Cluster Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Anonymous Citizen Report Form */}
        <div className="lg:col-span-5 bg-white border border-[#EBEBE6] rounded-xl p-6 shadow-xs space-y-4">
          <div className="border-b border-[#F0F0EB] pb-3">
            <h3 className="font-serif text-xl font-bold text-[#1A1A18]">
              Report a Food Safety Anomaly
            </h3>
            <p className="text-xs text-[#777] mt-0.5">
              Your report is cryptographically anonymized and fed directly into the national multi-agent risk twin.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-medium text-[#1A1A18] mb-1">Product Purchased</label>
              <input
                type="text"
                value={newProduct}
                onChange={(e) => setNewProduct(e.target.value)}
                className="w-full border border-[#DDDCD6] rounded-lg px-3 py-2 bg-[#FAFAF7] focus:bg-white focus:outline-none focus:border-[#8F6B00]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-[#1A1A18] mb-1">City / Region</label>
                <input
                  type="text"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  className="w-full border border-[#DDDCD6] rounded-lg px-3 py-2 bg-[#FAFAF7] focus:bg-white focus:outline-none focus:border-[#8F6B00]"
                  required
                />
              </div>
              <div>
                <label className="block font-medium text-[#1A1A18] mb-1">Locality / Pin Code</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full border border-[#DDDCD6] rounded-lg px-3 py-2 bg-[#FAFAF7] focus:bg-white focus:outline-none focus:border-[#8F6B00]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-[#1A1A18] mb-1">Observed Issue / Symptoms</label>
              <textarea
                value={newSymptoms}
                onChange={(e) => setNewSymptoms(e.target.value)}
                placeholder="e.g. Milk curdled upon boiling, swollen packet, chemical smell..."
                className="w-full h-24 border border-[#DDDCD6] rounded-lg p-3 bg-[#FAFAF7] focus:bg-white focus:outline-none focus:border-[#8F6B00]"
                required
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-[#1A1A18] hover:bg-[#8F6B00] text-white py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Geocoded Report</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Col: Live Geocoded Report Stream */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-[#1A1A18]">
              South Delhi Active Incident Cluster ({reports.length} Reports Correlated)
            </h3>
            <span className="font-mono text-xs text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded font-semibold">
              EPIDEMIC CLUSTER ACTIVE
            </span>
          </div>

          <div className="space-y-3">
            {reports.map((rep) => (
              <div
                key={rep.id}
                className="bg-white border border-[#EBEBE6] rounded-xl p-4 shadow-2xs space-y-2 hover:border-[#8F6B00] transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#8F6B00]">
                      #{rep.id}
                    </span>
                    <span className="font-semibold text-xs text-[#1A1A18]">
                      {rep.productName}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-[#888]">{rep.timestamp}</span>
                </div>

                <p className="text-xs text-[#555] leading-relaxed">
                  "{rep.description || (Array.isArray(rep.symptoms) ? rep.symptoms.join(', ') : rep.symptoms)}"
                </p>

                <div className="flex flex-wrap items-center justify-between text-[11px] text-[#777] pt-2 border-t border-[#F0F0EB] gap-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#8F6B00]" />
                    <span>{rep.locationCity}, {rep.locationState}</span>
                  </span>
                  {rep.linkedBatchId && (
                    <span className="font-mono text-[10px] bg-[#FDF9EE] text-[#8F6B00] px-1.5 py-0.5 rounded border border-[#EEDBB3]">
                      CORRELATED BATCH: #{rep.linkedBatchId}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
