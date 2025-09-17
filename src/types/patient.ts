export interface Patient {
    id: string;
    patientId: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    gender: string;
    email?: string;
    phone?: string;
    medicalHistory?: string;
    instituteId: string;

    // Contact Information (Guardian/Parent details)
    guardianName?: string;
    guardianPhone?: string;
    guardianEmail?: string;
    guardianRelationship?: string;

    // Socioeconomic Information
    motherEducationLevel?: EducationLevel;
    fatherEducationLevel?: EducationLevel;
    primaryCaregiver?: PrimaryCaregiver;
    earningMembersCount?: number;
    primaryEarnerOccupation?: Occupation;
    dependentsCount?: number;
    familyIncome?: FamilyIncomeRange;

    // Payment Information for CKD Care
    paymentMode?: PaymentMode;
    hasHealthInsurance?: boolean;
    insuranceType?: InsuranceType;
    insuranceProvider?: string;
    insurancePolicyNumber?: string;
    otherPaymentDetails?: string;

    // Legacy consent fields
    consentStatus: boolean;
    consentDate?: Date;

    // Enhanced consent fields
    consentStatusEnum: ConsentStatus;
    consentType?: ConsentType;
    consentObtainedDate?: Date;
    isVerbalConsent: boolean;
    isWrittenConsent: boolean;
    consentNotes?: string;

    // Assent for minors
    assentRequired: boolean;
    assentObtained: boolean;
    assentDate?: Date;

    // Ethics approval
    ethicsApprovalRequired: boolean;
    ethicsApprovalNumber?: string;
    ethicsApprovalDate?: Date;

    // Clinical History and CKD Information
    ageAtDiagnosis?: number;              // Age in months
    primaryRenalDiagnosis?: PrimaryRenalDiagnosis;
    symptomDurationYears?: number;
    symptomDurationMonths?: number;
    diagnosisDurationYears?: number;
    diagnosisDurationMonths?: number;
    surgicalInterventions?: string;
    currentCKDStage?: CKDStage;
    currentComplaints?: string[];         // Array of complaints
    comorbidities?: string[];             // Array of comorbidities

    // CKD Stage 5 - Dialysis Information
    isDialysisInitiated?: boolean;
    dialysisNotInitiatedReason?: string;

    // CKD Stage 4 - Preemptive Transplant
    isPreemptiveTransplantDiscussed?: boolean;

    // CKD Stage 5 - Transplant Evaluation
    isTransplantEvaluationInitiated?: boolean;
    transplantType?: TransplantType;
    transplantNotInitiatedReason?: string;

    // Physical Examination
    height?: number;                      // in cm
    heightSDS?: number;                   // Standard Deviation Score
    weight?: number;                      // in kg
    bmi?: number;                         // calculated
    bmiSDS?: number;                      // for height age
    systolicBP?: number;                  // mmHg
    diastolicBP?: number;                 // mmHg
    sbpPercentile?: number;               // for < 13 years
    dbpPercentile?: number;               // for < 13 years
    bpClassification?: BPClassification;
    growthPercentile?: GrowthPercentile;
    tannerStage?: TannerStage;

    // Laboratory Investigations (Mandatory fields marked with *)
    serumCreatinine?: number;             // *mandatory - mg/dL
    serumUrea?: number;                   // *mandatory - mg/dL
    eGFR?: number;                        // *mandatory - calculated
    proteinuriaDipstick?: ProteinuriaLevel;
    hemoglobin?: number;                  // *mandatory - g/dL
    sodium?: number;                      // *mandatory - mEq/L
    potassium?: number;                   // *mandatory - mEq/L
    chloride?: number;                    // mEq/L
    bicarbonate?: number;                 // *mandatory - mEq/L
    calcium?: number;                     // *mandatory - mg/dL
    phosphorus?: number;                  // *mandatory - mg/dL
    vitaminD?: number;                    // *mandatory - ng/mL
    ironLevel?: number;                   // μg/dL
    ferritin?: number;                    // ng/mL
    pth?: number;                         // pg/mL
    alp?: number;                         // U/L
    uricAcid?: number;                    // mg/dL

    // Other Imaging and Tests
    otherImaging?: string;                // Free text for ECHO, USG/KUB, MCU, DMSA, UDS, MRI
    geneticTests?: string;                // Free text for genetic test results

    status: number;
    createdAt: Date;
    updatedAt: Date;

    // Relations
    institute?: any;
    address?: PatientAddress;
    consentDocuments?: InformedConsent[];
    medications?: PatientMedication[];
    followUps?: PatientFollowUp[];
    dialysisRecords?: PatientDialysis[];
}

