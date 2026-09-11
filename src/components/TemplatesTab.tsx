import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Search,
  Filter,
  CheckCircle2,
  ExternalLink,
  Layers,
  FileCheck,
} from 'lucide-react';
import { NbaTemplateMeta } from '../types/nba';
import { exportMasterNbaWorkbook } from '../utils/excelExport';

interface TemplatesTabProps {
  templates: NbaTemplateMeta[];
  onExportMasterWorkbook: () => void;
  onOpenSarReport: () => void;
}

export const TemplatesTab: React.FC<TemplatesTabProps> = ({
  templates,
  onExportMasterWorkbook,
  onOpenSarReport,
}) => {
  const [selectedCriterion, setSelectedCriterion] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = templates.filter((t) => {
    const matchesCrit = selectedCriterion === 'all' || t.targetCriterion === selectedCriterion;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.primaryCustodian.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCrit && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            NBA Accreditation Template Library & Document Generator
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Full suite of 48 standardized Excel spreadsheets, calculation workbooks, and SAR draft templates covering all 10 NBA criteria.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={onOpenSarReport}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <FileCheck className="w-4 h-4 text-indigo-400" />
            <span>Generate SAR Document</span>
          </button>
          <button
            onClick={onExportMasterWorkbook}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download All Sheets (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search templates by title, code, stakeholder, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500 font-medium">Criterion:</span>
          <select
            value={selectedCriterion}
            onChange={(e) =>
              setSelectedCriterion(e.target.value === 'all' ? 'all' : Number(e.target.value))
            }
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium"
          >
            <option value="all">All Criteria (1 to 10)</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((c) => (
              <option key={c} value={c}>
                Criterion {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((tmpl) => (
          <div
            key={tmpl.id}
            className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {tmpl.code}
                </span>
                <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  Criterion {tmpl.targetCriterion}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 mt-2.5 leading-snug">
                {tmpl.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{tmpl.purpose}</p>

              {/* Cell Color Mapping Breakdown */}
              <div className="mt-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-[11px]">
                <div className="flex items-center gap-1.5 text-blue-900 font-medium">
                  <span className="w-2 h-2 rounded bg-blue-500 flex-shrink-0" />
                  <span className="truncate">Input: {tmpl.blueCellsSummary}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700 font-mono text-[10px]">
                  <span className="w-2 h-2 rounded bg-slate-400 flex-shrink-0" />
                  <span className="truncate">Formula: {tmpl.greyCellsSummary}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px] truncate max-w-[150px]">
                Custodian: <strong>{tmpl.primaryCustodian}</strong>
              </span>

              <button
                onClick={onExportMasterWorkbook}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg flex items-center gap-1 transition-colors text-xs"
              >
                <Download className="w-3 h-3 text-slate-500" />
                <span>Get Template</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
