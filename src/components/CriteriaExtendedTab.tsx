import React, { useState } from 'react';
import {
  Layers,
  FlaskConical,
  RefreshCw,
  Sparkles,
  HeartHandshake,
  Landmark,
  CheckCircle,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { ContinuousImprovementItem } from '../types/nba';

interface CriteriaExtendedTabProps {
  improvementActions: ContinuousImprovementItem[];
  onAddImprovementAction: (action: ContinuousImprovementItem) => void;
}

export const CriteriaExtendedTab: React.FC<CriteriaExtendedTabProps> = ({
  improvementActions,
  onAddImprovementAction,
}) => {
  const [activeCriterion, setActiveCriterion] = useState<6 | 7 | 8 | 9 | 10>(7);

  // New action form state for Criterion 7
  const [newPoTarget, setNewPoTarget] = useState('PO3: Design and Development of Solutions');
  const [newGap, setNewGap] = useState('');
  const [newAction, setNewAction] = useState('');
  const [newOutcome, setNewOutcome] = useState('');

  const handleAddAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGap || !newAction) return;

    const item: ContinuousImprovementItem = {
      id: `IMP-${Date.now()}`,
      poOrPsoCode: newPoTarget.split(':')[0],
      academicYear: '2024-25',
      identifiedGap: newGap,
      rootCauseAnalysis: 'Identified through course exit surveys and industry advisory board feedback',
      correctiveActionTaken: newAction,
      measurableOutcome: newOutcome || 'Measured in subsequent CIE and lab practical exams',
      status: 'Implemented',
    };
    onAddImprovementAction(item);
    setNewGap('');
    setNewAction('');
    setNewOutcome('');
  };

  return (
    <div className="space-y-6">
      {/* Criteria Navigator */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            NBA Criteria 6 to 10: Facilities, Improvement & Governance
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Institutional and departmental support infrastructure complying with Tier-II NBA SAR parameters.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs flex-wrap">
          <button
            onClick={() => setActiveCriterion(6)}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeCriterion === 6 ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            C6: Facilities (80M)
          </button>
          <button
            onClick={() => setActiveCriterion(7)}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeCriterion === 7 ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            C7: Improvement (50M)
          </button>
          <button
            onClick={() => setActiveCriterion(8)}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeCriterion === 8 ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            C8: First Year (50M)
          </button>
          <button
            onClick={() => setActiveCriterion(9)}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeCriterion === 9 ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            C9: Student Support (50M)
          </button>
          <button
            onClick={() => setActiveCriterion(10)}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeCriterion === 10 ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            C10: Governance (120M)
          </button>
        </div>
      </div>

      {/* CRITERION 6: FACILITIES & TECHNICAL SUPPORT */}
      {activeCriterion === 6 && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-blue-600" />
              Criterion 6: Laboratories, Technical Support & Computing Infrastructure (80 Marks)
            </h3>
            <p className="text-xs text-slate-500">
              NBA requires fully documented laboratory equipment logs, maintenance schedules, stock registers, and licensed software compliance.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900">Lab 1: Advanced Computing & AI Lab</div>
                <div className="text-slate-600">35 Workstations (Intel i7, 32GB RAM, RTX 4060 GPU)</div>
                <div className="text-[11px] font-mono text-emerald-700 font-semibold">Stock Reg Ref: CSE/LAB/01/SR</div>
                <div className="text-slate-500">In-Charge: Dr. A. Sharma • Tech Asst: Mr. K. Rao</div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900">Lab 2: Data Structures & Algorithms Lab</div>
                <div className="text-slate-600">40 Workstations (Intel i5, 16GB RAM, Linux OS)</div>
                <div className="text-[11px] font-mono text-emerald-700 font-semibold">Stock Reg Ref: CSE/LAB/02/SR</div>
                <div className="text-slate-500">In-Charge: Prof. R. Patel • Tech Asst: Ms. S. Nair</div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900">Lab 3: Networks & Cloud Computing Lab</div>
                <div className="text-slate-600">35 Workstations, Cisco Routers/Switches Rack</div>
                <div className="text-[11px] font-mono text-emerald-700 font-semibold">Stock Reg Ref: CSE/LAB/03/SR</div>
                <div className="text-slate-500">In-Charge: Prof. S. Sen • Tech Asst: Mr. D. Verma</div>
              </div>
            </div>

            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-950 font-medium">
              ✓ Bandwidth: 1 Gbps Leased Line (1:1 dedicated) • Power Backup: 100 kVA Online UPS with 4 hours backup + 250 kVA Diesel Generator.
            </div>
          </div>
        </div>
      )}

      {/* CRITERION 7: CONTINUOUS IMPROVEMENT */}
      {activeCriterion === 7 && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-emerald-600" />
                  Criterion 7: Continuous Improvement & Action Taken (50 Marks)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  The quintessential NBA closed-loop mechanism: <em>Attainment Gap Identified → Root Cause Analyzed → Corrective Action Taken → Improvement Verified</em>.
                </p>
              </div>
            </div>

            {/* List of Implemented Actions */}
            <div className="divide-y divide-slate-100 overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100 text-[11px]">
                    <th className="pb-2 font-semibold">PO / PSO</th>
                    <th className="pb-2 font-semibold">Identified Gap</th>
                    <th className="pb-2 font-semibold">Corrective Action Taken</th>
                    <th className="pb-2 font-semibold">Measurable Outcome</th>
                    <th className="pb-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-700">
                  {improvementActions.map((action) => (
                    <tr key={action.id} className="hover:bg-slate-50/70">
                      <td className="py-2.5 font-bold font-mono text-slate-900">{action.poOrPsoCode}</td>
                      <td className="py-2.5 max-w-xs">{action.identifiedGap}</td>
                      <td className="py-2.5 max-w-xs text-indigo-950 font-medium">{action.correctiveActionTaken}</td>
                      <td className="py-2.5 max-w-xs text-emerald-800">{action.measurableOutcome}</td>
                      <td className="py-2.5">
                        <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[11px] font-semibold border border-emerald-200">
                          {action.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add New Continuous Improvement Form */}
            <form onSubmit={handleAddAction} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Log New Closed-Loop Corrective Action
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Target PO / PSO</label>
                  <select
                    value={newPoTarget}
                    onChange={(e) => setNewPoTarget(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-medium"
                  >
                    <option value="PO1">PO1: Engineering Knowledge</option>
                    <option value="PO2">PO2: Problem Analysis</option>
                    <option value="PO3">PO3: Design/Development of Solutions</option>
                    <option value="PO4">PO4: Conduct Investigations of Complex Problems</option>
                    <option value="PO5">PO5: Modern Tool Usage</option>
                    <option value="PSO1">PSO1: Full-stack & Distributed Systems</option>
                    <option value="PSO2">PSO2: Machine Learning & Intelligence</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Identified Gap</label>
                  <input
                    type="text"
                    placeholder="e.g. Weak performance in asymptotic time complexity analysis"
                    value={newGap}
                    onChange={(e) => setNewGap(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Corrective Action Taken</label>
                  <input
                    type="text"
                    placeholder="e.g. Conducted 6-hour hands-on workshop with industry algorithm experts"
                    value={newAction}
                    onChange={(e) => setNewAction(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Measurable Outcome</label>
                  <input
                    type="text"
                    placeholder="e.g. Attainment in CIE-2 question 3 increased from 1.82 to 2.45"
                    value={newOutcome}
                    onChange={(e) => setNewOutcome(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-xs"
                >
                  Save to Criterion 7 Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CRITERION 8: FIRST YEAR ACADEMICS */}
      {activeCriterion === 8 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            Criterion 8: First Year Academics (50 Marks)
          </h3>
          <p className="text-xs text-slate-500">
            Evaluation of First-Year Science and Humanities faculty, SFR, physics/chemistry/programming laboratories, and transition mentoring for freshers.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 font-medium">First-Year SFR</span>
              <div className="text-xl font-bold text-slate-900 mt-1">1:16.8</div>
              <div className="text-[11px] text-emerald-700 mt-0.5">Compliant with AICTE norms</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 font-medium">Faculty Qualification (First Year)</span>
              <div className="text-xl font-bold text-slate-900 mt-1">62% Ph.D.</div>
              <div className="text-[11px] text-slate-500 mt-0.5">8 Ph.D., 5 M.Sc./M.Phil</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 font-medium">Induction Program</span>
              <div className="text-xl font-bold text-slate-900 mt-1">21 Days</div>
              <div className="text-[11px] text-emerald-700 mt-0.5">AICTE Universal Human Values (UHV) compliant</div>
            </div>
          </div>
        </div>
      )}

      {/* CRITERION 9: STUDENT SUPPORT SYSTEMS */}
      {activeCriterion === 9 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-amber-600" />
            Criterion 9: Student Support Systems & Mentoring (50 Marks)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="font-bold text-slate-900">1. Proctor / Mentoring System (1:20 Ratio)</div>
              <p className="text-slate-600 leading-relaxed">
                Each faculty mentor is assigned 20 students for 4-year continuity. Bi-weekly meetings, Proctor Diary tracking academic performance, attendance shortage warnings, and career counseling.
              </p>
              <div className="text-[11px] font-mono text-indigo-700">Evidence Binder: NBA-EV-CR9-01</div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="font-bold text-slate-900">2. Professional Societies & Student Chapters</div>
              <p className="text-slate-600 leading-relaxed">
                Active student branches of IEEE (STB99214), ACM Student Chapter, and CSI. Over 14 technical hackathons, guest lectures, and coding symposiums conducted in CAY.
              </p>
              <div className="text-[11px] font-mono text-indigo-700">Evidence Binder: NBA-EV-CR9-02</div>
            </div>
          </div>
        </div>
      )}

      {/* CRITERION 10: GOVERNANCE & FINANCIAL RESOURCES */}
      {activeCriterion === 10 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Landmark className="w-4 h-4 text-slate-800" />
            Criterion 10: Governance, Institutional Support & Financial Resources (120 Marks)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-slate-500 font-semibold">Budget Allocated (CAY)</div>
              <div className="text-xl font-bold text-slate-900 mt-1">₹145.0 Lakhs</div>
              <div className="text-[11px] text-emerald-700 mt-0.5">Utilization: 94.8% (₹137.5L)</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-slate-500 font-semibold">Library Titles & Volumes</div>
              <div className="text-xl font-bold text-slate-900 mt-1">2,450 / 12,800</div>
              <div className="text-[11px] text-slate-500 mt-0.5">IEEE Xplore + ScienceDirect Access</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-slate-500 font-semibold">Governing Body Meetings</div>
              <div className="text-xl font-bold text-slate-900 mt-1">2 / Year</div>
              <div className="text-[11px] text-indigo-700 mt-0.5">Action Taken Reports (ATR) verified</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