export interface PatientMedication {
    id: string;
    patientId: string;
    genericName: string;
    frequency: MedicationFrequency;
    routeOfAdministration: RouteOfAdministration;
    meanDosePerDay?: number;              // mg or units per day
    startDate: Date;
    stopDate?: Date;                      // null if ongoing

    status: number;
    createdAt: Date;
    updatedAt: Date;

    // Relations
    patient?: Patient;
}

export interface PatientFollowUp {
    id: string;
    patientId: string;
    followUpDate: Date;
    visitNumber: number;                  // Sequential visit number

    // 1. Socioeconomic and Demographic Updates
    hasSocioeconomicChanges: boolean;
    hasResidenceChange?: boolean;
    hasContactChange?: boolean;
    hasIncomeChange?: boolean;
    hasEducationStatusChange?: boolean;
    hasPaymentStatusChange?: boolean;

    // Updated socioeconomic fields (only if changes occurred)
    newFamilyIncome?: FamilyIncomeRange;
    newPaymentMode?: PaymentMode;
    newHasHealthInsurance?: boolean;
    newInsuranceType?: InsuranceType;
    newInsuranceProvider?: string;
    newMotherEducationLevel?: EducationLevel;
    newFatherEducationLevel?: EducationLevel;
    newPrimaryCaregiver?: PrimaryCaregiver;
    newEarningMembersCount?: number;
    newPrimaryEarnerOccupation?: Occupation;
    newDependentsCount?: number;

    // Contact updates
    newGuardianName?: string;
    newGuardianPhone?: string;
    newGuardianEmail?: string;
    newGuardianRelationship?: string;

    // 2. Clinical History and CKD Updates
    currentCKDStage?: CKDStage;

    // CKD Stage 5 - Dialysis Status Update
    isDialysisInitiated?: boolean;
    dialysisNotInitiatedReason?: string;

    // New symptoms since last visit
    newSymptomsSinceLastVisit?: string[]; // Array of new symptoms

    // Structured Comorbidity Status Checklist
    hasHypertension?: boolean;
    hasGrowthFailure?: boolean;
    hasAnemia?: boolean;
    hasBoneMineralDisease?: boolean;
    hasMetabolicAcidosis?: boolean;
    otherComorbidities?: string[];        // Additional comorbidities

    // Hospitalization tracking
    hasHospitalizationSinceLastVisit?: boolean;
    hospitalizationDetails?: string;     // Dates and details

    // 3. Physical Examination Updates
    currentHeight?: number;               // in cm
    currentHeightSDS?: number;            // Standard Deviation Score
    currentWeight?: number;               // in kg
    currentBMI?: number;                  // calculated
    currentBMISDS?: number;               // for height age
    currentSystolicBP?: number;           // mmHg
    currentDiastolicBP?: number;          // mmHg
    currentSBPPercentile?: number;        // for < 13 years
    currentDBPPercentile?: number;        // for < 13 years
    currentBPClassification?: BPClassification;
    currentTannerStage?: TannerStage;

    // 4. Laboratory Investigations (Follow-up)
    followUpSerumCreatinine?: number;     // *mandatory - mg/dL
    followUpSerumUrea?: number;           // *mandatory - mg/dL
    followUpEGFR?: number;                // *mandatory - calculated
    followUpProteinuriaDipstick?: ProteinuriaLevel;
    followUpHemoglobin?: number;          // *mandatory - g/dL
    followUpSodium?: number;              // *mandatory - mEq/L
    followUpPotassium?: number;           // *mandatory - mEq/L
    followUpChloride?: number;            // mEq/L
    followUpBicarbonate?: number;         // *mandatory - mEq/L
    followUpCalcium?: number;             // *mandatory - mg/dL
    followUpPhosphorus?: number;          // *mandatory - mg/dL
    followUpVitaminD?: number;            // *mandatory - ng/mL
    followUpIronLevel?: number;           // μg/dL
    followUpFerritin?: number;            // ng/mL
    followUpPTH?: number;                 // pg/mL
    followUpALP?: number;                 // U/L
    followUpUricAcid?: number;            // mg/dL

