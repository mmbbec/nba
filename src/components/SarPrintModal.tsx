import React from 'react';
import {
  Printer,
  X,
  Award,
  Building,
  FileCheck,
  Download,
} from 'lucide-react';
import {
  InstitutionMaster,
  NbaCriterionScore,
  YearBatchData,
  MasterFaculty,
} from '../types/nba';
import { calculateSFR, calculateCadreRatio, calculateFacultyQualificationPoints } from '../utils/calculations';
import { NbaSignatureSealBlock } from './NbaSignatureSealBlock';

interface SarPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  institution: InstitutionMaster;
  criteriaScores: NbaCriterionScore[];
  batchCAY: YearBatchData;
  facultyList: MasterFaculty[];
}

export const SarPrintModal: React.FC<SarPrintModalProps> = ({
  isOpen,
  onClose,
  institution,
  criteriaScores,
  batchCAY,
  facultyList,
}) => {
  if (!isOpen) return null;

  const totalScore = criteriaScores.reduce((acc, c) => acc + c.awardedEstimate, 0);
  const sfrData = calculateSFR(batchCAY.totalStudentStrength, facultyList.length);

  const profCount = facultyList.filter((f) => f.designation === 'Professor').length;
  const assocCount = facultyList.filter((f) => f.designation === 'Associate Professor').length;
  const asstCount = facultyList.filter((f) => f.designation === 'Assistant Professor').length;
  const cadreData = calculateCadreRatio(profCount, assocCount, asstCount, facultyList.length);

  const phdCount = facultyList.filter((f) => f.qualification === 'Ph.D.').length;
  const fqData = calculateFacultyQualificationPoints(phdCount, facultyList.length - phdCount, facultyList.length);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:static print:p-0 print:m-0 print:overflow-visible">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden print:max-h-none print:h-auto print:border-none print:shadow-none print:overflow-visible print:rounded-none">
        {/* Modal Controls Bar (Hidden in print) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-bold">
              NBA Self-Assessment Report (SAR) Executive Document Preview
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-6 text-slate-800 text-xs font-serif leading-relaxed">
          {/* Institutional Letterhead */}
          <div className="text-center border-b-2 border-slate-900 pb-5 space-y-1">
            <div className="text-xs uppercase tracking-widest text-slate-500 font-sans font-bold">
              NATIONAL BOARD OF ACCREDITATION (NBA) • TIER-II SAR SUBMISSION
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-sans text-slate-900 uppercase tracking-tight">
              {institution.collegeName}
            </h1>
            <p className="text-xs text-slate-600 font-sans">
              (Affiliated to {institution.affiliatingUniversity} • Approved by AICTE, New Delhi)
            </p>
            <p className="text-xs font-semibold text-slate-700 font-sans mt-1">
              Department of {institution.department} | {institution.programName}
            </p>
            <div className="inline-block mt-2 px-3 py-0.5 bg-slate-100 rounded-full font-sans font-bold text-[11px] text-slate-700 border border-slate-300">
              Academic Assessment Year: {institution.academicYearCAY} • {institution.nbaCycle}
            </div>
          </div>

          {/* New College Statutory Note */}
          {institution.isNewCollege && (
            <div className="p-3 bg-slate-50 border border-slate-300 rounded font-sans text-[11px] space-y-1">
              <strong className="text-slate-900 block uppercase">
                Statutory Declaration for New Institutions & First Graduating Batch:
              </strong>
              <p className="text-slate-700">
                This program was established in academic year {institution.yearOfEstablishment} with its initial graduating cohort completing degree requirements in {institution.firstGraduatingBatchYear}. Pursuant to Section 3.2 of the NBA Manual for Tier-II Undergraduate Engineering Institutions, historical placement and academic performance calculations reflect the available operational cycle, with previous batches designated as <em>"First Graduation Pending / New Program"</em>.
              </p>
            </div>
          )}

          {/* Table of Criteria-wise Marks Breakdown */}
          <div className="space-y-2">
            <h3 className="font-sans font-bold text-sm text-slate-900 uppercase tracking-wide border-b border-slate-300 pb-1">
              Part B: Summary of Criteria-Wise Scores (Tier-II UG Engineering - 1000 Marks)
            </h3>
            <table className="w-full text-left border-collapse border border-slate-300 text-[11px] font-sans">
              <thead>
                <tr className="bg-slate-100 text-slate-900 border-b border-slate-300 font-bold">
                  <th className="border border-slate-300 p-2">Criterion</th>
                  <th className="border border-slate-300 p-2">Criterion Title</th>
                  <th className="border border-slate-300 p-2 text-center">Max Marks</th>
                  <th className="border border-slate-300 p-2 text-center">Institutional Claim</th>
                  <th className="border border-slate-300 p-2 text-center">Readiness Status</th>
                </tr>
              </thead>
              <tbody>
                {criteriaScores.map((c) => (
                  <tr key={c.criterionNumber} className="border-b border-slate-200">
                    <td className="border border-slate-300 p-2 font-bold text-center">
                      C{c.criterionNumber}
                    </td>
                    <td className="border border-slate-300 p-2 font-medium">{c.name}</td>
                    <td className="border border-slate-300 p-2 text-center font-bold">
                      {c.maxMarks}
                    </td>
                    <td className="border border-slate-300 p-2 text-center font-bold text-slate-900">
                      {c.awardedEstimate}
                    </td>
                    <td className="border border-slate-300 p-2 text-center">
                      <span className="font-semibold text-slate-800">
                        {c.status === 'green' ? 'Compliant' : c.status === 'yellow' ? 'In Review' : 'Action Req.'}
                      </span>
                    </td>
                  </tr>
                ))}
                <tr className="bg-slate-100 font-bold border-t-2 border-slate-900">
                  <td colSpan={2} className="border border-slate-300 p-2 text-right uppercase">
                    Total Claimed Marks:
                  </td>
                  <td className="border border-slate-300 p-2 text-center">1000</td>
                  <td className="border border-slate-300 p-2 text-center text-sm font-extrabold text-blue-900">
                    {totalScore}
                  </td>
                  <td className="border border-slate-300 p-2 text-center">
                    {Math.round((totalScore / 1000) * 100)}% Readiness
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Key Compliance Metrics Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans text-xs">
            <div className="p-3 border border-slate-300 rounded space-y-1">
              <div className="font-bold text-slate-700 uppercase text-[10px]">Criterion 5: SFR</div>
              <div className="text-lg font-bold text-slate-900">{sfrData.sfrFormatted}</div>
              <div className="text-[11px] text-slate-600">{sfrData.statusText}</div>
            </div>

            <div className="p-3 border border-slate-300 rounded space-y-1">
              <div className="font-bold text-slate-700 uppercase text-[10px]">Criterion 5: Cadre Ratio</div>
              <div className="text-lg font-bold text-slate-900">
                {profCount} : {assocCount} : {asstCount}
              </div>
              <div className="text-[11px] text-slate-600">Points: {cadreData.cadreMarks} / 20</div>
            </div>

            <div className="p-3 border border-slate-300 rounded space-y-1">
              <div className="font-bold text-slate-700 uppercase text-[10px]">Criterion 5: Faculty Qual.</div>
              <div className="text-lg font-bold text-slate-900">{fqData.fqPoints} / 20</div>
              <div className="text-[11px] text-slate-600">{phdCount} Ph.D. Faculty ({Math.round((phdCount / facultyList.length) * 100)}%)</div>
            </div>
          </div>

          {/* Signatures, Official Seal & Certification Block with Generated Document Hash */}
          <NbaSignatureSealBlock
            documentType="NBA Self-Assessment Report (SAR) Executive Summary"
            institution={institution}
            entityId={`SAR-${institution.collegeCode}-${institution.academicYearCAY}`}
            declarationText={`Certified that this Self-Assessment Report (SAR) Executive Summary for the Department of ${institution.department} (${institution.programName}) has been formulated in compliance with NBA Tier-II norms. All criteria marks breakdown, Student-to-Faculty Ratio (SFR: ${sfrData.sfrFormatted}), and faculty qualification distributions have been scrutinized and validated against institutional registers.`}
            sealLabel="INSTITUTIONAL NBA ACCREDITATION SEAL"
            signatories={[
              {
                role: 'NBA Program Coordinator',
                name: institution.nbaCoordinator,
                title: 'NBA Program Coordinator',
                subtitle: 'Accreditation Steering Committee',
              },
              {
                role: 'Head of Department',
                name: institution.hodName,
                title: 'Head of Department (HOD)',
                subtitle: `Dept of ${institution.department}`,
              },
              {
                role: 'Principal / Director',
                name: institution.principalDirector,
                title: 'Principal / Director',
                subtitle: institution.collegeName,
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};
