import React, { useState } from 'react';
import {
  FolderCheck,
  BookOpen,
  FileText,
  CheckCircle2,
  AlertCircle,
  Download,
  ExternalLink,
  Users,
  Award,
} from 'lucide-react';
import { CourseInfo, CourseFileChecklist } from '../types/nba';

interface CourseFileTabProps {
  courses: CourseInfo[];
  courseFiles: CourseFileChecklist[];
  onUpdateFileStatus: (courseCode: string, itemKey: string, status: 'Verified' | 'Uploaded' | 'Pending') => void;
}

export const CourseFileTab: React.FC<CourseFileTabProps> = ({
  courses,
  courseFiles,
  onUpdateFileStatus,
}) => {
  const [selectedCourseCode, setSelectedCourseCode] = useState<string>(courses[0]?.courseCode || 'CS301');

  const activeCourse = courses.find((c) => c.courseCode === selectedCourseCode) || courses[0];
  const activeCourseFiles = courseFiles.filter((cf) => cf.courseCode === selectedCourseCode);

  const verifiedCount = activeCourseFiles.filter((cf) => cf.status === 'Verified').length;
  const totalCount = activeCourseFiles.length;
  const completionPercent = totalCount > 0 ? Math.round((verifiedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header & Course Switcher */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FolderCheck className="w-5 h-5 text-indigo-600" />
            NBA Standard Course File & Teaching-Learning Automation (Criteria 2 & 3)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Standard 15-section NBA Course File binder compliant with Tier-II NBA Visiting Committee audit guidelines.
          </p>
        </div>

        {/* Course Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Course:</span>
          <select
            value={selectedCourseCode}
            onChange={(e) => setSelectedCourseCode(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.courseCode}>
                {c.courseCode} - {c.courseName} (Sem {c.semester})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Course Profile Card */}
      {activeCourse && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-md border border-indigo-200">
                {activeCourse.courseCode}
              </span>
              <span className="text-xs font-medium text-slate-500">
                Category: {activeCourse.category} • Semester {activeCourse.semester} • Credits: {activeCourse.credits} ({activeCourse.lectureHoursPerWeek}-{activeCourse.tutorialHoursPerWeek}-{activeCourse.practicalHoursPerWeek})
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              {activeCourse.courseName}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Course Instructor: <strong className="text-slate-800">{activeCourse.facultyInCharge}</strong> • Academic Year: 2024-25 (Odd Semester)
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200 self-stretch lg:self-auto justify-between lg:justify-end">
            <div>
              <div className="text-[11px] text-slate-500 font-semibold uppercase">Course File Audit</div>
              <div className="text-base font-extrabold text-slate-900">
                {verifiedCount} of {totalCount} Sections
              </div>
            </div>
            <div className="text-right">
              <span
                className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold ${
                  completionPercent === 100
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {completionPercent}% Complete
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 15-Section Standard NBA Course File Checklist */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Mandatory NBA Course File Artifacts Checklist
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Every section must be updated and cross-signed by the course coordinator and Module Coordinator prior to peer inspection.
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {activeCourseFiles.map((cf) => (
            <div
              key={cf.id}
              className="p-4 sm:p-4.5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-slate-100 font-mono font-bold text-slate-600 flex items-center justify-center text-[11px] flex-shrink-0 mt-0.5">
                  {cf.sectionNumber}
                </span>

                <div>
                  <h4 className="font-bold text-slate-900">{cf.title}</h4>
                  <p className="text-slate-500 mt-0.5">{cf.description}</p>
                  <div className="mt-1 flex items-center gap-2 text-[11px] font-mono text-slate-400">
                    <span>Archive Reference: {cf.fileReference}</span>
                    <span>•</span>
                    <span>Last Updated: {cf.lastUpdated}</span>
                  </div>
                </div>
              </div>

              {/* Status Selector */}
              <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                <select
                  value={cf.status}
                  onChange={(e) =>
                    onUpdateFileStatus(cf.courseCode, cf.id, e.target.value as any)
                  }
                  className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${
                    cf.status === 'Verified'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : cf.status === 'Uploaded'
                      ? 'bg-blue-50 text-blue-800 border-blue-300'
                      : 'bg-rose-50 text-rose-800 border-rose-300'
                  }`}
                >
                  <option value="Verified">✓ Verified by HOD</option>
                  <option value="Uploaded">Uploaded (In Review)</option>
                  <option value="Pending">Pending Upload</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