    // Follow-up Imaging and Tests
    followUpOtherImaging?: string;        // ECHO, USG/KUB, MCU, DMSA, UDS, MRI
    followUpGeneticTests?: string;        // Genetic test results

    // 5. Medication Adherence
    overallMedicationAdherence?: boolean;
    adherenceNonComplianceReason?: string; // Reason for non-adherence

    // Clinical notes for this visit
    clinicalNotes?: string;
    nextFollowUpDate?: Date;

    status: number;
    createdAt: Date;
    updatedAt: Date;

    // Relations
    patient?: Patient;
    followUpMedications?: FollowUpMedication[];
}

export interface FollowUpMedication {
    id: string;
    followUpId: string;
    genericName: string;
    frequency: MedicationFrequency;
    routeOfAdministration: RouteOfAdministration;
    meanDosePerDay?: number;              // mg or units per day
    startDate: Date;
    stopDate?: Date;                      // null if ongoing
    isNewMedication: boolean;             // New since last visit
    isDiscontinued: boolean;              // Discontinued since last visit
    adherence?: boolean;                  // Patient adherent to this medication
    adherenceNotes?: string;              // Specific adherence notes

    status: number;
    createdAt: Date;
    updatedAt: Date;

    // Relations
    followUp?: PatientFollowUp;
}

export interface PatientAddress {
    id: string;
    patientId: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface InformedConsent {
    id: string;
    patientId: string;
    documentType: ConsentDocumentType;
    fileName: string;
    originalFileName: string;

    // AWS S3 Storage
    s3Key: string;
    s3Url: string;
    cloudFrontUrl: string;

    // Legacy field (backward compatibility)
    filePath?: string;

    fileSize: number;
    mimeType: string;

    // Document metadata
    documentTitle?: string;
    documentDescription?: string;
    version?: string;

    // Consent specific fields
    consentStatus: ConsentStatus;
    obtainedDate?: Date;
    expiryDate?: Date;
    witnessName?: string;
    witnessSignature?: string;

    // Ethics approval fields
    ethicsCommittee?: string;
    approvalNumber?: string;
    approvalDate?: Date;

    // Audit fields
    uploadedById: string;
    verifiedById?: string;
    verifiedAt?: Date;

    status: number;
    createdAt: Date;
    updatedAt: Date;

    // Relations
    patient?: Patient;
    uploadedBy?: any;
    verifiedBy?: any;
}

export interface CreatePatientInput {
    patientId: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    gender: string;
    email?: string;
    phone?: string;
    medicalHistory?: string;
    instituteId: string;

    // Address
    address?: CreatePatientAddressInput;

    // Contact Information (Guardian/Parent details)
    guardianName?: string;
    guardianPhone?: string;
    guardianEmail?: string;
    guardianRelationship?: string;

    // Socioeconomic Information
    motherEducationLevel?: EducationLevel;
    fatherEducationLevel?: EducationLevel;
    primaryCaregiver?: PrimaryCaregiver;
    earningMembersCount?: number;
    primaryEarnerOccupation?: Occupation;
    dependentsCount?: number;
    familyIncome?: FamilyIncomeRange;

    // Payment Information for CKD Care
    paymentMode?: PaymentMode;
    hasHealthInsurance?: boolean;
    insuranceType?: InsuranceType;
    insuranceProvider?: string;
    insurancePolicyNumber?: string;
    otherPaymentDetails?: string;

    // Initial consent information
    consentType?: ConsentType;
    isVerbalConsent?: boolean;
    isWrittenConsent?: boolean;
    consentNotes?: string;
    assentRequired?: boolean;
    ethicsApprovalRequired?: boolean;
}

export interface CreatePatientAddressInput {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
}

export interface UpdatePatientInput {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: Date;
    gender?: string;
    email?: string;
    phone?: string;
    medicalHistory?: string;

    // Contact Information (Guardian/Parent details)
    guardianName?: string;
    guardianPhone?: string;
    guardianEmail?: string;
    guardianRelationship?: string;

