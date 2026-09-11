import React, { useState } from 'react';
import {
  GraduationCap,
  Briefcase,
  TrendingUp,
  Search,
  Plus,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Award,
  Edit2,
  Trash2,
  X,
  User,
  Building,
  School,
  Sparkles,
} from 'lucide-react';
import { MasterStudent, YearBatchData } from '../types/nba';
import { calculatePlacementIndex, calculatePassPercentage } from '../utils/calculations';

interface StudentsTabProps {
  students: MasterStudent[];
  yearBatchData: Record<string, YearBatchData>;
  onUpdateBatchData: (yearKey: string, updated: YearBatchData) => void;
  onAddStudent: (student: MasterStudent) => void;
  onUpdateStudent: (student: MasterStudent) => void;
  onDeleteStudent: (id: string) => void;
}

export const StudentsTab: React.FC<StudentsTabProps> = ({
  students,
  yearBatchData,
  onUpdateBatchData,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
}) => {
  const [activeBatchKey, setActiveBatchKey] = useState<string>('CAY');
  const [studentSearch, setStudentSearch] = useState('');
  const [filterCareer, setFilterCareer] = useState('all');
  const [filterBatch, setFilterBatch] = useState('all');

  // Modal states for Add and Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<MasterStudent | null>(null);
  const [deleteConfirmStudent, setDeleteConfirmStudent] = useState<MasterStudent | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<MasterStudent>>({
    usnOrRollNo: '',
    name: '',
    batch: '2022-2026',
    currentSemester: 8,
    admissionYear: 2022,
    admissionCategory: 'Regular',
    academicStatus: 'Active',
    placementStatus: 'Placed',
    companyOrInstitutionName: '',
    packageLPA: 6.5,
    cgpa: 8.2,
  });

  const currentBatch = yearBatchData[activeBatchKey] || yearBatchData['CAY'];

  const passData = calculatePassPercentage(
    currentBatch.totalPassedFinalYear,
    currentBatch.appearedFinalYear
  );

  const placementData = calculatePlacementIndex(
    currentBatch.placedStudents,
    currentBatch.higherStudiesStudents,
    currentBatch.entrepreneurshipStudents,
    currentBatch.eligibleGraduates
  );

  // Extract unique batches from student list
  const uniqueBatches = Array.from(new Set(students.map((s) => s.batch))).filter(Boolean);

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.usnOrRollNo.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.companyOrInstitutionName.toLowerCase().includes(studentSearch.toLowerCase());
    const matchesCareer = filterCareer === 'all' || s.placementStatus === filterCareer;
    const matchesBatch = filterBatch === 'all' || s.batch === filterBatch;
    return matchesSearch && matchesCareer && matchesBatch;
  });

  // Cohort quick stats
  const totalFiltered = filteredStudents.length;
  const placedFiltered = filteredStudents.filter((s) => s.placementStatus === 'Placed').length;
  const higherStudiesFiltered = filteredStudents.filter((s) => s.placementStatus === 'Higher Studies').length;
  const entrepreneurFiltered = filteredStudents.filter((s) => s.placementStatus === 'Entrepreneurship').length;
  const avgCgpaFiltered =
    totalFiltered > 0
      ? (filteredStudents.reduce((acc, s) => acc + s.cgpa, 0) / totalFiltered).toFixed(2)
      : '0.00';

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setFormData({
      usnOrRollNo: '',
      name: '',
      batch: currentBatch?.yearLabel || '2022-2026',
      currentSemester: 8,
      admissionYear: 2022,
      admissionCategory: 'Regular',
      academicStatus: 'Active',
      placementStatus: 'Placed',
      companyOrInstitutionName: '',
      packageLPA: 6.5,
      cgpa: 8.2,
    });
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (student: MasterStudent) => {
    setEditingStudent(student);
    setFormData({ ...student });
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleSubmitStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.usnOrRollNo?.trim()) {
      setErrorMessage('USN / University Roll Number is required.');
      return;
    }
    if (!formData.name?.trim()) {
      setErrorMessage('Student Full Name is required.');
      return;
    }

    const trimmedUsn = formData.usnOrRollNo.trim().toUpperCase();
    const existing = students.find(
      (s) => s.usnOrRollNo.toUpperCase() === trimmedUsn && (!editingStudent || s.id !== editingStudent.id)
    );
    if (existing) {
      setErrorMessage(`A student with USN "${trimmedUsn}" already exists (${existing.name}).`);
      return;
    }

    if (editingStudent) {
      const updated: MasterStudent = {
        ...editingStudent,
        usnOrRollNo: trimmedUsn,
        name: formData.name.trim(),
        batch: formData.batch || '2022-2026',
        currentSemester: Number(formData.currentSemester) || 8,
        admissionYear: Number(formData.admissionYear) || 2022,
        admissionCategory: (formData.admissionCategory as any) || 'Regular',
        academicStatus: (formData.academicStatus as any) || 'Active',
        placementStatus: (formData.placementStatus as any) || 'Placed',
        companyOrInstitutionName: formData.companyOrInstitutionName?.trim() || '-',
        packageLPA: Number(formData.packageLPA) || 0,
        cgpa: Math.min(10, Math.max(0, Number(formData.cgpa) || 0)),
      };
      onUpdateStudent(updated);
    } else {
      const newStudent: MasterStudent = {
        id: `STU-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        usnOrRollNo: trimmedUsn,
        name: formData.name.trim(),
        batch: formData.batch || '2022-2026',
        currentSemester: Number(formData.currentSemester) || 8,
        admissionYear: Number(formData.admissionYear) || 2022,
        admissionCategory: (formData.admissionCategory as any) || 'Regular',
        academicStatus: (formData.academicStatus as any) || 'Active',
        placementStatus: (formData.placementStatus as any) || 'Placed',
        companyOrInstitutionName: formData.companyOrInstitutionName?.trim() || '-',
        packageLPA: Number(formData.packageLPA) || 0,
        cgpa: Math.min(10, Math.max(0, Number(formData.cgpa) || 0)),
      };
      onAddStudent(newStudent);
    }

    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmStudent) {
      onDeleteStudent(deleteConfirmStudent.id);
      setDeleteConfirmStudent(null);
    }
  };

  const handleInputChange = (field: keyof YearBatchData, value: any) => {
    const updated = { ...currentBatch, [field]: value };
    // Auto calculate totals if passed counts changed
    if (field === 'passedFinalYearWithoutBacklog' || field === 'passedFinalYearWithBacklog') {
      const wOut = field === 'passedFinalYearWithoutBacklog' ? Number(value) : currentBatch.passedFinalYearWithoutBacklog;
      const wBack = field === 'passedFinalYearWithBacklog' ? Number(value) : currentBatch.passedFinalYearWithBacklog;
      updated.totalPassedFinalYear = wOut + wBack;
    }
    // Auto calculate total student strength
    if (field === 'totalStudents2ndYear' || field === 'totalStudents3rdYear' || field === 'totalStudents4thYear') {
      const s2 = field === 'totalStudents2ndYear' ? Number(value) : currentBatch.totalStudents2ndYear;
      const s3 = field === 'totalStudents3rdYear' ? Number(value) : currentBatch.totalStudents3rdYear;
      const s4 = field === 'totalStudents4thYear' ? Number(value) : currentBatch.totalStudents4thYear;
      updated.totalStudentStrength = s2 + s3 + s4;
    }
    onUpdateBatchData(activeBatchKey, updated);
  };

  return (
    <div className="space-y-6">
      {/* Batch Year Switcher (CAY, CAYm1, CAYm2) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            NBA Criterion 4: Student Admissions, Performance & Placement Analytics
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Year-wise batch tracking configured for new colleges. Select an academic year to inspect and edit raw counts.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          {(Object.entries(yearBatchData) as [string, YearBatchData][]).map(([key, batch]) => (
            <button
              key={key}
              onClick={() => setActiveBatchKey(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeBatchKey === key
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {batch.yearLabel}
            </button>
          ))}
        </div>
      </div>

      {/* Year Status Notice */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 text-xs flex items-start gap-3">
        <span className="p-1.5 bg-blue-100 text-blue-800 rounded-lg font-bold flex-shrink-0">
          Status: {currentBatch.status}
        </span>
        <div className="text-slate-700 leading-relaxed">
          <strong>New Program Explanation for NBA Evaluators:</strong> {currentBatch.statusReason}
        </div>
      </div>

      {/* Year-wise Automated Calculation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Student Strength */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Enrolled (2nd + 3rd + 4th Yr)
          </span>
          <div className="mt-2 text-3xl font-extrabold text-slate-900">
            {currentBatch.totalStudentStrength}
          </div>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            Yr2: {currentBatch.totalStudents2ndYear} | Yr3: {currentBatch.totalStudents3rdYear} | Yr4: {currentBatch.totalStudents4thYear}
          </p>
        </div>

        {/* Pass Percentage */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Final Year Pass % [Calculated]
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {currentBatch.appearedFinalYear > 0 ? `${passData.passPercent}%` : 'Pending'}
            </span>
            {currentBatch.appearedFinalYear > 0 && (
              <span className="text-xs text-slate-500">
                ({currentBatch.totalPassedFinalYear}/{currentBatch.appearedFinalYear})
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            {currentBatch.passedFinalYearWithoutBacklog} passed without backlog
          </p>
        </div>

        {/* Placement Index */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Placement & Higher Studies Index
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {currentBatch.eligibleGraduates > 0 ? `${placementData.placementPercent}%` : 'N/A'}
            </span>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
              {placementData.nbaMarks} / 40 Marks
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {currentBatch.placedStudents} Placed • {currentBatch.higherStudiesStudents} Higher Ed • {currentBatch.entrepreneurshipStudents} Startup
          </p>
        </div>

        {/* Median Salary */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Median Package (LPA)
          </span>
          <div className="mt-2 text-3xl font-extrabold text-slate-900">
            {currentBatch.medianSalaryLPA > 0 ? `₹${currentBatch.medianSalaryLPA} LPA` : '-'}
          </div>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            Highest package: ₹8.9 LPA (TCS Digital)
          </p>
        </div>
      </div>

      {/* Raw Data Input Form for Active Year Batch */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
            Raw Admissions, Results & Placements Data for {currentBatch.yearLabel}
          </h3>
          <span className="text-[11px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-semibold border border-blue-200">
            Blue Cells = Enter Raw Numbers (No Formulas)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Column 1: Enrolment */}
          <div className="space-y-3 bg-slate-50/60 p-3.5 rounded-xl border border-slate-100">
            <h4 className="font-bold text-slate-800 border-b border-slate-200 pb-1.5">
              1. Enrolment & Running Batches
            </h4>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Sanctioned Intake</label>
              <input
                type="number"
                value={currentBatch.sanctionedIntake}
                onChange={(e) => handleInputChange('sanctionedIntake', Number(e.target.value))}
                className="w-full px-2.5 py-1.5 bg-blue-50/60 border border-blue-200 rounded-lg text-slate-900 font-bold"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-slate-700 font-medium mb-1">2nd Yr Total</label>
                <input
                  type="number"
                  value={currentBatch.totalStudents2ndYear}
                  onChange={(e) => handleInputChange('totalStudents2ndYear', Number(e.target.value))}
                  className="w-full px-2 py-1.5 bg-blue-50/60 border border-blue-200 rounded-lg text-slate-900 font-medium"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">3rd Yr Total</label>
                <input
                  type="number"
                  value={currentBatch.totalStudents3rdYear}
                  onChange={(e) => handleInputChange('totalStudents3rdYear', Number(e.target.value))}
                  className="w-full px-2 py-1.5 bg-blue-50/60 border border-blue-200 rounded-lg text-slate-900 font-medium"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">4th Yr Total</label>
                <input
                  type="number"
                  value={currentBatch.totalStudents4thYear}
                  onChange={(e) => handleInputChange('totalStudents4thYear', Number(e.target.value))}
                  className="w-full px-2 py-1.5 bg-blue-50/60 border border-blue-200 rounded-lg text-slate-900 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-500 font-medium mb-1">Total Student Strength (S)</label>
              <input
                type="number"
                value={currentBatch.totalStudentStrength}
                disabled
                className="w-full px-2.5 py-1.5 bg-slate-200/80 border border-slate-300 rounded-lg text-slate-800 font-mono font-bold cursor-not-allowed"
              />
            </div>
          </div>

          {/* Column 2: Results & Pass Performance */}
          <div className="space-y-3 bg-slate-50/60 p-3.5 rounded-xl border border-slate-100">
            <h4 className="font-bold text-slate-800 border-b border-slate-200 pb-1.5">
              2. Final Year Examination Results
            </h4>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Appeared in Final Exams</label>
              <input
                type="number"
                value={currentBatch.appearedFinalYear}
                onChange={(e) => handleInputChange('appearedFinalYear', Number(e.target.value))}
                className="w-full px-2.5 py-1.5 bg-blue-50/60 border border-blue-200 rounded-lg text-slate-900 font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Passed (No Backlogs)</label>
                <input
                  type="number"
                  value={currentBatch.passedFinalYearWithoutBacklog}
                  onChange={(e) => handleInputChange('passedFinalYearWithoutBacklog', Number(e.target.value))}
                  className="w-full px-2 py-1.5 bg-blue-50/60 border border-blue-200 rounded-lg text-slate-900 font-medium"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Passed (With Backlogs)</label>
                <input
                  type="number"
                  value={currentBatch.passedFinalYearWithBacklog}
                  onChange={(e) => handleInputChange('passedFinalYearWithBacklog', Number(e.target.value))}
                  className="w-full px-2 py-1.5 bg-blue-50/60 border border-blue-200 rounded-lg text-slate-900 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-500 font-medium mb-1">Total Passed [Auto-Sum]</label>
              <input
                type="number"
                value={currentBatch.totalPassedFinalYear}
                disabled
                className="w-full px-2.5 py-1.5 bg-slate-200/80 border border-slate-300 rounded-lg text-slate-800 font-mono font-bold cursor-not-allowed"
              />
            </div>
          </div>

          {/* Column 3: Placements & Higher Studies */}
          <div className="space-y-3 bg-slate-50/60 p-3.5 rounded-xl border border-slate-100">
            <h4 className="font-bold text-slate-800 border-b border-slate-200 pb-1.5">
              3. Placements & Higher Education
            </h4>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Eligible Graduates</label>
                <input
                  type="number"
                  value={currentBatch.eligibleGraduates}
                  onChange={(e) => handleInputChange('eligibleGraduates', Number(e.target.value))}
                  className="w-full px-2 py-1.5 bg-blue-50/60 border border-blue-200 rounded-lg text-slate-900 font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Students Placed</label>
                <input
                  type="number"
                  value={currentBatch.placedStudents}
                  onChange={(e) => handleInputChange('placedStudents', Number(e.target.value))}
                  className="w-full px-2 py-1.5 bg-blue-50/60 border border-blue-200 rounded-lg text-slate-900 font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Higher Studies</label>
                <input
                  type="number"
                  value={currentBatch.higherStudiesStudents}
                  onChange={(e) => handleInputChange('higherStudiesStudents', Number(e.target.value))}
                  className="w-full px-2 py-1.5 bg-blue-50/60 border border-blue-200 rounded-lg text-slate-900 font-medium"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Start-ups / Entr.</label>
                <input
                  type="number"
                  value={currentBatch.entrepreneurshipStudents}
                  onChange={(e) => handleInputChange('entrepreneurshipStudents', Number(e.target.value))}
                  className="w-full px-2 py-1.5 bg-blue-50/60 border border-blue-200 rounded-lg text-slate-900 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Median Salary (LPA)</label>
              <input
                type="number"
                step="0.1"
                value={currentBatch.medianSalaryLPA}
                onChange={(e) => handleInputChange('medianSalaryLPA', Number(e.target.value))}
                className="w-full px-2.5 py-1.5 bg-blue-50/60 border border-blue-200 rounded-lg text-slate-900 font-medium"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Student Registry Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                Master Student Registry
              </h3>
              <span className="bg-indigo-50 text-indigo-700 text-[11px] font-bold px-2 py-0.5 rounded-full border border-indigo-200">
                {totalFiltered} {totalFiltered === 1 ? 'Student' : 'Students'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Individual student profiles cross-referenced with university enrollment gazettes and placement records.
            </p>

            {/* Quick Cohort Indicators */}
            <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px]">
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md font-medium">
                Placed: <strong>{placedFiltered}</strong>
              </span>
              <span className="bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-md font-medium">
                Higher Studies: <strong>{higherStudiesFiltered}</strong>
              </span>
              <span className="bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded-md font-medium">
                Start-ups: <strong>{entrepreneurFiltered}</strong>
              </span>
              <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-md font-medium">
                Avg CGPA: <strong>{avgCgpaFiltered}</strong>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search USN, name, company..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none w-48 sm:w-56"
              />
            </div>

            {uniqueBatches.length > 0 && (
              <select
                value={filterBatch}
                onChange={(e) => setFilterBatch(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Batches</option>
                {uniqueBatches.map((b) => (
                  <option key={b} value={b}>
                    Batch {b}
                  </option>
                ))}
              </select>
            )}

            <select
              value={filterCareer}
              onChange={(e) => setFilterCareer(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Careers</option>
              <option value="Placed">Placed</option>
              <option value="Higher Studies">Higher Studies</option>
              <option value="Entrepreneurship">Start-up</option>
              <option value="Seeking">Seeking</option>
            </select>

            <button
              onClick={handleOpenAdd}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Student</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-2.5 px-3">USN / Roll No</th>
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3">Batch & Quota</th>
                <th className="py-2.5 px-3 text-center">Semester</th>
                <th className="py-2.5 px-3 text-center">CGPA (Max 10)</th>
                <th className="py-2.5 px-3">Career Status</th>
                <th className="py-2.5 px-3">Company / Institution</th>
                <th className="py-2.5 px-3 text-right">Package (LPA)</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    <p className="font-medium text-xs">No students found matching the selected criteria.</p>
                    <button
                      onClick={handleOpenAdd}
                      className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      + Add a student to this registry
                    </button>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{s.usnOrRollNo}</td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900">{s.name}</div>
                      <div className="text-[10px] text-slate-400">Status: {s.academicStatus}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-medium text-slate-700">{s.batch}</div>
                      <div className="text-[10px] text-slate-400">{s.admissionCategory}</div>
                    </td>
                    <td className="py-2.5 px-3 text-center font-semibold">Sem {s.currentSemester}</td>
                    <td className="py-2.5 px-3 text-center font-mono font-extrabold text-blue-900 bg-blue-50/30">
                      {s.cgpa.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                          s.placementStatus === 'Placed'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : s.placementStatus === 'Higher Studies'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : s.placementStatus === 'Entrepreneurship'
                            ? 'bg-purple-50 text-purple-800 border border-purple-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {s.placementStatus}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-800 font-medium">{s.companyOrInstitutionName}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                      {s.packageLPA > 0 ? `₹${s.packageLPA} LPA` : '-'}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(s)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title={`Edit ${s.name}`}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmStudent(s)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title={`Delete ${s.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  {editingStudent ? <Edit2 className="w-5 h-5" /> : <GraduationCap className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingStudent ? 'Edit Student Record' : 'Add New Student to Registry'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {editingStudent
                      ? `Updating details for ${editingStudent.name} (${editingStudent.usnOrRollNo})`
                      : 'Enter enrollment information and placement details'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmitStudent} className="space-y-4">
              {/* Row 1: USN & Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    USN / University Roll No <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1RV22CS001"
                    value={formData.usnOrRollNo || ''}
                    onChange={(e) => setFormData({ ...formData, usnOrRollNo: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono font-bold focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Student Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ananya Sharma"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              {/* Row 2: Batch, Semester, Admission Year */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Batch</label>
                  <input
                    type="text"
                    placeholder="e.g. 2022-2026"
                    value={formData.batch || ''}
                    onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                    className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Semester</label>
                  <select
                    value={formData.currentSemester || 8}
                    onChange={(e) => setFormData({ ...formData, currentSemester: Number(e.target.value) })}
                    className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <option key={sem} value={sem}>
                        Semester {sem}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Adm. Year</label>
                  <input
                    type="number"
                    value={formData.admissionYear || 2022}
                    onChange={(e) => setFormData({ ...formData, admissionYear: Number(e.target.value) })}
                    className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              {/* Row 3: Quota, Academic Status, CGPA */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Admission Quota</label>
                  <select
                    value={formData.admissionCategory || 'Regular'}
                    onChange={(e) => setFormData({ ...formData, admissionCategory: e.target.value as any })}
                    className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600"
                  >
                    <option value="Regular">Regular</option>
                    <option value="Lateral Entry">Lateral Entry</option>
                    <option value="Govt Quota">Govt Quota</option>
                    <option value="Management">Management</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Academic Status</label>
                  <select
                    value={formData.academicStatus || 'Active'}
                    onChange={(e) => setFormData({ ...formData, academicStatus: e.target.value as any })}
                    className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600"
                  >
                    <option value="Active">Active</option>
                    <option value="Graduated">Graduated</option>
                    <option value="Detained">Detained</option>
                    <option value="Discontinued">Discontinued</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">CGPA (Max 10)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={formData.cgpa ?? 8.0}
                    onChange={(e) => setFormData({ ...formData, cgpa: parseFloat(e.target.value) || 0 })}
                    className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-xl font-mono font-bold focus:outline-none focus:border-blue-600 text-blue-900 bg-blue-50/30"
                  />
                </div>
              </div>

              {/* Row 4: Career Status & Package */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Career / Placement Status</label>
                  <select
                    value={formData.placementStatus || 'Placed'}
                    onChange={(e) => setFormData({ ...formData, placementStatus: e.target.value as any })}
                    className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600"
                  >
                    <option value="Placed">Placed in Industry</option>
                    <option value="Higher Studies">Higher Studies (M.Tech/MS/MBA)</option>
                    <option value="Entrepreneurship">Start-up / Entrepreneurship</option>
                    <option value="Seeking">Seeking Placement</option>
                    <option value="Not Applicable">Not Applicable</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Salary Package (₹ LPA)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="e.g. 8.5"
                    value={formData.packageLPA ?? 0}
                    onChange={(e) => setFormData({ ...formData, packageLPA: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              {/* Row 5: Company / Institution */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Company / Institution / University Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Infosys, TCS, Stanford Univ, Own Venture"
                  value={formData.companyOrInstitutionName || ''}
                  onChange={(e) => setFormData({ ...formData, companyOrInstitutionName: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{editingStudent ? 'Update Student' : 'Save Student Record'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmStudent && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <div className="p-2.5 bg-rose-50 rounded-xl">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Delete Student Record</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete the record for{' '}
              <strong className="text-slate-900">{deleteConfirmStudent.name}</strong> (
              <span className="font-mono text-slate-800 font-semibold">{deleteConfirmStudent.usnOrRollNo}</span>)?
            </p>
            <p className="text-[11px] text-slate-500 mt-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              This will remove this student from Criterion 4 placement registry and batch performance reports.
            </p>

            <div className="flex items-center justify-end gap-2 mt-5">
              <button
                onClick={() => setDeleteConfirmStudent(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Delete Student</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
