import {
  AttainmentConfig,
  CourseOutcomeDef,
  MasterFaculty,
  NbaCriterionScore,
  StudentMarkEntry,
  YearBatchData,
  EvidenceDocument,
} from '../types/nba';

/**
 * Calculates Student-to-Faculty Ratio (SFR) as per NBA Tier-II guidelines.
 * Target is 1:15 for maximum marks (20), up to 1:20 for acceptable marks.
 */
export function calculateSFR(totalStudents: number, totalFaculty: number): {
  sfr: number;
  sfrFormatted: string;
  marksAwarded: number;
  isCompliant: boolean;
  statusText: string;
} {
  if (totalFaculty <= 0) {
    return { sfr: 0, sfrFormatted: 'N/A', marksAwarded: 0, isCompliant: false, statusText: 'No Faculty Defined' };
  }
  const sfr = Math.round((totalStudents / totalFaculty) * 100) / 100;
  let marks = 0;
  let statusText = '';
  let isCompliant = true;

  if (sfr <= 15) {
    marks = 20;
    statusText = 'Excellent (<= 1:15) - Full 20 Marks';
  } else if (sfr <= 20) {
    marks = Math.round((20 * (20 - sfr) / 5) * 10) / 10;
    statusText = `Acceptable (1:15 to 1:20) - ${marks} Marks`;
  } else if (sfr <= 25) {
    marks = Math.max(0, Math.round((10 * (25 - sfr) / 5) * 10) / 10);
    statusText = `Marginal (1:20 to 1:25) - Deficient Cadre`;
    isCompliant = false;
  } else {
    marks = 0;
    statusText = 'Critical Deficiency (> 1:25) - 0 Marks';
    isCompliant = false;
  }

  return {
    sfr,
    sfrFormatted: `1 : ${sfr.toFixed(1)}`,
    marksAwarded: marks,
    isCompliant,
    statusText,
  };
}

/**
 * Calculates Faculty Qualification (FQ) points as per NBA Tier-II:
 * FQ = 2.5 * [ (10 * X + 6 * Y) / F ]
 * X = Number of regular faculty with Ph.D.
 * Y = Number of regular faculty with M.Tech/M.E.
 * F = Required faculty (or actual regular faculty)
 */
export function calculateFacultyQualificationPoints(
  phdCount: number,
  mtechCount: number,
  totalFaculty: number
): {
  fqPoints: number;
  maxPoints: number;
  percentage: number;
} {
  if (totalFaculty <= 0) return { fqPoints: 0, maxPoints: 20, percentage: 0 };
  const rawFq = 2.5 * ((10 * phdCount + 6 * mtechCount) / totalFaculty);
  const fqPoints = Math.min(20, Math.round(rawFq * 100) / 100);
  return {
    fqPoints,
    maxPoints: 20,
    percentage: Math.round((fqPoints / 20) * 100),
  };
}

/**
 * Calculates Cadre Ratio (Professor : Associate Professor : Assistant Professor).
 * AICTE / NBA ideal ratio is 1 : 2 : 6.
 */
export function calculateCadreRatio(
  professors: number,
  assocProfessors: number,
  asstProfessors: number,
  totalRequiredFaculty: number
): {
  cadreMarks: number;
  maxMarks: number;
  cadreString: string;
  isIdeal: boolean;
} {
  const reqProf = Math.max(1, Math.round(totalRequiredFaculty / 9));
  const reqAssoc = Math.max(1, Math.round((2 * totalRequiredFaculty) / 9));
  const reqAsst = Math.max(1, Math.round((6 * totalRequiredFaculty) / 9));

  const af1 = Math.min(1.0, professors / reqProf);
  const af2 = Math.min(1.0, assocProfessors / reqAssoc);
  const af3 = Math.min(1.0, asstProfessors / reqAsst);

  const cadreMarks = Math.round(((af1 + af2 * 0.7 + af3 * 0.4) / 2.1) * 20 * 10) / 10;
  const cadreString = `${professors} : ${assocProfessors} : ${asstProfessors} (Req: ${reqProf}:${reqAssoc}:${reqAsst})`;

  return {
    cadreMarks: Math.min(20, cadreMarks),
    maxMarks: 20,
    cadreString,
    isIdeal: professors >= reqProf && assocProfessors >= reqAssoc,
  };
}

