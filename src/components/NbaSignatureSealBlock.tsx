import React, { useState, useMemo } from 'react';
import { ShieldCheck, Stamp, Fingerprint, Calendar, MapPin, Hash, QrCode } from 'lucide-react';
import { InstitutionMaster } from '../types/nba';
import { generateDocumentHash } from '../utils/documentHash';

export interface Signatory {
  role: string;
  name: string;
  title: string;
  subtitle?: string;
  signatureDate?: string;
}

export interface NbaSignatureSealBlockProps {
  documentType: string;
  institution: InstitutionMaster;
  signatories: Signatory[];
  declarationText?: string;
  entityId?: string;
  showSeal?: boolean;
  sealLabel?: string;
  place?: string;
  date?: string;
  compact?: boolean;
  className?: string;
}

export const NbaSignatureSealBlock: React.FC<NbaSignatureSealBlockProps> = ({
  documentType,
  institution,
  signatories,
  declarationText,
  entityId,
  showSeal = true,
  sealLabel = 'INSTITUTIONAL / PROGRAM SEAL',
  place,
  date,
  compact = false,
  className = '',
}) => {
  const docHash = useMemo(() => {
    return generateDocumentHash({
      docType: documentType,
      collegeCode: institution.collegeCode,
      collegeName: institution.collegeName,
      department: institution.department,
      academicYear: institution.academicYearCAY,
      entityId,
    });
  }, [documentType, institution, entityId]);

  const [currentPlace, setCurrentPlace] = useState(place || 'Institutional Campus');
  const [currentDate, setCurrentDate] = useState(date || docHash.issueDate);

  return (
    <div
      className={`space-y-3.5 page-break-inside-avoid print-page-break-inside-avoid border-t-2 border-slate-900 pt-3 text-slate-900 font-sans ${className}`}
      style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}
    >
      {/* Optional Statutory Declaration */}
      {declarationText && (
        <div className="text-[10.5px] text-slate-700 italic text-justify leading-normal bg-slate-50 p-2 border border-slate-300 rounded print:bg-white print:border-slate-400">
          <strong>Statutory Declaration & Verification:</strong> "{declarationText}"
        </div>
      )}

      {/* Date, Place & Seal Layout */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-end justify-between gap-4 pt-1">
        {/* Date and Place Metadata Fields */}
        <div className="flex flex-col gap-2 text-xs font-sans self-start sm:self-center">
          <div className="flex items-center gap-2">
            <label className="font-bold text-slate-800 text-[11px] w-14 flex items-center gap-1 shrink-0 cursor-text">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              Place:
            </label>
            <input
              type="text"
              value={currentPlace}
              onChange={(e) => setCurrentPlace(e.target.value)}
              placeholder="e.g. Campus, City"
              className="font-medium text-slate-800 border-b border-dashed border-slate-400 pb-0.5 px-1 w-44 text-[11px] bg-transparent focus:border-blue-600 focus:outline-none print:border-slate-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="font-bold text-slate-800 text-[11px] w-14 flex items-center gap-1 shrink-0 cursor-text">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              Date:
            </label>
            <input
              type="text"
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
              placeholder="DD-MMM-YYYY"
              className="font-medium text-slate-800 border-b border-dashed border-slate-400 pb-0.5 px-1 w-44 text-[11px] bg-transparent focus:border-blue-600 focus:outline-none print:border-slate-400"
            />
          </div>
        </div>

        {/* Official Seal / Stamp Placeholder Box */}
        {showSeal && (
          <div className="self-center sm:self-auto flex items-center gap-3">
            <div
              className={`border-2 border-dashed border-slate-400 rounded-xl bg-slate-50/70 p-2.5 flex flex-col items-center justify-center text-center text-slate-500 transition-colors print:bg-white print:border-slate-500 ${
                compact ? 'w-36 h-20' : 'w-40 h-24'
              }`}
            >
              <Stamp className="w-5 h-5 text-slate-400 mb-0.5" />
              <div className="text-[9px] font-extrabold uppercase tracking-wider text-slate-700 leading-tight">
                {sealLabel}
              </div>
              <div className="text-[7.5px] text-slate-400 mt-0.5">
                Affix Official Round Stamp with Date & Reg No.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Signatories Grid */}
      <div
        className={`grid gap-5 text-center text-xs font-sans pt-2 ${
          signatories.length === 2
            ? 'grid-cols-2'
            : signatories.length === 4
            ? 'grid-cols-2 sm:grid-cols-4'
            : 'grid-cols-3'
        }`}
      >
        {signatories.map((sig, idx) => (
          <div key={idx} className="flex flex-col justify-end">
            <div className="h-9 border-b border-slate-400 mb-1" />
            <div className="font-bold text-slate-900 text-[11px]">{sig.name}</div>
            <div className="text-slate-600 text-[10px] font-medium">{sig.title}</div>
            {sig.subtitle && <div className="text-slate-400 text-[9px]">{sig.subtitle}</div>}
            <div className="text-slate-400 text-[8.5px] mt-0.5">Signature & Date</div>
          </div>
        ))}
      </div>

      {/* Generated Document Hash & Digital Authenticity Verification Footer */}
      <div className="mt-3 pt-2 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[9.5px] text-slate-500 font-mono bg-slate-50/80 p-2 rounded border border-slate-200/80 print:bg-white print:border-slate-300">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold text-slate-700 uppercase tracking-tight font-sans text-[10px]">
              AUTHENTICITY VERIFICATION HASH:
            </span>
            <span className="bg-white px-1.5 py-0.5 rounded border border-slate-300 font-bold text-slate-900 tracking-wider text-[9px] print:border-slate-400">
              {docHash.formattedHash}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-[9px]">
          <span className="text-slate-400 font-sans">Verification Code:</span>
          <span className="font-bold text-blue-900 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 print:border-slate-300 print:bg-transparent">
            {docHash.verificationCode}
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500 font-sans">
            Ref: Tier-II / {institution.collegeCode} / {institution.academicYearCAY}
          </span>
        </div>
      </div>
    </div>
  );
};
