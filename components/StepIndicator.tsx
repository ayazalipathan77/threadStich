import React from 'react';
import { ProcessStep } from '../types';

interface StepIndicatorProps {
  currentStep: ProcessStep;
}

const steps: { id: ProcessStep; label: string }[] = [
  { id: 'UPLOAD', label: 'Upload' },
  { id: 'ANALYSIS', label: 'Analysis' },
  { id: 'FABRIC_SELECTION', label: 'Fabric' },
  { id: 'VALIDATION', label: 'Verdict' },
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const currentIdx = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10" />
        {steps.map((step, idx) => {
          const isActive = idx <= currentIdx;
          const isCurrent = idx === currentIdx;
          return (
            <div key={step.id} className="flex flex-col items-center bg-gray-50 px-2">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  isActive ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-500'
                } ${isCurrent ? 'ring-4 ring-blue-100 scale-110' : ''}`}
              >
                {idx + 1}
              </div>
              <span className={`text-xs mt-2 font-medium ${isActive ? 'text-blue-700' : 'text-gray-400'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};