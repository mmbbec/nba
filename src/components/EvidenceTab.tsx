import React, { useState } from 'react';
import {
  FileCheck,
  Search,
  AlertTriangle,
  CheckCircle2,
  FolderOpen,
  Filter,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { EvidenceDocument } from '../types/nba';

interface EvidenceTabProps {
  evidenceList: EvidenceDocument[];
  onUpdateEvidenceStatus: (id: string, newStatus: 'Verified' | 'In Progress' | 'Missing') => void;
}

export const EvidenceTab: React.FC<EvidenceTabProps> = ({
  evidenceList,
  onUpdateEvidenceStatus,
}) => {
  const [selectedCriterion, setSelectedCriterion] = useState<number | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Verified' | 'In Progress' | 'Missing'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvidence = evidenceList.filter((doc) => {
    const matchesCriterion = selectedCriterion === 'all' || doc.criterionNumber === selectedCriterion;
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    const matchesSearch =
      doc.documentTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.physicalStorageLocation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCriterion && matchesStatus && matchesSearch;
  });

  const verifiedCount = evidenceList.filter((e) => e.status === 'Verified').length;
  const inProgressCount = evidenceList.filter((e) => e.status === 'In Progress').length;
  const missingCount = evidenceList.filter((e) => e.status === 'Missing').length;

  return (
    <div className="space-y-6">
      {/* Evidence Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Verified Documents
            </span>
            <div className="mt-1 text-2xl font-extrabold text-emerald-700">
              {verifiedCount} / {evidenceList.length}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Physical binders & digital archives verified</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              In Compilation
            </span>
            <div className="mt-1 text-2xl font-extrabold text-amber-700">
              {inProgressCount} Documents
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Drafts ready, awaiting final signatory</p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <FolderOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Missing / Pending Action
            </span>
            <div className="mt-1 text-2xl font-extrabold text-rose-700">
              {missingCount} Documents
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Flagged in audit for immediate compilation</p>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Evidence Registry */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Filter Controls */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search evidence by title, code, custodian, or rack location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-blue-500 text-slate-800"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap text-xs">
            {/* Criterion Selector */}
            <select
              value={selectedCriterion}
              onChange={(e) =>
                setSelectedCriterion(e.target.value === 'all' ? 'all' : Number(e.target.value))
              }
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium"
            >
              <option value="all">All Criteria (1 to 10)</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <option key={num} value={num}>
                  Criterion {num}
                </option>
              ))}
            </select>

            {/* Status Selector */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium"
            >
              <option value="all">All Statuses</option>
              <option value="Verified">Verified Only</option>
              <option value="In Progress">In Progress Only</option>
              <option value="Missing">Missing Only</option>
            </select>
          </div>
        </div>

        {/* Evidence Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-2.5 px-3">Document Code</th>
                <th className="py-2.5 px-3">Criterion</th>
                <th className="py-2.5 px-3">Document Title & NBA Description</th>
                <th className="py-2.5 px-3">Physical Rack / Binder Location</th>
                <th className="py-2.5 px-3">Designated Custodian</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredEvidence.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/70">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-700 whitespace-nowrap">
                    {doc.code}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-semibold">
                      Criterion {doc.criterionNumber}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 max-w-sm">
                    <div className="font-bold text-slate-900">{doc.documentTitle}</div>
                    <div className="text-slate-500 mt-0.5 line-clamp-1">{doc.description}</div>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-600 text-[11px]">
                    {doc.physicalStorageLocation}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-800">
                    {doc.responsibleCustodian}
                  </td>
                  <td className="py-2.5 px-3 text-center whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        doc.status === 'Verified'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                          : doc.status === 'In Progress'
                          ? 'bg-amber-50 text-amber-800 border border-amber-300'
                          : 'bg-rose-50 text-rose-800 border border-rose-300'
                      }`}
                    >
                      {doc.status === 'Verified'
                        ? '✓ Verified'
                        : doc.status === 'In Progress'
                        ? 'In Progress'
                        : '⚠ Missing'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right whitespace-nowrap">
                    <select
                      value={doc.status}
                      onChange={(e) => onUpdateEvidenceStatus(doc.id, e.target.value as any)}
                      className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
                    >
                      <option value="Verified">Mark Verified</option>
                      <option value="In Progress">Mark In Progress</option>
                      <option value="Missing">Mark Missing</option>
                    </select>
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
