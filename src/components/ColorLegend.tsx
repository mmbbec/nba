import React from 'react';
import { Info, HelpCircle } from 'lucide-react';

export const ColorLegend: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-2 text-slate-700 font-medium">
        <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
        <span className="font-semibold text-slate-900">NBA Cell Standard & Calculation Guide:</span>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-blue-100 border border-blue-300 inline-block shadow-2xs" />
          <span className="text-slate-700 font-medium">Blue: <span className="text-blue-700 font-semibold">User Input (Raw Entry)</span></span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-slate-200 border border-slate-400 inline-block shadow-2xs" />
          <span className="text-slate-700 font-medium">Grey: <span className="text-slate-800 font-semibold font-mono">Formula (Auto-Calculated)</span></span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-emerald-100 border border-emerald-400 inline-block shadow-2xs" />
          <span className="text-slate-700 font-medium">Green: <span className="text-emerald-700 font-semibold">Validated & Complete</span></span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-rose-100 border border-rose-400 inline-block shadow-2xs" />
          <span className="text-slate-700 font-medium">Red: <span className="text-rose-700 font-semibold">Error / Missing Action</span></span>
        </div>
      </div>

      <div className="hidden lg:flex items-center gap-1.5 text-slate-500 text-[11px] bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
        <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
        <span>New College logic active: Historical metrics scale gracefully with pending graduation notes</span>
      </div>
    </div>
  );
};
