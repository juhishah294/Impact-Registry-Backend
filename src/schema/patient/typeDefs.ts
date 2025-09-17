export const patientTypeDefs = `
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
    
    status: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    
    # Relations
    institute: Institute!
    address: PatientAddress
    consentDocuments: [InformedConsent!]!
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

  type InformedConsent {
    id: ID!
    patientId: String!
    documentType: ConsentDocumentType!
    fileName: String!
    originalFileName: String!
    filePath: String!
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

  input UpdatePatientInput {
    firstName: String
    lastName: String
    dateOfBirth: DateTime
    gender: Gender
    email: String
    phone: String
    medicalHistory: String
    
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
    
    # Address update
    address: CreatePatientAddressInput
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

  enum Gender {
    MALE
    FEMALE
    OTHER
    UNKNOWN
  }

  # Extend existing types
  extend type Query {
    patients(instituteId: String): [Patient!]!
    patient(id: ID!): Patient
    patientByPatientId(patientId: String!): Patient
    patientConsentDocuments(patientId: String!): [InformedConsent!]!
  }

  extend type Mutation {
    createPatient(input: CreatePatientInput!): Patient!
    updatePatient(id: ID!, input: UpdatePatientInput!): Patient!
    deletePatient(id: ID!): Boolean!
    
    # Consent management
    updatePatientConsent(patientId: String!, consentStatus: ConsentStatus!, obtainedDate: DateTime, notes: String): Patient!
    uploadConsentDocument(input: UploadConsentInput!, file: Upload!): InformedConsent!
    verifyConsentDocument(consentId: String!): InformedConsent!
    deleteConsentDocument(consentId: String!): Boolean!
  }
`;
