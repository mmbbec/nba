import React from 'react';
import {
  Award,
  Download,
  FileCheck,
  Building2,
  Printer,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { InstitutionMaster } from '../types/nba';

interface HeaderProps {
  institution: InstitutionMaster;
  totalEstimatedScore: number;
  overallPercentage: number;
  unresolvedIssuesCount: number;
  onExportExcel: () => void;
  onOpenSarPrint: () => void;
  onOpenDeptProfilePrint?: () => void;
  onOpenFacultyProfilePrint?: () => void;
  onRunAudit: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  institution,
  totalEstimatedScore,
  overallPercentage,
  unresolvedIssuesCount,
  onExportExcel,
  onOpenSarPrint,
  onOpenDeptProfilePrint,
  onOpenFacultyProfilePrint,
  onRunAudit,
}) => {
  const isReady = overallPercentage >= 70 && unresolvedIssuesCount === 0;

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 shadow-md">
      {/* Top Banner with College Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-xl shadow-inner text-white flex-shrink-0">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                NBA Tier-II UG Engineering
              </span>
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-medium px-2 py-0.5 rounded-full">
                {institution.nbaCycle}
              </span>
              {institution.isNewCollege && (
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-medium px-2 py-0.5 rounded-full">
                  New College / First Batch Mode
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
              {institution.collegeName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-2 mt-0.5">
              <span>{institution.programName}</span>
              <span className="text-slate-600">•</span>
              <span>Affiliated to: {institution.affiliatingUniversity}</span>
              <span className="text-slate-600">•</span>
              <span className="font-semibold text-slate-300">{institution.academicYearCAY}</span>
            </p>
          </div>
        </div>

        {/* Action Controls & Readiness Gauge */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Quick Score Card */}
          <div className="bg-slate-800/90 border border-slate-700 px-3.5 py-1.5 rounded-xl flex items-center gap-3">
            <div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">Estimated Score</div>
              <div className="text-lg font-bold text-white flex items-baseline gap-1">
                <span>{totalEstimatedScore}</span>
                <span className="text-xs text-slate-400 font-normal">/ 1000</span>
              </div>
            </div>
            <div className="h-8 w-[1px] bg-slate-700" />
            <div className="flex items-center gap-1.5">
              <span
                className={`w-3 h-3 rounded-full ${
                  overallPercentage >= 75
                    ? 'bg-emerald-400 animate-pulse'
                    : overallPercentage >= 60
                    ? 'bg-amber-400'
                    : 'bg-rose-500'
                }`}
              />
              <span className="text-sm font-semibold text-slate-200">{overallPercentage}%</span>
            </div>
          </div>

          {/* Audit Button with Issue Count */}
          <button
            onClick={onRunAudit}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
              unresolvedIssuesCount > 0
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {unresolvedIssuesCount > 0 ? (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span>Audit ({unresolvedIssuesCount})</span>
          </button>

          {/* Department Profile PDF */}
          {onOpenDeptProfilePrint && (
            <button
              onClick={onOpenDeptProfilePrint}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Export formatted Department Profile Sheet for physical or digital submission"
            >
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Dept Profile (PDF)</span>
            </button>
          )}

          {/* Faculty Profile PDF */}
          {onOpenFacultyProfilePrint && (
            <button
              onClick={onOpenFacultyProfilePrint}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Export formatted Faculty Profile Dossier for physical or digital submission"
            >
              <Printer className="w-3.5 h-3.5 text-cyan-400" />
              <span>Faculty PDF</span>
            </button>
          )}

          {/* SAR Printable View */}
          <button
            onClick={onOpenSarPrint}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-indigo-400" />
            <span>SAR Report</span>
          </button>

          {/* Excel Export Button */}
          <button
            onClick={onExportExcel}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export Master Excel (.xlsx)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
