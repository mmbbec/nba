/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  Building2,
  Users,
  GraduationCap,
  Target,
  FolderCheck,
  Layers,
  FileCheck,
  ShieldAlert,
  FileSpreadsheet,
  Download,
  Award,
} from 'lucide-react';

import {
  defaultInstitution,
  defaultYearBatchData,
  defaultFacultyList,
  defaultStudents,
  defaultCourses,
  defaultCourseOutcomes,
  defaultProgramOutcomes,
  defaultProgramSpecificOutcomes,
  defaultStudentMarks,
  defaultAttainmentConfig,
  defaultCourseFileChecklist,
  defaultContinuousImprovements,
  defaultEvidenceDocuments,
  defaultNbaTemplates,
  defaultAuditLogs,
} from './data/defaultNbaData';

import {
  InstitutionMaster,
  YearBatchData,
  MasterFaculty,
  MasterStudent,
  CourseInfo,
  CourseOutcomeDef,
  StudentMarkEntry,
  AttainmentConfig,
  CourseFileChecklist,
  ContinuousImprovementItem,
  EvidenceDocument,
  AuditLogEntry,
} from './types/nba';

import { computeNbaReadiness } from './utils/calculations';
import { runFullNbaAudit } from './utils/validation';
import { exportMasterNbaWorkbook } from './utils/excelExport';

import { Header } from './components/Header';
import { ColorLegend } from './components/ColorLegend';
import { DashboardTab } from './components/DashboardTab';
import { MasterControlTab } from './components/MasterControlTab';
import { FacultyTab } from './components/FacultyTab';
import { StudentsTab } from './components/StudentsTab';
import { CoPoAttainmentTab } from './components/CoPoAttainmentTab';
import { CourseFileTab } from './components/CourseFileTab';
import { CriteriaExtendedTab } from './components/CriteriaExtendedTab';
import { EvidenceTab } from './components/EvidenceTab';
import { AuditTab } from './components/AuditTab';
import { TemplatesTab } from './components/TemplatesTab';
import { SarPrintModal } from './components/SarPrintModal';
import { FacultyProfilePrintModal } from './components/FacultyProfilePrintModal';
import { DepartmentProfilePrintModal } from './components/DepartmentProfilePrintModal';

export type MainTabType =
  | 'dashboard'
  | 'master-control'
  | 'faculty'
  | 'students'
  | 'co-po'
  | 'course-files'
  | 'extended-criteria'
  | 'evidence'
  | 'audit'
  | 'templates';

