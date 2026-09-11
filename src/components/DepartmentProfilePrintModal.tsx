import React from 'react';
import {
  Printer,
  X,
  Building2,
  Award,
  Users,
  GraduationCap,
  BookOpen,
  Layers,
  Cpu,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import {
  InstitutionMaster,
  YearBatchData,
  MasterFaculty,
  CourseInfo,
  NbaCriterionScore,
  AttainmentConfig,
} from '../types/nba';
import { calculateSFR, calculateCadreRatio, calculateFacultyQualificationPoints } from '../utils/calculations';
import { NbaSignatureSealBlock } from './NbaSignatureSealBlock';

interface DepartmentProfilePrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  institution: InstitutionMaster;
  batchCAY: YearBatchData;
  yearBatchData?: Record<string, YearBatchData>;
  facultyList: MasterFaculty[];
  courses?: CourseInfo[];
  criteriaScores: NbaCriterionScore[];
  attainmentConfig?: AttainmentConfig;
}

export const DepartmentProfilePrintModal: React.FC<DepartmentProfilePrintModalProps> = ({
  isOpen,
  onClose,
  institution,
  batchCAY,
  yearBatchData,
  facultyList,
  courses = [],
  criteriaScores,
  attainmentConfig,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  // Criterion 5 Calculations
  const sfrData = calculateSFR(batchCAY.totalStudentStrength, facultyList.length);
  const profCount = facultyList.filter((f) => f.designation === 'Professor').length;
  const assocCount = facultyList.filter((f) => f.designation === 'Associate Professor').length;
  const asstCount = facultyList.filter((f) => f.designation === 'Assistant Professor').length;
  const cadreData = calculateCadreRatio(profCount, assocCount, asstCount, facultyList.length);
  const phdCount = facultyList.filter((f) => f.qualification === 'Ph.D.').length;
  const fqData = calculateFacultyQualificationPoints(phdCount, facultyList.length - phdCount, facultyList.length);

  const totalPublications = facultyList.reduce((acc, f) => acc + f.researchPublicationsCount, 0);
  const totalGrants = facultyList.reduce((acc, f) => acc + f.sponsoredProjectsAmountLakhs, 0);
  const totalConsultancy = facultyList.reduce((acc, f) => acc + f.consultancyAmountLakhs, 0);

  // Criterion 4 Calculations
  const totalStudents = batchCAY.totalStudentStrength;
  const placed = batchCAY.placedCount;
  const higherStudies = batchCAY.higherStudiesCount;
  const entrepreneur = batchCAY.entrepreneurshipCount;
  const placementPercent = batchCAY.placementPercentage;

  const totalScoreClaimed = criteriaScores.reduce((acc, c) => acc + c.awardedEstimate, 0);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto printable-modal-overlay">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden printable-sheet">
        {/* Modal Controls Bar (Hidden in print) */}
        <div className="p-3.5 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-indigo-600/30 rounded-lg text-indigo-400 border border-indigo-500/30">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-bold">
                NBA Tier-II • Department Profile Sheet & Program Dossier
              </h2>
              <p className="text-[11px] text-slate-400">
                Official institutional summary ready for evaluators, physical dossiers, or digital PDF submission
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-6 text-slate-900 text-xs leading-relaxed font-sans bg-white">
          {/* Institutional Letterhead */}
          <div className="border-b-2 border-slate-900 pb-4 text-center space-y-1">
            <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
              NATIONAL BOARD OF ACCREDITATION (NBA) • TIER-II UNDERGRADUATE ENGINEERING
            </div>
            <h1 className="text-lg sm:text-2xl font-extrabold text-slate-900 uppercase tracking-tight font-serif">
              {institution.collegeName}
            </h1>
            <p className="text-[11px] text-slate-600 font-medium">
              (Approved by AICTE, New Delhi • Affiliated to {institution.affiliatingUniversity} • College Code: {institution.collegeCode})
            </p>
            <div className="text-xs sm:text-sm font-bold text-slate-800 uppercase mt-1">
              DEPARTMENT OF {institution.department.toUpperCase()}
            </div>
            <div className="text-xs font-semibold text-blue-900">
              Bachelor of Technology (B.Tech) in {institution.programName}
            </div>
            <div className="inline-block mt-2 px-3 py-0.5 bg-slate-100 rounded-full font-bold text-[10px] text-slate-700 border border-slate-300">
              DEPARTMENT PROFILE & ACCREDITATION DOSSIER • CYCLE: {institution.nbaCycle} • CAY: {institution.academicYearCAY}
            </div>
          </div>

          {/* New College Statutory Note */}
          {institution.isNewCollege && (
            <div className="p-3 bg-slate-50 border border-slate-300 rounded text-[11px] space-y-1 page-break-inside-avoid">
              <strong className="text-slate-900 uppercase block font-sans">
                Statutory Status: New Institution / First Graduating Cohort
              </strong>
              <p className="text-slate-700">
                The Department was established in Year {institution.yearOfEstablishment}. The initial graduating cohort completes degree requirements in {institution.firstGraduatingBatchYear}. Pursuant to Section 3.2 of the NBA Manual for Tier-II Undergraduate Engineering Institutions, historical placement and academic performance calculations reflect the available operational cycle, with previous batches designated as <em>"First Graduation Pending / New Program"</em>.
              </p>
            </div>
          )}

          {/* Part 1: Program General Information */}
          <div className="space-y-1.5 page-break-inside-avoid">
            <h3 className="font-bold text-xs uppercase tracking-wide text-slate-900 border-b border-slate-300 pb-0.5 flex items-center justify-between">
              <span>Part I: General Program Particulars</span>
              <span className="text-[10px] font-normal text-slate-500 lowercase">(nba pre-qualifier master)</span>
            </h3>
            <table className="w-full border-collapse border border-slate-300 text-xs">
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="w-1/4 p-2 font-bold bg-slate-50 border-r border-slate-200 text-slate-700">
                    Department Name
                  </td>
                  <td className="w-1/4 p-2 font-bold text-slate-900 border-r border-slate-200">
                    {institution.department}
                  </td>
                  <td className="w-1/4 p-2 font-bold bg-slate-50 border-r border-slate-200 text-slate-700">
                    Year of Establishment
                  </td>
                  <td className="w-1/4 p-2 font-mono font-bold text-slate-900">
                    {institution.yearOfEstablishment}
                  </td>
                </tr>

                <tr className="border-b border-slate-200">
                  <td className="p-2 font-bold bg-slate-50 border-r border-slate-200 text-slate-700">
                    Undergraduate Program
                  </td>
                  <td className="p-2 font-semibold text-slate-900 border-r border-slate-200">
                    {institution.programName}
                  </td>
                  <td className="p-2 font-bold bg-slate-50 border-r border-slate-200 text-slate-700">
                    Approved Annual Intake
                  </td>
                  <td className="p-2 font-bold text-slate-900">
                    {institution.approvedIntake} Students / Year
                  </td>
                </tr>

                <tr className="border-b border-slate-200">
                  <td className="p-2 font-bold bg-slate-50 border-r border-slate-200 text-slate-700">
                    Accreditation Tier
                  </td>
                  <td className="p-2 font-semibold text-slate-900 border-r border-slate-200">
                    {institution.accreditationTier} (Affiliated UG College)
                  </td>
                  <td className="p-2 font-bold bg-slate-50 border-r border-slate-200 text-slate-700">
                    First Graduating Batch
                  </td>
                  <td className="p-2 font-bold text-slate-900">
                    {institution.firstGraduatingBatchYear}
                  </td>
                </tr>

                <tr>
                  <td className="p-2 font-bold bg-slate-50 border-r border-slate-200 text-slate-700">
                    Head of Department (HOD)
                  </td>
                  <td className="p-2 font-semibold text-slate-900 border-r border-slate-200">
                    {institution.hodName}
                  </td>
                  <td className="p-2 font-bold bg-slate-50 border-r border-slate-200 text-slate-700">
                    NBA Program Coordinator
                  </td>
                  <td className="p-2 font-semibold text-slate-900">
                    {institution.nbaCoordinator}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Part 2: Department Vision, Mission & PEOs (Criterion 1) */}
          <div className="space-y-2 page-break-inside-avoid">
            <h3 className="font-bold text-xs uppercase tracking-wide text-slate-900 border-b border-slate-300 pb-0.5">
              Part II: Vision, Mission & Program Educational Objectives (Criterion 1)
            </h3>
            <div className="space-y-2 text-[11px]">
              <div className="p-2.5 bg-slate-50 border border-slate-300 rounded">
                <strong className="text-slate-900 uppercase block text-[10px] tracking-wider">Vision of the Department:</strong>
                <p className="text-slate-700 mt-0.5">
                  "To produce internationally competent, ethically grounded Computer Science and Engineering graduates equipped for transformative innovation, societal leadership, and lifelong scholarly inquiry."
                </p>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-300 rounded">
                <strong className="text-slate-900 uppercase block text-[10px] tracking-wider">Mission of the Department:</strong>
                <ul className="list-disc pl-4 text-slate-700 space-y-0.5 mt-0.5">
                  <li><strong>M1:</strong> Deliver robust core and cutting-edge curriculum through experiential pedagogy and state-of-the-art computational infrastructure.</li>
                  <li><strong>M2:</strong> Foster an enduring culture of interdisciplinary research, industrial problem-solving, and sustainable technological innovation.</li>
                  <li><strong>M3:</strong> Instill professional ethics, empathetic leadership, teamwork, and societal responsibility among aspiring engineers.</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="p-2.5 border border-slate-300 rounded bg-slate-50/50">
                  <strong className="text-slate-900 uppercase block text-[10px] tracking-wider">Program Educational Objectives (PEOs):</strong>
                  <ul className="list-disc pl-4 text-slate-700 space-y-0.5 mt-0.5">
                    <li><strong>PEO1:</strong> Successful professional careers in computing and IT industries.</li>
                    <li><strong>PEO2:</strong> Higher education and cutting-edge research pursuit.</li>
                    <li><strong>PEO3:</strong> Entrepreneurial venture building and innovation.</li>
                    <li><strong>PEO4:</strong> Ethical leadership with commitment to environmental sustainability.</li>
                  </ul>
                </div>

                <div className="p-2.5 border border-slate-300 rounded bg-slate-50/50">
                  <strong className="text-slate-900 uppercase block text-[10px] tracking-wider">Program Specific Outcomes (PSOs):</strong>
                  <ul className="list-disc pl-4 text-slate-700 space-y-0.5 mt-0.5">
                    <li><strong>PSO1:</strong> Design, develop and optimize scalable algorithmic and cloud architectures for real-world enterprise applications.</li>
                    <li><strong>PSO2:</strong> Deploy intelligent artificial intelligence and secure distributed systems addressing contemporary industrial challenges.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Part 3: Faculty Resource & Criterion 5 Compliance */}
          <div className="space-y-1.5 page-break-inside-avoid">
            <h3 className="font-bold text-xs uppercase tracking-wide text-slate-900 border-b border-slate-300 pb-0.5 flex items-center justify-between">
              <span>Part III: Faculty Resources & Criterion 5 Metrics</span>
              <span className="text-[10px] font-bold text-emerald-800">Max Marks: 200</span>
            </h3>

            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                <div className="text-[10px] text-slate-500 font-semibold uppercase">Total Faculty Strength</div>
                <div className="text-base font-extrabold text-slate-900 mt-0.5">
                  {facultyList.length} <span className="text-[11px] font-normal text-slate-500">Regular</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">100% on Approved Rolls</div>
              </div>

              <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                <div className="text-[10px] text-slate-500 font-semibold uppercase">Student-Faculty Ratio (SFR)</div>
                <div className="text-base font-extrabold text-slate-900 mt-0.5">
                  {sfrData.sfrFormatted}
                </div>
                <div className="text-[10px] text-emerald-700 font-bold mt-0.5">{sfrData.marksAwarded} / 20 Marks</div>
              </div>

              <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                <div className="text-[10px] text-slate-500 font-semibold uppercase">Cadre Ratio (P : ASP : AP)</div>
                <div className="text-base font-extrabold text-slate-900 mt-0.5">
                  {profCount} : {assocCount} : {asstCount}
                </div>
                <div className="text-[10px] text-indigo-700 font-bold mt-0.5">{cadreData.cadreMarks} / 20 Marks</div>
              </div>

              <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                <div className="text-[10px] text-slate-500 font-semibold uppercase">Doctorate Faculty (Ph.D.)</div>
                <div className="text-base font-extrabold text-slate-900 mt-0.5">
                  {phdCount} / {facultyList.length}
                </div>
                <div className="text-[10px] text-slate-600 mt-0.5">{Math.round((phdCount / facultyList.length) * 100)}% Ph.D. Holders</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs pt-1">
              <div className="p-2 border border-slate-300 rounded bg-slate-50/60">
                <span className="font-bold text-slate-800 text-[11px] block">Research Publications:</span>
                <span className="text-sm font-extrabold text-blue-900">{totalPublications}</span> Papers in Scopus/WoS
              </div>
              <div className="p-2 border border-slate-300 rounded bg-slate-50/60">
                <span className="font-bold text-slate-800 text-[11px] block">R&D Sponsored Grants:</span>
                <span className="text-sm font-extrabold text-emerald-800">₹ {totalGrants.toFixed(2)} Lakhs</span> Sanctioned
              </div>
              <div className="p-2 border border-slate-300 rounded bg-slate-50/60">
                <span className="font-bold text-slate-800 text-[11px] block">Industry Consultancy:</span>
                <span className="text-sm font-extrabold text-indigo-900">₹ {totalConsultancy.toFixed(2)} Lakhs</span> Generated
              </div>
            </div>
          </div>

          {/* Part 4: Student Demographics & Placement Performance (Criterion 4) */}
          <div className="space-y-1.5 page-break-inside-avoid">
            <h3 className="font-bold text-xs uppercase tracking-wide text-slate-900 border-b border-slate-300 pb-0.5 flex items-center justify-between">
              <span>Part IV: Student Cohorts & Career Progression (Criterion 4)</span>
              <span className="text-[10px] font-bold text-emerald-800">Max Marks: 150</span>
            </h3>

            <table className="w-full border-collapse border border-slate-300 text-xs text-left">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                  <th className="p-2 border-r border-slate-300">Cohort / Batch</th>
                  <th className="p-2 border-r border-slate-300 text-center">Approved Intake</th>
                  <th className="p-2 border-r border-slate-300 text-center">Total Enrolled</th>
                  <th className="p-2 border-r border-slate-300 text-center">Placed (X)</th>
                  <th className="p-2 border-r border-slate-300 text-center">Higher Studies (Y)</th>
                  <th className="p-2 border-r border-slate-300 text-center">Entrepreneur (Z)</th>
                  <th className="p-2 text-center">Placement Index</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-2 border-r border-slate-200 font-bold text-slate-900">
                    CAY ({institution.academicYearCAY})
                  </td>
                  <td className="p-2 border-r border-slate-200 text-center">{institution.approvedIntake}</td>
                  <td className="p-2 border-r border-slate-200 text-center font-bold">{batchCAY.intakeWithLateral}</td>
                  <td className="p-2 border-r border-slate-200 text-center font-semibold text-blue-900">{placed}</td>
                  <td className="p-2 border-r border-slate-200 text-center">{higherStudies}</td>
                  <td className="p-2 border-r border-slate-200 text-center">{entrepreneur}</td>
                  <td className="p-2 text-center font-bold text-emerald-800">{placementPercent.toFixed(1)}%</td>
                </tr>
                {yearBatchData && yearBatchData['CAYm1'] && (
                  <tr>
                    <td className="p-2 border-r border-slate-200 font-bold text-slate-900">
                      CAYm1 ({institution.academicYearCAYm1})
                    </td>
                    <td className="p-2 border-r border-slate-200 text-center">{institution.approvedIntake}</td>
                    <td className="p-2 border-r border-slate-200 text-center font-bold">{yearBatchData['CAYm1'].intakeWithLateral}</td>
                    <td className="p-2 border-r border-slate-200 text-center font-semibold text-blue-900">{yearBatchData['CAYm1'].placedCount}</td>
                    <td className="p-2 border-r border-slate-200 text-center">{yearBatchData['CAYm1'].higherStudiesCount}</td>
                    <td className="p-2 border-r border-slate-200 text-center">{yearBatchData['CAYm1'].entrepreneurshipCount}</td>
                    <td className="p-2 text-center font-bold text-emerald-800">{yearBatchData['CAYm1'].placementPercentage.toFixed(1)}%</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Part 5: Laboratory & Computing Infrastructure (Criterion 6) */}
          <div className="space-y-1.5 page-break-inside-avoid">
            <h3 className="font-bold text-xs uppercase tracking-wide text-slate-900 border-b border-slate-300 pb-0.5 flex items-center justify-between">
              <span>Part V: Computing Facilities & Laboratories (Criterion 6)</span>
              <span className="text-[10px] font-bold text-emerald-800">Max Marks: 80</span>
            </h3>

            <table className="w-full border-collapse border border-slate-300 text-xs text-left">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                  <th className="p-2 border-r border-slate-300">Name of Laboratory</th>
                  <th className="p-2 border-r border-slate-300">Major Hardware & Servers</th>
                  <th className="p-2 border-r border-slate-300">Licensed / Open Source Software</th>
                  <th className="p-2 border-r border-slate-300 text-center">Batch Capacity</th>
                  <th className="p-2 text-center">Student:PC Ratio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-2 border-r border-slate-200 font-bold text-slate-900">
                    Advanced Computing & AI Lab
                  </td>
                  <td className="p-2 border-r border-slate-200">
                    35 Intel Core i7 13th Gen, 32GB RAM, NVIDIA RTX 4060 GPU
                  </td>
                  <td className="p-2 border-r border-slate-200">
                    Ubuntu 24.04 LTS, Python 3.12, PyTorch, TensorFlow, CUDA Toolkit
                  </td>
                  <td className="p-2 border-r border-slate-200 text-center font-bold">35 Students</td>
                  <td className="p-2 text-center font-bold text-emerald-800">1 : 1</td>
                </tr>

                <tr>
                  <td className="p-2 border-r border-slate-200 font-bold text-slate-900">
                    Data Structures & Algorithm Lab
                  </td>
                  <td className="p-2 border-r border-slate-200">
                    35 Intel Core i5 12th Gen, 16GB RAM, 512GB NVMe SSD
                  </td>
                  <td className="p-2 border-r border-slate-200">
                    GCC / G++, JDK 21, VS Code, Git, Valgrind Profiler
                  </td>
                  <td className="p-2 border-r border-slate-200 text-center font-bold">35 Students</td>
                  <td className="p-2 text-center font-bold text-emerald-800">1 : 1</td>
                </tr>

                <tr>
                  <td className="p-2 border-r border-slate-200 font-bold text-slate-900">
                    Database & Cloud Engineering Lab
                  </td>
                  <td className="p-2 border-r border-slate-200">
                    35 Intel Core i5 12th Gen, 16GB RAM + 1 Dell PowerEdge Rack Server
                  </td>
                  <td className="p-2 border-r border-slate-200">
                    Oracle 19c Enterprise, PostgreSQL, MongoDB, Docker, Kubernetes
                  </td>
                  <td className="p-2 border-r border-slate-200 text-center font-bold">35 Students</td>
                  <td className="p-2 text-center font-bold text-emerald-800">1 : 1</td>
                </tr>

                <tr>
                  <td className="p-2 border-r border-slate-200 font-bold text-slate-900">
                    Network Systems & IoT Project Lab
                  </td>
                  <td className="p-2 border-r border-slate-200">
                    Cisco 2900 Routers, 24-Port Managed Switches, Raspberry Pi 4 & ESP32 Kits
                  </td>
                  <td className="p-2 border-r border-slate-200">
                    Wireshark, Cisco Packet Tracer, NS-3 Simulator, Arduino IDE
                  </td>
                  <td className="p-2 border-r border-slate-200 text-center font-bold">35 Students</td>
                  <td className="p-2 text-center font-bold text-emerald-800">1 : 1</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Part 6: OBE Attainment Process & Self-Assessment Summary */}
          <div className="space-y-1.5 page-break-inside-avoid">
            <h3 className="font-bold text-xs uppercase tracking-wide text-slate-900 border-b border-slate-300 pb-0.5 flex items-center justify-between">
              <span>Part VI: Outcome-Based Assessment & Score Summary</span>
              <span className="text-[10px] font-bold text-blue-900">Total Claim: {totalScoreClaimed} / 1000 Marks</span>
            </h3>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 border border-slate-300 rounded bg-slate-50/50 space-y-1">
                <span className="font-bold text-slate-800 block text-[11px]">Assessment Weighting Policy:</span>
                <div className="text-[11px] text-slate-700 space-y-0.5">
                  <div>• Direct Assessment Weight: <strong>80%</strong></div>
                  <div>• Indirect Assessment Weight: <strong>20%</strong></div>
                  <div>• CIE (Internal): <strong>30%</strong> | SEE (Exam): <strong>70%</strong></div>
                  <div>• Student Attainment Threshold: <strong>≥ 60% marks</strong></div>
                </div>
              </div>

              <div className="p-2.5 border border-slate-300 rounded bg-slate-50/50 space-y-1">
                <span className="font-bold text-slate-800 block text-[11px]">Program Outcomes (POs & PSOs):</span>
                <div className="text-[11px] text-slate-700 space-y-0.5">
                  <div>• Total POs Evaluated: <strong>12 Standard POs</strong></div>
                  <div>• Total PSOs Evaluated: <strong>2 Specific PSOs</strong></div>
                  <div>• Evaluation Scale: <strong>0 to 3.0 Level</strong></div>
                  <div>• Target Benchmark Level: <strong>2.50 / 3.00</strong></div>
                </div>
              </div>

              <div className="p-2.5 border border-slate-300 rounded bg-blue-50/40 space-y-1">
                <span className="font-bold text-blue-950 block text-[11px]">Continuous Improvement (CQI):</span>
                <div className="text-[11px] text-blue-900 space-y-0.5">
                  <div>• Closed Loop Protocol: <strong>Observation → Gap → Action → Impact</strong></div>
                  <div>• DQAC Audit Frequency: <strong>Twice per Semester</strong></div>
                  <div>• Course Files Compliance: <strong>15 Mandated Sections</strong></div>
                </div>
              </div>
            </div>
          </div>

          {/* Part 7: Institutional Endorsement, Official Seal, Signatures & Document Hash */}
          <NbaSignatureSealBlock
            documentType="Department Tier-II Profile"
            institution={institution}
            entityId={`DEPT-${institution.collegeCode}-${institution.department}`}
            declarationText="Certified that the Department Profile, infrastructure records, faculty information, student cohorts, and academic attainment figures presented above are verified against official university registers and approved AICTE/NBA records. The Department stands ready for NBA Peer Team On-Site Accreditation Assessment."
            sealLabel="INSTITUTIONAL & DEPARTMENT SEAL"
            signatories={[
              {
                role: 'NBA Program Coordinator',
                name: institution.nbaCoordinator,
                title: 'NBA Program Coordinator',
                subtitle: 'Internal Quality Assurance Cell',
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
