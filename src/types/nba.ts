export type ProgramStatus = 
  | 'Not Applicable'
  | 'Data Not Available'
  | 'New Program'
  | 'First Batch'
  | 'First Graduation Pending'
  | 'No Data Yet'
  | 'Applicable'
  | 'Completed'
  | 'Under Review';

export type TrafficLight = 'green' | 'yellow' | 'red';

export interface InstitutionMaster {
  collegeName: string;
  collegeCode: string;
  programName: string;
  department: string;
  affiliatingUniversity: string;
  academicYearCAY: string; // e.g. "2025-26"
  academicYearCAYm1: string; // e.g. "2024-25"
  academicYearCAYm2: string; // e.g. "2023-24"
  nbaCycle: string; // e.g. "Cycle 1 (Fresh Accreditation)"
  accreditationTier: 'Tier-I' | 'Tier-II';
  programType: 'UG Engineering' | 'PG Engineering' | 'Diploma' | 'Management';
  approvedIntake: number;
  yearOfEstablishment: number;
  isNewCollege: boolean;
  firstGraduatingBatchYear: string;
  principalDirector: string;
  hodName: string;
  nbaCoordinator: string;
  lastUpdated: string;
}

export interface AttainmentConfig {
  directWeightage: number; // e.g. 0.80 (80%)
  indirectWeightage: number; // e.g. 0.20 (20%)
  cieWeightage: number; // e.g. 0.30 (30%) or internal
  seeWeightage: number; // e.g. 0.70 (70%) or university exam
  thresholdPercent: number; // e.g. 60 (marks required to consider student attained)
  level1MinPercentage: number; // e.g. 50 (% of students above threshold)
  level2MinPercentage: number; // e.g. 60
  level3MinPercentage: number; // e.g. 70
  targetAttainmentLevel: number; // e.g. 2.5
}

export interface MasterFaculty {
  id: string;
  empId: string;
  name: string;
  designation: 'Professor' | 'Associate Professor' | 'Assistant Professor' | 'Adjunct Faculty';
  qualification: 'Ph.D.' | 'M.Tech / M.E.' | 'B.Tech / B.E.' | 'Other';
  specialization: string;
  department: string;
  dateOfJoining: string;
  teachingExperienceYears: number;
  industryExperienceYears: number;
  totalExperience: number; // calculated
  isRegular: boolean;
  status: ProgramStatus;
  researchPublicationsCount: number;
  fdpAttendedCount: number;
  sponsoredProjectsAmountLakhs: number;
  consultancyAmountLakhs: number;
  cadreWeight: number; // Prof: 1, Assoc: 1, Asst: 1
}

export interface MasterStudent {
  id: string;
  usnOrRollNo: string;
  name: string;
  batch: string; // e.g. "2022-2026"
  currentSemester: number;
  admissionYear: number;
  admissionCategory: 'Regular' | 'Lateral Entry' | 'Management' | 'Govt Quota';
  academicStatus: 'Active' | 'Detained' | 'Discontinued' | 'Graduated';
  placementStatus: 'Placed' | 'Higher Studies' | 'Entrepreneurship' | 'Seeking' | 'Not Applicable';
  companyOrInstitutionName: string;
  packageLPA: number;
  cgpa: number;
}

export interface MasterCourse {
  id: string;
  courseCode: string;
  courseTitle: string;
  semester: number;
  academicYear: string;
  facultyId: string;
  facultyName: string;
  credits: number;
  lectureHours: number;
  tutorialHours: number;
  practicalHours: number;
  totalHours: number; // calculated
  category: 'PC' | 'BS' | 'ES' | 'HS' | 'PE' | 'OE' | 'Project' | 'Internship';
  hasTheory: boolean;
  hasLab: boolean;
  status: ProgramStatus;
}

export interface ProgramOutcomeDef {
  code: string; // e.g. "PO1"
  title: string; // e.g. "Engineering Knowledge"
  description: string;
  targetLevel: number; // e.g. 2.5
}

export interface ProgramSpecificOutcomeDef {
  code: string; // e.g. "PSO1"
  title: string;
  description: string;
  targetLevel: number; // e.g. 2.5
}

export interface CourseOutcomeDef {
  id: string;
  courseId: string;
  coCode: string; // e.g. "CO1"
  description: string;
  bloomLevel: 'L1 Remember' | 'L2 Understand' | 'L3 Apply' | 'L4 Analyze' | 'L5 Evaluate' | 'L6 Create';
  directAttainment: number; // calculated (0 to 3)
  indirectAttainment: number; // calculated (0 to 3)
  overallAttainment: number; // calculated (0 to 3)
  poMapping: Record<string, number>; // PO1: 3, PO2: 2, etc. (0, 1, 2, 3)
  psoMapping: Record<string, number>; // PSO1: 2, PSO2: 3
}