    // Socioeconomic Information
    motherEducationLevel?: EducationLevel;
    fatherEducationLevel?: EducationLevel;
    primaryCaregiver?: PrimaryCaregiver;
    earningMembersCount?: number;
    primaryEarnerOccupation?: Occupation;
    dependentsCount?: number;
    familyIncome?: FamilyIncomeRange;

    // Payment Information for CKD Care
    paymentMode?: PaymentMode;
    hasHealthInsurance?: boolean;
    insuranceType?: InsuranceType;
    insuranceProvider?: string;
    insurancePolicyNumber?: string;
    otherPaymentDetails?: string;

    // Address update
    address?: CreatePatientAddressInput;

    // Consent updates
    consentStatusEnum?: ConsentStatus;
    consentType?: ConsentType;
    consentObtainedDate?: Date;
    isVerbalConsent?: boolean;
    isWrittenConsent?: boolean;
    consentNotes?: string;

    // Assent updates
    assentRequired?: boolean;
    assentObtained?: boolean;
    assentDate?: Date;

    // Ethics approval updates
    ethicsApprovalRequired?: boolean;
    ethicsApprovalNumber?: string;
    ethicsApprovalDate?: Date;

}

export interface UploadConsentInput {
    patientId: string;
    documentType: ConsentDocumentType;
    documentTitle?: string;
    documentDescription?: string;
    version?: string;
    consentStatus?: ConsentStatus;
    obtainedDate?: Date;
    expiryDate?: Date;
    witnessName?: string;
    ethicsCommittee?: string;
    approvalNumber?: string;
    approvalDate?: Date;
}

export enum ConsentStatus {
    PENDING = 'PENDING',
    OBTAINED = 'OBTAINED',
    DECLINED = 'DECLINED',
    EXPIRED = 'EXPIRED',
    WITHDRAWN = 'WITHDRAWN'
}

export enum ConsentType {
    INFORMED_CONSENT = 'INFORMED_CONSENT',
    ASSENT = 'ASSENT',
    PARENTAL_CONSENT = 'PARENTAL_CONSENT',
    GUARDIAN_CONSENT = 'GUARDIAN_CONSENT',
    RESEARCH_CONSENT = 'RESEARCH_CONSENT',
    TREATMENT_CONSENT = 'TREATMENT_CONSENT'
}

export enum ConsentDocumentType {
    CONSENT_FORM = 'CONSENT_FORM',
    ASSENT_FORM = 'ASSENT_FORM',
    ETHICS_APPROVAL = 'ETHICS_APPROVAL',
    WITNESS_SIGNATURE = 'WITNESS_SIGNATURE',
    PARENTAL_CONSENT = 'PARENTAL_CONSENT',
    GUARDIAN_CONSENT = 'GUARDIAN_CONSENT',
    AMENDMENT = 'AMENDMENT',
    WITHDRAWAL_FORM = 'WITHDRAWAL_FORM'
}

export enum EducationLevel {
    NO_FORMAL_EDUCATION = 'NO_FORMAL_EDUCATION',
    PRIMARY_INCOMPLETE = 'PRIMARY_INCOMPLETE',
    PRIMARY_COMPLETE = 'PRIMARY_COMPLETE',
    SECONDARY_INCOMPLETE = 'SECONDARY_INCOMPLETE',
    SECONDARY_COMPLETE = 'SECONDARY_COMPLETE',
    HIGHER_SECONDARY_INCOMPLETE = 'HIGHER_SECONDARY_INCOMPLETE',
    HIGHER_SECONDARY_COMPLETE = 'HIGHER_SECONDARY_COMPLETE',
    DIPLOMA = 'DIPLOMA',
    UNDERGRADUATE_INCOMPLETE = 'UNDERGRADUATE_INCOMPLETE',
    UNDERGRADUATE_COMPLETE = 'UNDERGRADUATE_COMPLETE',
    POSTGRADUATE_INCOMPLETE = 'POSTGRADUATE_INCOMPLETE',
    POSTGRADUATE_COMPLETE = 'POSTGRADUATE_COMPLETE',
    DOCTORAL = 'DOCTORAL',
    PROFESSIONAL_DEGREE = 'PROFESSIONAL_DEGREE'
}

export enum PrimaryCaregiver {
    MOTHER = 'MOTHER',
    FATHER = 'FATHER',
    BOTH_PARENTS = 'BOTH_PARENTS',
    GRANDMOTHER = 'GRANDMOTHER',
    GRANDFATHER = 'GRANDFATHER',
    AUNT = 'AUNT',
    UNCLE = 'UNCLE',
    SIBLING = 'SIBLING',
    SPOUSE = 'SPOUSE',
    OTHER_RELATIVE = 'OTHER_RELATIVE',
    NON_RELATIVE = 'NON_RELATIVE',
    SELF = 'SELF'
}

export enum Occupation {
    UNEMPLOYED = 'UNEMPLOYED',
    STUDENT = 'STUDENT',
    HOMEMAKER = 'HOMEMAKER',
    FARMER = 'FARMER',
    LABORER = 'LABORER',
    SKILLED_WORKER = 'SKILLED_WORKER',
    SMALL_BUSINESS_OWNER = 'SMALL_BUSINESS_OWNER',
    GOVERNMENT_EMPLOYEE = 'GOVERNMENT_EMPLOYEE',
    PRIVATE_EMPLOYEE = 'PRIVATE_EMPLOYEE',
    PROFESSIONAL = 'PROFESSIONAL',
    RETIRED = 'RETIRED',
    DISABLED = 'DISABLED',
    OTHER = 'OTHER'
}

export enum FamilyIncomeRange {
    BELOW_50000 = 'BELOW_50000',
    RANGE_50000_100000 = 'RANGE_50000_100000',
    RANGE_100000_200000 = 'RANGE_100000_200000',
    RANGE_200000_500000 = 'RANGE_200000_500000',
    RANGE_500000_1000000 = 'RANGE_500000_1000000',
    ABOVE_1000000 = 'ABOVE_1000000',
    PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY'
}

export enum PaymentMode {
    OUT_OF_POCKET = 'OUT_OF_POCKET',
    HEALTH_INSURANCE = 'HEALTH_INSURANCE',
    GOVERNMENT_SCHEME = 'GOVERNMENT_SCHEME',
    EMPLOYER_COVERAGE = 'EMPLOYER_COVERAGE',
    COMBINATION = 'COMBINATION',
    OTHER = 'OTHER'
}

export enum InsuranceType {
    GOVERNMENT_INSURANCE = 'GOVERNMENT_INSURANCE',
    PRIVATE_INSURANCE = 'PRIVATE_INSURANCE',
    EMPLOYER_INSURANCE = 'EMPLOYER_INSURANCE',
    FAMILY_INSURANCE = 'FAMILY_INSURANCE',
    MEDICLAIM = 'MEDICLAIM',
    HEALTH_SAVINGS_ACCOUNT = 'HEALTH_SAVINGS_ACCOUNT',
    OTHER = 'OTHER'
}

export enum PrimaryRenalDiagnosis {
    CONGENITAL_ANOMALIES_URINARY_TRACT = 'CONGENITAL_ANOMALIES_URINARY_TRACT',
    HEREDITARY_NEPHRITIS = 'HEREDITARY_NEPHRITIS',
    GLOMERULAR_DISEASE_PRIMARY = 'GLOMERULAR_DISEASE_PRIMARY',
    GLOMERULAR_DISEASE_SECONDARY = 'GLOMERULAR_DISEASE_SECONDARY',
    TUBULOINTERSTITIAL_DISEASE = 'TUBULOINTERSTITIAL_DISEASE',
    CYSTIC_KIDNEY_DISEASE = 'CYSTIC_KIDNEY_DISEASE',
    METABOLIC_DISORDERS = 'METABOLIC_DISORDERS',
    MALIGNANCY_RELATED = 'MALIGNANCY_RELATED',
    ISCHEMIC_NEPHROPATHY = 'ISCHEMIC_NEPHROPATHY',
    HYPERTENSIVE_NEPHROPATHY = 'HYPERTENSIVE_NEPHROPATHY',
    UNKNOWN_ETIOLOGY = 'UNKNOWN_ETIOLOGY',
    OTHER = 'OTHER'
}

export enum CKDStage {
    STAGE_3A = 'STAGE_3A',  // eGFR 45-59
    STAGE_3B = 'STAGE_3B',  // eGFR 30-44
    STAGE_4 = 'STAGE_4',    // eGFR 15-29
    STAGE_5 = 'STAGE_5'     // eGFR <15 or on dialysis
}

export enum TransplantType {
    LIVING_DONOR = 'LIVING_DONOR',
    DECEASED_DONOR = 'DECEASED_DONOR',
    BOTH_DISCUSSED = 'BOTH_DISCUSSED'
}

export enum BPClassification {
    NORMAL = 'NORMAL',
    ELEVATED = 'ELEVATED',
    STAGE_1_HTN = 'STAGE_1_HTN',
    STAGE_2_HTN = 'STAGE_2_HTN'
}

export enum GrowthPercentile {
    BELOW_3RD = 'BELOW_3RD',
    PERCENTILE_3_TO_10 = 'PERCENTILE_3_TO_10',
    PERCENTILE_10_TO_25 = 'PERCENTILE_10_TO_25',
    PERCENTILE_25_TO_50 = 'PERCENTILE_25_TO_50',
    PERCENTILE_50_TO_75 = 'PERCENTILE_50_TO_75',
    PERCENTILE_75_TO_90 = 'PERCENTILE_75_TO_90',
    PERCENTILE_90_TO_97 = 'PERCENTILE_90_TO_97',
    ABOVE_97TH = 'ABOVE_97TH'
}

export enum TannerStage {
    STAGE_1 = 'STAGE_1',
    STAGE_2 = 'STAGE_2',
    STAGE_3 = 'STAGE_3',
    STAGE_4 = 'STAGE_4',
    STAGE_5 = 'STAGE_5'
}

export enum ProteinuriaLevel {
    NEGATIVE = 'NEGATIVE',
    TRACE = 'TRACE',
    PLUS_1 = 'PLUS_1',
    PLUS_2 = 'PLUS_2',
    PLUS_3 = 'PLUS_3',
    PLUS_4 = 'PLUS_4'
}

export enum MedicationFrequency {
    ONCE_DAILY = 'ONCE_DAILY',
    TWICE_DAILY = 'TWICE_DAILY',
    THREE_TIMES_DAILY = 'THREE_TIMES_DAILY',
    FOUR_TIMES_DAILY = 'FOUR_TIMES_DAILY',
    EVERY_OTHER_DAY = 'EVERY_OTHER_DAY',
    WEEKLY = 'WEEKLY',
    MONTHLY = 'MONTHLY',
    AS_NEEDED = 'AS_NEEDED',
    OTHER = 'OTHER'
}

export enum RouteOfAdministration {
    ORAL = 'ORAL',
    SUBCUTANEOUS_INJECTION = 'SUBCUTANEOUS_INJECTION',
    IV_INJECTION = 'IV_INJECTION',
    INTRAMUSCULAR_INJECTION = 'INTRAMUSCULAR_INJECTION',
    TOPICAL = 'TOPICAL',
    INHALATION = 'INHALATION',
    RECTAL = 'RECTAL',
    OTHER = 'OTHER'
}

export interface PatientDialysis {
    id: string;
    patientId: string;
    dialysisStartDate: Date;
    isActive: boolean;                    // Current dialysis status

