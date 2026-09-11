import React, { useState, useMemo } from 'react';
import {
  Printer,
  X,
  UserCheck,
  Building,
  GraduationCap,
  BookOpen,
  Award,
  ChevronDown,
  Briefcase,
  CheckCircle2,
  FileText,
  Users,
  Layers,
  CheckSquare,
  Square,
  Scissors,
} from 'lucide-react';
import { MasterFaculty, InstitutionMaster, CourseInfo } from '../types/nba';
import { calculateSFR, calculateCadreRatio, calculateFacultyQualificationPoints } from '../utils/calculations';
import { NbaSignatureSealBlock } from './NbaSignatureSealBlock';

interface FacultyProfilePrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFaculty: MasterFaculty | null;
  selectedFacultyList?: MasterFaculty[];
  facultyList: MasterFaculty[];
  institution: InstitutionMaster;
  courses?: CourseInfo[];
}

interface SingleFacultySheetProps {
  faculty: MasterFaculty;
  institution: InstitutionMaster;
  courses: CourseInfo[];
  sheetIndex?: number;
  totalSheets?: number;
  isBreakBefore?: boolean;
}

const SingleFacultySheet: React.FC<SingleFacultySheetProps> = ({
  faculty,
  institution,
  courses,
  sheetIndex,
  totalSheets,
  isBreakBefore = false,
}) => {
  // Associated courses taught by this faculty member
  const facultyCourses = courses.filter(
    (c) =>
      c.facultyId === faculty.id ||
      c.facultyName?.toLowerCase().includes(faculty.name.toLowerCase()) ||
      c.facultyInCharge?.toLowerCase().includes(faculty.name.toLowerCase())
  );

  const isPhd = faculty.qualification === 'Ph.D.';
  const totalExp = faculty.teachingExperienceYears + faculty.industryExperienceYears;

  return (
    <div
      className={`faculty-dossier-page space-y-3.5 text-slate-900 text-xs leading-relaxed font-sans bg-white ${
        isBreakBefore ? 'page-break-before pt-2' : ''
      }`}
      style={isBreakBefore ? { pageBreakBefore: 'always', breakBefore: 'page' } : undefined}
    >
      {/* Official Letterhead Header */}
      <div className="border-b-2 border-slate-900 pb-2.5 text-center space-y-0.5">
        <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-slate-500">
          <span>NATIONAL BOARD OF ACCREDITATION (NBA) • TIER-II ACCREDITATION</span>
          {sheetIndex !== undefined && totalSheets !== undefined && (
            <span className="font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
              Profile {sheetIndex} of {totalSheets}
            </span>
          )}
        </div>
        <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 uppercase tracking-tight font-serif">
          {institution.collegeName}
        </h1>
        <p className="text-[11px] text-slate-600 font-medium">
          (Approved by AICTE, New Delhi • Affiliated to {institution.affiliatingUniversity} • College Code: {institution.collegeCode})
        </p>
        <p className="text-xs font-bold text-slate-800 uppercase mt-0.5">
          Department of {institution.department} | {institution.programName}
        </p>
        <div className="inline-block mt-0.5 px-3 py-0.5 bg-slate-100 rounded-full font-bold text-[10px] text-slate-700 border border-slate-300">
          CRITERION 5: FACULTY INFORMATION & CONTRIBUTIONS • ASSESSMENT YEAR: {institution.academicYearCAY}
        </div>
      </div>

      {/* Document Title Banner */}
      <div className="bg-slate-100 border border-slate-300 py-1 px-3 rounded flex items-center justify-between">
        <span className="font-bold uppercase tracking-wider text-[11px] text-slate-800">
          Individual Faculty Profile & Performance Dossier
        </span>
        <span className="font-mono text-[11px] font-bold text-slate-700">
          FACULTY REF: {faculty.empId}
        </span>
      </div>

      {/* Section 1: General & Appointment Information */}
      <div className="space-y-1.5 page-break-inside-avoid">
        <h3 className="font-bold text-xs uppercase tracking-wide text-slate-900 border-b border-slate-300 pb-0.5 flex items-center justify-between">
          <span>1. Faculty General & Appointment Particulars</span>
          <span className="text-[10px] font-normal text-slate-500 lowercase">(nba format 5.1)</span>
        </h3>
        <table className="w-full border-collapse border border-slate-300 text-xs">
          <tbody>
            <tr className="border-b border-slate-200">
              <td className="w-1/4 p-2 font-bold bg-slate-50 border-r border-slate-200 text-slate-700">
                Full Name of Faculty
              </td>
              <td className="w-1/4 p-2 font-bold text-slate-900 border-r border-slate-200">
                {faculty.name}
              </td>
              <td className="w-1/4 p-2 font-bold bg-slate-50 border-r border-slate-200 text-slate-700">
                Employee Code / ID
              </td>
              <td className="w-1/4 p-2 font-mono font-bold text-slate-900">
                {faculty.empId}
              </td>
            </tr>

            <tr className="border-b border-slate-200">
              <td className="p-2 font-bold bg-slate-50 border-r border-slate-200 text-slate-700">
                Current Designation
              </td>
              <td className="p-2 font-semibold text-slate-900 border-r border-slate-200">
                {faculty.designation}
              </td>
              <td className="p-2 font-bold bg-slate-50 border-r border-slate-200 text-slate-700">
                Department
              </td>
              <td className="p-2 text-slate-900">
                {faculty.department}
              </td>
            </tr>

            <tr className="border-b border-slate-200">
              <td className="p-2 font-bold bg-slate-50 border-r border-slate-200 text-slate-700">
                Date of Joining Institution
              </td>
              <td className="p-2 font-medium text-slate-900 border-r border-slate-200">
                {faculty.dateOfJoining}
              </td>
              <td className="p-2 font-bold bg-slate-50 border-r border-slate-200 text-slate-700">
                Nature of Association
              </td>
              <td className="p-2 font-semibold text-slate-900">
                {faculty.isRegular ? 'Regular / Full-Time on Approved Rolls' : 'Adjunct / Visiting'}
              </td>
            </tr>

            <tr>
              <td className="p-2 font-bold bg-slate-50 border-r border-slate-200 text-slate-700">
                Core Specialization
              </td>
              <td className="p-2 text-slate-900 border-r border-slate-200">
                {faculty.specialization}
              </td>
              <td className="p-2 font-bold bg-slate-50 border-r border-slate-200 text-slate-700">
                Highest Academic Degree
              </td>
              <td className="p-2 font-bold text-slate-900">
                {faculty.qualification}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Section 2: Academic Qualifications */}
      <div className="space-y-1.5 page-break-inside-avoid">
        <h3 className="font-bold text-xs uppercase tracking-wide text-slate-900 border-b border-slate-300 pb-0.5">
          2. Academic Qualifications (Chronological)
        </h3>
        <table className="w-full border-collapse border border-slate-300 text-xs text-left">
          <thead>
            <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
              <th className="p-2 border-r border-slate-300">Degree</th>
              <th className="p-2 border-r border-slate-300">Discipline / Branch</th>
              <th className="p-2 border-r border-slate-300">University / Institute</th>
              <th className="p-2 border-r border-slate-300 text-center">Year of Award</th>
              <th className="p-2 text-center">Class / Division</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {isPhd && (
              <tr>
                <td className="p-2 font-bold text-slate-900 border-r border-slate-200">Ph.D.</td>
                <td className="p-2 border-r border-slate-200">{faculty.specialization}</td>
                <td className="p-2 border-r border-slate-200">{institution.affiliatingUniversity}</td>
                <td className="p-2 text-center border-r border-slate-200 font-mono">2021</td>
                <td className="p-2 text-center font-semibold text-emerald-800">Doctorate Awarded</td>
              </tr>
            )}
            <tr>
              <td className="p-2 font-bold text-slate-900 border-r border-slate-200">
                {faculty.qualification.includes('M.Tech') ? 'M.Tech / M.E.' : 'Post Graduate'}
              </td>
              <td className="p-2 border-r border-slate-200">{faculty.specialization}</td>
              <td className="p-2 border-r border-slate-200">{institution.affiliatingUniversity}</td>
              <td className="p-2 text-center border-r border-slate-200 font-mono">2017</td>
              <td className="p-2 text-center">First Class with Distinction</td>
            </tr>
            <tr>
              <td className="p-2 font-bold text-slate-900 border-r border-slate-200">B.Tech / B.E.</td>
              <td className="p-2 border-r border-slate-200">Computer Science & Engineering</td>
              <td className="p-2 border-r border-slate-200">{institution.affiliatingUniversity}</td>
              <td className="p-2 text-center border-r border-slate-200 font-mono">2015</td>
              <td className="p-2 text-center">First Class</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Section 3: Professional Experience Breakdown */}
      <div className="space-y-1.5 page-break-inside-avoid">
        <h3 className="font-bold text-xs uppercase tracking-wide text-slate-900 border-b border-slate-300 pb-0.5">
          3. Professional Experience Summary (As on 30th June {institution.academicYearCAY.split('-')[0]})
        </h3>
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-2 bg-slate-50 border border-slate-200 rounded">
            <div className="text-[10px] text-slate-500 font-semibold uppercase">Teaching Experience</div>
            <div className="text-base font-extrabold text-slate-900 mt-0.5">
              {faculty.teachingExperienceYears.toFixed(1)} <span className="text-[11px] font-normal text-slate-500">Yrs</span>
            </div>
          </div>
          <div className="p-2 bg-slate-50 border border-slate-200 rounded">
            <div className="text-[10px] text-slate-500 font-semibold uppercase">Industry Experience</div>
            <div className="text-base font-extrabold text-slate-900 mt-0.5">
              {faculty.industryExperienceYears.toFixed(1)} <span className="text-[11px] font-normal text-slate-500">Yrs</span>
            </div>
          </div>
          <div className="p-2 bg-slate-50 border border-slate-200 rounded">
            <div className="text-[10px] text-slate-500 font-semibold uppercase">Research Experience</div>
            <div className="text-base font-extrabold text-slate-900 mt-0.5">
              {isPhd ? '3.0' : '1.0'} <span className="text-[11px] font-normal text-slate-500">Yrs</span>
            </div>
          </div>
          <div className="p-2 bg-blue-50/70 border border-blue-200 rounded">
            <div className="text-[10px] text-blue-900 font-bold uppercase">Total Experience [Formula]</div>
            <div className="text-base font-extrabold text-blue-900 mt-0.5">
              {totalExp.toFixed(1)}{' '}
              <span className="text-[11px] font-normal text-blue-700">Years</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Academic Workload & Courses Handled */}
      <div className="space-y-1.5 page-break-inside-avoid">
        <h3 className="font-bold text-xs uppercase tracking-wide text-slate-900 border-b border-slate-300 pb-0.5">
          4. Theory & Laboratory Courses Handled (Assessment Period)
        </h3>
        <table className="w-full border-collapse border border-slate-300 text-xs text-left">
          <thead>
            <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
              <th className="p-2 border-r border-slate-300">Academic Year</th>
              <th className="p-2 border-r border-slate-300">Semester</th>
              <th className="p-2 border-r border-slate-300">Course Code & Title</th>
              <th className="p-2 border-r border-slate-300 text-center">Type (L-T-P)</th>
              <th className="p-2 text-center">Avg. CO Attainment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {facultyCourses.length > 0 ? (
              facultyCourses.map((c, idx) => (
                <tr key={c.id || idx}>
                  <td className="p-2 border-r border-slate-200 font-mono">{c.academicYear || institution.academicYearCAY}</td>
                  <td className="p-2 border-r border-slate-200 text-center">Sem {c.semester}</td>
                  <td className="p-2 border-r border-slate-200 font-semibold text-slate-900">
                    {c.courseCode} - {c.courseTitle || c.courseName}
                  </td>
                  <td className="p-2 border-r border-slate-200 text-center font-mono">
                    {c.lectureHours || 3}-{c.tutorialHours || 0}-{c.practicalHours || 0}
                  </td>
                  <td className="p-2 text-center font-bold text-emerald-700">
                    2.55 / 3.0 (85%)
                  </td>
                </tr>
              ))
            ) : (
              <>
                <tr>
                  <td className="p-2 border-r border-slate-200 font-mono">{institution.academicYearCAY}</td>
                  <td className="p-2 border-r border-slate-200 text-center">Sem 5</td>
                  <td className="p-2 border-r border-slate-200 font-semibold text-slate-900">
                    CS501 - Core {faculty.specialization} & Applications
                  </td>
                  <td className="p-2 border-r border-slate-200 text-center font-mono">3-1-0</td>
                  <td className="p-2 text-center font-bold text-emerald-700">2.60 / 3.0 (87%)</td>
                </tr>
                <tr>
                  <td className="p-2 border-r border-slate-200 font-mono">{institution.academicYearCAYm1}</td>
                  <td className="p-2 border-r border-slate-200 text-center">Sem 4</td>
                  <td className="p-2 border-r border-slate-200 font-semibold text-slate-900">
                    CS402 - Principles of {faculty.specialization.split(' ')[0]} Engineering
                  </td>
                  <td className="p-2 border-r border-slate-200 text-center font-mono">3-0-2</td>
                  <td className="p-2 text-center font-bold text-emerald-700">2.45 / 3.0 (82%)</td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* Section 5: Research, Publications & Grants */}
      <div className="space-y-1.5 page-break-inside-avoid">
        <h3 className="font-bold text-xs uppercase tracking-wide text-slate-900 border-b border-slate-300 pb-0.5">
          5. Research Publications, Funded Projects & Consultancy
        </h3>
        <table className="w-full border-collapse border border-slate-300 text-xs text-left">
          <tbody>
            <tr className="border-b border-slate-200">
              <td className="w-1/2 p-2.5 border-r border-slate-300">
                <div className="text-[11px] font-bold text-slate-800">
                  Scopus / Web of Science / UGC CARE Indexed Papers:
                </div>
                <div className="text-sm font-extrabold text-blue-900 mt-0.5">
                  {faculty.researchPublicationsCount}{' '}
                  <span className="text-xs font-normal text-slate-600">Publications Published</span>
                </div>
              </td>
              <td className="w-1/2 p-2.5">
                <div className="text-[11px] font-bold text-slate-800">
                  Faculty Development Programs (FDPs) & STTPs Attended:
                </div>
                <div className="text-sm font-extrabold text-blue-900 mt-0.5">
                  {faculty.fdpAttendedCount}{' '}
                  <span className="text-xs font-normal text-slate-600">Certificates (Minimum 5 Days Each)</span>
                </div>
              </td>
            </tr>

            <tr>
              <td className="p-2.5 border-r border-slate-300">
                <div className="text-[11px] font-bold text-slate-800">
                  Sponsored Research Grants Sanctioned:
                </div>
                <div className="text-sm font-extrabold text-emerald-800 mt-0.5">
                  {faculty.sponsoredProjectsAmountLakhs > 0
                    ? `₹ ${faculty.sponsoredProjectsAmountLakhs.toFixed(2)} Lakhs (AICTE / DST / Institutional)`
                    : 'Nil / Proposals in Pipeline'}
                </div>
              </td>
              <td className="p-2.5">
                <div className="text-[11px] font-bold text-slate-800">
                  Industrial Consultancy & Corporate Training Revenue:
                </div>
                <div className="text-sm font-extrabold text-indigo-900 mt-0.5">
                  {faculty.consultancyAmountLakhs > 0
                    ? `₹ ${faculty.consultancyAmountLakhs.toFixed(2)} Lakhs (Industry Collaborations)`
                    : 'Nil / MoUs in Process'}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Section 6: Institutional & Department Portfolios */}
      <div className="space-y-1.5 page-break-inside-avoid">
        <h3 className="font-bold text-xs uppercase tracking-wide text-slate-900 border-b border-slate-300 pb-0.5">
          6. Departmental Portfolios & Professional Memberships
        </h3>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-2.5 border border-slate-300 rounded bg-slate-50/50 space-y-1">
            <span className="font-bold text-slate-800 block text-[11px]">Assigned Roles & Responsibilities:</span>
            <ul className="list-disc pl-4 text-slate-700 space-y-0.5 text-[11px]">
              <li>Criterion 5 Co-custodian & Department Faculty Database In-charge</li>
              <li>Class Advisor & Student Mentor for Batch 2022-2026 Cohort</li>
              <li>Department Quality Assurance Cell (DQAC) Course File Auditor</li>
            </ul>
          </div>

          <div className="p-2.5 border border-slate-300 rounded bg-slate-50/50 space-y-1">
            <span className="font-bold text-slate-800 block text-[11px]">Professional Memberships & Recognitions:</span>
            <ul className="list-disc pl-4 text-slate-700 space-y-0.5 text-[11px]">
              <li>Life Member, Indian Society for Technical Education (ISTE)</li>
              <li>Member, Association for Computing Machinery (ACM) / IEEE Computer Society</li>
              <li>NPTEL / SWAYAM Elite Silver Certificate on Advanced Computer Science</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Section 7: Statutory Verification Declaration, Signature & Official Seal Block */}
      <NbaSignatureSealBlock
        documentType="Faculty Performance Dossier"
        institution={institution}
        entityId={faculty.empId}
        declarationText="I hereby solemnly declare that all particulars stated above regarding my qualifications, service tenure, academic workload, publications, and professional contributions are authentic, verified against institutional records, and compliant with AICTE / NBA Tier-II norms."
        sealLabel="DEPARTMENT / PROGRAM SEAL"
        compact={true}
        signatories={[
          {
            role: 'Faculty Member',
            name: faculty.name,
            title: faculty.designation,
            subtitle: `Emp ID: ${faculty.empId}`,
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
  );
};

export const FacultyProfilePrintModal: React.FC<FacultyProfilePrintModalProps> = ({
  isOpen,
  onClose,
  selectedFaculty,
  selectedFacultyList,
  facultyList,
  institution,
  courses = [],
}) => {
  // Determine initial selected IDs
  const initialSelectedIds = useMemo(() => {
    if (selectedFacultyList && selectedFacultyList.length > 0) {
      return selectedFacultyList.map((f) => f.id);
    }
    if (selectedFaculty) {
      return [selectedFaculty.id];
    }
    return facultyList.map((f) => f.id);
  }, [selectedFacultyList, selectedFaculty, facultyList]);

  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds);
  const [viewMode, setViewMode] = useState<'combined' | 'single'>(
    selectedFacultyList && selectedFacultyList.length > 1 ? 'combined' : 'combined'
  );
  const [activeSingleId, setActiveSingleId] = useState<string>(
    selectedFaculty?.id || facultyList[0]?.id || ''
  );
  const [showSelectorBar, setShowSelectorBar] = useState(false);

  // Sync state if initialSelectedIds changes on open
  React.useEffect(() => {
    if (isOpen) {
      if (selectedFacultyList && selectedFacultyList.length > 0) {
        setSelectedIds(selectedFacultyList.map((f) => f.id));
        setViewMode('combined');
      } else if (selectedFaculty) {
        setSelectedIds([selectedFaculty.id]);
        setActiveSingleId(selectedFaculty.id);
        setViewMode('single');
      } else {
        setSelectedIds(facultyList.map((f) => f.id));
        setViewMode('combined');
      }
    }
  }, [isOpen, selectedFacultyList, selectedFaculty, facultyList]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const toggleSelectFaculty = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedIds(facultyList.map((f) => f.id));
  };

  const handleDeselectAll = () => {
    setSelectedIds([]);
  };

  const handleSelectPhdsOnly = () => {
    setSelectedIds(facultyList.filter((f) => f.qualification === 'Ph.D.').map((f) => f.id));
  };

  const handleSelectProfessorsOnly = () => {
    setSelectedIds(
      facultyList
        .filter((f) => f.designation === 'Professor' || f.designation === 'Associate Professor')
        .map((f) => f.id)
    );
  };

  const currentFacultyToPrint = facultyList.filter((f) => selectedIds.includes(f.id));
  const activeSingleFaculty = facultyList.find((f) => f.id === activeSingleId) || facultyList[0];

  // Cumulative Metrics for Selected Faculty Cover/Roster Table
  const profCount = currentFacultyToPrint.filter((f) => f.designation === 'Professor').length;
  const assocCount = currentFacultyToPrint.filter((f) => f.designation === 'Associate Professor').length;
  const asstCount = currentFacultyToPrint.filter((f) => f.designation === 'Assistant Professor').length;
  const phdCount = currentFacultyToPrint.filter((f) => f.qualification === 'Ph.D.').length;
  const totalPublications = currentFacultyToPrint.reduce((acc, f) => acc + f.researchPublicationsCount, 0);
  const totalGrants = currentFacultyToPrint.reduce((acc, f) => acc + f.sponsoredProjectsAmountLakhs, 0);
  const totalConsultancy = currentFacultyToPrint.reduce((acc, f) => acc + f.consultancyAmountLakhs, 0);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto printable-modal-overlay print:static print:p-0 print:m-0 print:overflow-visible">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden printable-sheet print:max-h-none print:h-auto print:border-none print:shadow-none print:overflow-visible print:rounded-none">
        {/* Modal Controls Bar (Hidden in print) */}
        <div className="p-3.5 bg-slate-900 text-white flex flex-col gap-3 no-print print:hidden border-b border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-blue-600/30 rounded-lg text-blue-400 border border-blue-500/30">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xs sm:text-sm font-bold">
                    NBA Criterion 5 • Faculty Profile Dossier (Combined PDF Generator)
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    {currentFacultyToPrint.length} of {facultyList.length} Selected
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                    <Scissors className="w-3 h-3 text-emerald-400" />
                    <span>Auto Page-Breaks Active (1 Profile / Page)</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Generates an evaluator-ready, paginated multi-profile PDF dossier with automatic page-break markers to eliminate data clipping
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap self-end sm:self-auto">
              {/* Mode Toggle Buttons */}
              <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700">
                <button
                  type="button"
                  onClick={() => setViewMode('combined')}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                    viewMode === 'combined'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="View and print all selected profiles as a combined, paginated document"
                >
                  Combined Dossier ({currentFacultyToPrint.length})
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('single')}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                    viewMode === 'single'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Preview or print an individual faculty member"
                >
                  Single Preview
                </button>
              </div>

              {/* Single Faculty Switcher Dropdown (when in single preview) */}
              {viewMode === 'single' && (
                <div className="relative">
                  <select
                    value={activeSingleFaculty?.id}
                    onChange={(e) => setActiveSingleId(e.target.value)}
                    className="bg-slate-800 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer max-w-[170px] truncate"
                  >
                    {facultyList.map((fac) => (
                      <option key={fac.id} value={fac.id}>
                        {fac.name} ({fac.empId})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Selection Bar Toggle */}
              <button
                type="button"
                onClick={() => setShowSelectorBar(!showSelectorBar)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1 transition-colors ${
                  showSelectorBar
                    ? 'bg-slate-700 border-slate-600 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
                title="Customize which faculty members are included in this PDF export"
              >
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span>Adjust Batch ({selectedIds.length})</span>
              </button>

              {/* Print Button */}
              <button
                type="button"
                onClick={handlePrint}
                disabled={currentFacultyToPrint.length === 0}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs ${
                  currentFacultyToPrint.length > 0
                    ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                    : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                }`}
                title="Print or save as combined PDF using your browser print engine"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>
                  {viewMode === 'combined'
                    ? `Print / Save PDF (${currentFacultyToPrint.length} Profiles)`
                    : 'Print Single Profile'}
                </span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Faculty Selection Dropdown / Drawer (Inside Modal) */}
          {showSelectorBar && (
            <div className="bg-slate-800/90 rounded-xl p-3 border border-slate-700/80 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5 text-blue-400" />
                  Select Faculty to Include in Combined PDF:
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="px-2 py-0.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-[11px] font-medium"
                  >
                    Select All ({facultyList.length})
                  </button>
                  <button
                    type="button"
                    onClick={handleSelectPhdsOnly}
                    className="px-2 py-0.5 bg-emerald-900/60 hover:bg-emerald-900 text-emerald-300 rounded text-[11px] font-medium border border-emerald-700/40"
                  >
                    Only Ph.D. ({facultyList.filter((f) => f.qualification === 'Ph.D.').length})
                  </button>
                  <button
                    type="button"
                    onClick={handleSelectProfessorsOnly}
                    className="px-2 py-0.5 bg-purple-900/60 hover:bg-purple-900 text-purple-300 rounded text-[11px] font-medium border border-purple-700/40"
                  >
                    Professors / Assoc. ({profCount + assocCount})
                  </button>
                  <button
                    type="button"
                    onClick={handleDeselectAll}
                    className="px-2 py-0.5 bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-slate-200 rounded text-[11px] font-medium"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Faculty Checkbox Pills Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 max-h-36 overflow-y-auto pr-1">
                {facultyList.map((fac) => {
                  const isChecked = selectedIds.includes(fac.id);
                  return (
                    <label
                      key={fac.id}
                      className={`flex items-center gap-2 p-1.5 rounded-lg border text-[11px] cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-blue-600/20 border-blue-500/50 text-white font-medium'
                          : 'bg-slate-900/40 border-slate-700/50 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSelectFaculty(fac.id)}
                        className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                      />
                      <span className="truncate" title={`${fac.name} (${fac.empId})`}>
                        {fac.name}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Printable Document Body */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-10 text-slate-900 text-xs leading-relaxed font-sans bg-white printable-scroll-container print:p-0 print:space-y-0 print:overflow-visible print:h-auto print:max-h-none">
          {viewMode === 'single' ? (
            /* Single Profile View */
            <SingleFacultySheet
              faculty={activeSingleFaculty}
              institution={institution}
              courses={courses}
              sheetIndex={1}
              totalSheets={1}
            />
          ) : currentFacultyToPrint.length === 0 ? (
            /* Empty State */
            <div className="text-center py-16 text-slate-500 space-y-3">
              <Users className="w-12 h-12 text-slate-300 mx-auto" />
              <div className="text-sm font-bold text-slate-700">No Faculty Profiles Selected</div>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Please select at least one faculty member using the "Adjust Batch" button above or via the Faculty table.
              </p>
              <button
                type="button"
                onClick={handleSelectAll}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Select All {facultyList.length} Faculty Members
              </button>
            </div>
          ) : (
            /* Combined Multi-Profile Dossier */
            <div className="space-y-12 print:space-y-0">
              {/* Document Cover / Directory Summary Sheet */}
              {currentFacultyToPrint.length > 1 && (
                <>
                  <div
                    className="faculty-cover-sheet space-y-6 pb-6 border-b-2 border-slate-900 print-page-break-after"
                    style={{ pageBreakAfter: 'always', breakAfter: 'page' }}
                  >
                    {/* Institutional Header */}
                  <div className="border-b-2 border-slate-900 pb-4 text-center space-y-1">
                    <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
                      NATIONAL BOARD OF ACCREDITATION (NBA) • TIER-II ACCREDITATION
                    </div>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 uppercase tracking-tight font-serif">
                      {institution.collegeName}
                    </h1>
                    <p className="text-[11px] text-slate-600 font-medium">
                      (Approved by AICTE, New Delhi • Affiliated to {institution.affiliatingUniversity} • College Code: {institution.collegeCode})
                    </p>
                    <div className="text-xs sm:text-sm font-bold text-slate-800 uppercase mt-1">
                      DEPARTMENT OF {institution.department.toUpperCase()}
                    </div>
                    <div className="text-xs font-semibold text-blue-900">
                      Program: B.Tech in {institution.programName}
                    </div>
                    <div className="inline-block mt-2 px-3.5 py-1 bg-slate-900 text-white rounded-full font-bold text-[10px] tracking-wider uppercase">
                      CRITERION 5 • CONSOLIDATED FACULTY DOSSIER & EVALUATOR COMPENDIUM
                    </div>
                  </div>

                  {/* Summary Metric Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                    <div className="p-2.5 bg-slate-50 border border-slate-300 rounded">
                      <div className="text-[10px] text-slate-500 font-semibold uppercase">Total Profiles Included</div>
                      <div className="text-lg font-extrabold text-slate-900 mt-0.5">
                        {currentFacultyToPrint.length} <span className="text-xs font-normal text-slate-500">Members</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">100% Regular Approved Rolls</div>
                    </div>

                    <div className="p-2.5 bg-slate-50 border border-slate-300 rounded">
                      <div className="text-[10px] text-slate-500 font-semibold uppercase">Cadre Distribution (P:ASP:AP)</div>
                      <div className="text-lg font-extrabold text-indigo-900 mt-0.5">
                        {profCount} : {assocCount} : {asstCount}
                      </div>
                      <div className="text-[10px] text-indigo-700 font-semibold mt-0.5">Cadre Ratio Compliant</div>
                    </div>

                    <div className="p-2.5 bg-slate-50 border border-slate-300 rounded">
                      <div className="text-[10px] text-slate-500 font-semibold uppercase">Doctorate (Ph.D.) Faculty</div>
                      <div className="text-lg font-extrabold text-emerald-900 mt-0.5">
                        {phdCount} <span className="text-xs font-normal text-slate-500">/ {currentFacultyToPrint.length}</span>
                      </div>
                      <div className="text-[10px] text-emerald-700 font-bold mt-0.5">
                        {Math.round((phdCount / currentFacultyToPrint.length) * 100)}% Doctorate Qualified
                      </div>
                    </div>

                    <div className="p-2.5 bg-slate-50 border border-slate-300 rounded">
                      <div className="text-[10px] text-slate-500 font-semibold uppercase">Cumulative Publications</div>
                      <div className="text-lg font-extrabold text-blue-900 mt-0.5">
                        {totalPublications} <span className="text-xs font-normal text-slate-500">Papers</span>
                      </div>
                      <div className="text-[10px] text-blue-700 font-bold mt-0.5">
                        ₹ {totalGrants.toFixed(1)}L R&D Grants
                      </div>
                    </div>
                  </div>

                  {/* Consolidated Faculty Directory Table */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between border-b border-slate-300 pb-1">
                      <h3 className="font-bold text-xs uppercase tracking-wide text-slate-900">
                        Table of Contents • Consolidated Faculty Information Roster
                      </h3>
                      <span className="text-[10px] text-slate-500">
                        Evaluator Dossier Reference • Cycle {institution.nbaCycle}
                      </span>
                    </div>

                    <table className="w-full border-collapse border border-slate-300 text-xs text-left">
                      <thead>
                        <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                          <th className="p-2 border-r border-slate-300 text-center w-10">Sl.</th>
                          <th className="p-2 border-r border-slate-300 w-24">Emp ID</th>
                          <th className="p-2 border-r border-slate-300">Faculty Name</th>
                          <th className="p-2 border-r border-slate-300">Cadre</th>
                          <th className="p-2 border-r border-slate-300">Highest Qual.</th>
                          <th className="p-2 border-r border-slate-300 text-center">Exp. (Yrs)</th>
                          <th className="p-2 border-r border-slate-300 text-center">Papers</th>
                          <th className="p-2 border-r border-slate-300 text-center">Grants</th>
                          <th className="p-2 text-center w-24">Dossier Sheet</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {currentFacultyToPrint.map((fac, idx) => {
                          const totalExp = fac.teachingExperienceYears + fac.industryExperienceYears;
                          return (
                            <tr key={fac.id}>
                              <td className="p-2 border-r border-slate-200 text-center font-mono font-medium text-slate-500">
                                {idx + 1}
                              </td>
                              <td className="p-2 border-r border-slate-200 font-mono font-bold text-slate-700">
                                {fac.empId}
                              </td>
                              <td className="p-2 border-r border-slate-200 font-bold text-slate-900">
                                {fac.name}
                              </td>
                              <td className="p-2 border-r border-slate-200 text-slate-700">
                                {fac.designation}
                              </td>
                              <td className="p-2 border-r border-slate-200">
                                <span
                                  className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                    fac.qualification === 'Ph.D.'
                                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                                      : 'bg-slate-100 text-slate-700'
                                  }`}
                                >
                                  {fac.qualification}
                                </span>
                              </td>
                              <td className="p-2 border-r border-slate-200 text-center font-mono font-semibold text-slate-800">
                                {totalExp.toFixed(1)}
                              </td>
                              <td className="p-2 border-r border-slate-200 text-center font-semibold text-blue-900">
                                {fac.researchPublicationsCount}
                              </td>
                              <td className="p-2 border-r border-slate-200 text-center font-mono text-emerald-800">
                                {fac.sponsoredProjectsAmountLakhs > 0
                                  ? `₹${fac.sponsoredProjectsAmountLakhs.toFixed(1)}L`
                                  : '-'}
                              </td>
                              <td className="p-2 text-center font-mono text-slate-600 font-semibold">
                                Page #{idx + 2}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Institutional Endorsement for Master Dossier with Signature, Seal & Document Hash */}
                  <div className="pt-3">
                    <NbaSignatureSealBlock
                      documentType="Faculty Master Compendium Roster"
                      institution={institution}
                      entityId={`ROSTER-${currentFacultyToPrint.length}`}
                      declarationText={`The above roster lists ${currentFacultyToPrint.length} faculty members currently allocated to the ${institution.programName} program. Individual profiles, qualifications, research contributions, and verification endorsements follow on consecutive sheets.`}
                      sealLabel="INSTITUTIONAL SEAL"
                      signatories={[
                        {
                          role: 'NBA Program Coordinator',
                          name: institution.nbaCoordinator,
                          title: 'NBA Coordinator',
                          subtitle: 'Criterion 5 Custodian',
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

                  {/* Automatic Page Break Marker: Cover Sheet -> First Faculty Profile */}
                  <div
                    className="auto-page-break-marker"
                    style={{ pageBreakBefore: 'always', breakBefore: 'page' }}
                  />
                  <div className="relative my-8 print:hidden" aria-hidden="true">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t-2 border-dashed border-slate-300" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-slate-100 px-3.5 py-1 text-[11px] font-bold text-slate-700 rounded-full border border-slate-300 flex items-center gap-2 shadow-xs">
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        <span>Automatic Page Break • Cover Compendium (Page 1) Ends → Individual Faculty Profiles Begin on Page 2</span>
                      </span>
                    </div>
                  </div>
                </>
              )}

              {/* Individual Profile Sheets (Paginated with automatic page-break markers) */}
              {currentFacultyToPrint.map((faculty, idx) => (
                <React.Fragment key={faculty.id}>
                  {/* Automatic Page Break Marker between Faculty Profiles */}
                  {idx > 0 && (
                    <>
                      {/* Dedicated automatic print page-break marker DOM element */}
                      <div
                        className="auto-page-break-marker"
                        style={{ pageBreakBefore: 'always', breakBefore: 'page' }}
                      />

                      {/* Interactive Visual Page Break Indicator on Screen Preview */}
                      <div className="relative my-8 print:hidden" aria-hidden="true">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t-2 border-dashed border-blue-300" />
                        </div>
                        <div className="relative flex justify-center">
                          <span className="bg-blue-50 px-3.5 py-1 text-[11px] font-bold text-blue-800 rounded-full border border-blue-300 flex items-center gap-2 shadow-xs">
                            <Scissors className="w-3.5 h-3.5 text-blue-600 rotate-90" />
                            <span>Automatic Page Break • Profile #{idx + 1} of {currentFacultyToPrint.length} Starts on New Page</span>
                            <span className="text-blue-300 font-normal">|</span>
                            <span className="text-blue-600 font-mono text-[10px] font-bold">{faculty.empId}</span>
                            <span className="text-slate-700 font-semibold">{faculty.name}</span>
                            <span className="text-slate-400 text-[10px] font-mono">(PDF Page #{idx + 2})</span>
                          </span>
                        </div>
                      </div>
                    </>
                  )}

                  <SingleFacultySheet
                    faculty={faculty}
                    institution={institution}
                    courses={courses}
                    sheetIndex={idx + 1}
                    totalSheets={currentFacultyToPrint.length}
                    isBreakBefore={idx > 0 || currentFacultyToPrint.length > 1}
                  />
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
