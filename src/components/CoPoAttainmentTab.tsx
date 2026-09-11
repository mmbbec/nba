import React, { useState } from 'react';
import {
  Target,
  BarChart3,
  Sliders,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Award,
  RefreshCw,
} from 'lucide-react';
import {
  AttainmentConfig,
  CourseOutcomeDef,
  ProgramOutcomeDef,
  ProgramSpecificOutcomeDef,
  StudentMarkEntry,
} from '../types/nba';
import {
  calculateClassCOAttainment,
  calculatePOAttainmentForCourse,
  evaluateStudentMarks,
} from '../utils/calculations';

interface CoPoAttainmentTabProps {
  config: AttainmentConfig;
  courseOutcomes: CourseOutcomeDef[];
  programOutcomes: ProgramOutcomeDef[];
  programSpecificOutcomes: ProgramSpecificOutcomeDef[];
  studentMarks: StudentMarkEntry[];
  onUpdateStudentMarks: (updated: StudentMarkEntry[]) => void;
  onUpdateCourseOutcomes: (updated: CourseOutcomeDef[]) => void;
}

export const CoPoAttainmentTab: React.FC<CoPoAttainmentTabProps> = ({
  config,
  courseOutcomes,
  programOutcomes,
  programSpecificOutcomes,
  studentMarks,
  onUpdateStudentMarks,
  onUpdateCourseOutcomes,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'co-calculator' | 'po-matrix' | 'gap-analysis'>('co-calculator');
  const [selectedCoCode, setSelectedCoCode] = useState<string>('CO1');

  // Automatic class attainment for the selected CO
  const classStats = calculateClassCOAttainment(studentMarks, config);

  // Quick mark editing
  const handleMarkChange = (index: number, field: keyof StudentMarkEntry, value: number) => {
    const next = [...studentMarks];
    next[index] = { ...next[index], [field]: value };
    onUpdateStudentMarks(next);
  };

  // PO Attainment computed for the course
  const poAttainmentSummary = programOutcomes.map((po) => {
    const result = calculatePOAttainmentForCourse(courseOutcomes, po.code);
    const gap = Math.round((result.attainment - po.targetLevel) * 100) / 100;
    return {
      po,
      attainment: result.attainment,
      mappedCOCount: result.mappedCOCount,
      target: po.targetLevel,
      gap,
      isAttained: result.attainment >= po.targetLevel,
    };
  });

  const psoAttainmentSummary = programSpecificOutcomes.map((pso) => {
    let weightedSum = 0;
    let totalWeight = 0;
    let mappedCount = 0;
    courseOutcomes.forEach((co) => {
      const w = co.psoMapping[pso.code] || 0;
      if (w > 0) {
        weightedSum += co.overallAttainment * w;
        totalWeight += w;
        mappedCount++;
      }
    });
    const attainment = totalWeight > 0 ? Math.round((weightedSum / totalWeight) * 100) / 100 : 0;
    const gap = Math.round((attainment - pso.targetLevel) * 100) / 100;
    return {
      pso,
      attainment,
      mappedCOCount: mappedCount,
      target: pso.targetLevel,
      gap,
      isAttained: attainment >= pso.targetLevel,
    };
  });

  return (
    <div className="space-y-6">
      {/* Header & Subtabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            NBA Criterion 3: Course & Program Outcome Attainment Engine
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated calculations for Direct ({Math.round(config.directWeightage * 100)}%) & Indirect ({Math.round(config.indirectWeightage * 100)}%) Attainments, CO-PO mapping matrix, and target gap analysis.
          </p>
        </div>

        {/* Subtab Navigator */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs">
          <button
            onClick={() => setActiveSubTab('co-calculator')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeSubTab === 'co-calculator'
                ? 'bg-white text-blue-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1. CO Marks & Direct Attainment
          </button>
          <button
            onClick={() => setActiveSubTab('po-matrix')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeSubTab === 'po-matrix'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            2. CO-PO / PSO Mapping Matrix
          </button>
          <button
            onClick={() => setActiveSubTab('gap-analysis')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeSubTab === 'gap-analysis'
                ? 'bg-white text-emerald-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            3. PO Attainment & Gap Analysis
          </button>
        </div>
      </div>

      {/* SUBTAB 1: CO CALCULATOR */}
      {activeSubTab === 'co-calculator' && (
        <div className="space-y-6">
          {/* Active Configuration Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 text-xs flex flex-wrap items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <span className="p-1.5 bg-blue-600 text-white rounded-lg font-bold">
                Formula Rule Active
              </span>
              <span className="text-blue-950 font-medium">
                Benchmark: Student must score ≥ <strong>{config.thresholdPercent}%</strong> marks. Attainment Level: Level 3 (≥{config.level3MinPercentage}% class), Level 2 (≥{config.level2MinPercentage}%), Level 1 (≥{config.level1MinPercentage}%).
              </span>
            </div>
            <div className="font-mono text-blue-900 font-bold bg-white/80 px-2.5 py-1 rounded-lg border border-blue-200">
              Overall CO = (Direct × {config.directWeightage}) + (Indirect × {config.indirectWeightage})
            </div>
          </div>

          {/* Attainment Result Cards for Current Course */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Students Attaining Threshold
              </span>
              <div className="mt-2 text-3xl font-extrabold text-slate-900">
                {classStats.percentageAttained}%
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                {classStats.studentsAttainedCount} of {classStats.totalStudents} students scored ≥ {config.thresholdPercent}%
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Direct Attainment Level (0-3)
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-blue-700">
                  {classStats.directAttainmentLevel}
                </span>
                <span className="text-xs text-slate-400 font-medium">/ 3.0 Scale</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Derived from CIE (30%) + SEE (70%)
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Indirect Attainment (Survey)
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-purple-700">
                  {classStats.indirectAttainmentLevel}
                </span>
                <span className="text-xs text-slate-400 font-medium">/ 3.0 Scale</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Avg survey score: {classStats.averageSurveyScore} / 5.0
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Overall CO Attainment
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-emerald-700">
                  {classStats.overallAttainmentLevel}
                </span>
                <span className="text-xs text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Target: {config.targetAttainmentLevel}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Status: {classStats.overallAttainmentLevel >= config.targetAttainmentLevel ? '✓ Target Achieved' : 'Remedial Required'}
              </p>
            </div>
          </div>

          {/* Raw Student Marksheet Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Course Marks Entry: CS301 - Data Structures and Algorithms
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enter student marks in <strong className="text-blue-700">Blue Cells</strong>. All scores, percentages, threshold determinations, and attainment levels calculate automatically in <strong className="text-slate-800">Grey Cells</strong>.
                </p>
              </div>

              <div className="text-xs font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                10 Students Enrolled (Sample Section A)
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 text-[11px] uppercase tracking-wider font-semibold">
                    <th className="py-2.5 px-3">USN</th>
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3 text-center bg-blue-50/60 text-blue-950">
                      CIE 1 (Max 30) [Input]
                    </th>
                    <th className="py-2.5 px-3 text-center bg-blue-50/60 text-blue-950">
                      CIE 2 (Max 30) [Input]
                    </th>
                    <th className="py-2.5 px-3 text-center bg-blue-50/60 text-blue-950">
                      Assign (Max 20) [Input]
                    </th>
                    <th className="py-2.5 px-3 text-center bg-slate-100 font-mono font-bold text-slate-900">
                      CIE Total (80) [Formula]
                    </th>
                    <th className="py-2.5 px-3 text-center bg-blue-50/60 text-blue-950">
                      SEE Exam (100) [Input]
                    </th>
                    <th className="py-2.5 px-3 text-center bg-slate-100 font-mono font-bold text-slate-900">
                      Combined Score % [Formula]
                    </th>
                    <th className="py-2.5 px-3 text-center">
                      Attained (≥ {config.thresholdPercent}%)?
                    </th>
                    <th className="py-2.5 px-3 text-center bg-purple-50/60 text-purple-950">
                      Survey (1-5) [Input]
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {studentMarks.map((m, idx) => {
                    const evalRes = evaluateStudentMarks(m, config);
                    const cieTotal = m.cie1 + m.cie2 + m.assignment;

                    return (
                      <tr key={m.studentId} className="hover:bg-slate-50/70">
                        <td className="py-2 px-3 font-mono font-medium text-slate-500">
                          {m.usn}
                        </td>
                        <td className="py-2 px-3 font-bold text-slate-900">
                          {m.studentName}
                        </td>

                        {/* CIE 1 Input */}
                        <td className="py-1.5 px-2 text-center bg-blue-50/30">
                          <input
                            type="number"
                            min="0"
                            max="30"
                            value={m.cie1}
                            onChange={(e) => handleMarkChange(idx, 'cie1', Number(e.target.value))}
                            className="w-16 px-1.5 py-1 text-center bg-white border border-blue-200 rounded font-bold text-blue-900"
                          />
                        </td>

                        {/* CIE 2 Input */}
                        <td className="py-1.5 px-2 text-center bg-blue-50/30">
                          <input
                            type="number"
                            min="0"
                            max="30"
                            value={m.cie2}
                            onChange={(e) => handleMarkChange(idx, 'cie2', Number(e.target.value))}
                            className="w-16 px-1.5 py-1 text-center bg-white border border-blue-200 rounded font-bold text-blue-900"
                          />
                        </td>

                        {/* Assignment Input */}
                        <td className="py-1.5 px-2 text-center bg-blue-50/30">
                          <input
                            type="number"
                            min="0"
                            max="20"
                            value={m.assignment}
                            onChange={(e) => handleMarkChange(idx, 'assignment', Number(e.target.value))}
                            className="w-16 px-1.5 py-1 text-center bg-white border border-blue-200 rounded font-bold text-blue-900"
                          />
                        </td>

                        {/* CIE Total Formula */}
                        <td className="py-2 px-3 text-center font-mono font-bold text-slate-800 bg-slate-100/80">
                          {cieTotal} / 80
                        </td>

                        {/* SEE Exam Input */}
                        <td className="py-1.5 px-2 text-center bg-blue-50/30">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={m.seeMarks}
                            onChange={(e) => handleMarkChange(idx, 'seeMarks', Number(e.target.value))}
                            className="w-16 px-1.5 py-1 text-center bg-white border border-blue-200 rounded font-bold text-blue-900"
                          />
                        </td>

                        {/* Combined Score Formula */}
                        <td className="py-2 px-3 text-center font-mono font-extrabold text-slate-900 bg-slate-100/80">
                          {evalRes.combinedPercent}%
                        </td>

                        {/* Attainment Determination */}
                        <td className="py-2 px-3 text-center">
                          {evalRes.hasAttainedThreshold ? (
                            <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              ✓ Attained
                            </span>
                          ) : (
                            <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                              ✗ Not Attained
                            </span>
                          )}
                        </td>

                        {/* Course Survey Score Input */}
                        <td className="py-1.5 px-2 text-center bg-purple-50/30">
                          <input
                            type="number"
                            step="0.1"
                            min="1"
                            max="5"
                            value={m.courseEndSurveyScore}
                            onChange={(e) => handleMarkChange(idx, 'courseEndSurveyScore', Number(e.target.value))}
                            className="w-14 px-1 py-1 text-center bg-white border border-purple-200 rounded font-bold text-purple-900"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: CO-PO MATRIX */}
      {activeSubTab === 'po-matrix' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900">
              CO-PO and CO-PSO Articulation Matrix for CS301
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Mapping Levels: <strong className="text-slate-800">1 = Low (Slight)</strong>, <strong className="text-slate-800">2 = Medium (Moderate)</strong>, <strong className="text-slate-800">3 = High (Substantial)</strong>. Empty cell denotes unmapped.
            </p>

            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 text-[11px] uppercase tracking-wider font-semibold">
                    <th className="py-2.5 px-3">CO Code</th>
                    <th className="py-2.5 px-3">Bloom Tax.</th>
                    <th className="py-2.5 px-3 max-w-sm">Course Outcome Description</th>
                    <th className="py-2.5 px-2 text-center bg-emerald-50 text-emerald-950 font-bold">Attainment</th>
                    {programOutcomes.map((po) => (
                      <th key={po.code} className="py-2.5 px-1.5 text-center font-mono">
                        {po.code}
                      </th>
                    ))}
                    {programSpecificOutcomes.map((pso) => (
                      <th key={pso.code} className="py-2.5 px-1.5 text-center font-mono bg-indigo-50/50">
                        {pso.code}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {courseOutcomes.map((co) => (
                    <tr key={co.id} className="hover:bg-slate-50/70">
                      <td className="py-2 px-3 font-bold text-slate-900 font-mono">{co.coCode}</td>
                      <td className="py-2 px-3">
                        <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-semibold">
                          {co.bloomLevel}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-slate-600 max-w-sm">{co.description}</td>
                      <td className="py-2 px-2 text-center font-mono font-extrabold text-emerald-800 bg-emerald-50/50">
                        {co.overallAttainment.toFixed(2)}
                      </td>

                      {/* PO Mappings */}
                      {programOutcomes.map((po) => {
                        const val = co.poMapping[po.code] || 0;
                        return (
                          <td key={po.code} className="py-2 px-1.5 text-center font-mono font-bold">
                            {val > 0 ? (
                              <span
                                className={`inline-block w-5 h-5 leading-5 rounded text-[11px] ${
                                  val === 3
                                    ? 'bg-blue-600 text-white'
                                    : val === 2
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {val}
                              </span>
                            ) : (
                              <span className="text-slate-300">-</span>
                            )}
                          </td>
                        );
                      })}

                      {/* PSO Mappings */}
                      {programSpecificOutcomes.map((pso) => {
                        const val = co.psoMapping[pso.code] || 0;
                        return (
                          <td key={pso.code} className="py-2 px-1.5 text-center font-mono font-bold bg-indigo-50/20">
                            {val > 0 ? (
                              <span
                                className={`inline-block w-5 h-5 leading-5 rounded text-[11px] ${
                                  val === 3
                                    ? 'bg-indigo-600 text-white'
                                    : val === 2
                                    ? 'bg-indigo-100 text-indigo-800'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {val}
                              </span>
                            ) : (
                              <span className="text-slate-300">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: PO ATTAINMENT & GAP ANALYSIS */}
      {activeSubTab === 'gap-analysis' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900">
              Program Outcome (PO1 to PO12) and PSO Attainment vs Institutional Target
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Calculated automatically using weighted average: <code className="text-blue-700">PO_Attainment = Σ(CO_Attainment × Weight) / Σ(Weight)</code>
            </p>

            {/* Visual Bar Comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-4">
              {poAttainmentSummary.map((item) => (
                <div
                  key={item.po.code}
                  className={`p-3.5 rounded-xl border ${
                    item.isAttained
                      ? 'bg-white border-slate-200'
                      : 'bg-amber-50/40 border-amber-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 font-mono">{item.po.code}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        item.isAttained
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {item.isAttained ? 'Attained' : 'Gap Observed'}
                    </span>
                  </div>

                  <div className="text-[11px] font-semibold text-slate-700 mt-1 truncate">
                    {item.po.title}
                  </div>

                  <div className="mt-3 flex items-baseline justify-between text-xs font-mono">
                    <span className="text-slate-500">
                      Actual: <strong className="text-slate-900 text-sm font-bold">{item.attainment.toFixed(2)}</strong>
                    </span>
                    <span className="text-slate-400">
                      Target: <strong className="text-slate-600">{item.target.toFixed(2)}</strong>
                    </span>
                  </div>

                  {/* Progress Bar comparing Actual to 3.0 scale */}
                  <div className="mt-2 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${
                        item.isAttained ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${(item.attainment / 3.0) * 100}%` }}
                    />
                  </div>

                  <div className="mt-2 text-[10px] text-slate-500 flex justify-between">
                    <span>Mapped COs: {item.mappedCOCount}</span>
                    <span className={item.gap >= 0 ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                      Gap: {item.gap > 0 ? `+${item.gap}` : item.gap}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
