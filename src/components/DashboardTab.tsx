import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  AlertCircle,
  Clock,
  Users,
  GraduationCap,
  Briefcase,
  FileCheck,
  TrendingUp,
  Building,
  ChevronRight,
  Filter,
  Info,
  Layers,
  Printer,
  FileText,
  Building2,
} from 'lucide-react';
import {
  InstitutionMaster,
  NbaCriterionScore,
  YearBatchData,
  MasterFaculty,
  EvidenceDocument,
} from '../types/nba';
import { calculateSFR, calculateFacultyQualificationPoints } from '../utils/calculations';

interface DashboardTabProps {
  institution: InstitutionMaster;
  criteriaScores: NbaCriterionScore[];
  batchCAY: YearBatchData;
  facultyList: MasterFaculty[];
  evidenceList: EvidenceDocument[];
  unresolvedIssuesCount: number;
  onSelectCriterion: (criterionNumber: number) => void;
  onOpenTemplates: () => void;
  onOpenSarReport?: () => void;
  onOpenDeptProfile?: () => void;
  onOpenFacultyProfile?: () => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  institution,
  criteriaScores,
  batchCAY,
  facultyList,
  evidenceList,
  unresolvedIssuesCount,
  onSelectCriterion,
  onOpenTemplates,
  onOpenSarReport,
  onOpenDeptProfile,
  onOpenFacultyProfile,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'green' | 'yellow' | 'red'>('all');

  const totalScore = criteriaScores.reduce((acc, c) => acc + c.awardedEstimate, 0);
  const overallPercentage = Math.round((totalScore / 1000) * 100);

  const sfrData = calculateSFR(batchCAY.totalStudentStrength, facultyList.length);
  const phdCount = facultyList.filter((f) => f.qualification === 'Ph.D.').length;
  const fqData = calculateFacultyQualificationPoints(
    phdCount,
    facultyList.length - phdCount,
    facultyList.length
  );

  const verifiedEvidence = evidenceList.filter((e) => e.status === 'Verified').length;
  const missingEvidence = evidenceList.filter((e) => e.status === 'Missing').length;
  const totalEvidence = evidenceList.length;