export default function App() {
  // Primary State
  const [activeTab, setActiveTab] = useState<MainTabType>('dashboard');
  const [institution, setInstitution] = useState<InstitutionMaster>(defaultInstitution);
  const [yearBatchData, setYearBatchData] = useState<Record<string, YearBatchData>>(defaultYearBatchData);
  const [facultyList, setFacultyList] = useState<MasterFaculty[]>(defaultFacultyList);
  const [students, setStudents] = useState<MasterStudent[]>(defaultStudents);
  const [courses, setCourses] = useState<CourseInfo[]>(defaultCourses);
  const [courseOutcomes, setCourseOutcomes] = useState<CourseOutcomeDef[]>(defaultCourseOutcomes);
  const [studentMarks, setStudentMarks] = useState<StudentMarkEntry[]>(defaultStudentMarks);
  const [attainmentConfig, setAttainmentConfig] = useState<AttainmentConfig>(defaultAttainmentConfig);
  const [courseFiles, setCourseFiles] = useState<CourseFileChecklist[]>(defaultCourseFileChecklist);
  const [improvementActions, setImprovementActions] = useState<ContinuousImprovementItem[]>(defaultContinuousImprovements);
  const [evidenceList, setEvidenceList] = useState<EvidenceDocument[]>(defaultEvidenceDocuments);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(defaultAuditLogs);

  // Modal State
  const [isSarPrintOpen, setIsSarPrintOpen] = useState(false);
  const [isFacultyPdfOpen, setIsFacultyPdfOpen] = useState(false);
  const [selectedFacultyForPdf, setSelectedFacultyForPdf] = useState<MasterFaculty | null>(null);
  const [selectedFacultyListForPdf, setSelectedFacultyListForPdf] = useState<MasterFaculty[]>([]);
  const [isDeptProfilePdfOpen, setIsDeptProfilePdfOpen] = useState(false);

  const handleOpenFacultyPdf = (fac?: MasterFaculty) => {
    setSelectedFacultyForPdf(fac || facultyList[0] || null);
    setSelectedFacultyListForPdf(fac ? [fac] : facultyList);
    setIsFacultyPdfOpen(true);
  };

  const handleOpenFacultyBulkPdf = (faculties: MasterFaculty[]) => {
    const list = faculties.length > 0 ? faculties : facultyList;
    setSelectedFacultyListForPdf(list);
    setSelectedFacultyForPdf(list[0] || facultyList[0] || null);
    setIsFacultyPdfOpen(true);
  };

  const handleOpenDeptProfilePdf = () => {
    setIsDeptProfilePdfOpen(true);
  };

  // Active CAY batch
  const batchCAY = yearBatchData['CAY'] || defaultYearBatchData['CAY'];

  // Automatic Calculation of NBA Criteria Scores
  const readiness = useMemo(() => {
    return computeNbaReadiness(batchCAY, facultyList, evidenceList);
  }, [batchCAY, facultyList, evidenceList]);

  // Automatic Pre-Submission Data Integrity Audit
  const validationIssues = useMemo(() => {
    return runFullNbaAudit(
      institution,
      facultyList,
      students,
      courses,
      yearBatchData,
      studentMarks,
      evidenceList
    );
  }, [institution, facultyList, students, courses, yearBatchData, studentMarks, evidenceList]);

  // Handlers
  const handleExportExcel = () => {
    exportMasterNbaWorkbook(
      institution,
      facultyList,
      students,
      courses,
      yearBatchData,
      courseOutcomes,
      studentMarks,
      evidenceList,
      readiness.criteriaScores
    );
  };

  const handleUpdateBatchData = (yearKey: string, updated: YearBatchData) => {
    setYearBatchData((prev) => ({ ...prev, [yearKey]: updated }));
    addAuditLog('Admissions & Placements', `${yearKey} metrics`, 'Updated batch numbers');
  };

  const handleAddFaculty = (faculty: MasterFaculty) => {
    setFacultyList((prev) => [faculty, ...prev]);
    addAuditLog('Faculty Master', 'Faculty Roster', `Added faculty: ${faculty.name}`);
  };

  const handleUpdateFaculty = (faculty: MasterFaculty) => {
    setFacultyList((prev) => prev.map((f) => (f.id === faculty.id ? faculty : f)));
    addAuditLog('Faculty Master', faculty.name, `Updated profile: ${faculty.empId}`);
  };

  const handleDeleteFaculty = (id: string) => {
    const fac = facultyList.find((f) => f.id === id);
    setFacultyList((prev) => prev.filter((f) => f.id !== id));
    addAuditLog('Faculty Master', fac?.name || id, 'Deleted faculty record');
  };

  const handleUpdateCourseFileStatus = (
    courseCode: string,
    itemKey: string,
    status: 'Verified' | 'Uploaded' | 'Pending'
  ) => {
    setCourseFiles((prev) =>
      prev.map((cf) => (cf.id === itemKey ? { ...cf, status } : cf))
    );
  };

  const handleUpdateEvidenceStatus = (
    id: string,
    newStatus: 'Verified' | 'In Progress' | 'Missing'
  ) => {
    setEvidenceList((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
    );
  };

  const handleAddImprovementAction = (action: ContinuousImprovementItem) => {
    setImprovementActions((prev) => [action, ...prev]);
    addAuditLog('Criterion 7', action.poOrPsoCode, 'Logged new continuous improvement action');
  };

  const addAuditLog = (module: string, fieldChanged: string, remarks: string) => {
    const newLog: AuditLogEntry = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      user: 'Prof. S. Ranganathan (NBA Coord)',
      module,
      fieldChanged,
      previousValue: 'Previous State',
      newValue: 'Updated State',
      remarks,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const handleSelectCriterion = (criterionNumber: number) => {
    if (criterionNumber === 1 || criterionNumber === 10) setActiveTab('master-control');
    else if (criterionNumber === 2) setActiveTab('course-files');
    else if (criterionNumber === 3) setActiveTab('co-po');
    else if (criterionNumber === 4) setActiveTab('students');
    else if (criterionNumber === 5) setActiveTab('faculty');
    else setActiveTab('extended-criteria');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Application Master Header */}
      <Header
        institution={institution}
        totalEstimatedScore={readiness.totalEstimatedScore}
        overallPercentage={readiness.overallPercentage}
        unresolvedIssuesCount={validationIssues.length}
        onExportExcel={handleExportExcel}
        onOpenSarPrint={() => setIsSarPrintOpen(true)}
        onOpenDeptProfilePrint={handleOpenDeptProfilePdf}
        onOpenFacultyProfilePrint={() => handleOpenFacultyBulkPdf(facultyList)}
        onRunAudit={() => setActiveTab('audit')}
      />

      {/* Main Tab Navigation Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none text-xs">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-2 rounded-xl font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Readiness Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('master-control')}
              className={`px-3 py-2 rounded-xl font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === 'master-control'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Master Control</span>
            </button>

            <button
              onClick={() => setActiveTab('faculty')}
              className={`px-3 py-2 rounded-xl font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === 'faculty'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Faculty & SFR (C5)</span>
            </button>

            <button
              onClick={() => setActiveTab('students')}
              className={`px-3 py-2 rounded-xl font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === 'students'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Students & Placements (C4)</span>
            </button>

            <button
              onClick={() => setActiveTab('co-po')}
              className={`px-3 py-2 rounded-xl font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === 'co-po'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Target className="w-4 h-4" />
              <span>CO-PO Attainment Lab (C3)</span>
            </button>

            <button
              onClick={() => setActiveTab('course-files')}
              className={`px-3 py-2 rounded-xl font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === 'course-files'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FolderCheck className="w-4 h-4" />
              <span>Course Files (C2)</span>
            </button>

            <button
              onClick={() => setActiveTab('extended-criteria')}
              className={`px-3 py-2 rounded-xl font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === 'extended-criteria'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Criteria 6 - 10</span>
            </button>

            <button
              onClick={() => setActiveTab('evidence')}
              className={`px-3 py-2 rounded-xl font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === 'evidence'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              <span>Evidence Repository</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-2 rounded-xl font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === 'audit'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Live Audit ({validationIssues.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('templates')}
              className={`px-3 py-2 rounded-xl font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === 'templates'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>48 NBA Templates</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        {/* Color Legend Standard */}
        <ColorLegend />

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <DashboardTab
            institution={institution}
            criteriaScores={readiness.criteriaScores}
            batchCAY={batchCAY}
            facultyList={facultyList}
            evidenceList={evidenceList}
            unresolvedIssuesCount={validationIssues.length}
            onSelectCriterion={handleSelectCriterion}
            onOpenTemplates={() => setActiveTab('templates')}
            onOpenSarReport={() => setIsSarPrintOpen(true)}
            onOpenDeptProfile={handleOpenDeptProfilePdf}
            onOpenFacultyProfile={() => handleOpenFacultyBulkPdf(facultyList)}
          />
        )}

        {activeTab === 'master-control' && (
          <MasterControlTab
            institution={institution}
            attainmentConfig={attainmentConfig}
            auditLogs={auditLogs}
            onUpdateInstitution={setInstitution}
            onUpdateAttainmentConfig={setAttainmentConfig}
            onOpenDeptProfilePdf={handleOpenDeptProfilePdf}
          />
        )}

        {activeTab === 'faculty' && (
          <FacultyTab
            facultyList={facultyList}
            batchCAY={batchCAY}
            institution={institution}
            courses={courses}
            onAddFaculty={handleAddFaculty}
            onUpdateFaculty={handleUpdateFaculty}
            onDeleteFaculty={handleDeleteFaculty}
            onOpenFacultyPdf={handleOpenFacultyPdf}
            onOpenFacultyBulkPdf={handleOpenFacultyBulkPdf}
          />
        )}

        {activeTab === 'students' && (
          <StudentsTab
            students={students}
            yearBatchData={yearBatchData}
            onUpdateBatchData={handleUpdateBatchData}
            onAddStudent={(newStudent) => setStudents((prev) => [newStudent, ...prev])}
          />
        )}

        {activeTab === 'co-po' && (
          <CoPoAttainmentTab
            config={attainmentConfig}
            courseOutcomes={courseOutcomes}
            programOutcomes={defaultProgramOutcomes}
            programSpecificOutcomes={defaultProgramSpecificOutcomes}
            studentMarks={studentMarks}
            onUpdateStudentMarks={setStudentMarks}
            onUpdateCourseOutcomes={setCourseOutcomes}
          />
        )}

        {activeTab === 'course-files' && (
          <CourseFileTab
            courses={courses}
            courseFiles={courseFiles}
            onUpdateFileStatus={handleUpdateCourseFileStatus}
          />
        )}

        {activeTab === 'extended-criteria' && (
          <CriteriaExtendedTab
            improvementActions={improvementActions}
            onAddImprovementAction={handleAddImprovementAction}
          />
        )}

        {activeTab === 'evidence' && (
          <EvidenceTab
            evidenceList={evidenceList}
            onUpdateEvidenceStatus={handleUpdateEvidenceStatus}
          />
        )}

        {activeTab === 'audit' && (
          <AuditTab
            validationIssues={validationIssues}
            onReRunAudit={() => {}}
            onNavigateToModule={(mod) => handleSelectCriterion(3)}
            onResolveIssue={(issueId) => {}}
          />
        )}

        {activeTab === 'templates' && (
          <TemplatesTab
            templates={defaultNbaTemplates}
            onExportMasterWorkbook={handleExportExcel}
            onOpenSarReport={() => setIsSarPrintOpen(true)}
          />
        )}
      </main>

      {/* SAR Printable Modal */}
      <SarPrintModal
        isOpen={isSarPrintOpen}
        onClose={() => setIsSarPrintOpen(false)}
        institution={institution}
        criteriaScores={readiness.criteriaScores}
        batchCAY={batchCAY}
        facultyList={facultyList}
      />

      {/* Faculty Profile Printable Modal */}
      <FacultyProfilePrintModal
        isOpen={isFacultyPdfOpen}
        onClose={() => setIsFacultyPdfOpen(false)}
        selectedFaculty={selectedFacultyForPdf}
        selectedFacultyList={selectedFacultyListForPdf}
        facultyList={facultyList}
        institution={institution}
        courses={courses}
      />

      {/* Department Profile Printable Modal */}
      <DepartmentProfilePrintModal
        isOpen={isDeptProfilePdfOpen}
        onClose={() => setIsDeptProfilePdfOpen(false)}
        institution={institution}
        batchCAY={batchCAY}
        yearBatchData={yearBatchData}
        facultyList={facultyList}
        courses={courses}
        criteriaScores={readiness.criteriaScores}
        attainmentConfig={attainmentConfig}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            NBA Accreditation Automated Decision Support & SAR Compiler • Version 2026.1
          </div>
          <div className="flex items-center gap-4">
            <span>Tier-II Engineering Guidelines</span>
            <span>•</span>
            <span>AICTE-NBA Benchmark Aligned</span>
            <span>•</span>
            <button
              onClick={handleExportExcel}
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Export Excel Package
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
