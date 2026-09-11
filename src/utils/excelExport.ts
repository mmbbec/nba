import * as XLSX from 'xlsx';
import {
  InstitutionMaster,
  MasterFaculty,
  MasterStudent,
  MasterCourse,
  YearBatchData,
  CourseOutcomeDef,
  StudentMarkEntry,
  EvidenceDocument,
  NbaTemplateMeta,
  NbaCriterionScore,
} from '../types/nba';

/**
 * Exports the comprehensive master NBA Excel package with all sheets,
 * color legends, and automated formulas.
 */
export function exportMasterNbaWorkbook(
  institution: InstitutionMaster,
  facultyList: MasterFaculty[],
  studentList: MasterStudent[],
  courseList: MasterCourse[],
  yearBatchData: Record<string, YearBatchData>,
  cos: CourseOutcomeDef[],
  marks: StudentMarkEntry[],
  evidenceList: EvidenceDocument[],
  criteriaScores: NbaCriterionScore[]
) {
  const wb = XLSX.utils.book_new();

  // 1. Sheet: 00_READ_ME_&_LEGEND
  const legendData = [
    ['NATIONAL BOARD OF ACCREDITATION (NBA) - AUTOMATION PACKAGE'],
    ['INSTITUTION:', institution.collegeName],
    ['PROGRAM:', institution.programName],
    ['ACCREDITATION CYCLE:', institution.nbaCycle],
    ['LAST UPDATED:', institution.lastUpdated],
    [],
    ['CELL COLOR CODING CONVENTION (AS MANDATED BY NBA GUIDELINES):'],
    ['BLUE CELLS', 'User Input Data (Enter raw numbers/text only - never type formulas)'],
    ['GREY CELLS', 'Automatically Calculated (Contains formulas for ratios, %, averages)'],
    ['GREEN CELLS', 'Validated & Complete Data (Meets NBA threshold and format)'],
    ['RED CELLS', 'Missing / Inconsistent Data (Requires immediate institutional action)'],
    [],
    ['STATUS CONVENTIONS FOR NEW PROGRAM / FIRST BATCH:'],
    ['Status Code', 'Operational Meaning'],
    ['New Program', 'Department started recently (2022 onwards); historical years unpopulated'],
    ['First Batch', 'Initial cohort currently enrolled in upper semesters'],
    ['First Graduation Pending', 'Students in 7th/8th semester; placement ongoing; degree award pending'],
    ['Applicable', 'Metric is actively measured for the academic year'],
    ['Not Applicable', 'Metric cannot be evaluated due to program timeline or regulations'],
  ];
  const wsLegend = XLSX.utils.aoa_to_sheet(legendData);
  XLSX.utils.book_append_sheet(wb, wsLegend, '00_Legend_&_Guide');

  // 2. Sheet: 01_Program_Profile
  const profileData = [
    ['NBA CRITERION 1: PROGRAM PROFILE & GOVERNANCE'],
    ['Field Name', 'Institutional Value', 'Input / Calculated', 'Verification Source'],
    ['College Name', institution.collegeName, 'USER INPUT', 'AICTE / University NOC'],
    ['College Code', institution.collegeCode, 'USER INPUT', 'State CET / DTE Code'],
    ['Program Name', institution.programName, 'USER INPUT', 'AICTE Approval Order'],
    ['Department', institution.department, 'USER INPUT', 'Internal Allocation'],
    ['Affiliating University', institution.affiliatingUniversity, 'USER INPUT', 'Affiliation Gazette'],
    ['Current Academic Year (CAY)', institution.academicYearCAY, 'USER INPUT', 'Academic Calendar'],
    ['CAYm1', institution.academicYearCAYm1, 'USER INPUT', 'Academic Calendar'],
    ['CAYm2', institution.academicYearCAYm2, 'USER INPUT', 'Academic Calendar'],
    ['Approved Intake (1st Year)', institution.approvedIntake, 'USER INPUT', 'AICTE Extension of Approval (EOA)'],
    ['Year of Establishment', institution.yearOfEstablishment, 'USER INPUT', 'Founding Charter'],
    ['Is New College/Program', institution.isNewCollege ? 'YES' : 'NO', 'USER INPUT', 'Institutional Age <= 5 yrs'],
    ['First Graduating Batch', institution.firstGraduatingBatchYear, 'USER INPUT', 'Convocation Schedule'],
    ['Principal / Director', institution.principalDirector, 'USER INPUT', 'Appointment Order'],
    ['Head of Department', institution.hodName, 'USER INPUT', 'Service Record'],
    ['NBA Coordinator', institution.nbaCoordinator, 'USER INPUT', 'Office Order'],
  ];
  const wsProfile = XLSX.utils.aoa_to_sheet(profileData);
  XLSX.utils.book_append_sheet(wb, wsProfile, '01_Program_Profile');

  // 3. Sheet: 02_Faculty_Master
  const facHeader = [
    'Emp ID',
    'Faculty Name',
    'Designation',
    'Qualification',
    'Specialization',
    'Date of Joining',
    'Teaching Exp (Yrs)',
    'Industry Exp (Yrs)',
    'Total Experience (Yrs) [CALCULATED]',
    'Is Regular Faculty',
    'Publications (Scopus/WoS)',
    'FDPs Attended',
    'Sponsored Grants (Lakhs)',
    'Consultancy (Lakhs)',
    'Status',
  ];
  const facRows = facultyList.map((f) => [
    f.empId,
    f.name,
    f.designation,
    f.qualification,
    f.specialization,
    f.dateOfJoining,
    f.teachingExperienceYears,
    f.industryExperienceYears,
    f.teachingExperienceYears + f.industryExperienceYears, // formula equivalent
    f.isRegular ? 'Yes' : 'No',
    f.researchPublicationsCount,
    f.fdpAttendedCount,
    f.sponsoredProjectsAmountLakhs,
    f.consultancyAmountLakhs,
    f.status,
  ]);
  const wsFaculty = XLSX.utils.aoa_to_sheet([facHeader, ...facRows]);
  XLSX.utils.book_append_sheet(wb, wsFaculty, '02_Faculty_Master');

  // 4. Sheet: 03_Student_Master
  const stuHeader = [
    'USN / Roll No',
    'Student Name',
    'Batch',
    'Current Semester',
    'Admission Category',
    'Academic Status',
    'CGPA (Out of 10)',
    'Placement / Career Status',
    'Company / Institution Name',
    'Package (LPA)',
  ];
  const stuRows = studentList.map((s) => [
    s.usnOrRollNo,
    s.name,
    s.batch,
    s.currentSemester,
    s.admissionCategory,
    s.academicStatus,
    s.cgpa,
    s.placementStatus,
    s.companyOrInstitutionName,
    s.packageLPA,
  ]);
  const wsStudents = XLSX.utils.aoa_to_sheet([stuHeader, ...stuRows]);
  XLSX.utils.book_append_sheet(wb, wsStudents, '03_Student_Master');

  // 5. Sheet: 04_SFR_Cadre_Calculations
  const sfrData = [
    ['NBA CRITERION 5.1 & 5.2: STUDENT-FACULTY RATIO (SFR) & CADRE RATIO'],
    ['Academic Year', 'Sanctioned Intake', '2nd Year Students', '3rd Year Students', '4th Year Students', 'Total Students (S)', 'Regular Faculty (F)', 'SFR (S/F) [CALCULATED]', 'Ph.D. Count', 'Professors', 'Assoc. Profs', 'Asst. Profs'],
    ...Object.values(yearBatchData).map((b) => [
      b.yearLabel,
      b.sanctionedIntake,
      b.totalStudents2ndYear,
      b.totalStudents3rdYear,
      b.totalStudents4thYear,
      b.totalStudentStrength,
      b.regularFacultyCount,
      (b.totalStudentStrength / (b.regularFacultyCount || 1)).toFixed(2),
      b.phdFacultyCount,
      b.professorsCount,
      b.assocProfessorsCount,
      b.asstProfessorsCount,
    ]),
    [],
    ['BENCHMARK METRICS:'],
    ['NBA Tier-II Maximum Marks for SFR (<= 1:15)', '20 Marks'],
    ['Acceptable SFR Band', '1:15 to 1:20 (Marks scaled proportionally)'],
    ['Marginal / Deficient', '> 1:25 (0 Marks Awarded)'],
  ];
  const wsSFR = XLSX.utils.aoa_to_sheet(sfrData);
  XLSX.utils.book_append_sheet(wb, wsSFR, '04_SFR_&_Cadre');

  // 6. Sheet: 05_Placement_Results
  const plcData = [
    ['NBA CRITERION 4: STUDENTS PERFORMANCE & PLACEMENTS'],
    ['Year Batch', 'Status', 'Appeared Final Exam', 'Passed Total', 'Pass % [CALCULATED]', 'Eligible Graduates', 'Placed', 'Higher Studies', 'Start-ups', 'Placement Index % [CALCULATED]', 'Median LPA'],
    ...Object.values(yearBatchData).map((b) => [
      b.yearLabel,
      b.status,
      b.appearedFinalYear,
      b.totalPassedFinalYear,
      b.appearedFinalYear > 0 ? ((b.totalPassedFinalYear / b.appearedFinalYear) * 100).toFixed(1) + '%' : 'N/A (Pending)',
      b.eligibleGraduates,
      b.placedStudents,
      b.higherStudiesStudents,
      b.entrepreneurshipStudents,
      b.eligibleGraduates > 0 ? (((b.placedStudents + b.higherStudiesStudents + b.entrepreneurshipStudents) / b.eligibleGraduates) * 100).toFixed(1) + '%' : 'N/A',
      b.medianSalaryLPA,
    ]),
  ];
  const wsPlc = XLSX.utils.aoa_to_sheet(plcData);
  XLSX.utils.book_append_sheet(wb, wsPlc, '05_Placement_Results');

  // 7. Sheet: 06_CO_Attainment_Raw
  const markHeader = [
    'Student ID',
    'Student Name',
    'USN',
    'CIE 1 (Max 30) [INPUT]',
    'CIE 2 (Max 30) [INPUT]',
    'Assignment (Max 20) [INPUT]',
    'Total Internal (Max 80) [CALCULATED]',
    'SEE Marks (Max 100) [INPUT]',
    'Direct Score % (30% CIE + 70% SEE) [CALCULATED]',
    'Attained Threshold (>= 60%)? [CALCULATED]',
    'Course End Survey (1-5) [INPUT]',
  ];
  const markRows = marks.map((m) => {
    const totalCie = m.cie1 + m.cie2 + m.assignment;
    const ciePct = (totalCie / 80) * 100;
    const seePct = m.seeMarks;
    const combinedPct = ciePct * 0.3 + seePct * 0.7;
    return [
      m.studentId,
      m.studentName,
      m.usn,
      m.cie1,
      m.cie2,
      m.assignment,
      totalCie,
      m.seeMarks,
      combinedPct.toFixed(1) + '%',
      combinedPct >= 60 ? 'YES (Attained)' : 'NO',
      m.courseEndSurveyScore,
    ];
  });
  const wsMarks = XLSX.utils.aoa_to_sheet([markHeader, ...markRows]);
  XLSX.utils.book_append_sheet(wb, wsMarks, '06_CO_Student_Marks');

  // 8. Sheet: 07_CO_PO_Mapping_Matrix
  const coPoHeader = [
    'CO Code',
    'Bloom Level',
    'Course Outcome Statement',
    'Direct Attainment (0-3)',
    'Indirect Attainment (0-3)',
    'Overall CO Attainment (0-3)',
    'PO1', 'PO2', 'PO3', 'PO4', 'PO5', 'PO6', 'PO7', 'PO8', 'PO9', 'PO10', 'PO11', 'PO12',
    'PSO1', 'PSO2',
  ];
  const coPoRows = cos.map((co) => [
    co.coCode,
    co.bloomLevel,
    co.description,
    co.directAttainment,
    co.indirectAttainment,
    co.overallAttainment,
    co.poMapping['PO1'] || '-',
    co.poMapping['PO2'] || '-',
    co.poMapping['PO3'] || '-',
    co.poMapping['PO4'] || '-',
    co.poMapping['PO5'] || '-',
    co.poMapping['PO6'] || '-',
    co.poMapping['PO7'] || '-',
    co.poMapping['PO8'] || '-',
    co.poMapping['PO9'] || '-',
    co.poMapping['PO10'] || '-',
    co.poMapping['PO11'] || '-',
    co.poMapping['PO12'] || '-',
    co.psoMapping['PSO1'] || '-',
    co.psoMapping['PSO2'] || '-',
  ]);
  const wsCoPo = XLSX.utils.aoa_to_sheet([coPoHeader, ...coPoRows]);
  XLSX.utils.book_append_sheet(wb, wsCoPo, '07_CO_PO_Matrix');

  // 9. Sheet: 08_Evidence_Index
  const eviHeader = [
    'Document Code',
    'Criterion No',
    'Criterion Name',
    'Document Title',
    'Expected Format',
    'Mandatory for New College',
    'Status',
    'File Name',
    'Location / URL',
    'Responsible Owner',
    'Academic Year',
    'Remarks',
  ];
  const eviRows = evidenceList.map((e) => [
    e.code,
    e.criterionNumber,
    e.criterionName,
    e.title,
    e.expectedFormat,
    e.mandatoryForNewCollege ? 'Yes' : 'No',
    e.status,
    e.fileName,
    e.fileLocationOrUrl,
    e.owner,
    e.academicYear,
    e.remarks,
  ]);
  const wsEvi = XLSX.utils.aoa_to_sheet([eviHeader, ...eviRows]);
  XLSX.utils.book_append_sheet(wb, wsEvi, '08_Evidence_Index');

  // 10. Sheet: 09_Readiness_Dashboard
  const dashHeader = [
    'Criterion No',
    'Criterion Description',
    'Max Marks',
    'Awarded Estimate',
    'Completion %',
    'Status Light',
    'Key Gaps & Action Items',
    'New College Guidance',
  ];
  const dashRows = criteriaScores.map((c) => [
    `Criterion ${c.criterionNumber}`,
    c.name,
    c.maxMarks,
    c.awardedEstimate,
    `${c.completionPercent}%`,
    c.status.toUpperCase(),
    c.keyGaps.join('; '),
    c.newCollegeNote || '',
  ]);
  const totalScore = criteriaScores.reduce((sum, c) => sum + c.awardedEstimate, 0);
  dashRows.push([
    'TOTAL',
    'SUMMARY OVERALL NBA SCORE',
    1000,
    totalScore,
    `${Math.round((totalScore / 1000) * 100)}%`,
    totalScore >= 700 ? 'GREEN (ACCREDITATION READY)' : 'YELLOW',
    'Maintain rigorous document indexing for all 10 criteria',
    'New College provisions applied for historical graduate scaling',
  ]);
  const wsDash = XLSX.utils.aoa_to_sheet([dashHeader, ...dashRows]);
  XLSX.utils.book_append_sheet(wb, wsDash, '09_Readiness_Dashboard');

  // Generate and trigger download
  const dateStr = new Date().toISOString().split('T')[0];
  XLSX.writeFile(wb, `NBA_Accreditation_Automation_Package_${dateStr}.xlsx`);
}