    // Initial Dialysis Setup
    initialDialysisModality: DialysisModality;

    // HD Access Information
    hdAccessType?: HDAccessType;
    hdAccessCreationDate?: Date;
    hdAccessComplicationNotes?: string;

    // PD Access Information
    pdCatheterType?: PDCatheterType;
    pdCatheterInsertionDate?: Date;
    pdCatheterComplicationNotes?: string;

    // Initial HD Prescription (if HD)
    hdFrequencyPerWeek?: number;          // Sessions per week
    hdSessionDurationHours?: number;      // Hours per session
    hdBloodFlowRate?: number;             // mL/min
    hdDialysateFlowRate?: number;         // mL/min
    hdUltrafiltrationGoal?: number;       // Liters
    hdDialyzerType?: string;
    hdAnticoagulation?: string;
    hdVascularAccess?: string;

    // Initial PD Prescription (if PD)
    pdModalityType?: PDModalityType;      // CAPD, CCPD, etc.
    pdFillVolume?: number;                // mL per exchange
    pdDwellTime?: number;                 // Minutes
    pdExchangesPerDay?: number;           // Number of exchanges
    pdGlucoseConcentration?: PDGlucoseConcentration;
    pdAdditionalMedications?: string;
    pdCyclerSettings?: string;            // For automated PD

