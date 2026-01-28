import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, ChevronRight, LayoutTemplate } from './Icons';
import { TEMPLATES } from '../constants';

interface UploadSectionProps {
  onUpload: (file: File) => void;
  onSelectTemplate: (templateId: string) => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({ onUpload, onSelectTemplate }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <div className="animate-fade-in-up pb-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">Validate Production Readiness</h1>
        <p className="text-slate-500 text-lg">Upload your Tech Pack to start the AI validation process.</p>
      </div>

      <div 
        className={`max-w-xl mx-auto border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept=".pdf,.xlsx,.png,.jpg"
          onChange={handleChange}
        />
        <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <UploadCloud size={40} />
        </div>
        <h3 className="text-xl font-semibold text-slate-700 mb-2">
          Click to upload or drag & drop
        </h3>
        <p className="text-slate-500 mb-6">
          PDF, Excel, or Image formats supported
        </p>
        <div className="flex justify-center gap-4 text-sm text-slate-400">
          <span className="flex items-center gap-1"><FileText size={14}/> Tech Pack</span>
          <span className="flex items-center gap-1"><FileText size={14}/> Spec Sheet</span>
        </div>
      </div>
      
      {/* Divider */}
      <div className="max-w-4xl mx-auto relative flex items-center py-12">
        <div className="flex-grow border-t border-slate-200"></div>
        <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-medium uppercase tracking-widest flex items-center gap-2">
           <LayoutTemplate size={16}/> Or Start With A Template
        </span>
        <div className="flex-grow border-t border-slate-200"></div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {TEMPLATES.map((template) => (
          <div 
            key={template.id}
            onClick={() => onSelectTemplate(template.id)}
            className="group bg-white rounded-xl border border-slate-200 p-4 hover:border-blue-400 hover:shadow-lg cursor-pointer transition-all flex items-center gap-4"
          >
            <div className="w-20 h-20 rounded-lg bg-slate-100 overflow-hidden shrink-0 relative">
               <img src={template.image} alt={template.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
               <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            </div>
            <div className="flex-1">
               <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{template.name}</h4>
               <p className="text-xs text-slate-500 mt-1 line-clamp-2">{template.description}</p>
               <div className="flex gap-2 mt-2">
                 <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded 
                   ${template.category === 'Woven' ? 'bg-amber-100 text-amber-800' : 'bg-purple-100 text-purple-800'}`}>
                   {template.category}
                 </span>
               </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:translate-x-1">
              <ChevronRight size={16} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Trusted By Teams At</p>
        <div className="flex justify-center gap-8 mt-4 opacity-50 grayscale">
           {/* Mock Logos */}
           <div className="font-bold text-xl font-serif">ZARA</div>
           <div className="font-bold text-xl font-sans">H&M</div>
           <div className="font-bold text-xl font-mono">UNIQLO</div>
        </div>
      </div>
    </div>
  );
};