/**
 * Calculates Student Placement & Higher Studies Index:
 * Placement Index = (Placed + Higher Studies + Entrepreneurship) / Eligible Students
 */
export function calculatePlacementIndex(
  placed: number,
  higherStudies: number,
  entrepreneurship: number,
  eligible: number
): {
  placementPercent: number;
  placementIndex: number;
  nbaMarks: number;
  status: string;
} {
  if (eligible <= 0) {
    return { placementPercent: 0, placementIndex: 0, nbaMarks: 0, status: 'No Eligible Batch / First Batch Pending' };
  }
  const totalBenefited = placed + higherStudies + entrepreneurship;
  const placementIndex = Math.min(1.0, Math.round((totalBenefited / eligible) * 100) / 100);
  const placementPercent = Math.round(placementIndex * 100);
  // NBA Tier-II marks for placement typically scale up to 40 marks
  const nbaMarks = Math.round(placementIndex * 40 * 10) / 10;

  return {
    placementPercent,
    placementIndex,
    nbaMarks,
    status: `${placementPercent}% (Placed: ${placed}, Higher Ed: ${higherStudies}, Start-up: ${entrepreneurship})`,
  };
}

/**
 * Calculates Pass Percentage from raw counts.
 */
export function calculatePassPercentage(
  passed: number,
  appeared: number
): {
  passPercent: number;
  failedCount: number;
  isValid: boolean;
  errorMessage?: string;
} {
  if (appeared <= 0) return { passPercent: 0, failedCount: 0, isValid: true };
  if (passed > appeared) {
    return {
      passPercent: 0,
      failedCount: 0,
      isValid: false,
      errorMessage: `Passed count (${passed}) cannot exceed appeared count (${appeared})!`,
    };
  }
  const failedCount = appeared - passed;
  const passPercent = Math.round((passed / appeared) * 1000) / 10;
  return { passPercent, failedCount, isValid: true };
}

/**
 * Evaluates individual student mark entry for Course Outcome (CO) attainment.
 */
export function evaluateStudentMarks(
  mark: StudentMarkEntry,
  config: AttainmentConfig,
  maxCie1: number = 30,
  maxCie2: number = 30,
  maxAssignment: number = 20,
  maxSee: number = 100
): {
  ciePercent: number;
  seePercent: number;
  combinedPercent: number;
  hasAttainedThreshold: boolean;
  surveyContribution3Scale: number;
} {
  const cieTotal = mark.cie1 + mark.cie2 + mark.assignment;
  const maxCieTotal = maxCie1 + maxCie2 + maxAssignment;
  const ciePercent = maxCieTotal > 0 ? (cieTotal / maxCieTotal) * 100 : 0;
  const seePercent = maxSee > 0 ? (mark.seeMarks / maxSee) * 100 : 0;

  const combinedPercent =
    ciePercent * config.cieWeightage + seePercent * config.seeWeightage;
  const hasAttainedThreshold = combinedPercent >= config.thresholdPercent;
  const surveyContribution3Scale = (mark.courseEndSurveyScore / 5) * 3;

  return {
    ciePercent: Math.round(ciePercent * 10) / 10,
    seePercent: Math.round(seePercent * 10) / 10,
    combinedPercent: Math.round(combinedPercent * 10) / 10,
    hasAttainedThreshold,
    surveyContribution3Scale: Math.round(surveyContribution3Scale * 100) / 100,
  };
}

/**
 * Computes class-wide CO Attainment:
 * Level 3 if >= level3MinPercentage (e.g. 70%)
 * Level 2 if >= level2MinPercentage (e.g. 60%)
 * Level 1 if >= level1MinPercentage (e.g. 50%)
 * Level 0 otherwise.
 */
