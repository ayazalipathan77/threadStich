import React, { useEffect, useState } from 'react';
import { TechPack } from '../types';
import { Shirt, Scissors, Scale, Layers, CheckCircle2, Loader2 } from './Icons';

interface AutoDetectSummaryProps {
  techPack: TechPack;
  onConfirm: () => void;
}

export const AutoDetectSummary: React.FC<AutoDetectSummaryProps> = ({ techPack, onConfirm }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500); // Simulate "Thinking"
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <Loader2 size={48} className="text-blue-600 animate-spin mb-4" />
        <h3 className="text-xl font-semibold text-slate-700">Analyzing Tech Pack Structure...</h3>
        <p className="text-slate-500">Extracting measurements, construction details, and garment type.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-8 py-4 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <CheckCircle2 size={20} className="text-green-500" />
              Auto-Detection Complete
            </h2>
            <p className="text-sm text-slate-500">We extracted the following parameters from your file.</p>
          </div>
          <button 
            onClick={onConfirm}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-blue-200"
          >
            Confirm & Select Fabric
          </button>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 mb-2 text-slate-400 text-sm font-medium uppercase tracking-wider">
              <Shirt size={16} /> Garment
            </div>
            <div className="font-bold text-lg text-slate-800">{techPack.garmentType}</div>
            <div className="text-sm text-slate-500">{techPack.gender} • {techPack.category}</div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 mb-2 text-slate-400 text-sm font-medium uppercase tracking-wider">
              <Scale size={16} /> Sizing
            </div>
            <div className="font-bold text-lg text-slate-800">{techPack.sizeRange.length} Sizes</div>
            <div className="text-sm text-slate-500">{techPack.sizeRange.join(' - ')}</div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 mb-2 text-slate-400 text-sm font-medium uppercase tracking-wider">
              <Scissors size={16} /> Construction
            </div>
            <div className="font-bold text-lg text-slate-800">{techPack.construction.stitchType}</div>
            <div className="text-sm text-slate-500">SPI: {techPack.construction.spi} • {techPack.construction.seamType}</div>
          </div>

           <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 mb-2 text-slate-400 text-sm font-medium uppercase tracking-wider">
              <Layers size={16} /> Specs
            </div>
            <div className="font-bold text-lg text-slate-800">{techPack.measurements.length} Points</div>
            <div className="text-sm text-slate-500">Avg Tolerance: ±0.6cm</div>
          </div>
        </div>

        {/* Sneak peek of what's next */}
        <div className="px-8 pb-8 pt-0">
          <div className="text-xs font-mono text-slate-400 bg-slate-900 rounded p-3">
             <span className="text-green-400">✓</span> PARSED: Style {techPack.styleCode}<br/>
             <span className="text-green-400">✓</span> DETECTED: Buyer {techPack.buyer}<br/>
             <span className="text-yellow-400">⚡</span> WAITING: Material Physics Application...
          </div>
        </div>
      </div>
    </div>
  );
};