    // Initial Complications
    initialComplications?: DialysisComplication[];
    initialComplicationNotes?: string;

    // Payment Information
    paymentMethod?: DialysisPaymentMethod;
    monthlyCostSelfPay?: number;          // If self-pay
    insuranceCoverage?: string;

    // Clinical Notes
    clinicalNotes?: string;

    status: number;
    createdAt: Date;
    updatedAt: Date;

    // Relations
    patient?: Patient;
    followUps?: DialysisFollowUp[];
}

export interface DialysisFollowUp {
    id: string;
    dialysisId: string;
    followUpDate: Date;
    visitNumber: number;                  // Sequential visit number for this dialysis record

    // Current Modality
    currentModality: DialysisModality;
    hasModalityChange: boolean;
    modalityChangeDate?: Date;
    modalityChangeReason?: string;

    // HD Prescription Updates (if current modality is HD)
    hdFrequencyPerWeek?: number;
    hdSessionDurationHours?: number;
    hdBloodFlowRate?: number;
    hdDialysateFlowRate?: number;
    hdUltrafiltrationGoal?: number;
    hdDialyzerType?: string;
    hdAnticoagulation?: string;
    hdVascularAccess?: string;
    hdKtV?: number;                       // Dialysis adequacy measure
    hdURR?: number;                       // Urea Reduction Ratio