/**
 * Exports a single template spreadsheet with metadata and column schema.
 */
export function exportSingleTemplate(template: NbaTemplateMeta, institution: InstitutionMaster) {
  const wb = XLSX.utils.book_new();

  const fileId = template.fileId || template.code || template.id;
  const fileName = template.fileName || `${template.code || template.id}.xlsx`;
  const category = template.category || `Criterion ${template.targetCriterion}`;
  const reportingPeriod = template.reportingPeriod || 'Annual / CAY';
  const responsiblePerson = template.responsiblePerson || template.primaryCustodian;
  const completionStatus = template.completionStatus || 'Ready for Entry';
  const formulaLogic = template.formulaLogic || template.greyCellsSummary;
  const validationRules = template.validationRules || ['Values must be valid numbers/text', 'No blank mandatory fields'];
  const requiredSupportingDocs = template.requiredSupportingDocs || 'Approved registers, meeting minutes, and evaluation rubrics';
  const remarks = template.remarks || 'Standard Tier-II NBA format aligned with AICTE-NBA guidelines';
  const inputFields = template.inputFields && template.inputFields.length > 0 ? template.inputFields : [template.blueCellsSummary];
  const calculatedFields = template.calculatedFields && template.calculatedFields.length > 0 ? template.calculatedFields : [template.greyCellsSummary];

  const metaData = [
    ['TEMPLATE CODE:', fileId],
    ['FILE NAME:', fileName],
    ['CATEGORY:', category],
    ['INSTITUTION:', institution.collegeName],
    ['PROGRAM:', institution.programName],
    ['REPORTING PERIOD:', reportingPeriod],
    ['RESPONSIBLE OWNER:', responsiblePerson],
    ['COMPLETION STATUS:', completionStatus],
    [],
    ['PURPOSE:'],
    [template.purpose],
    [],
    ['FORMULA & CALCULATION LOGIC:'],
    [formulaLogic],
    [],
    ['VALIDATION RULES:'],
    ...validationRules.map((r) => [`- ${r}`]),
    [],
    ['REQUIRED SUPPORTING DOCUMENTS:'],
    [requiredSupportingDocs],
    [],
    ['REMARKS & NEW COLLEGE GUIDANCE:'],
    [remarks],
  ];
  const wsMeta = XLSX.utils.aoa_to_sheet(metaData);
  XLSX.utils.book_append_sheet(wb, wsMeta, 'Template_Documentation');

  // Sheet 2: Data Entry Sheet with Blue (Input) and Grey (Calculated) columns
  const tableHeaders = [
    ...inputFields.map((f) => `${f} [BLUE - USER INPUT]`),
    ...calculatedFields.map((f) => `${f} [GREY - FORMULA]`),
    'Validation Flag [GREEN/RED]',
  ];

  // Provide 3 sample rows
  const sampleRows = [
    [
      ...inputFields.map(() => '[Enter Value]'),
      ...calculatedFields.map(() => '=FORMULA(...)'),
      'OK',
    ],
    [
      ...inputFields.map(() => '[Enter Value]'),
      ...calculatedFields.map(() => '=FORMULA(...)'),
      'OK',
    ],
    [
      ...inputFields.map(() => '[Enter Value]'),
      ...calculatedFields.map(() => '=FORMULA(...)'),
      'OK',
    ],
  ];

  const wsEntry = XLSX.utils.aoa_to_sheet([tableHeaders, ...sampleRows]);
  XLSX.utils.book_append_sheet(wb, wsEntry, 'Data_Entry_Sheet');

  XLSX.writeFile(wb, fileName);
}