export interface StudentMarkEntry {
  studentId: string;
  studentName: string;
  usn: string;
  cie1: number; // Max e.g. 30
  cie2: number; // Max e.g. 30
  assignment: number; // Max e.g. 20
  seeMarks: number; // Max e.g. 100
  courseEndSurveyScore: number; // 1 to 5
}

export interface YearBatchData {
  academicYear: string; // "CAY", "CAYm1", "CAYm2"
  yearLabel: string; // "2025-26", "2024-25", "2023-24"
  status: ProgramStatus;
  statusReason?: string;
  
  // Student Enrolment
  sanctionedIntake: number;
  actualAdmitted1stYear: number;
  lateralEntryAdmitted2ndYear: number;
  totalStudents2ndYear: number;
  totalStudents3rdYear: number;
  totalStudents4thYear: number;
  totalStudentStrength: number; // calculated
  
  // Faculty Data for the year
  regularFacultyCount: number;
  phdFacultyCount: number;
  professorsCount: number;
  assocProfessorsCount: number;
  asstProfessorsCount: number;
  
  // Results & Success
  appearedFinalYear: number;
  passedFinalYearWithoutBacklog: number;
  passedFinalYearWithBacklog: number;
  totalPassedFinalYear: number; // calculated
  
  // Placement & Higher Education
  eligibleGraduates: number;
  placedStudents: number;
  higherStudiesStudents: number;
  entrepreneurshipStudents: number;
  medianSalaryLPA: number;
  
  // Research & Grants
  fundedProjectsLakhs: number;
  consultancyLakhs: number;
  scopusWosPapers: number;
  patentsPublishedOrGranted: number;
  fdpWorkshopsOrganized: number;
}

export interface ContinuousImprovementRecord {
  id: string;
  criterionNumber: number;
  academicYear: string;
  observation: string;
  identifiedGap: string;
  rootCause: string;
  correctiveAction: string;
  responsiblePerson: string;
  timeline: string;
  measurableImprovement: string;
  supportingEvidenceRef: string;
  status: 'Initiated' | 'In Progress' | 'Completed' | 'Under Review';
}

export interface EvidenceDocument {
  id: string;
  code: string; // e.g. "DOC-CR1-01"
  criterionNumber: number;
  criterionName: string;
  title: string;
  documentTitle?: string;
  description: string;
  expectedFormat: 'PDF' | 'Excel' | 'Word' | 'Register / Physical File' | 'Minutes of Meeting' | 'Geo-tagged Photos' | 'Physical Register / PDF';
  mandatoryForNewCollege: boolean;
  status: 'Uploaded' | 'Draft' | 'Missing' | 'Not Applicable (New College)' | 'Verified' | 'In Progress';
  fileName: string;
  fileLocationOrUrl: string;
  physicalStorageLocation?: string;
  responsibleCustodian?: string;
  owner: string;
  academicYear: string;
  remarks: string;
}

export interface ValidationIssue {
  id: string;
  record: string;
  criterion: string;
  field: string;
  problem: string;
  recommendedAction: string;
  severity: 'Error' | 'Warning' | 'Info';
  status: 'Unresolved' | 'Acknowledged' | 'Resolved';
}

export interface ValidationErrorItem {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  module: string;
  fieldName: string;
  issueDescription: string;
  recommendedAction: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  module: string;
  fieldChanged: string;
  previousValue: string;
  newValue: string;
  remarks: string;
}

export interface NbaCriterionScore {
  criterionNumber: number;
  name: string;
  maxMarks: number;
  awardedEstimate: number;
  completionPercent: number;
  status: TrafficLight;
  keyGaps: string[];
  newCollegeNote?: string;
}

export type CourseInfo = MasterCourse & {
  courseName?: string;
  lectureHoursPerWeek?: number;
  tutorialHoursPerWeek?: number;
  practicalHoursPerWeek?: number;
  facultyInCharge?: string;
};

export interface CourseFileChecklist {
  id: string;
  courseCode: string;
  sectionNumber: string;
  title: string;
  description: string;
  fileReference: string;
  lastUpdated: string;
  status: 'Verified' | 'Uploaded' | 'Pending';
}

export interface ContinuousImprovementItem {
  id: string;
  poOrPsoCode: string;
  academicYear: string;
  identifiedGap: string;
  rootCauseAnalysis: string;
  correctiveActionTaken: string;
  measurableOutcome: string;
  status: string;
}

export interface NbaTemplateMeta {
  id: string;
  code: string;
  title: string;
  targetCriterion: number;
  purpose: string;
  blueCellsSummary: string;
  greyCellsSummary: string;
  primaryCustodian: string;
  outputFormat: string;

  fileId?: string;
  fileName?: string;
  category?: string;
  reportingPeriod?: string;
  responsiblePerson?: string;
  completionStatus?: string;
  formulaLogic?: string;
  validationRules?: string[];
  requiredSupportingDocs?: string;
  remarks?: string;
  inputFields?: string[];
  calculatedFields?: string[];
}

