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
} from 'lucide-react';
import { MasterStudent, YearBatchData } from '../types/nba';
import { calculatePlacementIndex, calculatePassPercentage } from '../utils/calculations';

interface StudentsTabProps {
  students: MasterStudent[];
  yearBatchData: Record<string, YearBatchData>;
  onUpdateBatchData: (yearKey: string, updated: YearBatchData) => void;
  onAddStudent: (student: MasterStudent) => void;
}

export const StudentsTab: React.FC<StudentsTabProps> = ({
  students,
  yearBatchData,
  onUpdateBatchData,
  onAddStudent,
}) => {
  const [activeBatchKey, setActiveBatchKey] = useState<string>('CAY');
  const [studentSearch, setStudentSearch] = useState('');
  const [filterCareer, setFilterCareer] = useState('all');

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

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.usnOrRollNo.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.companyOrInstitutionName.toLowerCase().includes(studentSearch.toLowerCase());
    const matchesCareer = filterCareer === 'all' || s.placementStatus === filterCareer;
    return matchesSearch && matchesCareer;
  });

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
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Master Student Registry (Sample 1st Batch Students - Batch 2022-2026)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Individual student profiles cross-referenced with university enrollment gazettes and placement records.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by USN or name..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-blue-500"
              />
            </div>
            <select
              value={filterCareer}
              onChange={(e) => setFilterCareer(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-xl"
            >
              <option value="all">All Careers</option>
              <option value="Placed">Placed</option>
              <option value="Higher Studies">Higher Studies</option>
              <option value="Entrepreneurship">Start-up</option>
              <option value="Seeking">Seeking</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-2.5 px-3">USN / Roll No</th>
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3">Admission Quota</th>
                <th className="py-2.5 px-3 text-center">Semester</th>
                <th className="py-2.5 px-3 text-center">CGPA (Max 10)</th>
                <th className="py-2.5 px-3">Career Status</th>
                <th className="py-2.5 px-3">Company / Institution</th>
                <th className="py-2.5 px-3 text-right">Package (LPA)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredStudents.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/70">
                  <td className="py-2 px-3 font-mono font-medium text-slate-500">{s.usnOrRollNo}</td>
                  <td className="py-2 px-3 font-bold text-slate-900">{s.name}</td>
                  <td className="py-2 px-3">{s.admissionCategory}</td>
                  <td className="py-2 px-3 text-center font-semibold">Sem {s.currentSemester}</td>
                  <td className="py-2 px-3 text-center font-mono font-extrabold text-blue-900 bg-blue-50/30">
                    {s.cgpa.toFixed(2)}
                  </td>
                  <td className="py-2 px-3">
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
                  <td className="py-2 px-3 text-slate-800 font-medium">{s.companyOrInstitutionName}</td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                    {s.packageLPA > 0 ? `₹${s.packageLPA} LPA` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