  const filteredCriteria = criteriaScores.filter((c) => {
    if (filterStatus === 'all') return true;
    return c.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner for New College */}
      {institution.isNewCollege && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="p-2 bg-blue-600 text-white rounded-xl shadow-xs flex-shrink-0 mt-0.5">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-blue-950">
                New College / Program Accreditation Provision Active
              </h3>
              <p className="text-xs sm:text-sm text-blue-800/90 mt-0.5 max-w-3xl leading-relaxed">
                As a program established in {institution.yearOfEstablishment} with its first graduating batch in {institution.firstGraduatingBatchYear}, historical student performance indicators for previous cycles are marked with <strong className="font-semibold text-blue-950">"First Graduation Pending"</strong> and <strong className="font-semibold text-blue-950">"New Program"</strong> status tags to satisfy NBA Visiting Peer Team evaluation guidelines without penalization.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenTemplates}
            className="px-3.5 py-2 bg-white hover:bg-blue-50 text-blue-800 border border-blue-300 font-semibold text-xs rounded-xl shadow-2xs whitespace-nowrap transition-colors"
          >
            Browse 48 Data Templates
          </button>
        </div>
      )}

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Readiness Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              NBA Total Score
            </span>
            <span
              className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                overallPercentage >= 75
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {overallPercentage >= 75 ? 'Accreditation Ready' : 'In Progress'}
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{totalScore}</span>
            <span className="text-sm font-medium text-slate-400">/ 1000 Marks</span>
          </div>
          {/* Progress bar */}
          <div className="mt-3">
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${overallPercentage}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-500 mt-1.5 font-medium">
              <span>Threshold for 3 Years: 600</span>
              <span>Threshold for 6 Years: 750</span>
            </div>
          </div>
        </div>

        {/* Student Faculty Ratio (SFR) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Student-Faculty Ratio (SFR)
            </span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{sfrData.sfrFormatted}</span>
            <span className="text-xs font-medium text-slate-500">
              ({batchCAY.totalStudentStrength} Students / {facultyList.length} Faculty)
            </span>
          </div>
          <div className="mt-2 text-xs">
            <span
              className={`inline-block font-semibold px-2 py-0.5 rounded-md ${
                sfrData.isCompliant
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              {sfrData.statusText}
            </span>
          </div>
        </div>

        {/* Placement & Progression */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              First Batch Placement Index
            </span>
            <Briefcase className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {Math.round(
                ((batchCAY.placedStudents + batchCAY.higherStudiesStudents + batchCAY.entrepreneurshipStudents) /
                  (batchCAY.eligibleGraduates || 1)) *
                  100
              )}
              %
            </span>
            <span className="text-xs font-medium text-slate-500">
              ({batchCAY.placedStudents + batchCAY.higherStudiesStudents + batchCAY.entrepreneurshipStudents} of {batchCAY.eligibleGraduates} Students)
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-600 flex items-center justify-between">
            <span>Placed: <strong className="text-slate-900">{batchCAY.placedStudents}</strong></span>
            <span>Higher Ed: <strong className="text-slate-900">{batchCAY.higherStudiesStudents}</strong></span>
            <span>Median: <strong className="text-slate-900">{batchCAY.medianSalaryLPA} LPA</strong></span>
          </div>
        </div>

        {/* Evidence & Document Completion */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Evidence Readiness
            </span>
            <FileCheck className="w-4 h-4 text-teal-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {Math.round((verifiedEvidence / (totalEvidence || 1)) * 100)}%
            </span>
            <span className="text-xs font-medium text-slate-500">
              ({verifiedEvidence} of {totalEvidence} Verified)
            </span>
          </div>
          <div className="mt-2 text-xs flex items-center justify-between">
            <span className="text-emerald-700 font-medium">✓ Verified: {verifiedEvidence}</span>
            {missingEvidence > 0 ? (
              <span className="text-rose-700 font-semibold bg-rose-50 px-1.5 py-0.5 rounded">
                Missing: {missingEvidence}
              </span>
            ) : (
              <span className="text-slate-500">0 Missing</span>
            )}
          </div>
        </div>
      </div>

      {/* Accreditation Dossiers & PDF Export Hub */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-4.5 sm:p-5 shadow-sm border border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-blue-500/30 border border-blue-400/40 text-blue-300 rounded text-[10px] font-bold uppercase tracking-wider">
              Accreditation Submission Dossiers
            </span>
            <span className="text-xs text-slate-400">PDF & Physical Visit Ready</span>
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white mt-1">
            Export Officially Formatted Profile Sheets & Evaluator Reports
          </h3>
          <p className="text-xs text-slate-300 mt-0.5 max-w-2xl">
            Pre-formatted according to NBA Tier-II guidelines with institutional letterheads, statutory notes, calculation formulas, and signature blocks.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap self-stretch sm:self-auto">
          {onOpenDeptProfile && (
            <button
              onClick={onOpenDeptProfile}
              className="flex-1 sm:flex-initial px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              title="Export complete Department Profile Dossier (PDF)"
            >
              <Building2 className="w-3.5 h-3.5 text-blue-200" />
              <span>Dept Profile (PDF)</span>
            </button>
          )}

          {onOpenFacultyProfile && (
            <button
              onClick={onOpenFacultyProfile}
              className="flex-1 sm:flex-initial px-3.5 py-2 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-600"
              title="Export individual Faculty Profile Dossiers (PDF)"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-300" />
              <span>Faculty Dossiers (PDF)</span>
            </button>
          )}

          {onOpenSarReport && (
            <button
              onClick={onOpenSarReport}
              className="flex-1 sm:flex-initial px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              title="Export complete 10-Criterion Self Assessment Report (SAR)"
            >
              <Printer className="w-3.5 h-3.5 text-indigo-200" />
              <span>Full SAR Report</span>
            </button>
          )}
        </div>
      </div>

      {/* Criteria 1 to 10 Breakdown Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              NBA Criteria 1 to 10 Readiness Matrix (1000 Marks)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Tier-II Undergraduate Engineering evaluation criteria. Click any criterion to open detailed data sheets.
            </p>
          </div>

          {/* Traffic Light Filter */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterStatus === 'all'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All (10)
            </button>
            <button
              onClick={() => setFilterStatus('green')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors flex items-center gap-1 ${
                filterStatus === 'green'
                  ? 'bg-emerald-100 text-emerald-800 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              Complete
            </button>
            <button
              onClick={() => setFilterStatus('yellow')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors flex items-center gap-1 ${
                filterStatus === 'yellow'
                  ? 'bg-amber-100 text-amber-800 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-amber-700'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
              Partial
            </button>
            <button
              onClick={() => setFilterStatus('red')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors flex items-center gap-1 ${
                filterStatus === 'red'
                  ? 'bg-rose-100 text-rose-800 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-rose-700'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
              Action Required
            </button>
          </div>
        </div>

        {/* Criteria Table */}
        <div className="divide-y divide-slate-100 overflow-x-auto">
          {filteredCriteria.map((c) => (
            <div
              key={c.criterionNumber}
              onClick={() => onSelectCriterion(c.criterionNumber)}
              className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                <span
                  className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5 ${
                    c.status === 'green'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : c.status === 'yellow'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}
                >
                  C{c.criterionNumber}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-slate-900 truncate">
                      Criterion {c.criterionNumber}: {c.name}
                    </h3>
                    <span className="text-[11px] font-semibold text-slate-400">
                      (Max: {c.maxMarks} Marks)
                    </span>
                  </div>

                  {c.newCollegeNote && (
                    <p className="text-xs text-indigo-700 font-medium mt-0.5">
                      New Program Note: {c.newCollegeNote}
                    </p>
                  )}

                  {c.keyGaps.length > 0 && (
                    <div className="mt-1 text-xs text-slate-500 flex items-center gap-1.5 flex-wrap">
                      <span className="font-semibold text-slate-600">Key Focus:</span>
                      <span>{c.keyGaps.join(' • ')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress & Score */}
              <div className="flex items-center gap-6 justify-between lg:justify-end flex-shrink-0">
                <div className="text-right">
                  <div className="text-sm font-extrabold text-slate-900">
                    {c.awardedEstimate} / {c.maxMarks}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    {c.completionPercent}% Attained
                  </div>
                </div>

                <div className="w-24 sm:w-32 bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full ${
                      c.status === 'green'
                        ? 'bg-emerald-500'
                        : c.status === 'yellow'
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${c.completionPercent}%` }}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 ${
                      c.status === 'green'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : c.status === 'yellow'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        c.status === 'green'
                          ? 'bg-emerald-500'
                          : c.status === 'yellow'
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                    />
                    {c.status === 'green'
                      ? 'Compliant'
                      : c.status === 'yellow'
                      ? 'In Review'
                      : 'Action Req'}
                  </span>

                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
