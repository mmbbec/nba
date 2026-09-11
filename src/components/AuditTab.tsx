import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle,
  AlertTriangle,
  Info,
  RefreshCw,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { ValidationErrorItem } from '../types/nba';

interface AuditTabProps {
  validationIssues: ValidationErrorItem[];
  onReRunAudit: () => void;
  onNavigateToModule: (module: string) => void;
  onResolveIssue: (issueId: string) => void;
}

export const AuditTab: React.FC<AuditTabProps> = ({
  validationIssues,
  onReRunAudit,
  onNavigateToModule,
  onResolveIssue,
}) => {
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');

  const criticalIssues = validationIssues.filter((i) => i.severity === 'critical');
  const warningIssues = validationIssues.filter((i) => i.severity === 'warning');
  const infoIssues = validationIssues.filter((i) => i.severity === 'info');

  const filteredIssues = validationIssues.filter((i) => {
    if (severityFilter === 'all') return true;
    return i.severity === severityFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            NBA Live Pre-Submission Audit & Data Integrity Engine
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated verification against NBA accreditation guidelines, mathematical bounds, and peer team inspection red flags.
          </p>
        </div>

        <button
          onClick={onReRunAudit}
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Re-Run Live Audit</span>
        </button>
      </div>

      {/* Severity Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Critical Red Flags
            </span>
            <div className="mt-1 text-2xl font-extrabold text-rose-700">
              {criticalIssues.length}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Will cause instant audit rejection if unresolved</p>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Compliance Warnings
            </span>
            <div className="mt-1 text-2xl font-extrabold text-amber-700">
              {warningIssues.length}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Weak areas likely to incur mark deductions</p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Informational / Advice
            </span>
            <div className="mt-1 text-2xl font-extrabold text-blue-700">
              {infoIssues.length}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Best practices & new college exemptions</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Info className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Issues Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Detected Inconsistencies & Required Corrective Actions
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review and resolve each item prior to downloading the official SAR report.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setSeverityFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-medium ${
                severityFilter === 'all' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600'
              }`}
            >
              All ({validationIssues.length})
            </button>
            <button
              onClick={() => setSeverityFilter('critical')}
              className={`px-2.5 py-1 rounded-lg font-medium text-rose-700 ${
                severityFilter === 'critical' ? 'bg-rose-100 font-bold' : ''
              }`}
            >
              Critical ({criticalIssues.length})
            </button>
            <button
              onClick={() => setSeverityFilter('warning')}
              className={`px-2.5 py-1 rounded-lg font-medium text-amber-700 ${
                severityFilter === 'warning' ? 'bg-amber-100 font-bold' : ''
              }`}
            >
              Warnings ({warningIssues.length})
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Module / Record</th>
                <th className="py-2.5 px-3">Field Name</th>
                <th className="py-2.5 px-3">Problem Detected</th>
                <th className="py-2.5 px-3">Recommended NBA Action</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredIssues.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    <span className="text-sm font-semibold text-slate-700">
                      Zero Inconsistencies Found!
                    </span>
                    <p className="text-xs text-slate-400 mt-0.5">
                      All criteria formulas and data parameters satisfy NBA Tier-II guidelines.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredIssues.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.severity === 'critical'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : item.severity === 'warning'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}
                      >
                        {item.severity === 'critical' ? (
                          <AlertTriangle className="w-3 h-3" />
                        ) : (
                          <Info className="w-3 h-3" />
                        )}
                        {item.severity.toUpperCase()}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 font-semibold text-slate-900 whitespace-nowrap">
                      {item.module}
                    </td>

                    <td className="py-2.5 px-3 font-mono text-slate-600 text-[11px]">
                      {item.fieldName}
                    </td>

                    <td className="py-2.5 px-3 font-medium text-slate-800 max-w-sm">
                      {item.issueDescription}
                    </td>

                    <td className="py-2.5 px-3 text-indigo-900 font-medium max-w-sm bg-indigo-50/20">
                      {item.recommendedAction}
                    </td>

                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => onResolveIssue(item.id)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition-colors"
                      >
                        Mark Resolved
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
