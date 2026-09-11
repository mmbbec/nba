import React, { useState } from 'react';
import {
  Building2,
  Sliders,
  History,
  Save,
  CheckCircle,
  HelpCircle,
  AlertCircle,
  Lock,
  Printer,
  FileText,
} from 'lucide-react';
import { InstitutionMaster, AttainmentConfig, AuditLogEntry } from '../types/nba';

interface MasterControlTabProps {
  institution: InstitutionMaster;
  attainmentConfig: AttainmentConfig;
  auditLogs: AuditLogEntry[];
  onUpdateInstitution: (updated: InstitutionMaster) => void;
  onUpdateAttainmentConfig: (updated: AttainmentConfig) => void;
  onOpenDeptProfilePdf?: () => void;
}

export const MasterControlTab: React.FC<MasterControlTabProps> = ({
  institution,
  attainmentConfig,
  auditLogs,
  onUpdateInstitution,
  onUpdateAttainmentConfig,
  onOpenDeptProfilePdf,
}) => {
  const [instForm, setInstForm] = useState<InstitutionMaster>({ ...institution });
  const [configForm, setConfigForm] = useState<AttainmentConfig>({ ...attainmentConfig });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateInstitution(instForm);
    onUpdateAttainmentConfig(configForm);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSaveAll} className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            NBA Master Control Sheet & Governance Parameters
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Single-point institutional data configuration. Values entered here automatically cascade to all Criteria, Course Files, and Reports.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          {onOpenDeptProfilePdf && (
            <button
              type="button"
              onClick={onOpenDeptProfilePdf}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
              title="Generate printable Department Profile Sheet for NBA Peer Team"
            >
              <Printer className="w-4 h-4 text-indigo-400" />
              <span>Export Dept Profile (PDF)</span>
            </button>
          )}

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Master Configuration</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Institutional parameters and attainment calculation weights updated successfully!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Institution & Program Profile */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
              Institutional Identity & Accreditation Cycle
            </h3>
            <span className="text-[11px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-semibold border border-blue-200">
              Blue Cells = Raw Input
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                College Name & Location
              </label>
              <input
                type="text"
                value={instForm.collegeName}
                onChange={(e) => setInstForm({ ...instForm, collegeName: e.target.value })}
                className="w-full px-3 py-2 bg-blue-50/50 border border-blue-200 focus:border-blue-500 focus:bg-white rounded-xl text-slate-900 font-medium transition-colors"
                placeholder="[ENTER COLLEGE NAME]"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  College / CET Code
                </label>
                <input
                  type="text"
                  value={instForm.collegeCode}
                  onChange={(e) => setInstForm({ ...instForm, collegeCode: e.target.value })}
                  className="w-full px-3 py-2 bg-blue-50/50 border border-blue-200 focus:border-blue-500 focus:bg-white rounded-xl text-slate-900 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Accreditation Tier
                </label>
                <select
                  value={instForm.accreditationTier}
                  onChange={(e) => setInstForm({ ...instForm, accreditationTier: e.target.value as 'Tier-I' | 'Tier-II' })}
                  className="w-full px-3 py-2 bg-blue-50/50 border border-blue-200 rounded-xl text-slate-900 font-medium"
                >
                  <option value="Tier-II">Tier-II (Affiliated Colleges)</option>
                  <option value="Tier-I">Tier-I (Autonomous / University Departments)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Program & Engineering Branch Name
              </label>
              <input
                type="text"
                value={instForm.programName}
                onChange={(e) => setInstForm({ ...instForm, programName: e.target.value })}
                className="w-full px-3 py-2 bg-blue-50/50 border border-blue-200 rounded-xl text-slate-900 font-medium"
                placeholder="[ENTER PROGRAM NAME]"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={instForm.department}
                  onChange={(e) => setInstForm({ ...instForm, department: e.target.value })}
                  className="w-full px-3 py-2 bg-blue-50/50 border border-blue-200 rounded-xl text-slate-900 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Affiliating University
                </label>
                <input
                  type="text"
                  value={instForm.affiliatingUniversity}
                  onChange={(e) => setInstForm({ ...instForm, affiliatingUniversity: e.target.value })}
                  className="w-full px-3 py-2 bg-blue-50/50 border border-blue-200 rounded-xl text-slate-900 font-medium"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Approved Intake
                </label>
                <input
                  type="number"
                  value={instForm.approvedIntake}
                  onChange={(e) => setInstForm({ ...instForm, approvedIntake: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-blue-50/50 border border-blue-200 rounded-xl text-slate-900 font-medium"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Year of Establishment
                </label>
                <input
                  type="number"
                  value={instForm.yearOfEstablishment}
                  onChange={(e) => setInstForm({ ...instForm, yearOfEstablishment: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-blue-50/50 border border-blue-200 rounded-xl text-slate-900 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  First Batch Convocation
                </label>
                <input
                  type="text"
                  value={instForm.firstGraduatingBatchYear}
                  onChange={(e) => setInstForm({ ...instForm, firstGraduatingBatchYear: e.target.value })}
                  className="w-full px-3 py-2 bg-blue-50/50 border border-blue-200 rounded-xl text-slate-900 font-medium"
                  required
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Principal / Director</label>
                <input
                  type="text"
                  value={instForm.principalDirector}
                  onChange={(e) => setInstForm({ ...instForm, principalDirector: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Head of Department</label>
                <input
                  type="text"
                  value={instForm.hodName}
                  onChange={(e) => setInstForm({ ...instForm, hodName: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">NBA Coordinator</label>
                <input
                  type="text"
                  value={instForm.nbaCoordinator}
                  onChange={(e) => setInstForm({ ...instForm, nbaCoordinator: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Configurable Attainment Methodology */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600" />
              Configurable CO & PO Attainment Formula Logic
            </h3>
            <span className="text-[11px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-semibold border border-amber-200">
              Approved Institutional Model
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-600 leading-relaxed">
              NBA allows institutions to define their internal attainment policy. Enter your Academic Council / DQAC approved weightages below. Formulas automatically recalculate all sheets.
            </div>

            {/* Direct vs Indirect Split */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Direct Assessment Weight (%)
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="0.5"
                  max="1.0"
                  value={configForm.directWeightage}
                  onChange={(e) => {
                    const direct = Number(e.target.value);
                    setConfigForm({
                      ...configForm,
                      directWeightage: direct,
                      indirectWeightage: Math.max(0, Math.round((1 - direct) * 100) / 100),
                    });
                  }}
                  className="w-full px-3 py-2 bg-blue-50/50 border border-blue-200 rounded-xl text-slate-900 font-bold"
                />
                <span className="text-[11px] text-slate-400 mt-0.5 block">Standard: 80% (0.80)</span>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Indirect Assessment Weight (%)
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={configForm.indirectWeightage}
                  disabled
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-xl text-slate-700 font-bold cursor-not-allowed"
                />
                <span className="text-[11px] text-slate-400 mt-0.5 block">Standard: 20% (0.20)</span>
              </div>
            </div>

            {/* CIE vs SEE internal split */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Internal (CIE) Weight in Direct
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="0.1"
                  max="0.5"
                  value={configForm.cieWeightage}
                  onChange={(e) => {
                    const cie = Number(e.target.value);
                    setConfigForm({
                      ...configForm,
                      cieWeightage: cie,
                      seeWeightage: Math.max(0, Math.round((1 - cie) * 100) / 100),
                    });
                  }}
                  className="w-full px-3 py-2 bg-blue-50/50 border border-blue-200 rounded-xl text-slate-900 font-bold"
                />
                <span className="text-[11px] text-slate-400 mt-0.5 block">Standard: 30% (0.30)</span>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Semester End (SEE) Weight
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={configForm.seeWeightage}
                  disabled
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-xl text-slate-700 font-bold cursor-not-allowed"
                />
                <span className="text-[11px] text-slate-400 mt-0.5 block">Standard: 70% (0.70)</span>
              </div>
            </div>

            {/* Threshold Percent */}
            <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-2">
              <label className="block text-indigo-950 font-semibold">
                Attainment Benchmark Threshold Marks (%)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={configForm.thresholdPercent}
                  onChange={(e) => setConfigForm({ ...configForm, thresholdPercent: Number(e.target.value) })}
                  className="w-24 px-3 py-1.5 bg-white border border-indigo-200 rounded-lg text-indigo-950 font-bold text-center"
                  min="35"
                  max="80"
                />
                <span className="text-xs text-indigo-900">
                  A student is counted as "Attained" if they score ≥ {configForm.thresholdPercent}% marks in the course assessments.
                </span>
              </div>
            </div>

            {/* 3-Level Mapping Thresholds */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">
                Class Percentage Required for Attainment Levels (0 to 3 Scale)
              </label>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                  <div className="text-[11px] text-slate-500 font-bold">Level 1</div>
                  <div className="text-sm font-extrabold text-slate-900 mt-0.5">≥ {configForm.level1MinPercentage}%</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">students pass benchmark</div>
                </div>

                <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                  <div className="text-[11px] text-slate-500 font-bold">Level 2</div>
                  <div className="text-sm font-extrabold text-slate-900 mt-0.5">≥ {configForm.level2MinPercentage}%</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">students pass benchmark</div>
                </div>

                <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                  <div className="text-[11px] text-slate-500 font-bold">Level 3</div>
                  <div className="text-sm font-extrabold text-slate-900 mt-0.5">≥ {configForm.level3MinPercentage}%</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">students pass benchmark</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Audit Trail Log */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <History className="w-4 h-4 text-slate-600" />
            Accreditation Audit Trail (Administrative Edit Log)
          </h3>
          <span className="text-[11px] text-slate-400">Maintains tamper-evident change log for NBA peer team</span>
        </div>

        <div className="mt-3 divide-y divide-slate-100 overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 border-b border-slate-100 text-[11px]">
                <th className="pb-2 font-semibold">Timestamp</th>
                <th className="pb-2 font-semibold">Responsible User</th>
                <th className="pb-2 font-semibold">Module</th>
                <th className="pb-2 font-semibold">Field Changed</th>
                <th className="pb-2 font-semibold">Previous Value</th>
                <th className="pb-2 font-semibold">New Value</th>
                <th className="pb-2 font-semibold">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-700">
              {auditLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-4 text-center text-slate-400">
                    No changes logged yet in this session.
                  </td>
                </tr>
              ) : (
                auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80">
                    <td className="py-2.5 font-mono text-slate-500">{log.timestamp}</td>
                    <td className="py-2.5 font-semibold text-slate-800">{log.user}</td>
                    <td className="py-2.5">{log.module}</td>
                    <td className="py-2.5 font-medium">{log.fieldChanged}</td>
                    <td className="py-2.5 text-rose-700 line-through max-w-xs truncate">{log.previousValue}</td>
                    <td className="py-2.5 text-emerald-700 font-semibold max-w-xs truncate">{log.newValue}</td>
                    <td className="py-2.5 text-slate-500">{log.remarks}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </form>
  );
};