    // PD Prescription Updates (if current modality is PD)
    pdModalityType?: PDModalityType;
    pdFillVolume?: number;
    pdDwellTime?: number;
    pdExchangesPerDay?: number;
    pdGlucoseConcentration?: PDGlucoseConcentration;
    pdAdditionalMedications?: string;
    pdCyclerSettings?: string;
    pdWeeklyKtV?: number;                 // PD adequacy measure
    pdCreatinineClearance?: number;       // L/week/1.73m²

    // Complications Since Last Visit
    newComplications?: DialysisComplication[];
    complicationNotes?: string;

    // Access-Related Issues
    accessProblems: boolean;
    accessProblemDescription?: string;
    accessInterventionsRequired: boolean;
    accessInterventionDetails?: string;

    // Payment Updates
    currentPaymentMethod?: DialysisPaymentMethod;
    currentMonthlyCostSelfPay?: number;
    paymentMethodChanged: boolean;

    // Laboratory Results (Dialysis-Specific)
    preDialysisWeight?: number;           // kg
    postDialysisWeight?: number;          // kg
    weightGain?: number;                  // kg
    bloodPressurePreDialysis?: string;    // "120/80"
    bloodPressurePostDialysis?: string;

    // Quality of Life Assessment
    functionalStatus?: FunctionalStatus;
    qualityOfLifeScore?: number;          // 1-10 scale

    // Clinical Assessment
    clinicalNotes?: string;
    nextFollowUpDate?: Date;

    status: number;
    createdAt: Date;
    updatedAt: Date;

