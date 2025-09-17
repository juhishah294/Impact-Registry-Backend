export const typeDefs = `
  scalar DateTime
  scalar Upload
  scalar JSON

  type Query {
    hello: String
    me: User
    userStatus: UserStatusResponse
    institutes: [Institute!]!
    institute(id: ID!): Institute
    pendingInstitutes: [Institute!]!
    approvedInstitutes: [Institute!]!
    
    # Patient queries
    patients(instituteId: String): [Patient!]!
    patient(id: ID!): Patient
    patientByPatientId(patientId: String!): Patient
    patientConsentDocuments(patientId: String!): [InformedConsent!]!
    generateSignedUrl(consentId: String!, expiresIn: Int): SignedUrlResponse!
    
    # Follow-up queries
    patientFollowUps(patientId: String!): [PatientFollowUp!]!
    patientFollowUp(id: ID!): PatientFollowUp
    followUpMedications(followUpId: String!): [FollowUpMedication!]!
    
    # Dialysis queries
    patientDialysisRecords(patientId: String!): [PatientDialysis!]!
    patientDialysis(id: ID!): PatientDialysis
    dialysisFollowUps(dialysisId: String!): [DialysisFollowUp!]!
    dialysisFollowUp(id: ID!): DialysisFollowUp
    
    # Dashboard queries
    ckdStageDistribution(filters: DashboardFilterInput): [CKDStageDistribution!]!
    demographicSummary(filters: DashboardFilterInput): DemographicSummary!
    dialysisPrevalence(filters: DashboardFilterInput): DialysisPrevalence!
    comorbidityAnalysis(filters: DashboardFilterInput): ComorbidityAnalysis!
    growthTrends(filters: DashboardFilterInput): GrowthTrends!
    dataCompletenessReport(filters: DashboardFilterInput): DataCompletenessReport!
    
    # Calculator queries
    calculateEGFR(input: EGFRCalculatorInput!): CalculatorResult!
    calculateBMIZScore(input: BMIZScoreCalculatorInput!): CalculatorResult!
    calculateHeightZScore(input: HeightZScoreCalculatorInput!): CalculatorResult!
    calculateBPPercentile(input: BPPercentileCalculatorInput!): CalculatorResult!
    calculateDialysisKtV(input: DialysisKtVCalculatorInput!): CalculatorResult!
    calculateDialysisURR(input: DialysisURRCalculatorInput!): CalculatorResult!
    
    # Exit queries
    patientExit(patientId: String!): PatientExit
    patientExits(filters: PatientExitFilterInput): [PatientExit!]!
  }

  type Mutation {
    login(email: String!, password: String!): LoginResponse
    createUser(input: CreateUserInput!): User
    registerInstitute(input: CreateInstituteInput!): Institute
    registerInstituteWithAdmin(input: PublicRegistrationInput!): RegistrationResponse
    registerUserToInstitute(input: UserRegistrationInput!): LoginResponse
    approveInstitute(id: ID!): Institute
    rejectInstitute(id: ID!, reason: String!): Institute
    suspendInstitute(id: ID!): Institute
    disableUser(id: ID!): User
    enableUser(id: ID!): User
    disableInstitute(id: ID!): Institute
    enableInstitute(id: ID!): Institute
    
    # Patient mutations
    createPatient(input: CreatePatientInput!): Patient!
    updatePatient(id: ID!, input: UpdatePatientInput!): Patient!
    deletePatient(id: ID!): Boolean!
    
    # Follow-up mutations
    createPatientFollowUp(input: CreatePatientFollowUpInput!): PatientFollowUp!
    updatePatientFollowUp(id: ID!, input: UpdatePatientFollowUpInput!): PatientFollowUp!
    deletePatientFollowUp(id: ID!): Boolean!
    
    # Follow-up medication mutations
    createFollowUpMedication(input: CreateFollowUpMedicationInput!): FollowUpMedication!
    updateFollowUpMedication(id: ID!, input: UpdateFollowUpMedicationInput!): FollowUpMedication!
    deleteFollowUpMedication(id: ID!): Boolean!
    
    # Dialysis mutations
    createPatientDialysis(input: CreatePatientDialysisInput!): PatientDialysis!
    updatePatientDialysis(id: ID!, input: UpdatePatientDialysisInput!): PatientDialysis!
    deletePatientDialysis(id: ID!): Boolean!
    
    # Dialysis follow-up mutations
    createDialysisFollowUp(input: CreateDialysisFollowUpInput!): DialysisFollowUp!
    updateDialysisFollowUp(id: ID!, input: UpdateDialysisFollowUpInput!): DialysisFollowUp!
    deleteDialysisFollowUp(id: ID!): Boolean!
    
    # Data export mutations
    requestDataExport(input: DataExportRequestInput!): DataExportRequest!
    
    # Calculator mutations
    saveCalculatorResult(input: SaveCalculatorResultInput!): CalculatorResult!
    
    # Exit mutations
    createPatientExit(input: CreatePatientExitInput!): PatientExit!
    updatePatientExit(id: ID!, input: UpdatePatientExitInput!): PatientExit!
    verifyPatientExit(id: ID!, verificationNotes: String): PatientExit!
    
    # Consent management
    updatePatientConsent(patientId: String!, consentStatus: ConsentStatus!, obtainedDate: DateTime, notes: String): Patient!
    uploadConsentDocument(input: UploadConsentInput!, file: Upload!): InformedConsent!
    verifyConsentDocument(consentId: String!): InformedConsent!
    deleteConsentDocument(consentId: String!): Boolean!
  }

  type User {
    id: ID!
    email: String!
    firstName: String!
    lastName: String!
    role: UserRole!
    status: UserStatus!
    instituteId: String
    institute: Institute
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Institute {
    id: ID!
    centerName: String!
    address: String!
    contactInformation: String!
    headOfDepartment: String!
    headOfDepartmentContact: String!
    coInvestigatorName: String!
    coInvestigatorContact: String!
    
    # Center Type
    isPublicSector: Boolean!
    isPrivateNonProfit: Boolean!
    isCorporateHospital: Boolean!
    isPrivatePractice: Boolean!
    
    # Payment modes
    privateInsurance: Boolean!
    governmentInsurance: Boolean!
    selfPayment: Boolean!
    
    # Public sector coverage
    medications100Percent: Boolean!
    medicationsReduced: Boolean!
    medicationsFullCost: Boolean!
    lab100Percent: Boolean!
    labReduced: Boolean!
    labFullCost: Boolean!
    hd100Percent: Boolean!
    hdReduced: Boolean!
    hdFullCost: Boolean!
    pd100Percent: Boolean!
    pdReduced: Boolean!
    pdFullCost: Boolean!
    transplant100Percent: Boolean!
    transplantReduced: Boolean!
    transplantFullCost: Boolean!
    
    # Teaching hospital
    isTeachingHospital: Boolean!
    isUGCenter: Boolean!
    isPGCenter: Boolean!
    
    # Pediatric nephrology training
    hasPediatricTraining: Boolean!
    trainingType: String
    
    # Capacity
    numberOfBeds: Int!
    numberOfFaculty: Int!
    averageTrainees: Int!
    
    # Clinical services
    standaloneCKDClinic: Boolean!
    clinicalCareNonDialysis: Boolean!
    avFistulaCreation: Boolean!
    cuffedPDCatheter: Boolean!
    permcathInsertion: Boolean!
    maintenanceHD: Boolean!
    standalonePediatricHD: Boolean!
    housedInAdultUnit: Boolean!
    maintenancePD: Boolean!
    manualCAPD: Boolean!
    cyclerCCPD: Boolean!
    kidneyTransplant: Boolean!
    livingDonorTransplant: Boolean!
    deceasedDonorTransplant: Boolean!
    
    # Available services
    routineLabServices: Boolean!
    crossMatchLab: Boolean!
    hlaTypingLab: Boolean!
    donorSpecificAntibodies: Boolean!
    therapeuticDrugMonitoring: Boolean!
    virologyLab: Boolean!
    ultrasound: Boolean!
    doppler: Boolean!
    nuclearMedicine: Boolean!
    ctOrMri: Boolean!
    echo: Boolean!
    urology: Boolean!
    interventionalRadiology: Boolean!
    picu: Boolean!
    nicu: Boolean!
    renalHistopathology: Boolean!
    ambulatoryBP: Boolean!
    
    # Personnel
    pediatricNephrologists: Boolean!
    ckdNurse: Boolean!
    dialysisNurse: Boolean!
    hdTechnicians: Boolean!
    transplantCoordinator: Boolean!
    socialWorker: Boolean!
    renalDietician: Boolean!
    psychologist: Boolean!
    patientSupportGroups: Boolean!
    inPersonEducation: Boolean!
    onlineEducation: Boolean!
    
    status: Int!
    approvalStatus: InstituteStatus!
    approvedBy: String
    approvedAt: DateTime
    rejectionReason: String
    users: [User!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type LoginResponse {
    user: User!
    token: String!
  }

  type RegistrationResponse {
    institute: Institute!
    user: User!
    token: String!
  }

  type UserStatusResponse {
    user: User!
    isActive: Boolean!
    isDisabled: Boolean!
    instituteStatus: InstituteStatusInfo
    permissions: UserPermissions!
    canAccessSystem: Boolean!
    statusMessage: String!
  }

  type InstituteStatusInfo {
    approvalStatus: InstituteStatus!
    isApproved: Boolean!
    isRejected: Boolean!
    isPending: Boolean!
    isSuspended: Boolean!
    rejectionReason: String
    approvedAt: DateTime
    approvedBy: String
  }

  type UserPermissions {
    canManageUsers: Boolean!
    canManageInstitute: Boolean!
    canViewAllInstitutes: Boolean!
    canApproveInstitutes: Boolean!
    canEnterData: Boolean!
    canViewReports: Boolean!
    canExportData: Boolean!
    canManageSystem: Boolean!
  }

  input CreateUserInput {
    email: String!
    password: String!
    firstName: String!
    lastName: String!
    role: UserRole!
    instituteId: String
  }

  input CreateInstituteInput {
    centerName: String!
    address: String!
    contactInformation: String!
    headOfDepartment: String!
    headOfDepartmentContact: String!
    coInvestigatorName: String!
    coInvestigatorContact: String!
    
    # Center Type
    isPublicSector: Boolean
    isPrivateNonProfit: Boolean
    isCorporateHospital: Boolean
    isPrivatePractice: Boolean
    
    # Payment modes
    privateInsurance: Boolean
    governmentInsurance: Boolean
    selfPayment: Boolean
    
    # Public sector coverage
    medications100Percent: Boolean
    medicationsReduced: Boolean
    medicationsFullCost: Boolean
    lab100Percent: Boolean
    labReduced: Boolean
    labFullCost: Boolean
    hd100Percent: Boolean
    hdReduced: Boolean
    hdFullCost: Boolean
    pd100Percent: Boolean
    pdReduced: Boolean
    pdFullCost: Boolean
    transplant100Percent: Boolean
    transplantReduced: Boolean
    transplantFullCost: Boolean
    
    # Teaching hospital
    isTeachingHospital: Boolean
    isUGCenter: Boolean
    isPGCenter: Boolean
    
    # Pediatric nephrology training
    hasPediatricTraining: Boolean
    trainingType: String
    
    # Capacity
    numberOfBeds: Int
    numberOfFaculty: Int
    averageTrainees: Int
    
    # Clinical services
    standaloneCKDClinic: Boolean
    clinicalCareNonDialysis: Boolean
    avFistulaCreation: Boolean
    cuffedPDCatheter: Boolean
    permcathInsertion: Boolean
    maintenanceHD: Boolean
    standalonePediatricHD: Boolean
    housedInAdultUnit: Boolean
    maintenancePD: Boolean
    manualCAPD: Boolean
    cyclerCCPD: Boolean
    kidneyTransplant: Boolean
    livingDonorTransplant: Boolean
    deceasedDonorTransplant: Boolean
    
    # Available services
    routineLabServices: Boolean
    crossMatchLab: Boolean
    hlaTypingLab: Boolean
    donorSpecificAntibodies: Boolean
    therapeuticDrugMonitoring: Boolean
    virologyLab: Boolean
    ultrasound: Boolean
    doppler: Boolean
    nuclearMedicine: Boolean
    ctOrMri: Boolean
    echo: Boolean
    urology: Boolean
    interventionalRadiology: Boolean
    picu: Boolean
    nicu: Boolean
    renalHistopathology: Boolean
    ambulatoryBP: Boolean
    
    # Personnel
    pediatricNephrologists: Boolean
    ckdNurse: Boolean
    dialysisNurse: Boolean
    hdTechnicians: Boolean
    transplantCoordinator: Boolean
    socialWorker: Boolean
    renalDietician: Boolean
    psychologist: Boolean
    patientSupportGroups: Boolean
    inPersonEducation: Boolean
    onlineEducation: Boolean
  }

  input PublicRegistrationInput {
    # Institute Information
    centerName: String!
    address: String!
    contactInformation: String!
    headOfDepartment: String!
    headOfDepartmentContact: String!
    coInvestigatorName: String!
    coInvestigatorContact: String!
    
    # Center Type
    isPublicSector: Boolean
    isPrivateNonProfit: Boolean
    isCorporateHospital: Boolean
    isPrivatePractice: Boolean
    
    # Payment modes
    privateInsurance: Boolean
    governmentInsurance: Boolean
    selfPayment: Boolean
    
    # Public sector coverage
    medications100Percent: Boolean
    medicationsReduced: Boolean
    medicationsFullCost: Boolean
    lab100Percent: Boolean
    labReduced: Boolean
    labFullCost: Boolean
    hd100Percent: Boolean
    hdReduced: Boolean
    hdFullCost: Boolean
    pd100Percent: Boolean
    pdReduced: Boolean
    pdFullCost: Boolean
    transplant100Percent: Boolean
    transplantReduced: Boolean
    transplantFullCost: Boolean
    
    # Teaching hospital
    isTeachingHospital: Boolean
    isUGCenter: Boolean
    isPGCenter: Boolean
    
    # Pediatric nephrology training
    hasPediatricTraining: Boolean
    trainingType: String
    
    # Capacity
    numberOfBeds: Int
    numberOfFaculty: Int
    averageTrainees: Int
    
    # Clinical services
    standaloneCKDClinic: Boolean
    clinicalCareNonDialysis: Boolean
    avFistulaCreation: Boolean
    cuffedPDCatheter: Boolean
    permcathInsertion: Boolean
    maintenanceHD: Boolean
    standalonePediatricHD: Boolean
    housedInAdultUnit: Boolean
    maintenancePD: Boolean
    manualCAPD: Boolean
    cyclerCCPD: Boolean
    kidneyTransplant: Boolean
    livingDonorTransplant: Boolean
    deceasedDonorTransplant: Boolean
    
    # Available services
    routineLabServices: Boolean
    crossMatchLab: Boolean
    hlaTypingLab: Boolean
    donorSpecificAntibodies: Boolean
    therapeuticDrugMonitoring: Boolean
    virologyLab: Boolean
    ultrasound: Boolean
    doppler: Boolean
    nuclearMedicine: Boolean
    ctOrMri: Boolean
    echo: Boolean
    urology: Boolean
    interventionalRadiology: Boolean
    picu: Boolean
    nicu: Boolean
    renalHistopathology: Boolean
    ambulatoryBP: Boolean
    
    # Personnel
    pediatricNephrologists: Boolean
    ckdNurse: Boolean
    dialysisNurse: Boolean
    hdTechnicians: Boolean
    transplantCoordinator: Boolean
    socialWorker: Boolean
    renalDietician: Boolean
    psychologist: Boolean
    patientSupportGroups: Boolean
    inPersonEducation: Boolean
    onlineEducation: Boolean
    
    # Admin User Information
    adminEmail: String!
    adminPassword: String!
    adminFirstName: String!
    adminLastName: String!
  }

  input UserRegistrationInput {
    email: String!
    password: String!
    firstName: String!
    lastName: String!
    instituteId: String!
    role: UserRole!
  }

  enum UserRole {
    SUPER_ADMIN
    INSTITUTE_ADMIN
    ADMIN
    DATA_ENTRY
  }

  enum UserStatus {
    ACTIVE
    INACTIVE
    SUSPENDED
    PENDING
  }

  enum InstituteStatus {
    PENDING_APPROVAL
    APPROVED
    REJECTED
    SUSPENDED
  }

  # Patient Management Types
  type Patient {
    id: ID!
    patientId: String!
    firstName: String!
    lastName: String!
    dateOfBirth: DateTime!
    gender: Gender!
    email: String
    phone: String
    medicalHistory: String
    instituteId: String!
    
    # Contact Information (Guardian/Parent details)
    guardianName: String
    guardianPhone: String
    guardianEmail: String
    guardianRelationship: String
    
    # Socioeconomic Information
    motherEducationLevel: EducationLevel
    fatherEducationLevel: EducationLevel
    primaryCaregiver: PrimaryCaregiver
    earningMembersCount: Int
    primaryEarnerOccupation: Occupation
    dependentsCount: Int
    familyIncome: FamilyIncomeRange
    
    # Payment Information for CKD Care
    paymentMode: PaymentMode
    hasHealthInsurance: Boolean
    insuranceType: InsuranceType
    insuranceProvider: String
    insurancePolicyNumber: String
    otherPaymentDetails: String
    
    # Legacy consent fields
    consentStatus: Boolean!
    consentDate: DateTime
    
    # Enhanced consent fields
    consentStatusEnum: ConsentStatus!
    consentType: ConsentType
    consentObtainedDate: DateTime
    isVerbalConsent: Boolean!
    isWrittenConsent: Boolean!
    consentNotes: String
    
    # Assent for minors
    assentRequired: Boolean!
    assentObtained: Boolean!
    assentDate: DateTime
    
    # Ethics approval
    ethicsApprovalRequired: Boolean!
    ethicsApprovalNumber: String
    ethicsApprovalDate: DateTime
    
    # Clinical History and CKD Information
    ageAtDiagnosis: Int                    # Age in months
    primaryRenalDiagnosis: PrimaryRenalDiagnosis
    symptomDurationYears: Int
    symptomDurationMonths: Int
    diagnosisDurationYears: Int
    diagnosisDurationMonths: Int
    surgicalInterventions: String
    currentCKDStage: CKDStage
    currentComplaints: [String!]           # Array of complaints
    comorbidities: [String!]               # Array of comorbidities
    
    # CKD Stage 5 - Dialysis Information
    isDialysisInitiated: Boolean
    dialysisNotInitiatedReason: String
    
    # CKD Stage 4 - Preemptive Transplant
    isPreemptiveTransplantDiscussed: Boolean
    
    # CKD Stage 5 - Transplant Evaluation
    isTransplantEvaluationInitiated: Boolean
    transplantType: TransplantType
    transplantNotInitiatedReason: String
    
    # Physical Examination
    height: Float                          # in cm
    heightSDS: Float                       # Standard Deviation Score
    weight: Float                          # in kg
    bmi: Float                             # calculated
    bmiSDS: Float                          # for height age
    systolicBP: Int                        # mmHg
    diastolicBP: Int                       # mmHg
    sbpPercentile: Float                   # for < 13 years
    dbpPercentile: Float                   # for < 13 years
    bpClassification: BPClassification
    growthPercentile: GrowthPercentile
    tannerStage: TannerStage
    
    # Laboratory Investigations (Mandatory fields marked with *)
    serumCreatinine: Float                 # *mandatory - mg/dL
    serumUrea: Float                       # *mandatory - mg/dL
    eGFR: Float                            # *mandatory - calculated
    proteinuriaDipstick: ProteinuriaLevel
    hemoglobin: Float                      # *mandatory - g/dL
    sodium: Float                          # *mandatory - mEq/L
    potassium: Float                       # *mandatory - mEq/L
    chloride: Float                        # mEq/L
    bicarbonate: Float                     # *mandatory - mEq/L
    calcium: Float                         # *mandatory - mg/dL
    phosphorus: Float                      # *mandatory - mg/dL
    vitaminD: Float                        # *mandatory - ng/mL
    ironLevel: Float                       # μg/dL
    ferritin: Float                        # ng/mL
    pth: Float                             # pg/mL
    alp: Float                             # U/L
    uricAcid: Float                        # mg/dL
    
    # Other Imaging and Tests
    otherImaging: String                   # Free text for ECHO, USG/KUB, MCU, DMSA, UDS, MRI
    geneticTests: String                   # Free text for genetic test results
    
    status: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    
    # Relations
    institute: Institute!
    address: PatientAddress
    consentDocuments: [InformedConsent!]!
    medications: [PatientMedication!]!
    followUps: [PatientFollowUp!]!
    dialysisRecords: [PatientDialysis!]!
    patientExit: PatientExit
  }

  type PatientMedication {
    id: ID!
    patientId: String!
    genericName: String!
    frequency: MedicationFrequency!
    routeOfAdministration: RouteOfAdministration!
    meanDosePerDay: Float                  # mg or units per day
    startDate: DateTime!
    stopDate: DateTime                     # null if ongoing
    
    status: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    
    # Relations
    patient: Patient!
  }

  type PatientFollowUp {
    id: ID!
    patientId: String!
    followUpDate: DateTime!
    visitNumber: Int!                     # Sequential visit number
    
    # 1. Socioeconomic and Demographic Updates
    hasSocioeconomicChanges: Boolean!
    hasResidenceChange: Boolean
    hasContactChange: Boolean
    hasIncomeChange: Boolean
    hasEducationStatusChange: Boolean
    hasPaymentStatusChange: Boolean
    
    # Updated socioeconomic fields (only if changes occurred)
    newFamilyIncome: FamilyIncomeRange
    newPaymentMode: PaymentMode
    newHasHealthInsurance: Boolean
    newInsuranceType: InsuranceType
    newInsuranceProvider: String
    newMotherEducationLevel: EducationLevel
    newFatherEducationLevel: EducationLevel
    newPrimaryCaregiver: PrimaryCaregiver
    newEarningMembersCount: Int
    newPrimaryEarnerOccupation: Occupation
    newDependentsCount: Int
    
    # Contact updates
    newGuardianName: String
    newGuardianPhone: String
    newGuardianEmail: String
    newGuardianRelationship: String
    
    # 2. Clinical History and CKD Updates
    currentCKDStage: CKDStage
    
    # CKD Stage 5 - Dialysis Status Update
    isDialysisInitiated: Boolean
    dialysisNotInitiatedReason: String
    
    # New symptoms since last visit
    newSymptomsSinceLastVisit: [String!]  # Array of new symptoms
    
    # Structured Comorbidity Status Checklist
    hasHypertension: Boolean
    hasGrowthFailure: Boolean
    hasAnemia: Boolean
    hasBoneMineralDisease: Boolean
    hasMetabolicAcidosis: Boolean
    otherComorbidities: [String!]         # Additional comorbidities
    
    # Hospitalization tracking
    hasHospitalizationSinceLastVisit: Boolean
    hospitalizationDetails: String       # Dates and details
    
    # 3. Physical Examination Updates
    currentHeight: Float                  # in cm
    currentHeightSDS: Float               # Standard Deviation Score
    currentWeight: Float                  # in kg
    currentBMI: Float                     # calculated
    currentBMISDS: Float                  # for height age
    currentSystolicBP: Int                # mmHg
    currentDiastolicBP: Int               # mmHg
    currentSBPPercentile: Float           # for < 13 years
    currentDBPPercentile: Float           # for < 13 years
    currentBPClassification: BPClassification
    currentTannerStage: TannerStage
    
    # 4. Laboratory Investigations (Follow-up)
    followUpSerumCreatinine: Float        # *mandatory - mg/dL
    followUpSerumUrea: Float              # *mandatory - mg/dL
    followUpEGFR: Float                   # *mandatory - calculated
    followUpProteinuriaDipstick: ProteinuriaLevel
    followUpHemoglobin: Float             # *mandatory - g/dL
    followUpSodium: Float                 # *mandatory - mEq/L
    followUpPotassium: Float              # *mandatory - mEq/L
    followUpChloride: Float               # mEq/L
    followUpBicarbonate: Float            # *mandatory - mEq/L
    followUpCalcium: Float                # *mandatory - mg/dL
    followUpPhosphorus: Float             # *mandatory - mg/dL
    followUpVitaminD: Float               # *mandatory - ng/mL
    followUpIronLevel: Float              # μg/dL
    followUpFerritin: Float               # ng/mL
    followUpPTH: Float                    # pg/mL
    followUpALP: Float                    # U/L
    followUpUricAcid: Float               # mg/dL
    
    # Follow-up Imaging and Tests
    followUpOtherImaging: String          # ECHO, USG/KUB, MCU, DMSA, UDS, MRI
    followUpGeneticTests: String          # Genetic test results
    
    # 5. Medication Adherence
    overallMedicationAdherence: Boolean
    adherenceNonComplianceReason: String  # Reason for non-adherence
    
    # Clinical notes for this visit
    clinicalNotes: String
    nextFollowUpDate: DateTime
    
    status: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    
    # Relations
    patient: Patient!
    followUpMedications: [FollowUpMedication!]!
  }

  type FollowUpMedication {
    id: ID!
    followUpId: String!
    genericName: String!
    frequency: MedicationFrequency!
    routeOfAdministration: RouteOfAdministration!
    meanDosePerDay: Float                 # mg or units per day
    startDate: DateTime!
    stopDate: DateTime                    # null if ongoing
    isNewMedication: Boolean!             # New since last visit
    isDiscontinued: Boolean!              # Discontinued since last visit
    adherence: Boolean                    # Patient adherent to this medication
    adherenceNotes: String                # Specific adherence notes
    
    status: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    
    # Relations
    followUp: PatientFollowUp!
  }

  type PatientDialysis {
    id: ID!
    patientId: String!
    dialysisStartDate: DateTime!
    isActive: Boolean!                    # Current dialysis status
    
    # Initial Dialysis Setup
    initialDialysisModality: DialysisModality!
    
    # HD Access Information
    hdAccessType: HDAccessType
    hdAccessCreationDate: DateTime
    hdAccessComplicationNotes: String
    
    # PD Access Information
    pdCatheterType: PDCatheterType
    pdCatheterInsertionDate: DateTime
    pdCatheterComplicationNotes: String
    
    # Initial HD Prescription (if HD)
    hdFrequencyPerWeek: Int               # Sessions per week
    hdSessionDurationHours: Float         # Hours per session
    hdBloodFlowRate: Int                  # mL/min
    hdDialysateFlowRate: Int              # mL/min
    hdUltrafiltrationGoal: Float          # Liters
    hdDialyzerType: String
    hdAnticoagulation: String
    hdVascularAccess: String
    
    # Initial PD Prescription (if PD)
    pdModalityType: PDModalityType        # CAPD, CCPD, etc.
    pdFillVolume: Int                     # mL per exchange
    pdDwellTime: Int                      # Minutes
    pdExchangesPerDay: Int                # Number of exchanges
    pdGlucoseConcentration: PDGlucoseConcentration
    pdAdditionalMedications: String
    pdCyclerSettings: String              # For automated PD
    
    # Initial Complications
    initialComplications: [DialysisComplication!]
    initialComplicationNotes: String
    
    # Payment Information
    paymentMethod: DialysisPaymentMethod
    monthlyCostSelfPay: Float             # If self-pay
    insuranceCoverage: String
    
    # Clinical Notes
    clinicalNotes: String
    
    status: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    
    # Relations
    patient: Patient!
    followUps: [DialysisFollowUp!]!
  }

  type DialysisFollowUp {
    id: ID!
    dialysisId: String!
    followUpDate: DateTime!
    visitNumber: Int!                     # Sequential visit number for this dialysis record
    
    # Current Modality
    currentModality: DialysisModality!
    hasModalityChange: Boolean!
    modalityChangeDate: DateTime
    modalityChangeReason: String
    
    # HD Prescription Updates (if current modality is HD)
    hdFrequencyPerWeek: Int
    hdSessionDurationHours: Float
    hdBloodFlowRate: Int
    hdDialysateFlowRate: Int
    hdUltrafiltrationGoal: Float
    hdDialyzerType: String
    hdAnticoagulation: String
    hdVascularAccess: String
    hdKtV: Float                          # Dialysis adequacy measure
    hdURR: Float                          # Urea Reduction Ratio
    
    # PD Prescription Updates (if current modality is PD)
    pdModalityType: PDModalityType
    pdFillVolume: Int
    pdDwellTime: Int
    pdExchangesPerDay: Int
    pdGlucoseConcentration: PDGlucoseConcentration
    pdAdditionalMedications: String
    pdCyclerSettings: String
    pdWeeklyKtV: Float                    # PD adequacy measure
    pdCreatinineClearance: Float          # L/week/1.73m²
    
    # Complications Since Last Visit
    newComplications: [DialysisComplication!]
    complicationNotes: String
    
    # Access-Related Issues
    accessProblems: Boolean!
    accessProblemDescription: String
    accessInterventionsRequired: Boolean!
    accessInterventionDetails: String
    
    # Payment Updates
    currentPaymentMethod: DialysisPaymentMethod
    currentMonthlyCostSelfPay: Float
    paymentMethodChanged: Boolean!
    
    # Laboratory Results (Dialysis-Specific)
    preDialysisWeight: Float              # kg
    postDialysisWeight: Float             # kg
    weightGain: Float                     # kg
    bloodPressurePreDialysis: String      # "120/80"
    bloodPressurePostDialysis: String
    
    # Quality of Life Assessment
    functionalStatus: FunctionalStatus
    qualityOfLifeScore: Int               # 1-10 scale
    
    # Clinical Assessment
    clinicalNotes: String
    nextFollowUpDate: DateTime
    
    status: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    
    # Relations
    dialysis: PatientDialysis!
  }

  # Dashboard Types
  type CKDStageDistribution {
    stage: String!
    count: Int!
    percentage: Float!
  }

  type DemographicSummary {
    totalPatients: Int!
    genderDistribution: [GenderDistribution!]!
    ageGroups: [AgeGroupDistribution!]!
    regionalDistribution: [RegionalDistribution!]!
  }

  type GenderDistribution {
    gender: String!
    count: Int!
    percentage: Float!
  }

  type AgeGroupDistribution {
    ageGroup: String!
    count: Int!
    percentage: Float!
  }

  type RegionalDistribution {
    region: String!
    count: Int!
    percentage: Float!
  }

  type DialysisPrevalence {
    totalCKDPatients: Int!
    dialysisPatients: Int!
    dialysisPercentage: Float!
    modalityDistribution: [ModalityDistribution!]!
    accessDistribution: [AccessDistribution!]!
  }

  type ModalityDistribution {
    modality: String!
    count: Int!
    percentage: Float!
  }

  type AccessDistribution {
    accessType: String!
    count: Int!
    percentage: Float!
  }

  type ComorbidityAnalysis {
    hypertension: ComorbidityMetric!
    anemia: ComorbidityMetric!
    boneDiseaseCount: ComorbidityMetric!
    growthFailure: ComorbidityMetric!
    metabolicAcidosis: ComorbidityMetric!
  }

  type ComorbidityMetric {
    count: Int!
    percentage: Float!
  }

  type GrowthTrends {
    heightZScoreDistribution: [ZScoreDistribution!]!
    bmiZScoreDistribution: [ZScoreDistribution!]!
    averageHeightZScore: Float!
    averageBMIZScore: Float!
  }

  type ZScoreDistribution {
    range: String!
    count: Int!
    percentage: Float!
  }

  type DataCompletenessReport {
    totalPatients: Int!
    completenessMetrics: [CompletenessMetric!]!
    overallCompleteness: Float!
  }

  type CompletenessMetric {
    field: String!
    completed: Int!
    percentage: Float!
    category: String!
  }

  # Calculator Types
  type CalculatorResult {
    id: ID
    value: Float!
    unit: String!
    interpretation: String!
    category: String
    percentile: Float
    zScore: Float
    reference: String
    createdAt: DateTime
  }

  type DataExportRequest {
    id: ID!
    exportType: ExportDataType!
    exportFormat: ExportFormat!
    fileName: String!
    status: ExportStatus!
    downloadUrl: String
    expiresAt: DateTime
    errorMessage: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  # Exit System Types
  type PatientExit {
    id: ID!
    patientId: String!
    exitDate: DateTime!
    exitCause: ExitCause!
    
    # Detailed exit information based on cause
    deathDetails: PatientDeath
    lossToFollowUpDetails: PatientLossToFollowUp
    transplantDetails: PatientTransplant
    
    # General exit information
    exitNotes: String
    reportedBy: String!
    verifiedBy: String
    verificationDate: DateTime
    
    status: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    
    # Relations
    patient: Patient!
    reportedByUser: User!
    verifiedByUser: User
  }

  type PatientDeath {
    id: ID!
    patientExitId: String!
    
    # Death Details
    dateOfDeath: DateTime!
    timeOfDeath: String
    placeOfDeath: PlaceOfDeath!
    hospitalName: String
    
    # Cause of Death
    primaryCauseOfDeath: CauseOfDeath!
    secondaryCauseOfDeath: CauseOfDeath
    immediateCareCause: String
    underlyingCause: String
    
    # CKD-Related Death Details
    isCKDRelated: Boolean!
    ckdRelatedCause: CKDDeathCause
    dialysisRelated: Boolean!
    dialysisComplication: DialysisComplication
    
    # Cardiovascular Death (common in CKD)
    isCardiovascular: Boolean!
    cardiovascularCause: CardiovascularDeathCause
    
    # Infection-Related Death
    isInfectionRelated: Boolean!
    infectionType: InfectionType
    infectionSite: String
    
    # Autopsy Information
    autopsyPerformed: Boolean!
    autopsyFindings: String
    
    # Death Certificate
    deathCertificateNumber: String
    certifyingPhysician: String
    
    # Family/Guardian Information
    informedFamily: Boolean!
    familyContactDate: DateTime
    familyContactPerson: String
    
    # Additional Details
    clinicalNotes: String
    
    status: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    
    # Relations
    patientExit: PatientExit!
  }

  type PatientLossToFollowUp {
    id: ID!
    patientExitId: String!
    
    # Loss to Follow-up Details
    lastContactDate: DateTime!
    lastVisitDate: DateTime!
    durationOfLoss: Int!
    
    # Contact Attempts (Prevention Checklist)
    phoneCallAttempts: Int!
    phoneCallDates: [String!]!
    phoneCallOutcomes: [String!]!
    
    smsAttempts: Int!
    smsDates: [String!]!
    smsDeliveryStatus: [String!]!
    
    emailAttempts: Int!
    emailDates: [String!]!
    emailDeliveryStatus: [String!]!
    
    homeVisitAttempts: Int!
    homeVisitDates: [String!]!
    homeVisitOutcomes: [String!]!
    
    letterAttempts: Int!
    letterDates: [String!]!
    letterDeliveryStatus: [String!]!
    
    # Contact Person Attempts
    emergencyContactAttempts: Int!
    emergencyContactDates: [String!]!
    emergencyContactOutcomes: [String!]!
    
    # Reasons for Loss to Follow-up
    suspectedReasons: [LossToFollowUpReason!]!
    familyReportedReasons: String
    
    # Geographic/Social Factors
    hasRelocated: Boolean!
    newLocation: String
    hasChangedContact: Boolean!
    
    # Financial Factors
    financialConstraints: Boolean!
    transportationIssues: Boolean!
    
    # Medical Factors
    improvedCondition: Boolean!
    seekingAlternativeCare: Boolean!
    alternativeCareProvider: String
    
    # Prevention Checklist Completion
    checklistCompletedBy: String!
    checklistCompletionDate: DateTime!
    
    # Follow-up Actions
    referredToSocialWorker: Boolean!
    socialWorkerNotes: String
    
    # Final Classification
    finalClassification: LossToFollowUpClassification!
    
    # Additional Notes
    clinicalNotes: String
    
    status: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    
    # Relations
    patientExit: PatientExit!
    checklistCompletedByUser: User!
  }

  type PatientTransplant {
    id: ID!
    patientExitId: String!
    
    # Transplant Achievement Details
    transplantDate: DateTime!
    transplantType: TransplantType!
    
    # Donor Information
    donorType: DonorType!
    donorAge: Int
    donorGender: Gender
    donorRelationship: DonorRelationship
    
    # Living Donor Details (if applicable)
    livingDonorName: String
    livingDonorContact: String
    donorWorkup: Boolean
    donorWorkupDate: DateTime
    donorCompatibility: String
    
    # Deceased Donor Details (if applicable)
    donorOrganizationName: String
    waitingListDuration: Int
    waitingListRegistrationDate: DateTime
    
    # Transplant Center Information
    transplantCenter: String!
    transplantCenterCity: String!
    transplantCenterState: String!
    surgeonName: String
    
    # Pre-Transplant Assessment
    preTransplantEGFR: Float
    preTransplantDialysis: Boolean!
    dialysisDuration: Int
    preemptiveTransplant: Boolean!
    
    # Transplant Procedure Details
    surgeryDuration: Float
    coldIschemiaTime: Float
    warmIschemiaTime: Float
    
    # Immunosuppression Protocol
    inductionTherapy: String
    maintenanceImmunosuppression: String
    
    # Early Outcomes (30 days)
    immediateGraftFunction: GraftFunction!
    delayedGraftFunction: Boolean!
    acuteRejectionEpisodes: Int!
    
    # Complications
    surgicalComplications: [String!]!
    medicalComplications: [String!]!
    
    # Follow-up Plan
    followUpCenter: String
    followUpPhysician: String
    followUpContact: String
    
    # Transition Details
    registryTransitionDate: DateTime
    newRegistryName: String
    dataTransferCompleted: Boolean!
    
    # Additional Information
    transplantNotes: String
    familyEducationCompleted: Boolean!
    
    status: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    
    # Relations
    patientExit: PatientExit!
  }

  type PatientAddress {
    id: ID!
    patientId: String!
    line1: String!
    line2: String
    city: String!
    state: String!
    country: String!
    postalCode: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type SignedUrlResponse {
    signedUrl: String!
    expiresIn: Int!
    fileName: String!
    fileSize: Int!
    mimeType: String!
  }

  type InformedConsent {
    id: ID!
    patientId: String!
    documentType: ConsentDocumentType!
    fileName: String!
    originalFileName: String!
    
    # AWS S3 Storage URLs
    s3Key: String!
    s3Url: String!
    cloudFrontUrl: String!
    
    # Legacy field (backward compatibility)
    filePath: String
    
    fileSize: Int!
    mimeType: String!
    
    # Document metadata
    documentTitle: String
    documentDescription: String
    version: String
    
    # Consent specific fields
    consentStatus: ConsentStatus!
    obtainedDate: DateTime
    expiryDate: DateTime
    witnessName: String
    witnessSignature: String
    
    # Ethics approval fields
    ethicsCommittee: String
    approvalNumber: String
    approvalDate: DateTime
    
    # Audit fields
    uploadedById: String!
    verifiedById: String
    verifiedAt: DateTime
    
    status: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    
    # Relations
    patient: Patient!
    uploadedBy: User!
    verifiedBy: User
  }

  input CreatePatientInput {
    patientId: String!
    firstName: String!
    lastName: String!
    dateOfBirth: DateTime!
    gender: Gender!
    email: String
    phone: String
    medicalHistory: String
    instituteId: String!
    
    # Address
    address: CreatePatientAddressInput
    
    # Contact Information (Guardian/Parent details)
    guardianName: String
    guardianPhone: String
    guardianEmail: String
    guardianRelationship: String
    
    # Socioeconomic Information
    motherEducationLevel: EducationLevel
    fatherEducationLevel: EducationLevel
    primaryCaregiver: PrimaryCaregiver
    earningMembersCount: Int
    primaryEarnerOccupation: Occupation
    dependentsCount: Int
    familyIncome: FamilyIncomeRange
    
    # Payment Information for CKD Care
    paymentMode: PaymentMode
    hasHealthInsurance: Boolean
    insuranceType: InsuranceType
    insuranceProvider: String
    insurancePolicyNumber: String
    otherPaymentDetails: String
    
    # Initial consent information
    consentType: ConsentType
    isVerbalConsent: Boolean
    isWrittenConsent: Boolean
    consentNotes: String
    assentRequired: Boolean
    ethicsApprovalRequired: Boolean
  }

  input CreatePatientAddressInput {
    line1: String!
    line2: String
    city: String!
    state: String!
    country: String!
    postalCode: String!
  }

  input CreatePatientFollowUpInput {
    patientId: String!
    followUpDate: DateTime!
    visitNumber: Int!
    
    # 1. Socioeconomic and Demographic Updates
    hasSocioeconomicChanges: Boolean!
    hasResidenceChange: Boolean
    hasContactChange: Boolean
    hasIncomeChange: Boolean
    hasEducationStatusChange: Boolean
    hasPaymentStatusChange: Boolean
    
    # Updated socioeconomic fields (only if changes occurred)
    newFamilyIncome: FamilyIncomeRange
    newPaymentMode: PaymentMode
    newHasHealthInsurance: Boolean
    newInsuranceType: InsuranceType
    newInsuranceProvider: String
    newMotherEducationLevel: EducationLevel
    newFatherEducationLevel: EducationLevel
    newPrimaryCaregiver: PrimaryCaregiver
    newEarningMembersCount: Int
    newPrimaryEarnerOccupation: Occupation
    newDependentsCount: Int
    
    # Contact updates
    newGuardianName: String
    newGuardianPhone: String
    newGuardianEmail: String
    newGuardianRelationship: String
    
    # 2. Clinical History and CKD Updates
    currentCKDStage: CKDStage
    
    # CKD Stage 5 - Dialysis Status Update
    isDialysisInitiated: Boolean
    dialysisNotInitiatedReason: String
    
    # New symptoms since last visit
    newSymptomsSinceLastVisit: [String!]
    
    # Structured Comorbidity Status Checklist
    hasHypertension: Boolean
    hasGrowthFailure: Boolean
    hasAnemia: Boolean
    hasBoneMineralDisease: Boolean
    hasMetabolicAcidosis: Boolean
    otherComorbidities: [String!]
    
    # Hospitalization tracking
    hasHospitalizationSinceLastVisit: Boolean
    hospitalizationDetails: String
    
    # 3. Physical Examination Updates
    currentHeight: Float
    currentHeightSDS: Float
    currentWeight: Float
    currentBMI: Float
    currentBMISDS: Float
    currentSystolicBP: Int
    currentDiastolicBP: Int
    currentSBPPercentile: Float
    currentDBPPercentile: Float
    currentBPClassification: BPClassification
    currentTannerStage: TannerStage
    
    # 4. Laboratory Investigations (Follow-up)
    followUpSerumCreatinine: Float        # *mandatory
    followUpSerumUrea: Float              # *mandatory
    followUpEGFR: Float                   # *mandatory
    followUpProteinuriaDipstick: ProteinuriaLevel
    followUpHemoglobin: Float             # *mandatory
    followUpSodium: Float                 # *mandatory
    followUpPotassium: Float              # *mandatory
    followUpChloride: Float
    followUpBicarbonate: Float            # *mandatory
    followUpCalcium: Float                # *mandatory
    followUpPhosphorus: Float             # *mandatory
    followUpVitaminD: Float               # *mandatory
    followUpIronLevel: Float
    followUpFerritin: Float
    followUpPTH: Float
    followUpALP: Float
    followUpUricAcid: Float
    
    # Follow-up Imaging and Tests
    followUpOtherImaging: String
    followUpGeneticTests: String
    
    # 5. Medication Adherence
    overallMedicationAdherence: Boolean
    adherenceNonComplianceReason: String
    
    # Clinical notes
    clinicalNotes: String
    nextFollowUpDate: DateTime
  }

  input UpdatePatientFollowUpInput {
    followUpDate: DateTime
    visitNumber: Int
    
    # All the same fields as CreatePatientFollowUpInput but optional
    hasSocioeconomicChanges: Boolean
    hasResidenceChange: Boolean
    hasContactChange: Boolean
    hasIncomeChange: Boolean
    hasEducationStatusChange: Boolean
    hasPaymentStatusChange: Boolean
    
    newFamilyIncome: FamilyIncomeRange
    newPaymentMode: PaymentMode
    newHasHealthInsurance: Boolean
    newInsuranceType: InsuranceType
    newInsuranceProvider: String
    newMotherEducationLevel: EducationLevel
    newFatherEducationLevel: EducationLevel
    newPrimaryCaregiver: PrimaryCaregiver
    newEarningMembersCount: Int
    newPrimaryEarnerOccupation: Occupation
    newDependentsCount: Int
    
    newGuardianName: String
    newGuardianPhone: String
    newGuardianEmail: String
    newGuardianRelationship: String
    
    currentCKDStage: CKDStage
    isDialysisInitiated: Boolean
    dialysisNotInitiatedReason: String
    newSymptomsSinceLastVisit: [String!]
    
    hasHypertension: Boolean
    hasGrowthFailure: Boolean
    hasAnemia: Boolean
    hasBoneMineralDisease: Boolean
    hasMetabolicAcidosis: Boolean
    otherComorbidities: [String!]
    
    hasHospitalizationSinceLastVisit: Boolean
    hospitalizationDetails: String
    
    currentHeight: Float
    currentHeightSDS: Float
    currentWeight: Float
    currentBMI: Float
    currentBMISDS: Float
    currentSystolicBP: Int
    currentDiastolicBP: Int
    currentSBPPercentile: Float
    currentDBPPercentile: Float
    currentBPClassification: BPClassification
    currentTannerStage: TannerStage
    
    followUpSerumCreatinine: Float
    followUpSerumUrea: Float
    followUpEGFR: Float
    followUpProteinuriaDipstick: ProteinuriaLevel
    followUpHemoglobin: Float
    followUpSodium: Float
    followUpPotassium: Float
    followUpChloride: Float
    followUpBicarbonate: Float
    followUpCalcium: Float
    followUpPhosphorus: Float
    followUpVitaminD: Float
    followUpIronLevel: Float
    followUpFerritin: Float
    followUpPTH: Float
    followUpALP: Float
    followUpUricAcid: Float
    
    followUpOtherImaging: String
    followUpGeneticTests: String
    
    overallMedicationAdherence: Boolean
    adherenceNonComplianceReason: String
    
    clinicalNotes: String
    nextFollowUpDate: DateTime
  }

  input CreateFollowUpMedicationInput {
    followUpId: String!
    genericName: String!
    frequency: MedicationFrequency!
    routeOfAdministration: RouteOfAdministration!
    meanDosePerDay: Float
    startDate: DateTime!
    stopDate: DateTime
    isNewMedication: Boolean!
    isDiscontinued: Boolean!
    adherence: Boolean
    adherenceNotes: String
  }

  input UpdateFollowUpMedicationInput {
    genericName: String
    frequency: MedicationFrequency
    routeOfAdministration: RouteOfAdministration
    meanDosePerDay: Float
    startDate: DateTime
    stopDate: DateTime
    isNewMedication: Boolean
    isDiscontinued: Boolean
    adherence: Boolean
    adherenceNotes: String
  }

  input CreatePatientDialysisInput {
    patientId: String!
    dialysisStartDate: DateTime!
    isActive: Boolean!
    
    # Initial Dialysis Setup
    initialDialysisModality: DialysisModality!
    
    # HD Access Information
    hdAccessType: HDAccessType
    hdAccessCreationDate: DateTime
    hdAccessComplicationNotes: String
    
    # PD Access Information
    pdCatheterType: PDCatheterType
    pdCatheterInsertionDate: DateTime
    pdCatheterComplicationNotes: String
    
    # Initial HD Prescription (if HD)
    hdFrequencyPerWeek: Int
    hdSessionDurationHours: Float
    hdBloodFlowRate: Int
    hdDialysateFlowRate: Int
    hdUltrafiltrationGoal: Float
    hdDialyzerType: String
    hdAnticoagulation: String
    hdVascularAccess: String
    
    # Initial PD Prescription (if PD)
    pdModalityType: PDModalityType
    pdFillVolume: Int
    pdDwellTime: Int
    pdExchangesPerDay: Int
    pdGlucoseConcentration: PDGlucoseConcentration
    pdAdditionalMedications: String
    pdCyclerSettings: String
    
    # Initial Complications
    initialComplications: [DialysisComplication!]
    initialComplicationNotes: String
    
    # Payment Information
    paymentMethod: DialysisPaymentMethod
    monthlyCostSelfPay: Float
    insuranceCoverage: String
    
    # Clinical Notes
    clinicalNotes: String
  }

  input UpdatePatientDialysisInput {
    dialysisStartDate: DateTime
    isActive: Boolean
    
    initialDialysisModality: DialysisModality
    
    hdAccessType: HDAccessType
    hdAccessCreationDate: DateTime
    hdAccessComplicationNotes: String
    
    pdCatheterType: PDCatheterType
    pdCatheterInsertionDate: DateTime
    pdCatheterComplicationNotes: String
    
    hdFrequencyPerWeek: Int
    hdSessionDurationHours: Float
    hdBloodFlowRate: Int
    hdDialysateFlowRate: Int
    hdUltrafiltrationGoal: Float
    hdDialyzerType: String
    hdAnticoagulation: String
    hdVascularAccess: String
    
    pdModalityType: PDModalityType
    pdFillVolume: Int
    pdDwellTime: Int
    pdExchangesPerDay: Int
    pdGlucoseConcentration: PDGlucoseConcentration
    pdAdditionalMedications: String
    pdCyclerSettings: String
    
    initialComplications: [DialysisComplication!]
    initialComplicationNotes: String
    
    paymentMethod: DialysisPaymentMethod
    monthlyCostSelfPay: Float
    insuranceCoverage: String
    
    clinicalNotes: String
  }

  input CreateDialysisFollowUpInput {
    dialysisId: String!
    followUpDate: DateTime!
    visitNumber: Int!
    
    # Current Modality
    currentModality: DialysisModality!
    hasModalityChange: Boolean!
    modalityChangeDate: DateTime
    modalityChangeReason: String
    
    # HD Prescription Updates
    hdFrequencyPerWeek: Int
    hdSessionDurationHours: Float
    hdBloodFlowRate: Int
    hdDialysateFlowRate: Int
    hdUltrafiltrationGoal: Float
    hdDialyzerType: String
    hdAnticoagulation: String
    hdVascularAccess: String
    hdKtV: Float
    hdURR: Float
    
    # PD Prescription Updates
    pdModalityType: PDModalityType
    pdFillVolume: Int
    pdDwellTime: Int
    pdExchangesPerDay: Int
    pdGlucoseConcentration: PDGlucoseConcentration
    pdAdditionalMedications: String
    pdCyclerSettings: String
    pdWeeklyKtV: Float
    pdCreatinineClearance: Float
    
    # Complications Since Last Visit
    newComplications: [DialysisComplication!]
    complicationNotes: String
    
    # Access-Related Issues
    accessProblems: Boolean!
    accessProblemDescription: String
    accessInterventionsRequired: Boolean!
    accessInterventionDetails: String
    
    # Payment Updates
    currentPaymentMethod: DialysisPaymentMethod
    currentMonthlyCostSelfPay: Float
    paymentMethodChanged: Boolean!
    
    # Laboratory Results
    preDialysisWeight: Float
    postDialysisWeight: Float
    weightGain: Float
    bloodPressurePreDialysis: String
    bloodPressurePostDialysis: String
    
    # Quality of Life Assessment
    functionalStatus: FunctionalStatus
    qualityOfLifeScore: Int
    
    # Clinical Assessment
    clinicalNotes: String
    nextFollowUpDate: DateTime
  }

  input UpdateDialysisFollowUpInput {
    followUpDate: DateTime
    visitNumber: Int
    
    currentModality: DialysisModality
    hasModalityChange: Boolean
    modalityChangeDate: DateTime
    modalityChangeReason: String
    
    hdFrequencyPerWeek: Int
    hdSessionDurationHours: Float
    hdBloodFlowRate: Int
    hdDialysateFlowRate: Int
    hdUltrafiltrationGoal: Float
    hdDialyzerType: String
    hdAnticoagulation: String
    hdVascularAccess: String
    hdKtV: Float
    hdURR: Float
    
    pdModalityType: PDModalityType
    pdFillVolume: Int
    pdDwellTime: Int
    pdExchangesPerDay: Int
    pdGlucoseConcentration: PDGlucoseConcentration
    pdAdditionalMedications: String
    pdCyclerSettings: String
    pdWeeklyKtV: Float
    pdCreatinineClearance: Float
    
    newComplications: [DialysisComplication!]
    complicationNotes: String
    
    accessProblems: Boolean
    accessProblemDescription: String
    accessInterventionsRequired: Boolean
    accessInterventionDetails: String
    
    currentPaymentMethod: DialysisPaymentMethod
    currentMonthlyCostSelfPay: Float
    paymentMethodChanged: Boolean
    
    preDialysisWeight: Float
    postDialysisWeight: Float
    weightGain: Float
    bloodPressurePreDialysis: String
    bloodPressurePostDialysis: String
    
    functionalStatus: FunctionalStatus
    qualityOfLifeScore: Int
    
    clinicalNotes: String
    nextFollowUpDate: DateTime
  }

  # Dashboard Input Types
  input DashboardFilterInput {
    ageRange: AgeRangeInput
    gender: [String!]
    region: [String!]
    ckdCause: [String!]
    ckdStage: [String!]
    instituteId: String
    dateRange: DateRangeInput
  }

  input AgeRangeInput {
    min: Int!
    max: Int!
  }

  input DateRangeInput {
    start: DateTime!
    end: DateTime!
  }

  input DataExportRequestInput {
    exportType: ExportDataType!
    exportFormat: ExportFormat!
    filters: DashboardFilterInput
  }

  # Calculator Input Types
  input EGFRCalculatorInput {
    calculatorType: EGFRCalculatorType!
    serumCreatinine: Float!      # mg/dL
    height: Float!               # cm
    bun: Float                   # mg/dL (for CKiD)
    cystatin: Float              # mg/L (optional for CKiD)
    patientId: String            # Optional - to save result
  }

  input BMIZScoreCalculatorInput {
    age: Int!                    # months
    gender: Gender!
    height: Float!               # cm
    weight: Float!               # kg
    reference: GrowthReference!  # WHO or CDC
    patientId: String            # Optional
  }

  input HeightZScoreCalculatorInput {
    age: Int!                    # months
    gender: Gender!
    height: Float!               # cm
    reference: GrowthReference!  # WHO or CDC
    patientId: String            # Optional
  }

  input BPPercentileCalculatorInput {
    age: Int!                    # years
    gender: Gender!
    height: Float!               # cm
    systolicBP: Int!             # mmHg
    diastolicBP: Int!            # mmHg
    patientId: String            # Optional
  }

  input DialysisKtVCalculatorInput {
    preDialysisBUN: Float!       # mg/dL
    postDialysisBUN: Float!      # mg/dL
    sessionTime: Float!          # hours
    ultrafiltrationVolume: Float! # L
    postDialysisWeight: Float!   # kg
    patientId: String            # Optional
  }

  input DialysisURRCalculatorInput {
    preDialysisBUN: Float!       # mg/dL
    postDialysisBUN: Float!      # mg/dL
    patientId: String            # Optional
  }

  input SaveCalculatorResultInput {
    patientId: String
    calculatorType: CalculatorType!
    inputParameters: JSON!
    result: JSON!
    interpretation: String
  }

  # Exit Input Types
  input PatientExitFilterInput {
    exitCause: [ExitCause!]
    exitDateRange: DateRangeInput
    instituteId: String
    verificationStatus: ExitVerificationStatus
  }

  input CreatePatientExitInput {
    patientId: String!
    exitDate: DateTime!
    exitCause: ExitCause!
    exitNotes: String
    
    # Death details (if exitCause = DEATH)
    deathDetails: CreatePatientDeathInput
    
    # Loss to follow-up details (if exitCause = LOSS_TO_FOLLOWUP)
    lossToFollowUpDetails: CreatePatientLossToFollowUpInput
    
    # Transplant details (if exitCause = KIDNEY_TRANSPLANT)
    transplantDetails: CreatePatientTransplantInput
  }

  input UpdatePatientExitInput {
    exitDate: DateTime
    exitCause: ExitCause
    exitNotes: String
    
    # Update specific details based on exit cause
    deathDetails: UpdatePatientDeathInput
    lossToFollowUpDetails: UpdatePatientLossToFollowUpInput
    transplantDetails: UpdatePatientTransplantInput
  }

  input CreatePatientDeathInput {
    dateOfDeath: DateTime!
    timeOfDeath: String
    placeOfDeath: PlaceOfDeath!
    hospitalName: String
    
    primaryCauseOfDeath: CauseOfDeath!
    secondaryCauseOfDeath: CauseOfDeath
    immediateCareCause: String
    underlyingCause: String
    
    isCKDRelated: Boolean!
    ckdRelatedCause: CKDDeathCause
    dialysisRelated: Boolean!
    dialysisComplication: DialysisComplication
    
    isCardiovascular: Boolean!
    cardiovascularCause: CardiovascularDeathCause
    
    isInfectionRelated: Boolean!
    infectionType: InfectionType
    infectionSite: String
    
    autopsyPerformed: Boolean!
    autopsyFindings: String
    
    deathCertificateNumber: String
    certifyingPhysician: String
    
    informedFamily: Boolean!
    familyContactDate: DateTime
    familyContactPerson: String
    
    clinicalNotes: String
  }

  input UpdatePatientDeathInput {
    dateOfDeath: DateTime
    timeOfDeath: String
    placeOfDeath: PlaceOfDeath
    hospitalName: String
    
    primaryCauseOfDeath: CauseOfDeath
    secondaryCauseOfDeath: CauseOfDeath
    immediateCareCause: String
    underlyingCause: String
    
    isCKDRelated: Boolean
    ckdRelatedCause: CKDDeathCause
    dialysisRelated: Boolean
    dialysisComplication: DialysisComplication
    
    isCardiovascular: Boolean
    cardiovascularCause: CardiovascularDeathCause
    
    isInfectionRelated: Boolean
    infectionType: InfectionType
    infectionSite: String
    
    autopsyPerformed: Boolean
    autopsyFindings: String
    
    deathCertificateNumber: String
    certifyingPhysician: String
    
    informedFamily: Boolean
    familyContactDate: DateTime
    familyContactPerson: String
    
    clinicalNotes: String
  }

  input CreatePatientLossToFollowUpInput {
    lastContactDate: DateTime!
    lastVisitDate: DateTime!
    durationOfLoss: Int!
    
    # Contact Attempts
    phoneCallAttempts: Int!
    phoneCallDates: [String!]!
    phoneCallOutcomes: [String!]!
    
    smsAttempts: Int!
    smsDates: [String!]!
    smsDeliveryStatus: [String!]!
    
    emailAttempts: Int!
    emailDates: [String!]!
    emailDeliveryStatus: [String!]!
    
    homeVisitAttempts: Int!
    homeVisitDates: [String!]!
    homeVisitOutcomes: [String!]!
    
    letterAttempts: Int!
    letterDates: [String!]!
    letterDeliveryStatus: [String!]!
    
    emergencyContactAttempts: Int!
    emergencyContactDates: [String!]!
    emergencyContactOutcomes: [String!]!
    
    # Reasons and factors
    suspectedReasons: [LossToFollowUpReason!]!
    familyReportedReasons: String
    
    hasRelocated: Boolean!
    newLocation: String
    hasChangedContact: Boolean!
    
    financialConstraints: Boolean!
    transportationIssues: Boolean!
    
    improvedCondition: Boolean!
    seekingAlternativeCare: Boolean!
    alternativeCareProvider: String
    
    checklistCompletionDate: DateTime!
    
    referredToSocialWorker: Boolean!
    socialWorkerNotes: String
    
    finalClassification: LossToFollowUpClassification!
    clinicalNotes: String
  }

  input UpdatePatientLossToFollowUpInput {
    lastContactDate: DateTime
    lastVisitDate: DateTime
    durationOfLoss: Int
    
    phoneCallAttempts: Int
    phoneCallDates: [String!]
    phoneCallOutcomes: [String!]
    
    smsAttempts: Int
    smsDates: [String!]
    smsDeliveryStatus: [String!]
    
    emailAttempts: Int
    emailDates: [String!]
    emailDeliveryStatus: [String!]
    
    homeVisitAttempts: Int
    homeVisitDates: [String!]
    homeVisitOutcomes: [String!]
    
    letterAttempts: Int
    letterDates: [String!]
    letterDeliveryStatus: [String!]
    
    emergencyContactAttempts: Int
    emergencyContactDates: [String!]
    emergencyContactOutcomes: [String!]
    
    suspectedReasons: [LossToFollowUpReason!]
    familyReportedReasons: String
    
    hasRelocated: Boolean
    newLocation: String
    hasChangedContact: Boolean
    
    financialConstraints: Boolean
    transportationIssues: Boolean
    
    improvedCondition: Boolean
    seekingAlternativeCare: Boolean
    alternativeCareProvider: String
    
    referredToSocialWorker: Boolean
    socialWorkerNotes: String
    
    finalClassification: LossToFollowUpClassification
    clinicalNotes: String
  }

  input CreatePatientTransplantInput {
    transplantDate: DateTime!
    transplantType: TransplantType!
    
    donorType: DonorType!
    donorAge: Int
    donorGender: Gender
    donorRelationship: DonorRelationship
    
    livingDonorName: String
    livingDonorContact: String
    donorWorkup: Boolean
    donorWorkupDate: DateTime
    donorCompatibility: String
    
    donorOrganizationName: String
    waitingListDuration: Int
    waitingListRegistrationDate: DateTime
    
    transplantCenter: String!
    transplantCenterCity: String!
    transplantCenterState: String!
    surgeonName: String
    
    preTransplantEGFR: Float
    preTransplantDialysis: Boolean!
    dialysisDuration: Int
    preemptiveTransplant: Boolean!
    
    surgeryDuration: Float
    coldIschemiaTime: Float
    warmIschemiaTime: Float
    
    inductionTherapy: String
    maintenanceImmunosuppression: String
    
    immediateGraftFunction: GraftFunction!
    delayedGraftFunction: Boolean!
    acuteRejectionEpisodes: Int!
    
    surgicalComplications: [String!]!
    medicalComplications: [String!]!
    
    followUpCenter: String
    followUpPhysician: String
    followUpContact: String
    
    registryTransitionDate: DateTime
    newRegistryName: String
    dataTransferCompleted: Boolean!
    
    transplantNotes: String
    familyEducationCompleted: Boolean!
  }

  input UpdatePatientTransplantInput {
    transplantDate: DateTime
    transplantType: TransplantType
    
    donorType: DonorType
    donorAge: Int
    donorGender: Gender
    donorRelationship: DonorRelationship
    
    livingDonorName: String
    livingDonorContact: String
    donorWorkup: Boolean
    donorWorkupDate: DateTime
    donorCompatibility: String
    
    donorOrganizationName: String
    waitingListDuration: Int
    waitingListRegistrationDate: DateTime
    
    transplantCenter: String
    transplantCenterCity: String
    transplantCenterState: String
    surgeonName: String
    
    preTransplantEGFR: Float
    preTransplantDialysis: Boolean
    dialysisDuration: Int
    preemptiveTransplant: Boolean
    
    surgeryDuration: Float
    coldIschemiaTime: Float
    warmIschemiaTime: Float
    
    inductionTherapy: String
    maintenanceImmunosuppression: String
    
    immediateGraftFunction: GraftFunction
    delayedGraftFunction: Boolean
    acuteRejectionEpisodes: Int
    
    surgicalComplications: [String!]
    medicalComplications: [String!]
    
    followUpCenter: String
    followUpPhysician: String
    followUpContact: String
    
    registryTransitionDate: DateTime
    newRegistryName: String
    dataTransferCompleted: Boolean
    
    transplantNotes: String
    familyEducationCompleted: Boolean
  }

  input UpdatePatientInput {
    firstName: String
    lastName: String
    dateOfBirth: DateTime
    gender: Gender
    email: String
    phone: String
    medicalHistory: String
    
    # Address update
    address: CreatePatientAddressInput
    
    # Contact Information (Guardian/Parent details)
    guardianName: String
    guardianPhone: String
    guardianEmail: String
    guardianRelationship: String
    
    # Socioeconomic Information
    motherEducationLevel: EducationLevel
    fatherEducationLevel: EducationLevel
    primaryCaregiver: PrimaryCaregiver
    earningMembersCount: Int
    primaryEarnerOccupation: Occupation
    dependentsCount: Int
    familyIncome: FamilyIncomeRange
    
    # Payment Information for CKD Care
    paymentMode: PaymentMode
    hasHealthInsurance: Boolean
    insuranceType: InsuranceType
    insuranceProvider: String
    insurancePolicyNumber: String
    otherPaymentDetails: String
    
    # Consent updates
    consentStatusEnum: ConsentStatus
    consentType: ConsentType
    consentObtainedDate: DateTime
    isVerbalConsent: Boolean
    isWrittenConsent: Boolean
    consentNotes: String
    
    # Assent updates
    assentRequired: Boolean
    assentObtained: Boolean
    assentDate: DateTime
    
    # Ethics approval updates
    ethicsApprovalRequired: Boolean
    ethicsApprovalNumber: String
    ethicsApprovalDate: DateTime
  }

  input UploadConsentInput {
    patientId: String!
    documentType: ConsentDocumentType!
    documentTitle: String
    documentDescription: String
    version: String
    consentStatus: ConsentStatus
    obtainedDate: DateTime
    expiryDate: DateTime
    witnessName: String
    ethicsCommittee: String
    approvalNumber: String
    approvalDate: DateTime
  }

  enum ConsentStatus {
    PENDING
    OBTAINED
    DECLINED
    EXPIRED
    WITHDRAWN
  }

  enum ConsentType {
    INFORMED_CONSENT
    ASSENT
    PARENTAL_CONSENT
    GUARDIAN_CONSENT
    RESEARCH_CONSENT
    TREATMENT_CONSENT
  }

  enum ConsentDocumentType {
    CONSENT_FORM
    ASSENT_FORM
    ETHICS_APPROVAL
    WITNESS_SIGNATURE
    PARENTAL_CONSENT
    GUARDIAN_CONSENT
    AMENDMENT
    WITHDRAWAL_FORM
  }

  enum EducationLevel {
    NO_FORMAL_EDUCATION
    PRIMARY_INCOMPLETE
    PRIMARY_COMPLETE
    SECONDARY_INCOMPLETE
    SECONDARY_COMPLETE
    HIGHER_SECONDARY_INCOMPLETE
    HIGHER_SECONDARY_COMPLETE
    DIPLOMA
    UNDERGRADUATE_INCOMPLETE
    UNDERGRADUATE_COMPLETE
    POSTGRADUATE_INCOMPLETE
    POSTGRADUATE_COMPLETE
    DOCTORAL
    PROFESSIONAL_DEGREE
  }

  enum PrimaryCaregiver {
    MOTHER
    FATHER
    BOTH_PARENTS
    GRANDMOTHER
    GRANDFATHER
    AUNT
    UNCLE
    SIBLING
    SPOUSE
    OTHER_RELATIVE
    NON_RELATIVE
    SELF
  }

  enum Occupation {
    UNEMPLOYED
    STUDENT
    HOMEMAKER
    FARMER
    LABORER
    SKILLED_WORKER
    SMALL_BUSINESS_OWNER
    GOVERNMENT_EMPLOYEE
    PRIVATE_EMPLOYEE
    PROFESSIONAL
    RETIRED
    DISABLED
    OTHER
  }

  enum FamilyIncomeRange {
    BELOW_50000
    RANGE_50000_100000
    RANGE_100000_200000
    RANGE_200000_500000
    RANGE_500000_1000000
    ABOVE_1000000
    PREFER_NOT_TO_SAY
  }

  enum PaymentMode {
    OUT_OF_POCKET
    HEALTH_INSURANCE
    GOVERNMENT_SCHEME
    EMPLOYER_COVERAGE
    COMBINATION
    OTHER
  }

  enum InsuranceType {
    GOVERNMENT_INSURANCE
    PRIVATE_INSURANCE
    EMPLOYER_INSURANCE
    FAMILY_INSURANCE
    MEDICLAIM
    HEALTH_SAVINGS_ACCOUNT
    OTHER
  }

  enum PrimaryRenalDiagnosis {
    CONGENITAL_ANOMALIES_URINARY_TRACT
    HEREDITARY_NEPHRITIS
    GLOMERULAR_DISEASE_PRIMARY
    GLOMERULAR_DISEASE_SECONDARY
    TUBULOINTERSTITIAL_DISEASE
    CYSTIC_KIDNEY_DISEASE
    METABOLIC_DISORDERS
    MALIGNANCY_RELATED
    ISCHEMIC_NEPHROPATHY
    HYPERTENSIVE_NEPHROPATHY
    UNKNOWN_ETIOLOGY
    OTHER
  }

  enum CKDStage {
    STAGE_3A  # eGFR 45-59
    STAGE_3B  # eGFR 30-44
    STAGE_4   # eGFR 15-29
    STAGE_5   # eGFR <15 or on dialysis
  }

  enum TransplantType {
    LIVING_DONOR
    DECEASED_DONOR
    BOTH_DISCUSSED
  }

  enum BPClassification {
    NORMAL
    ELEVATED
    STAGE_1_HTN
    STAGE_2_HTN
  }

  enum GrowthPercentile {
    BELOW_3RD
    PERCENTILE_3_TO_10
    PERCENTILE_10_TO_25
    PERCENTILE_25_TO_50
    PERCENTILE_50_TO_75
    PERCENTILE_75_TO_90
    PERCENTILE_90_TO_97
    ABOVE_97TH
  }

  enum TannerStage {
    STAGE_1
    STAGE_2
    STAGE_3
    STAGE_4
    STAGE_5
  }

  enum ProteinuriaLevel {
    NEGATIVE
    TRACE
    PLUS_1
    PLUS_2
    PLUS_3
    PLUS_4
  }

  enum MedicationFrequency {
    ONCE_DAILY
    TWICE_DAILY
    THREE_TIMES_DAILY
    FOUR_TIMES_DAILY
    EVERY_OTHER_DAY
    WEEKLY
    MONTHLY
    AS_NEEDED
    OTHER
  }

  enum RouteOfAdministration {
    ORAL
    SUBCUTANEOUS_INJECTION
    IV_INJECTION
    INTRAMUSCULAR_INJECTION
    TOPICAL
    INHALATION
    RECTAL
    OTHER
  }

  enum DialysisModality {
    HEMODIALYSIS
    PERITONEAL_DIALYSIS
  }

  enum HDAccessType {
    PERMCATH
    AV_FISTULA
    AV_GRAFT
    TEMPORARY_HD_CATHETER
    TUNNELED_CATHETER
  }

  enum PDCatheterType {
    STRAIGHT_TENCKHOFF
    COILED_TENCKHOFF
    SWAN_NECK_CATHETER
    PRESTERNAL_CATHETER
    OTHER
  }

  enum PDModalityType {
    CAPD              # Continuous Ambulatory Peritoneal Dialysis
    CCPD              # Continuous Cycling Peritoneal Dialysis
    APD               # Automated Peritoneal Dialysis
    NIPD              # Nocturnal Intermittent Peritoneal Dialysis
    TIDAL_PD          # Tidal Peritoneal Dialysis
  }

  enum PDGlucoseConcentration {
    GLUCOSE_1_5_PERCENT
    GLUCOSE_2_5_PERCENT
    GLUCOSE_4_25_PERCENT
    ICODEXTRIN
    AMINO_ACID_SOLUTION
  }

  enum DialysisComplication {
    # HD Complications
    HYPOTENSION
    MUSCLE_CRAMPS
    NAUSEA_VOMITING
    HEADACHE
    CHEST_PAIN
    BACK_PAIN
    ITCHING
    ACCESS_INFECTION
    ACCESS_THROMBOSIS
    ACCESS_STENOSIS
    ACCESS_BLEEDING
    HEMOLYSIS
    AIR_EMBOLISM
    DISEQUILIBRIUM_SYNDROME
    
    # PD Complications
    PERITONITIS
    EXIT_SITE_INFECTION
    TUNNEL_INFECTION
    CATHETER_MALFUNCTION
    CATHETER_MIGRATION
    FLUID_LEAK
    HERNIA
    HYDROTHORAX
    HEMOPERITONEUM
    BOWEL_PERFORATION
    
    # General Complications
    ELECTROLYTE_IMBALANCE
    FLUID_OVERLOAD
    INADEQUATE_DIALYSIS
    PROTEIN_LOSS
    MALNUTRITION
    BONE_DISEASE
    CARDIOVASCULAR_COMPLICATIONS
    OTHER
  }

  enum DialysisPaymentMethod {
    FREE_GOVERNMENT
    FREE_NGO
    HEALTH_INSURANCE
    SELF_PAY
    EMPLOYER_COVERAGE
    COMBINATION
    OTHER
  }

  enum FunctionalStatus {
    NORMAL_ACTIVITY
    RESTRICTED_ACTIVITY
    CARE_FOR_SELF
    LIMITED_SELF_CARE
    DISABLED
    BEDRIDDEN
  }

  enum ExportDataType {
    PATIENT_DEMOGRAPHICS
    CLINICAL_DATA
    DIALYSIS_DATA
    FOLLOW_UP_DATA
    MEDICATION_DATA
    DASHBOARD_SUMMARY
    COMPLETE_DATASET
  }

  enum ExportFormat {
    CSV
    EXCEL
    PDF
    JSON
  }

  enum ExportStatus {
    PENDING
    PROCESSING
    COMPLETED
    FAILED
    EXPIRED
  }

  enum EGFRCalculatorType {
    SCHWARTZ
    CKID
    BEDSIDE_SCHWARTZ
    CKD_EPI
  }

  enum GrowthReference {
    WHO
    CDC
  }

  enum CalculatorType {
    EGFR_SCHWARTZ
    EGFR_CKID
    EGFR_BEDSIDE_SCHWARTZ
    EGFR_CKD_EPI
    BMI_Z_SCORE
    HEIGHT_Z_SCORE
    WEIGHT_Z_SCORE
    BP_PERCENTILE
    DIALYSIS_KTV
    DIALYSIS_URR
    GROWTH_VELOCITY
    PROTEIN_INTAKE
    FLUID_RESTRICTION
  }

  enum ExitCause {
    DEATH
    LOSS_TO_FOLLOWUP
    KIDNEY_TRANSPLANT
    TRANSFER_TO_ADULT_CARE
    FAMILY_RELOCATION
    IMPROVED_CONDITION
    OTHER
  }

  enum ExitVerificationStatus {
    PENDING
    VERIFIED
    ALL
  }

  enum PlaceOfDeath {
    HOME
    HOSPITAL
    ICU
    EMERGENCY_DEPARTMENT
    HOSPICE
    NURSING_HOME
    OTHER
  }

  enum CauseOfDeath {
    CARDIOVASCULAR
    INFECTION
    MALIGNANCY
    ACCIDENT_TRAUMA
    SUICIDE
    RESPIRATORY_FAILURE
    LIVER_FAILURE
    NEUROLOGICAL
    METABOLIC
    UNKNOWN
    OTHER
  }

  enum CKDDeathCause {
    UREMIA
    FLUID_OVERLOAD
    ELECTROLYTE_IMBALANCE
    BONE_DISEASE_COMPLICATIONS
    GROWTH_FAILURE_COMPLICATIONS
    ANEMIA_COMPLICATIONS
    HYPERTENSION_COMPLICATIONS
    METABOLIC_ACIDOSIS
    OTHER
  }

  enum CardiovascularDeathCause {
    MYOCARDIAL_INFARCTION
    HEART_FAILURE
    ARRHYTHMIA
    STROKE
    PULMONARY_EMBOLISM
    HYPERTENSIVE_CRISIS
    CARDIOMYOPATHY
    OTHER
  }

  enum InfectionType {
    BACTERIAL
    VIRAL
    FUNGAL
    PARASITIC
    UNKNOWN
  }

  enum LossToFollowUpReason {
    FAMILY_RELOCATION
    FINANCIAL_CONSTRAINTS
    TRANSPORTATION_ISSUES
    IMPROVED_CONDITION
    SEEKING_ALTERNATIVE_CARE
    FAMILY_DISSATISFACTION
    CHANGED_CONTACT_INFO
    SOCIAL_ISSUES
    CULTURAL_BARRIERS
    LANGUAGE_BARRIERS
    UNKNOWN
  }

  enum LossToFollowUpClassification {
    TEMPORARY_LOSS
    PERMANENT_LOSS
    TRANSFERRED_CARE
    DECEASED_UNCONFIRMED
    IMPROVED_DISCHARGED
    UNKNOWN
  }

  enum DonorType {
    LIVING_RELATED
    LIVING_UNRELATED
    DECEASED
  }

  enum DonorRelationship {
    PARENT
    SIBLING
    GRANDPARENT
    AUNT_UNCLE
    COUSIN
    FAMILY_FRIEND
    ALTRUISTIC_DONOR
    OTHER
  }

  enum GraftFunction {
    IMMEDIATE_FUNCTION
    SLOW_GRAFT_FUNCTION
    DELAYED_GRAFT_FUNCTION
    PRIMARY_NON_FUNCTION
  }

  enum Gender {
    MALE
    FEMALE
    OTHER
    UNKNOWN
  }
`;
