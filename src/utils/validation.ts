import {
  InstitutionMaster,
  MasterFaculty,
  MasterStudent,
  MasterCourse,
  YearBatchData,
  StudentMarkEntry,
  EvidenceDocument,
  ValidationIssue,
} from '../types/nba';

export function runFullNbaAudit(
  institution: InstitutionMaster,
  facultyList: MasterFaculty[],
  studentList: MasterStudent[],
  courseList: MasterCourse[],
  yearBatchData: Record<string, YearBatchData>,
  studentMarks: StudentMarkEntry[],
  evidenceList: EvidenceDocument[]
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // 1. Institution Master checks
  if (!institution.collegeName || institution.collegeName.includes('[ENTER COLLEGE NAME]')) {
    issues.push({
      id: 'VAL-INST-01',
      record: 'Institution Profile',
      criterion: 'Criterion 1',
      field: 'collegeName',
      problem: 'College Name contains template placeholder [ENTER COLLEGE NAME].',
      recommendedAction: 'Replace placeholder with your registered institutional name in Master Control.',
      severity: 'Warning',
      status: 'Unresolved',
    });
  }

  if (!institution.programName || institution.programName.includes('[ENTER PROGRAM NAME]')) {
    issues.push({
      id: 'VAL-INST-02',
      record: 'Institution Profile',
      criterion: 'Criterion 1',
      field: 'programName',
      problem: 'Program Name contains placeholder [ENTER PROGRAM NAME].',
      recommendedAction: 'Specify the accredited engineering branch name (e.g., B.Tech CSE).',
      severity: 'Warning',
      status: 'Unresolved',
    });
  }

  if (institution.approvedIntake <= 0) {
    issues.push({
      id: 'VAL-INST-03',
      record: 'Institution Profile',
      criterion: 'Criterion 4',
      field: 'approvedIntake',
      problem: `Approved intake is invalid (${institution.approvedIntake}).`,
      recommendedAction: 'Enter approved annual intake as per AICTE approval letter.',
      severity: 'Error',
      status: 'Unresolved',
    });
  }

  // 2. Faculty checks (duplicate IDs, negative exp, qualifications)
  const facultyIdMap = new Map<string, number>();
  facultyList.forEach((fac) => {
    const count = (facultyIdMap.get(fac.empId) || 0) + 1;
    facultyIdMap.set(fac.empId, count);

    if (fac.teachingExperienceYears < 0 || fac.industryExperienceYears < 0) {
      issues.push({
        id: `VAL-FAC-EXP-${fac.id}`,
        record: `Faculty: ${fac.name}`,
        criterion: 'Criterion 5',
        field: 'Experience',
        problem: `Negative experience value detected for ${fac.name}.`,
        recommendedAction: 'Set experience in positive decimal years.',
        severity: 'Error',
        status: 'Unresolved',
      });
    }

    if (!fac.qualification) {
      issues.push({
        id: `VAL-FAC-QUAL-${fac.id}`,
        record: `Faculty: ${fac.name}`,
        criterion: 'Criterion 5',
        field: 'qualification',
        problem: `Missing highest qualification for ${fac.name}.`,
        recommendedAction: 'Select Ph.D., M.Tech, or appropriate degree.',
        severity: 'Error',
        status: 'Unresolved',
      });
    }
  });

  facultyIdMap.forEach((count, empId) => {
    if (count > 1) {
      issues.push({
        id: `VAL-FAC-DUP-${empId}`,
        record: 'Faculty Master Database',
        criterion: 'Criterion 5',
        field: 'empId',
        problem: `Duplicate Faculty Employee ID detected: ${empId} (${count} occurrences).`,
        recommendedAction: 'Assign unique employee IDs to every faculty member.',
        severity: 'Error',
        status: 'Unresolved',
      });
    }
  });

  // 3. Student checks (duplicate USN, negative CGPA, out of bounds)
  const studentUsnMap = new Map<string, number>();
  studentList.forEach((stu) => {
    const count = (studentUsnMap.get(stu.usnOrRollNo) || 0) + 1;
    studentUsnMap.set(stu.usnOrRollNo, count);

    if (stu.cgpa < 0 || stu.cgpa > 10) {
      issues.push({
        id: `VAL-STU-CGPA-${stu.id}`,
        record: `Student: ${stu.name} (${stu.usnOrRollNo})`,
        criterion: 'Criterion 4',
        field: 'cgpa',
        problem: `CGPA ${stu.cgpa} is outside valid boundary (0.00 - 10.00).`,
        recommendedAction: 'Reconcile CGPA against university grade report.',
        severity: 'Error',
        status: 'Unresolved',
      });
    }
  });

  studentUsnMap.forEach((count, usn) => {
    if (count > 1) {
      issues.push({
        id: `VAL-STU-DUP-${usn}`,
        record: 'Student Master Database',
        criterion: 'Criterion 4',
        field: 'usnOrRollNo',
        problem: `Duplicate Student USN/Roll Number detected: ${usn}.`,
        recommendedAction: 'Verify university registration and remove duplicate student records.',
        severity: 'Error',
        status: 'Unresolved',
      });
    }
  });

  // 4. Course Master checks (duplicate course code)
  const courseCodeMap = new Map<string, number>();
  courseList.forEach((crs) => {
    const count = (courseCodeMap.get(crs.courseCode) || 0) + 1;
    courseCodeMap.set(crs.courseCode, count);

    if (crs.credits <= 0) {
      issues.push({
        id: `VAL-CRS-CRD-${crs.id}`,
        record: `Course: ${crs.courseCode}`,
        criterion: 'Criterion 2 & 3',
        field: 'credits',
        problem: `Course credits (${crs.credits}) cannot be zero or negative.`,
        recommendedAction: 'Enter university approved credits scheme.',
        severity: 'Error',
        status: 'Unresolved',
      });
    }
  });

  courseCodeMap.forEach((count, code) => {
    if (count > 1) {
      issues.push({
        id: `VAL-CRS-DUP-${code}`,
        record: 'Course Master Database',
        criterion: 'Criterion 2',
        field: 'courseCode',
        problem: `Duplicate Course Code detected: ${code}.`,
        recommendedAction: 'Ensure course code matches university curriculum nomenclature.',
        severity: 'Error',
        status: 'Unresolved',
      });
    }
  });

  // 5. Year Batch Data checks (passed > appeared, placed > eligible, negative students)
  Object.entries(yearBatchData).forEach(([ayKey, batch]) => {
    if (batch.totalStudentStrength < 0) {
      issues.push({
        id: `VAL-BATCH-STR-${ayKey}`,
        record: `Academic Batch: ${batch.yearLabel}`,
        criterion: 'Criterion 4',
        field: 'totalStudentStrength',
        problem: `Student strength cannot be negative (${batch.totalStudentStrength}).`,
        recommendedAction: 'Verify enrollment numbers across running semesters.',
        severity: 'Error',
        status: 'Unresolved',
      });
    }

    if (batch.totalPassedFinalYear > batch.appearedFinalYear && batch.appearedFinalYear > 0) {
      issues.push({
        id: `VAL-BATCH-PASS-${ayKey}`,
        record: `Academic Batch: ${batch.yearLabel}`,
        criterion: 'Criterion 4',
        field: 'totalPassedFinalYear',
        problem: `Passed students (${batch.totalPassedFinalYear}) exceeds appeared students (${batch.appearedFinalYear}).`,
        recommendedAction: 'Reconcile passed students with official university result gazette.',
        severity: 'Error',
        status: 'Unresolved',
      });
    }

    if (batch.placedStudents > batch.eligibleGraduates && batch.eligibleGraduates > 0) {
      issues.push({
        id: `VAL-BATCH-PLC-${ayKey}`,
        record: `Academic Batch: ${batch.yearLabel}`,
        criterion: 'Criterion 4',
        field: 'placedStudents',
        problem: `Placed students (${batch.placedStudents}) exceeds total eligible graduates (${batch.eligibleGraduates}).`,
        recommendedAction: 'Verify unique student placed count (excluding multiple job offers).',
        severity: 'Error',
        status: 'Unresolved',
      });
    }
  });

  // 6. Student Marks validation (marks > max marks)
  studentMarks.forEach((m) => {
    if (m.cie1 > 30 || m.cie1 < 0) {
      issues.push({
        id: `VAL-MARK-CIE1-${m.studentId}`,
        record: `Marksheet: ${m.studentName}`,
        criterion: 'Criterion 3',
        field: 'cie1',
        problem: `CIE 1 marks (${m.cie1}) out of boundary (0 - 30).`,
        recommendedAction: 'Correct internal test score to be within maximum test marks.',
        severity: 'Error',
        status: 'Unresolved',
      });
    }
    if (m.seeMarks > 100 || m.seeMarks < 0) {
      issues.push({
        id: `VAL-MARK-SEE-${m.studentId}`,
        record: `Marksheet: ${m.studentName}`,
        criterion: 'Criterion 3',
        field: 'seeMarks',
        problem: `Semester Exam marks (${m.seeMarks}) out of boundary (0 - 100).`,
        recommendedAction: 'Check university mark statement.',
        severity: 'Error',
        status: 'Unresolved',
      });
    }
  });

  // 7. Evidence verification checks
  const missingEvidences = evidenceList.filter((e) => e.status === 'Missing');
  missingEvidences.forEach((ev) => {
    issues.push({
      id: `VAL-EVI-MISS-${ev.id}`,
      record: `Evidence: ${ev.code}`,
      criterion: `Criterion ${ev.criterionNumber}`,
      field: 'fileLocationOrUrl',
      problem: `Mandatory evidence missing: "${ev.title}".`,
      recommendedAction: `Upload ${ev.expectedFormat} document to ${ev.owner}'s custody before NBA mock visit.`,
      severity: ev.mandatoryForNewCollege ? 'Error' : 'Warning',
      status: 'Unresolved',
    });
  });

  return issues;
}
