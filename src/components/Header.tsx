import React, { useState } from 'react';
import {
  Award,
  Download,
  FileCheck,
  Building2,
  Printer,
  ShieldCheck,
  AlertTriangle,
  Edit2,
  X,
  CheckCircle,
  GraduationCap,
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
  onUpdateInstitution?: (updated: InstitutionMaster) => void;
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
  onUpdateInstitution,
}) => {
  const isReady = overallPercentage >= 70 && unresolvedIssuesCount === 0;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    collegeName: institution.collegeName,
    programName: institution.programName,
    affiliatingUniversity: institution.affiliatingUniversity,
    department: institution.department,
    academicYearCAY: institution.academicYearCAY,
    collegeCode: institution.collegeCode,
  });

  const handleOpenEdit = () => {
    setFormData({
      collegeName: institution.collegeName,
      programName: institution.programName,
      affiliatingUniversity: institution.affiliatingUniversity,
      department: institution.department,
      academicYearCAY: institution.academicYearCAY,
      collegeCode: institution.collegeCode,
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateInstitution) {
      onUpdateInstitution({
        ...institution,
        collegeName: formData.collegeName.trim() || institution.collegeName,
        programName: formData.programName.trim() || institution.programName,
        affiliatingUniversity: formData.affiliatingUniversity.trim() || institution.affiliatingUniversity,
        department: formData.department.trim() || institution.department,
        academicYearCAY: formData.academicYearCAY.trim() || institution.academicYearCAY,
        collegeCode: formData.collegeCode.trim() || institution.collegeCode,
      });
    }
    setIsEditModalOpen(false);
  };

  const handleClearPlaceholders = () => {
    setFormData((prev) => ({
      ...prev,
      collegeName: prev.collegeName.replace(/\[ENTER COLLEGE NAME\]\s*[-–]?\s*/gi, '').trim(),
      programName: prev.programName.replace(/\[ENTER PROGRAM NAME\]\s*[-–]?\s*/gi, '').trim(),
      affiliatingUniversity: prev.affiliatingUniversity.replace(/\[ENTER UNIVERSITY NAME\]\s*[-–]?\s*/gi, '').trim(),
    }));
  };

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 shadow-md">
      {/* Top Banner with College Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-xl shadow-inner text-white flex-shrink-0 mt-0.5">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1
                onClick={handleOpenEdit}
                className="text-xl sm:text-2xl font-bold tracking-tight text-white cursor-pointer hover:text-blue-300 transition-colors"
                title="Click to edit College Name"
              >
                {institution.collegeName}
              </h1>
              <button
                onClick={handleOpenEdit}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-300 hover:text-white bg-slate-800 hover:bg-blue-600 px-2.5 py-1 rounded-lg border border-slate-700 hover:border-blue-500 transition-colors shadow-xs"
                title="Edit College Name, Program Name, and Affiliated University"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Info</span>
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-2 mt-1 flex-wrap">
              <span
                onClick={handleOpenEdit}
                className="cursor-pointer hover:text-blue-300 transition-colors text-slate-300 font-medium"
                title="Click to edit Program Name"
              >
                {institution.programName}
              </span>
              <span className="text-slate-600">•</span>
              <span
                onClick={handleOpenEdit}
                className="cursor-pointer hover:text-blue-300 transition-colors text-slate-300"
                title="Click to edit Affiliated University"
              >
                Affiliated to: <span className="text-white font-medium">{institution.affiliatingUniversity}</span>
              </span>
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

      {/* Edit Institutional Details Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Edit Institutional Details
                  </h3>
                  <p className="text-xs text-slate-500">
                    Update college name, program, and affiliated university
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick helper to strip template brackets if present */}
            {(formData.collegeName.includes('[ENTER') ||
              formData.programName.includes('[ENTER') ||
              formData.affiliatingUniversity.includes('[ENTER')) && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-2 text-xs text-amber-800">
                <span>Template placeholder tags detected in text.</span>
                <button
                  type="button"
                  onClick={handleClearPlaceholders}
                  className="px-2.5 py-1 bg-amber-200 hover:bg-amber-300 text-amber-900 font-semibold rounded-lg text-[11px] shrink-0 transition-colors"
                >
                  Clear '[ENTER ...]' Tags
                </button>
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-4">
              {/* College Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  College / Institute Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bangalore Institute of Technology & Science"
                  value={formData.collegeName}
                  onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>

              {/* Program Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Program & Engineering Branch <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. B.Tech Computer Science & Engineering"
                  value={formData.programName}
                  onChange={(e) => setFormData({ ...formData, programName: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>

              {/* Affiliating University */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Affiliating University <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Visvesvaraya Technological University (VTU)"
                  value={formData.affiliatingUniversity}
                  onChange={(e) => setFormData({ ...formData, affiliatingUniversity: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>

              {/* Department & Academic Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Department of Computer Science & Engineering"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Academic Year (CAY)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2025-26 (CAY)"
                    value={formData.academicYearCAY}
                    onChange={(e) => setFormData({ ...formData, academicYearCAY: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Save Details</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
