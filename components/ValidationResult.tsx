import React, { useState } from 'react';
import { Costing, ReadinessReport, RuleResult, TechPack, Fabric } from '../types';
import { AlertTriangle, XCircle, CheckCircle2, Info, Loader2, Sparkles, DollarSign } from './Icons';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip } from 'recharts';
import { getAIExplanation } from '../services/geminiService';

interface ValidationResultProps {
  results: RuleResult[];
  costing: Costing;
  readiness: ReadinessReport;
  techPack: TechPack;
  fabric: Fabric;
}

export const ValidationResult: React.FC<ValidationResultProps> = ({ results, costing, readiness, techPack, fabric }) => {
  const [explainingRuleId, setExplainingRuleId] = useState<string | null>(null);
  const [explanations, setExplanations] = useState<Record<string, string>>({});

  const handleExplain = async (rule: RuleResult) => {
    if (explanations[rule.ruleId]) return; // Already explained
    
    setExplainingRuleId(rule.ruleId);
    const explanation = await getAIExplanation(rule, techPack, fabric);
    setExplanations(prev => ({ ...prev, [rule.ruleId]: explanation }));
    setExplainingRuleId(null);
  };

  // Group Results
  const criticals = results.filter(r => r.severity === 'CRITICAL');
  const risks = results.filter(r => r.severity === 'RISK');
  const passes = results.filter(r => r.severity === 'SAFE');

  // Chart Data
  const costData = [
    { name: 'Fabric', value: costing.fabricCost, color: '#3b82f6' },
    { name: 'CM', value: costing.cmCost, color: '#64748b' },
    { name: 'Trims', value: costing.trimCost, color: '#94a3b8' },
    { name: 'Wash/Other', value: costing.washingCost + costing.overheadCost, color: '#cbd5e1' },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 border-green-200 bg-green-50';
    if (score >= 50) return 'text-yellow-600 border-yellow-200 bg-yellow-50';
    return 'text-red-600 border-red-200 bg-red-50';
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up pb-24">
      
      {/* LEFT COLUMN: Rules Engine */}
      <div className="lg:col-span-2 space-y-6">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          Validation Verdict
          <span className="text-xs font-normal bg-slate-200 text-slate-600 px-2 py-1 rounded-full">{results.length} Rules Checked</span>
        </h3>

        {/* Critical Issues */}
        {criticals.length > 0 && (
          <div className="space-y-3">
             {criticals.map(rule => (
               <RuleCard 
                 key={rule.ruleId} 
                 rule={rule} 
                 onExplain={() => handleExplain(rule)}
                 loading={explainingRuleId === rule.ruleId}
                 explanation={explanations[rule.ruleId]}
               />
             ))}
          </div>
        )}

        {/* Warnings */}
        {risks.length > 0 && (
          <div className="space-y-3">
             {risks.map(rule => (
               <RuleCard 
                 key={rule.ruleId} 
                 rule={rule} 
                 onExplain={() => handleExplain(rule)}
                 loading={explainingRuleId === rule.ruleId}
                 explanation={explanations[rule.ruleId]}
               />
             ))}
          </div>
        )}

        {/* Passes (Collapsed or Summarized) */}
        <div className="bg-green-50/50 border border-green-100 rounded-xl p-4 flex flex-wrap gap-2">
           {passes.map(rule => (
             <span key={rule.ruleId} className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-md">
               <CheckCircle2 size={12}/> {rule.category}
             </span>
           ))}
           <span className="text-xs text-green-600 self-center ml-2">All other parameters optimized.</span>
        </div>
      </div>

      {/* RIGHT COLUMN: Score & Costing */}
      <div className="space-y-6">
        
        {/* Readiness Score */}
        <div className={`rounded-2xl p-6 border-2 flex flex-col items-center justify-center text-center ${getScoreColor(readiness.score)}`}>
           <div className="text-sm font-bold tracking-widest uppercase mb-2 opacity-70">Production Readiness</div>
           <div className="text-6xl font-black mb-2">{readiness.score}</div>
           <div className="font-bold text-lg">{readiness.status}</div>
        </div>

        {/* Costing Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <DollarSign size={18} className="text-blue-500"/> Cost Structure
          </h4>
          
          <div className="h-48 w-full relative">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={costData}
                   innerRadius={50}
                   outerRadius={70}
                   paddingAngle={5}
                   dataKey="value"
                 >
                   {costData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} />
                   ))}
                 </Pie>
                 <ReTooltip />
               </PieChart>
             </ResponsiveContainer>
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="block text-xs text-slate-400">Total</span>
                <span className="block font-bold text-slate-800">${costing.totalCostPerPiece.toFixed(2)}</span>
             </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm border-b border-slate-100 pb-2">
              <span className="text-slate-500">Target Price</span>
              <span className="font-medium">${costing.buyerPrice.toFixed(2)}</span>
            </div>
             <div className="flex justify-between text-sm pt-1">
              <span className="text-slate-500">Est. Margin</span>
              <span className={`font-bold ${costing.marginPercent < 5 ? 'text-red-500' : 'text-green-600'}`}>
                {costing.marginPercent.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// Sub-component for individual Rule Cards
const RuleCard: React.FC<{ 
  rule: RuleResult; 
  onExplain: () => void; 
  loading: boolean;
  explanation?: string;
}> = ({ rule, onExplain, loading, explanation }) => {
  const isCritical = rule.severity === 'CRITICAL';
  
  return (
    <div className={`rounded-xl p-5 border-l-4 shadow-sm bg-white transition-all
      ${isCritical ? 'border-l-red-500' : 'border-l-yellow-400'}
    `}>
      <div className="flex items-start gap-3">
        {isCritical ? <XCircle className="text-red-500 shrink-0 mt-1" /> : <AlertTriangle className="text-yellow-500 shrink-0 mt-1" />}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h5 className="font-bold text-slate-800">{rule.category} Issue</h5>
             <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded 
               ${isCritical ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}
             `}>
               {rule.severity}
             </span>
          </div>
          <p className="text-slate-600 mt-1">{rule.message}</p>
          
          {explanation ? (
             <div className="mt-3 bg-blue-50 p-3 rounded-lg text-sm text-blue-800 flex gap-2">
               <Sparkles size={16} className="shrink-0 mt-0.5 text-blue-500"/>
               <p>{explanation}</p>
             </div>
          ) : (
             <button 
               onClick={onExplain}
               disabled={loading}
               className="mt-3 text-xs font-semibold text-blue-600 flex items-center gap-1 hover:underline disabled:opacity-50"
             >
               {loading ? <Loader2 size={12} className="animate-spin"/> : <Sparkles size={12}/>}
               {loading ? "AI is thinking..." : "Ask AI Why"}
             </button>
          )}
        </div>
      </div>
    </div>
  );
};