    // Relations
    dialysis?: PatientDialysis;
}

export enum DialysisModality {
    HEMODIALYSIS = 'HEMODIALYSIS',
    PERITONEAL_DIALYSIS = 'PERITONEAL_DIALYSIS'
}

export enum HDAccessType {
    PERMCATH = 'PERMCATH',
    AV_FISTULA = 'AV_FISTULA',
    AV_GRAFT = 'AV_GRAFT',
    TEMPORARY_HD_CATHETER = 'TEMPORARY_HD_CATHETER',
    TUNNELED_CATHETER = 'TUNNELED_CATHETER'
}

export enum PDCatheterType {
    STRAIGHT_TENCKHOFF = 'STRAIGHT_TENCKHOFF',
    COILED_TENCKHOFF = 'COILED_TENCKHOFF',
    SWAN_NECK_CATHETER = 'SWAN_NECK_CATHETER',
    PRESTERNAL_CATHETER = 'PRESTERNAL_CATHETER',
    OTHER = 'OTHER'
}

export enum PDModalityType {
    CAPD = 'CAPD',              // Continuous Ambulatory Peritoneal Dialysis
    CCPD = 'CCPD',              // Continuous Cycling Peritoneal Dialysis
    APD = 'APD',                // Automated Peritoneal Dialysis
    NIPD = 'NIPD',              // Nocturnal Intermittent Peritoneal Dialysis
    TIDAL_PD = 'TIDAL_PD'       // Tidal Peritoneal Dialysis
}

export enum PDGlucoseConcentration {
    GLUCOSE_1_5_PERCENT = 'GLUCOSE_1_5_PERCENT',
    GLUCOSE_2_5_PERCENT = 'GLUCOSE_2_5_PERCENT',
    GLUCOSE_4_25_PERCENT = 'GLUCOSE_4_25_PERCENT',
    ICODEXTRIN = 'ICODEXTRIN',
    AMINO_ACID_SOLUTION = 'AMINO_ACID_SOLUTION'
}

export enum DialysisComplication {
    // HD Complications
    HYPOTENSION = 'HYPOTENSION',
    MUSCLE_CRAMPS = 'MUSCLE_CRAMPS',
    NAUSEA_VOMITING = 'NAUSEA_VOMITING',
    HEADACHE = 'HEADACHE',
    CHEST_PAIN = 'CHEST_PAIN',
    BACK_PAIN = 'BACK_PAIN',
    ITCHING = 'ITCHING',
    ACCESS_INFECTION = 'ACCESS_INFECTION',
    ACCESS_THROMBOSIS = 'ACCESS_THROMBOSIS',
    ACCESS_STENOSIS = 'ACCESS_STENOSIS',
    ACCESS_BLEEDING = 'ACCESS_BLEEDING',
    HEMOLYSIS = 'HEMOLYSIS',
    AIR_EMBOLISM = 'AIR_EMBOLISM',
    DISEQUILIBRIUM_SYNDROME = 'DISEQUILIBRIUM_SYNDROME',

    // PD Complications
    PERITONITIS = 'PERITONITIS',
    EXIT_SITE_INFECTION = 'EXIT_SITE_INFECTION',
    TUNNEL_INFECTION = 'TUNNEL_INFECTION',
    CATHETER_MALFUNCTION = 'CATHETER_MALFUNCTION',
    CATHETER_MIGRATION = 'CATHETER_MIGRATION',
    FLUID_LEAK = 'FLUID_LEAK',
    HERNIA = 'HERNIA',
    HYDROTHORAX = 'HYDROTHORAX',
    HEMOPERITONEUM = 'HEMOPERITONEUM',
    BOWEL_PERFORATION = 'BOWEL_PERFORATION',

    // General Complications
    ELECTROLYTE_IMBALANCE = 'ELECTROLYTE_IMBALANCE',
    FLUID_OVERLOAD = 'FLUID_OVERLOAD',
    INADEQUATE_DIALYSIS = 'INADEQUATE_DIALYSIS',
    PROTEIN_LOSS = 'PROTEIN_LOSS',
    MALNUTRITION = 'MALNUTRITION',
    BONE_DISEASE = 'BONE_DISEASE',
    CARDIOVASCULAR_COMPLICATIONS = 'CARDIOVASCULAR_COMPLICATIONS',
    OTHER = 'OTHER'
}

export enum DialysisPaymentMethod {
    FREE_GOVERNMENT = 'FREE_GOVERNMENT',
    FREE_NGO = 'FREE_NGO',
    HEALTH_INSURANCE = 'HEALTH_INSURANCE',
    SELF_PAY = 'SELF_PAY',
    EMPLOYER_COVERAGE = 'EMPLOYER_COVERAGE',
    COMBINATION = 'COMBINATION',
    OTHER = 'OTHER'
}

export enum FunctionalStatus {
    NORMAL_ACTIVITY = 'NORMAL_ACTIVITY',
    RESTRICTED_ACTIVITY = 'RESTRICTED_ACTIVITY',
    CARE_FOR_SELF = 'CARE_FOR_SELF',
    LIMITED_SELF_CARE = 'LIMITED_SELF_CARE',
    DISABLED = 'DISABLED',
    BEDRIDDEN = 'BEDRIDDEN'
}