export function calculateClassCOAttainment(
  studentMarks: StudentMarkEntry[],
  config: AttainmentConfig
): {
  totalStudents: number;
  studentsAttainedCount: number;
  percentageAttained: number;
  directAttainmentLevel: number;
  averageSurveyScore: number;
  indirectAttainmentLevel: number;
  overallAttainmentLevel: number;
} {
  if (!studentMarks || studentMarks.length === 0) {
    return {
      totalStudents: 0,
      studentsAttainedCount: 0,
      percentageAttained: 0,
      directAttainmentLevel: 0,
      averageSurveyScore: 0,
      indirectAttainmentLevel: 0,
      overallAttainmentLevel: 0,
    };
  }

  let attainedCount = 0;
  let totalSurveyScore = 0;

  for (const mark of studentMarks) {
    const evalResult = evaluateStudentMarks(mark, config);
    if (evalResult.hasAttainedThreshold) {
      attainedCount++;
    }
    totalSurveyScore += mark.courseEndSurveyScore;
  }

  const percentageAttained = (attainedCount / studentMarks.length) * 100;
  let directLevel = 0;

  if (percentageAttained >= config.level3MinPercentage) {
    directLevel = 3.0;
  } else if (percentageAttained >= config.level2MinPercentage) {
    directLevel = 2.0;
  } else if (percentageAttained >= config.level1MinPercentage) {
    directLevel = 1.0;
  } else {
    directLevel = (percentageAttained / config.level1MinPercentage) * 1.0;
  }

  const averageSurveyScore = totalSurveyScore / studentMarks.length;
  const indirectLevel = (averageSurveyScore / 5) * 3;

  const overallAttainment =
    directLevel * config.directWeightage + indirectLevel * config.indirectWeightage;

  return {
    totalStudents: studentMarks.length,
    studentsAttainedCount: attainedCount,
    percentageAttained: Math.round(percentageAttained * 10) / 10,
    directAttainmentLevel: Math.round(directLevel * 100) / 100,
    averageSurveyScore: Math.round(averageSurveyScore * 100) / 100,
    indirectAttainmentLevel: Math.round(indirectLevel * 100) / 100,
    overallAttainmentLevel: Math.round(overallAttainment * 100) / 100,
  };
}

/**
 * Calculates Program Outcome (PO) and Program Specific Outcome (PSO) Attainment:
 * For a given PO: PO_Attainment = SUM(CO_Overall_Attainment * Mapping_Strength) / SUM(Mapping_Strength)
 */
export function calculatePOAttainmentForCourse(
  cos: CourseOutcomeDef[],
  poCode: string
): {
  attainment: number;
  mappedCOCount: number;
  totalMappingWeight: number;
} {
  let weightedSum = 0;
  let totalWeight = 0;
  let mappedCOCount = 0;

  for (const co of cos) {
    const weight = co.poMapping[poCode] || 0;
    if (weight > 0) {
      weightedSum += co.overallAttainment * weight;
      totalWeight += weight;
      mappedCOCount++;
    }
  }

  const attainment = totalWeight > 0 ? Math.round((weightedSum / totalWeight) * 100) / 100 : 0;
  return {
    attainment,
    mappedCOCount,
    totalMappingWeight: totalWeight,
  };
}

/**
 * Computes NBA Criteria 1 to 10 readiness breakdown and overall score out of 1000 marks.
 */
