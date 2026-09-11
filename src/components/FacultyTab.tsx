import React, { useState, useRef, useEffect } from 'react';
import {
  Users,
  Plus,
  Search,
  BookOpen,
  Award,
  DollarSign,
  TrendingUp,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Printer,
  FileText,
  CheckSquare,
  Square,
  Layers,
} from 'lucide-react';
import { MasterFaculty, YearBatchData, InstitutionMaster, CourseInfo } from '../types/nba';
import {
  calculateSFR,
  calculateFacultyQualificationPoints,
  calculateCadreRatio,
} from '../utils/calculations';

interface FacultyTabProps {
  facultyList: MasterFaculty[];
  batchCAY: YearBatchData;
  institution?: InstitutionMaster;
  courses?: CourseInfo[];
  onAddFaculty: (faculty: MasterFaculty) => void;
  onUpdateFaculty: (faculty: MasterFaculty) => void;
  onDeleteFaculty: (id: string) => void;
  onOpenFacultyPdf?: (faculty: MasterFaculty) => void;
  onOpenFacultyBulkPdf?: (faculties: MasterFaculty[]) => void;
}

export const FacultyTab: React.FC<FacultyTabProps> = ({
  facultyList,
  batchCAY,
  institution,
  courses,
  onAddFaculty,
  onUpdateFaculty,
  onDeleteFaculty,
  onOpenFacultyPdf,
  onOpenFacultyBulkPdf,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDesignation, setFilterDesignation] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<MasterFaculty | null>(null);
  const [selectedFacultyIds, setSelectedFacultyIds] = useState<string[]>([]);

  const headerCheckboxRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<MasterFaculty>>({
    empId: '',
    name: '',
    designation: 'Assistant Professor',
    qualification: 'M.Tech / M.E.',
    specialization: '',
    department: 'Computer Science & Engineering',
    dateOfJoining: new Date().toISOString().split('T')[0],
    teachingExperienceYears: 3,
    industryExperienceYears: 0,
    isRegular: true,
    status: 'Completed',
    researchPublicationsCount: 0,
    fdpAttendedCount: 2,
    sponsoredProjectsAmountLakhs: 0,
    consultancyAmountLakhs: 0,
  });

  // Derived Calculations
  const sfrData = calculateSFR(batchCAY.totalStudentStrength, facultyList.length);
  const phdCount = facultyList.filter((f) => f.qualification === 'Ph.D.').length;
  const mtechCount = facultyList.filter((f) => f.qualification.includes('M.Tech')).length;
  const fqData = calculateFacultyQualificationPoints(phdCount, mtechCount, facultyList.length);

  const profCount = facultyList.filter((f) => f.designation === 'Professor').length;
  const assocCount = facultyList.filter((f) => f.designation === 'Associate Professor').length;
  const asstCount = facultyList.filter((f) => f.designation === 'Assistant Professor').length;
  const cadreData = calculateCadreRatio(profCount, assocCount, asstCount, facultyList.length);

  const totalPublications = facultyList.reduce((acc, f) => acc + f.researchPublicationsCount, 0);
  const totalGrants = facultyList.reduce((acc, f) => acc + f.sponsoredProjectsAmountLakhs, 0);
  const totalConsultancy = facultyList.reduce((acc, f) => acc + f.consultancyAmountLakhs, 0);

  const filteredFaculty = facultyList.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.empId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDesig = filterDesignation === 'all' || f.designation === filterDesignation;
    return matchesSearch && matchesDesig;
  });

  // Multi-Selection State & Controls
  const allFilteredSelected =
    filteredFaculty.length > 0 &&
    filteredFaculty.every((f) => selectedFacultyIds.includes(f.id));
  const someFilteredSelected =
    filteredFaculty.some((f) => selectedFacultyIds.includes(f.id)) && !allFilteredSelected;

  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = someFilteredSelected;
    }
  }, [someFilteredSelected]);

  const toggleSelectAllFiltered = () => {
    if (allFilteredSelected) {
      const filteredIdSet = new Set(filteredFaculty.map((f) => f.id));
      setSelectedFacultyIds((prev) => prev.filter((id) => !filteredIdSet.has(id)));
    } else {
      const newIds = new Set([...selectedFacultyIds, ...filteredFaculty.map((f) => f.id)]);
      setSelectedFacultyIds(Array.from(newIds));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedFacultyIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedFacultyIds(facultyList.map((f) => f.id));
  };

  const handleDeselectAll = () => {
    setSelectedFacultyIds([]);
  };

  const handleSelectPhdOnly = () => {
    setSelectedFacultyIds(facultyList.filter((f) => f.qualification === 'Ph.D.').map((f) => f.id));
  };

  const handleSelectProfessorsOnly = () => {
    setSelectedFacultyIds(
      facultyList
        .filter((f) => f.designation === 'Professor' || f.designation === 'Associate Professor')
        .map((f) => f.id)
    );
  };

  const handleTriggerBulkExport = () => {
    const selectedList = facultyList.filter((f) => selectedFacultyIds.includes(f.id));
    const targetList = selectedList.length > 0 ? selectedList : filteredFaculty;
    if (onOpenFacultyBulkPdf) {
      onOpenFacultyBulkPdf(targetList);
    } else if (onOpenFacultyPdf && targetList.length > 0) {
      onOpenFacultyPdf(targetList[0]);
    }
  };

  const handleOpenAdd = () => {
    setEditingFaculty(null);
    setFormData({
      empId: `EMP-CSE-00${facultyList.length + 1}`,
      name: '',
      designation: 'Assistant Professor',
      qualification: 'M.Tech / M.E.',
      specialization: '',
      department: 'Computer Science & Engineering',
      dateOfJoining: new Date().toISOString().split('T')[0],
      teachingExperienceYears: 3.0,
      industryExperienceYears: 0.0,
      isRegular: true,
      status: 'Completed',
      researchPublicationsCount: 1,
      fdpAttendedCount: 2,
      sponsoredProjectsAmountLakhs: 0.0,
      consultancyAmountLakhs: 0.0,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (fac: MasterFaculty) => {
    setEditingFaculty(fac);
    setFormData({ ...fac });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const teaching = Number(formData.teachingExperienceYears) || 0;
    const industry = Number(formData.industryExperienceYears) || 0;
    const total = teaching + industry;

    if (editingFaculty) {
      onUpdateFaculty({
        ...(editingFaculty as MasterFaculty),
        ...formData,
        teachingExperienceYears: teaching,
        industryExperienceYears: industry,
        totalExperience: total,
      } as MasterFaculty);
    } else {
      const newFac: MasterFaculty = {
        id: `FAC-${Date.now()}`,
        empId: formData.empId || `EMP-${Date.now()}`,
        name: formData.name || 'New Faculty Member',
        designation: formData.designation || 'Assistant Professor',
        qualification: formData.qualification || 'M.Tech / M.E.',
        specialization: formData.specialization || 'Computer Science',
        department: formData.department || 'Computer Science & Engineering',
        dateOfJoining: formData.dateOfJoining || new Date().toISOString().split('T')[0],
        teachingExperienceYears: teaching,
        industryExperienceYears: industry,
        totalExperience: total,
        isRegular: formData.isRegular !== false,
        status: 'Completed',
        researchPublicationsCount: Number(formData.researchPublicationsCount) || 0,
        fdpAttendedCount: Number(formData.fdpAttendedCount) || 0,
        sponsoredProjectsAmountLakhs: Number(formData.sponsoredProjectsAmountLakhs) || 0,
        consultancyAmountLakhs: Number(formData.consultancyAmountLakhs) || 0,
        cadreWeight: 1,
      };
      onAddFaculty(newFac);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* KPI & Automatic Calculation Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Student-Faculty Ratio */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              SFR & Tier-II Marks
            </span>
            <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
              Formula Auto
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{sfrData.sfrFormatted}</span>
            <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
              {sfrData.marksAwarded} / 20 Marks
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">{sfrData.statusText}</p>
        </div>

        {/* Cadre Ratio */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Cadre Ratio (P : ASP : AP)
            </span>
            <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
              Formula Auto
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">
              {profCount} : {assocCount} : {asstCount}
            </span>
            <span className="text-xs text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded-full">
              {cadreData.cadreMarks} / 20 Marks
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">{cadreData.cadreString}</p>
        </div>

        {/* Faculty Qualification (FQ) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Faculty Qualification (FQ)
            </span>
            <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
              Formula Auto
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{fqData.fqPoints}</span>
            <span className="text-xs text-slate-500">/ 20 Points</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {phdCount} Ph.D. ({Math.round((phdCount / facultyList.length) * 100)}%) • {mtechCount} M.Tech
          </p>
        </div>

        {/* Research & Grants Summary */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Research & Grants
            </span>
            <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
              Formula Auto
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{totalPublications}</span>
            <span className="text-xs text-slate-500">Papers in Scopus/WoS</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Grants: ₹{totalGrants.toFixed(1)}L • Consultancy: ₹{totalConsultancy.toFixed(1)}L
          </p>
        </div>
      </div>

      {/* Faculty Master Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Controls */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search faculty by name, specialization, or Emp ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-blue-500 text-slate-800"
              />
            </div>
            <select
              value={filterDesignation}
              onChange={(e) => setFilterDesignation(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-700"
            >
              <option value="all">All Cadres</option>
              <option value="Professor">Professors</option>
              <option value="Associate Professor">Associate Professors</option>
              <option value="Assistant Professor">Assistant Professors</option>
            </select>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            {(onOpenFacultyBulkPdf || onOpenFacultyPdf) && (
              <button
                type="button"
                onClick={handleTriggerBulkExport}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                title={
                  selectedFacultyIds.length > 0
                    ? `Export combined paginated PDF dossier for ${selectedFacultyIds.length} selected profiles`
                    : 'Export combined paginated PDF dossier for all faculty profiles'
                }
              >
                <Printer className="w-4 h-4 text-indigo-400" />
                <span>
                  {selectedFacultyIds.length > 0
                    ? `Bulk Export (${selectedFacultyIds.length}) (PDF)`
                    : 'Bulk Export All (PDF)'}
                </span>
              </button>
            )}

            <button
              onClick={handleOpenAdd}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Faculty Member</span>
            </button>
          </div>
        </div>

        {/* Bulk Selection Action Ribbon */}
        {selectedFacultyIds.length > 0 && (
          <div className="bg-blue-50/90 border-b border-blue-200 px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-blue-950 flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-blue-600" />
                {selectedFacultyIds.length} of {facultyList.length} faculty selected
              </span>
              <span className="text-blue-300">|</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-[11px] font-semibold text-blue-700 hover:text-blue-900 underline"
                >
                  Select All ({facultyList.length})
                </button>
                <button
                  type="button"
                  onClick={handleSelectPhdOnly}
                  className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 underline ml-1.5"
                >
                  Only Ph.D. ({facultyList.filter((f) => f.qualification === 'Ph.D.').length})
                </button>
                <button
                  type="button"
                  onClick={handleSelectProfessorsOnly}
                  className="text-[11px] font-semibold text-indigo-700 hover:text-indigo-900 underline ml-1.5"
                >
                  Professors ({facultyList.filter((f) => f.designation.includes('Professor')).length})
                </button>
                <button
                  type="button"
                  onClick={handleDeselectAll}
                  className="text-[11px] font-medium text-slate-500 hover:text-slate-800 ml-1.5"
                >
                  Clear Selection
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTriggerBulkExport}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                title="Generate combined paginated PDF report for selected profiles"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Generate Combined PDF ({selectedFacultyIds.length} Profiles)</span>
              </button>
            </div>
          </div>
        )}

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-3 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    ref={headerCheckboxRef}
                    checked={allFilteredSelected}
                    onChange={toggleSelectAllFiltered}
                    className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                    title={allFilteredSelected ? 'Deselect all visible faculty' : 'Select all visible faculty'}
                  />
                </th>
                <th className="py-3 px-3">Emp ID</th>
                <th className="py-3 px-3">Faculty Name</th>
                <th className="py-3 px-3">Designation [Input]</th>
                <th className="py-3 px-3">Qualification [Input]</th>
                <th className="py-3 px-3">Specialization [Input]</th>
                <th className="py-3 px-3 text-center">Teaching Exp (Yrs) [Input]</th>
                <th className="py-3 px-3 text-center">Industry Exp (Yrs) [Input]</th>
                <th className="py-3 px-3 text-center bg-slate-100 font-bold text-slate-900 border-x border-slate-200">
                  Total Exp [Formula]
                </th>
                <th className="py-3 px-3 text-center">Papers [Input]</th>
                <th className="py-3 px-3 text-center">Grants (₹L) [Input]</th>
                <th className="py-3 px-3 text-center">Validation Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredFaculty.map((fac) => {
                const totalExp = fac.teachingExperienceYears + fac.industryExperienceYears;
                const isPhd = fac.qualification === 'Ph.D.';
                const isSelected = selectedFacultyIds.includes(fac.id);

                return (
                  <tr
                    key={fac.id}
                    className={`transition-colors ${
                      isSelected ? 'bg-blue-50/70' : 'hover:bg-slate-50/70'
                    }`}
                  >
                    {/* Selection Checkbox */}
                    <td className="py-2.5 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(fac.id)}
                        className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                      />
                    </td>

                    {/* Emp ID */}
                    <td className="py-2.5 px-3 font-mono font-medium text-slate-500 whitespace-nowrap">
                      {fac.empId}
                    </td>

                    {/* Name */}
                    <td className="py-2.5 px-3 font-bold text-slate-900 whitespace-nowrap">
                      {fac.name}
                    </td>

                    {/* Designation (Blue Badge) */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${
                          fac.designation === 'Professor'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : fac.designation === 'Associate Professor'
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        {fac.designation}
                      </span>
                    </td>

                    {/* Qualification */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                          isPhd
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {fac.qualification}
                      </span>
                    </td>

                    {/* Specialization */}
                    <td className="py-2.5 px-3 text-slate-600 max-w-xs truncate">
                      {fac.specialization}
                    </td>

                    {/* Teaching Exp (Input) */}
                    <td className="py-2.5 px-3 text-center font-mono font-medium text-blue-900 bg-blue-50/40">
                      {fac.teachingExperienceYears.toFixed(1)}
                    </td>

                    {/* Industry Exp (Input) */}
                    <td className="py-2.5 px-3 text-center font-mono font-medium text-blue-900 bg-blue-50/40">
                      {fac.industryExperienceYears.toFixed(1)}
                    </td>

                    {/* Total Exp (Grey Formula Cell) */}
                    <td className="py-2.5 px-3 text-center font-mono font-extrabold text-slate-900 bg-slate-100/90 border-x border-slate-200">
                      {totalExp.toFixed(1)}
                    </td>

                    {/* Papers */}
                    <td className="py-2.5 px-3 text-center font-semibold text-slate-800">
                      {fac.researchPublicationsCount}
                    </td>

                    {/* Grants */}
                    <td className="py-2.5 px-3 text-center font-mono text-slate-700">
                      {fac.sponsoredProjectsAmountLakhs > 0
                        ? `₹${fac.sponsoredProjectsAmountLakhs.toFixed(1)}L`
                        : '-'}
                    </td>

                    {/* Status */}
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        Complete
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {onOpenFacultyPdf && (
                          <button
                            onClick={() => onOpenFacultyPdf(fac)}
                            className="p-1 hover:bg-blue-100 rounded text-blue-600 transition-colors"
                            title={`Export ${fac.name} Profile Sheet (PDF)`}
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEdit(fac)}
                          className="p-1 hover:bg-slate-200 rounded text-slate-600 transition-colors"
                          title="Edit Faculty Record"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteFaculty(fac.id)}
                          className="p-1 hover:bg-rose-100 rounded text-rose-600 transition-colors"
                          title="Delete Faculty Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog for Add/Edit Faculty */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-xl space-y-4 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">
              {editingFaculty ? 'Edit Faculty Record' : 'Add New Faculty Member'}
            </h3>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Employee ID</label>
                  <input
                    type="text"
                    value={formData.empId}
                    onChange={(e) => setFormData({ ...formData, empId: e.target.value })}
                    className="w-full px-3 py-1.5 bg-blue-50/50 border border-blue-200 rounded-lg text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Faculty Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-1.5 bg-blue-50/50 border border-blue-200 rounded-lg text-slate-900"
                    placeholder="e.g. Dr. Jane Doe"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Designation</label>
                  <select
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value as any })}
                    className="w-full px-3 py-1.5 bg-blue-50/50 border border-blue-200 rounded-lg text-slate-900"
                  >
                    <option value="Professor">Professor</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Assistant Professor">Assistant Professor</option>
                    <option value="Adjunct Faculty">Adjunct Faculty</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Qualification</label>
                  <select
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value as any })}
                    className="w-full px-3 py-1.5 bg-blue-50/50 border border-blue-200 rounded-lg text-slate-900"
                  >
                    <option value="Ph.D.">Ph.D.</option>
                    <option value="M.Tech / M.E.">M.Tech / M.E.</option>
                    <option value="B.Tech / B.E.">B.Tech / B.E.</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Specialization / Domain</label>
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="w-full px-3 py-1.5 bg-blue-50/50 border border-blue-200 rounded-lg text-slate-900"
                  placeholder="e.g. Artificial Intelligence, Distributed Systems"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Teaching Exp (Years)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={formData.teachingExperienceYears}
                    onChange={(e) => setFormData({ ...formData, teachingExperienceYears: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-blue-50/50 border border-blue-200 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Industry Exp (Years)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={formData.industryExperienceYears}
                    onChange={(e) => setFormData({ ...formData, industryExperienceYears: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-blue-50/50 border border-blue-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Scopus/WoS Papers Count</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.researchPublicationsCount}
                    onChange={(e) => setFormData({ ...formData, researchPublicationsCount: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-blue-50/50 border border-blue-200 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Sponsored Grants (₹ Lakhs)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.sponsoredProjectsAmountLakhs}
                    onChange={(e) => setFormData({ ...formData, sponsoredProjectsAmountLakhs: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-blue-50/50 border border-blue-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-3.5 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-4 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-xs"
              >
                {editingFaculty ? 'Update Faculty' : 'Save to Master Database'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
