import React from 'react';
import { Fabric } from '../types';
import { FABRIC_LIBRARY } from '../constants';
import { Layers, Activity, Zap } from './Icons';

interface FabricSelectorProps {
  onSelect: (fabric: Fabric) => void;
  selectedFabricId?: string;
}

export const FabricSelector: React.FC<FabricSelectorProps> = ({ onSelect, selectedFabricId }) => {
  return (
    <div className="max-w-6xl mx-auto animate-fade-in-up">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-slate-800">Select Material Profile</h2>
        <p className="text-slate-500">The system will instantly re-calculate feasibility based on physical properties.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {FABRIC_LIBRARY.map((fabric) => {
          const isSelected = selectedFabricId === fabric.fabricId;
          return (
            <div 
              key={fabric.fabricId}
              onClick={() => onSelect(fabric)}
              className={`
                group relative bg-white rounded-xl cursor-pointer transition-all duration-300 overflow-hidden border-2
                ${isSelected 
                  ? 'border-blue-600 shadow-xl shadow-blue-100 scale-105 z-10' 
                  : 'border-transparent hover:border-slate-300 shadow-sm hover:shadow-md'
                }
              `}
            >
              <div className="h-32 w-full bg-gray-200 overflow-hidden">
                <img src={fabric.imageUrl} alt={fabric.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                   <h3 className={`font-bold text-lg leading-tight ${isSelected ? 'text-blue-700' : 'text-slate-700'}`}>
                    {fabric.name}
                  </h3>
                  {isSelected && <div className="bg-blue-600 text-white rounded-full p-1"><CheckCircleIcon /></div>}
                </div>
               
                <p className="text-xs text-slate-400 font-mono mb-4">{fabric.fabricId}</p>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 flex items-center gap-1"><Layers size={14}/> GSM</span>
                    <span className="font-semibold text-slate-700">{fabric.gsm}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 flex items-center gap-1"><Activity size={14}/> Stretch</span>
                    <span className="font-semibold text-slate-700">{fabric.stretchPercent}%</span>
                  </div>
                   <div className="flex justify-between text-sm">
                    <span className="text-slate-500 flex items-center gap-1"><Zap size={14}/> Shrinkage</span>
                    <span className="font-semibold text-slate-700">{fabric.shrinkagePercent}%</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-xs text-slate-400">Cost/Mtr</span>
                    <span className="font-bold text-slate-800">${fabric.costPerMeter.toFixed(2)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
)