export function computeNbaReadiness(
  batchCAY: YearBatchData,
  facultyList: MasterFaculty[],
  evidenceDocs: EvidenceDocument[]
): {
  totalEstimatedScore: number;
  overallPercentage: number;
  criteriaScores: NbaCriterionScore[];
  totalEvidenceCount: number;
  verifiedEvidenceCount: number;
  missingEvidenceCount: number;
  evidenceReadinessPercent: number;
} {
  const sfrData = calculateSFR(batchCAY.totalStudentStrength, facultyList.length);
  const phdCount = facultyList.filter((f) => f.qualification === 'Ph.D.').length;
  const mtechCount = facultyList.filter((f) => f.qualification.includes('M.Tech')).length;
  const fqData = calculateFacultyQualificationPoints(phdCount, mtechCount, facultyList.length);

  const totalEvidence = evidenceDocs.length;
  const verifiedCount = evidenceDocs.filter((d) => d.status === 'Verified').length;
  const uploadedCount = evidenceDocs.filter((d) => d.status === 'Uploaded').length;
  const missingCount = evidenceDocs.filter((d) => d.status === 'Missing').length;

  const criteriaScores: NbaCriterionScore[] = [
    {
      criterionNumber: 1,
      name: 'Vision, Mission & Program Educational Objectives (PEOs)',
      maxMarks: 50,
      awardedEstimate: 45,
      completionPercent: 90,
      status: 'green',
      keyGaps: ['Review PEOs with 2nd Advisory Board meeting minutes.'],
      newCollegeNote: 'Vision & Mission approved by inaugural Governing Council.',
    },
    {
      criterionNumber: 2,
      name: 'Curriculum and Teaching-Learning Processes',
      maxMarks: 100,
      awardedEstimate: 84,
      completionPercent: 84,
      status: 'green',
      keyGaps: ['Expand project-based learning documentation in Semester 5 & 6.'],
      newCollegeNote: 'University prescribed curriculum implemented with value-added additions.',
    },
    {
      criterionNumber: 3,
      name: 'Course Outcomes and Program Outcomes (COs & POs)',
      maxMarks: 175,
      awardedEstimate: 148,
      completionPercent: 85,
      status: 'green',
      keyGaps: ['Close loop on PO4 (Investigations) remedial lab exercises.'],
      newCollegeNote: 'Automated 80:20 attainment model deployed institutional-wide.',
    },
    {
      criterionNumber: 4,
      name: "Students' Performance (Admissions, Success & Placements)",
      maxMarks: 100,
      awardedEstimate: 78,
      completionPercent: 78,
      status: 'yellow',
      keyGaps: ['First batch graduating in CAY; ongoing placement drive to achieve 85% placement.'],
      newCollegeNote: 'New Program Provision: First batch graduation pending, marks scaled by evaluation committee.',
    },
    {
      criterionNumber: 5,
      name: 'Faculty Information and Contributions',
      maxMarks: 200,
      awardedEstimate: Math.round(135 + sfrData.marksAwarded * 1.5 + fqData.fqPoints * 1.5),
      completionPercent: Math.round(((135 + sfrData.marksAwarded * 1.5 + fqData.fqPoints * 1.5) / 200) * 100),
      status: sfrData.isCompliant ? 'green' : 'yellow',
      keyGaps: [
        `Current SFR is ${sfrData.sfrFormatted}; target <= 1:15 requires 2 additional faculty.`,
        'Encourage 2 assistant professors to register for doctoral studies.',
      ],
      newCollegeNote: 'Cadre ratio is balanced; 4 Ph.D. holders active.',
    },
    {
      criterionNumber: 6,
      name: 'Facilities and Technical Support (Labs & Infrastructure)',
      maxMarks: 80,
      awardedEstimate: 72,
      completionPercent: 90,
      status: 'green',
      keyGaps: ['Complete annual calibration register for electronics test equipment.'],
      newCollegeNote: 'Brand-new modern high-end computer laboratories with dedicated GPU nodes.',
    },
    {
      criterionNumber: 7,
      name: 'Continuous Improvement',
      maxMarks: 50,
      awardedEstimate: 41,
      completionPercent: 82,
      status: 'green',
      keyGaps: ['Document secondary audit closure on Course Outcomes remedial actions.'],
      newCollegeNote: '3-year continuous improvement tracking active with measurable impacts.',
    },
    {
      criterionNumber: 8,
      name: 'First Year Academics',
      maxMarks: 50,
      awardedEstimate: 44,
      completionPercent: 88,
      status: 'green',
      keyGaps: ['Document diagnostic tests and bridge course reports for lateral entry students.'],
      newCollegeNote: 'Dedicated first year faculty with strong basic science Ph.D. qualifications.',
    },
    {
      criterionNumber: 9,
      name: 'Student Support Systems',
      maxMarks: 50,
      awardedEstimate: 46,
      completionPercent: 92,
      status: 'green',
      keyGaps: ['Maintain bi-weekly counseling records in proctor books.'],
      newCollegeNote: 'Statutory committees (Anti-ragging, Grievance, ICC) actively functioning.',
    },
    {
      criterionNumber: 10,
      name: 'Governance, Institutional Support & Financial Resources',
      maxMarks: 120,
      awardedEstimate: 106,
      completionPercent: 88,
      status: 'green',
      keyGaps: ['Upload audited statements of the immediate preceding financial year.'],
      newCollegeNote: 'Substantial recurring and non-recurring trust funding with >90% budget utilization.',
    },
  ];

  const totalScore = criteriaScores.reduce((sum, c) => sum + c.awardedEstimate, 0);
  const overallPct = Math.round((totalScore / 1000) * 100);

  const evidencePercent = totalEvidence > 0
    ? Math.round(((verifiedCount + uploadedCount * 0.7) / totalEvidence) * 100)
    : 0;

  return {
    totalEstimatedScore: totalScore,
    overallPercentage: overallPct,
    criteriaScores,
    totalEvidenceCount: totalEvidence,
    verifiedEvidenceCount: verifiedCount,
    missingEvidenceCount: missingCount,
    evidenceReadinessPercent: evidencePercent,
  };
}
