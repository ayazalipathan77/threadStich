import React, { useState, useMemo } from 'react';
import { 
  ProcessStep, 
  TechPack, 
  Fabric, 
  RuleResult, 
  Costing, 
  ReadinessReport 
} from './types';
import { 
  MOCK_PARSED_TECH_PACK, 
  MOCK_TECH_PACKS,
  BASE_COSTS 
} from './constants';
import { parseTechPackAI } from './services/geminiService';
import { StepIndicator } from './components/StepIndicator';
import { UploadSection } from './components/UploadSection';
import { AutoDetectSummary } from './components/AutoDetectSummary';
import { FabricSelector } from './components/FabricSelector';
import { ValidationResult } from './components/ValidationResult';
import { Loader2 } from './components/Icons';

export default function App() {
  const [step, setStep] = useState<ProcessStep>('UPLOAD');
  const [loading, setLoading] = useState(false);
  const [techPack, setTechPack] = useState<TechPack | null>(null);
  const [selectedFabric, setSelectedFabric] = useState<Fabric | null>(null);
  
  // Handlers
  const handleUpload = async (file: File) => {
    setLoading(true);
    // Simulate Parsing Phase
    await parseTechPackAI("mock-base64"); 
    setTechPack(MOCK_PARSED_TECH_PACK);
    setLoading(false);
    setStep('ANALYSIS');
  };

  const handleTemplateSelect = (templateId: string) => {
    setLoading(true);
    setTimeout(() => {
        const template = MOCK_TECH_PACKS[templateId];
        if (template) {
            setTechPack(template);
            setStep('ANALYSIS');
        }
        setLoading(false);
    }, 1000); // Simulate loading delay
  };

  const handleAnalysisConfirm = () => {
    setStep('FABRIC_SELECTION');
  };

  const handleFabricSelect = (fabric: Fabric) => {
    setSelectedFabric(fabric);
    setStep('VALIDATION');
  };

  // Logic Engine (Running "Live" based on state)
  const validationData = useMemo(() => {
    if (!techPack || !selectedFabric) return null;

    const results: RuleResult[] = [];

    // --- RULE LOGIC SIMULATION ---
    
    // Rule: GSM Checks (Cargo)
    if (techPack.garmentType.includes('Cargo') && selectedFabric.gsm < 180) {
      results.push({
        ruleId: 'FB-007',
        severity: 'RISK',
        category: 'Durability',
        message: `Low GSM (${selectedFabric.gsm}) for cargo pocket load areas. Recommended: 180+`
      });
    }

    // Rule: Stretch Check (Activewear)
    if (techPack.garmentType.includes('Active') && selectedFabric.stretchPercent < 10) {
        results.push({
            ruleId: 'FB-008',
            severity: 'CRITICAL',
            category: 'Performance',
            message: `Selected fabric has ${selectedFabric.stretchPercent}% stretch. Activewear requires minimum 10% stretch.`
        });
    }

    // Rule: Fabric Type vs Construction (General Incompatibility)
    // Check if categories are opposites (Woven vs Knit)
    const isWovenPack = techPack.category === 'Woven';
    const isKnitPack = techPack.category === 'Knit';
    const isWovenFabric = selectedFabric.type === 'Woven';
    const isKnitFabric = selectedFabric.type === 'Knit';

    if (isWovenPack && isKnitFabric) {
      results.push({
        ruleId: 'FB-001',
        severity: 'CRITICAL',
        category: 'Compatibility',
        message: 'Woven stitch construction specified for Knit fabric. High risk of seam failure.'
      });
    } else if (isKnitPack && isWovenFabric) {
       results.push({
        ruleId: 'FB-002',
        severity: 'CRITICAL',
        category: 'Compatibility',
        message: 'Knit pattern requires stretch. Woven fabric selected will cause fit restriction.'
      }); 
    }

    // Rule: Shrinkage vs Tolerance
    const maxTolerance = Math.max(...techPack.measurements.map(m => m.toleranceCm));
    // Rough logic: 1% shrinkage on 50cm is 0.5cm. 
    if (selectedFabric.shrinkagePercent > 3 && maxTolerance < 0.6) {
      results.push({
        ruleId: 'TP-004',
        severity: 'RISK',
        category: 'Fit',
        message: `Fabric shrinkage (${selectedFabric.shrinkagePercent}%) exceeds tolerance safety margin.`
      });
    }

    // Rule: SPI Check
    if (techPack.construction.spi > 10 && selectedFabric.gsm < 150) {
       results.push({
        ruleId: 'ST-003',
        severity: 'RISK',
        category: 'Stitching',
        message: 'High SPI (>10) on lightweight fabric may cause puckering.'
      });
    }

    // Default Passes
    if (techPack.measurements.length > 0) {
      results.push({ ruleId: 'TP-001', severity: 'SAFE', category: 'Tech Pack', message: 'Measurement table present.' });
    }
    
    // --- COSTING CALC ---
    const widthFactor = selectedFabric.widthInches >= 58 ? 1 : 1.2;
    const fabricCostPerPiece = (1.65 * widthFactor) * selectedFabric.costPerMeter; // Mock consumption
    const totalCost = fabricCostPerPiece + BASE_COSTS.trimCost + BASE_COSTS.cmCost + BASE_COSTS.washingCost + BASE_COSTS.overheadCost;
    const margin = ((BASE_COSTS.buyerPrice - totalCost) / BASE_COSTS.buyerPrice) * 100;

    const costing: Costing = {
      fabricCost: fabricCostPerPiece,
      trimCost: BASE_COSTS.trimCost,
      cmCost: BASE_COSTS.cmCost,
      washingCost: BASE_COSTS.washingCost,
      overheadCost: BASE_COSTS.overheadCost,
      totalCostPerPiece: totalCost,
      buyerPrice: BASE_COSTS.buyerPrice,
      marginPercent: margin
    };

    // Costing Rule
    if (margin < 5) {
      results.push({
        ruleId: 'CT-004',
        severity: 'RISK',
        category: 'Commercial',
        message: `Margin (${margin.toFixed(1)}%) is below factory threshold of 5%.`
      });
    }

    // --- READINESS SCORE ---
    let score = 100;
    let failCount = 0;
    let warningCount = 0;

    results.forEach(r => {
      if (r.severity === 'CRITICAL') {
        score -= 25;
        failCount++;
      }
      if (r.severity === 'RISK') {
        score -= 10;
        warningCount++;
      }
    });

    const status = score >= 80 ? 'PRODUCTION READY' : score >= 50 ? 'SAMPLE WITH CAUTION' : 'REJECTED';

    return { results, costing, readiness: { score, status, failCount, warningCount } };

  }, [techPack, selectedFabric]);


  // --- RENDER ---

  return (
    <div className="min-h-screen pb-20 font-sans text-slate-600">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
           <div className="flex items-center gap-2 font-bold text-slate-800 text-xl tracking-tight cursor-pointer" onClick={() => setStep('UPLOAD')}>
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.54 15H17a2 2 0 0 0-2 2v4.54"/><path d="M7 3.34V5a3 3 0 0 0 3 3v0a2 2 0 0 1 2 2v0c0 1.1.9 2 2 2v0a2 2 0 0 0 2-2v0c0-1.1.9-2 2-2h3.17"/><path d="M11 21.95V18a2 2 0 0 0-2-2v0a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05"/></svg>
             </div>
             ThreadLogic
           </div>
           <div className="flex items-center gap-4 text-sm font-medium">
             <span className="text-slate-400">Enterprise Edition</span>
             <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">JD</div>
           </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        <StepIndicator currentStep={step} />

        {step === 'UPLOAD' && (
          loading ? (
             <div className="flex flex-col items-center justify-center py-32 animate-fade-in">
                <Loader2 size={64} className="text-blue-500 animate-spin mb-6" />
                <h2 className="text-2xl font-bold text-slate-700">Parsing Tech Pack Document...</h2>
                <p className="text-slate-500 mt-2">AI is extracting 42 data points including measurement tables.</p>
             </div>
          ) : (
            <UploadSection onUpload={handleUpload} onSelectTemplate={handleTemplateSelect} />
          )
        )}

        {step === 'ANALYSIS' && techPack && (
          <AutoDetectSummary techPack={techPack} onConfirm={handleAnalysisConfirm} />
        )}

        {(step === 'FABRIC_SELECTION' || step === 'VALIDATION') && (
          <>
            <FabricSelector onSelect={handleFabricSelect} selectedFabricId={selectedFabric?.fabricId} />
            
            {step === 'VALIDATION' && validationData && techPack && selectedFabric && (
               <div className="mt-12 border-t border-slate-200 pt-12">
                 <ValidationResult 
                    results={validationData.results}
                    costing={validationData.costing}
                    readiness={validationData.readiness}
                    techPack={techPack}
                    fabric={selectedFabric}
                 />
               </div>
            )}
          </>
        )}
      </main>

      {/* Decision Footer (Sticky) */}
      {step === 'VALIDATION' && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 shadow-2xl p-4 z-40 animate-slide-up">
           <div className="max-w-7xl mx-auto flex justify-between items-center">
             <div className="flex items-center gap-4">
                <button 
                  onClick={() => setStep('FABRIC_SELECTION')}
                  className="text-slate-500 hover:text-slate-800 font-medium text-sm"
                >
                  Change Fabric
                </button>
             </div>
             <div className="flex gap-4">
                <button className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition-colors">
                  Share Report
                </button>
                <button className="px-8 py-2.5 rounded-lg bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors shadow-lg">
                  Proceed to Sampling
                </button>
             </div>
           </div>
        </div>
      )}

      {/* Global Styles for Animations */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
        .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
}