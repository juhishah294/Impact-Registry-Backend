import { InstituteStatus } from './enums';
import { User } from './user';

export interface Institute {
    id: string;
    centerName: string;
    address: string;
    contactInformation: string;
    headOfDepartment: string;
    headOfDepartmentContact: string;
    coInvestigatorName: string;
    coInvestigatorContact: string;

    // Center Type
    isPublicSector: boolean;
    isPrivateNonProfit: boolean;
    isCorporateHospital: boolean;
    isPrivatePractice: boolean;

    // Payment modes
    privateInsurance: boolean;
    governmentInsurance: boolean;
    selfPayment: boolean;

    // Public sector coverage
    medications100Percent: boolean;
    medicationsReduced: boolean;
    medicationsFullCost: boolean;
    lab100Percent: boolean;
    labReduced: boolean;
    labFullCost: boolean;
    hd100Percent: boolean;
    hdReduced: boolean;
    hdFullCost: boolean;
    pd100Percent: boolean;
    pdReduced: boolean;
    pdFullCost: boolean;
    transplant100Percent: boolean;
    transplantReduced: boolean;
    transplantFullCost: boolean;

    // Teaching hospital
    isTeachingHospital: boolean;
    isUGCenter: boolean;
    isPGCenter: boolean;

    // Pediatric nephrology training
    hasPediatricTraining: boolean;
    trainingType?: string;

    // Capacity
    numberOfBeds: number;
    numberOfFaculty: number;
    averageTrainees: number;

    // Clinical services
    standaloneCKDClinic: boolean;
    clinicalCareNonDialysis: boolean;
    avFistulaCreation: boolean;
    cuffedPDCatheter: boolean;
    permcathInsertion: boolean;
    maintenanceHD: boolean;
    standalonePediatricHD: boolean;
    housedInAdultUnit: boolean;
    maintenancePD: boolean;
    manualCAPD: boolean;
    cyclerCCPD: boolean;
    kidneyTransplant: boolean;
    livingDonorTransplant: boolean;
    deceasedDonorTransplant: boolean;

    // Available services
    routineLabServices: boolean;
    crossMatchLab: boolean;
    hlaTypingLab: boolean;
    donorSpecificAntibodies: boolean;
    therapeuticDrugMonitoring: boolean;
    virologyLab: boolean;
    ultrasound: boolean;
    doppler: boolean;
    nuclearMedicine: boolean;
    ctOrMri: boolean;
    echo: boolean;
    urology: boolean;
    interventionalRadiology: boolean;
    picu: boolean;
    nicu: boolean;
    renalHistopathology: boolean;
    ambulatoryBP: boolean;

    // Personnel
    pediatricNephrologists: boolean;
    ckdNurse: boolean;
    dialysisNurse: boolean;
    hdTechnicians: boolean;
    transplantCoordinator: boolean;
    socialWorker: boolean;
    renalDietician: boolean;
    psychologist: boolean;
    patientSupportGroups: boolean;
    inPersonEducation: boolean;
    onlineEducation: boolean;

    // Status and approval
    status: number;
    approvalStatus: InstituteStatus;
    approvedBy?: string;
    approvedAt?: Date;
    rejectionReason?: string;
    users: User[];
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateInstituteInput {
    centerName: string;
    address: string;
    contactInformation: string;
    headOfDepartment: string;
    headOfDepartmentContact: string;
    coInvestigatorName: string;
    coInvestigatorContact: string;

    // Center Type
    isPublicSector?: boolean;
    isPrivateNonProfit?: boolean;
    isCorporateHospital?: boolean;
    isPrivatePractice?: boolean;

    // Payment modes
    privateInsurance?: boolean;
    governmentInsurance?: boolean;
    selfPayment?: boolean;

    // Public sector coverage
    medications100Percent?: boolean;
    medicationsReduced?: boolean;
    medicationsFullCost?: boolean;
    lab100Percent?: boolean;
    labReduced?: boolean;
    labFullCost?: boolean;
    hd100Percent?: boolean;
    hdReduced?: boolean;
    hdFullCost?: boolean;
    pd100Percent?: boolean;
    pdReduced?: boolean;
    pdFullCost?: boolean;
    transplant100Percent?: boolean;
    transplantReduced?: boolean;
    transplantFullCost?: boolean;

    // Teaching hospital
    isTeachingHospital?: boolean;
    isUGCenter?: boolean;
    isPGCenter?: boolean;

    // Pediatric nephrology training
    hasPediatricTraining?: boolean;
    trainingType?: string;

    // Capacity
    numberOfBeds?: number;
    numberOfFaculty?: number;
    averageTrainees?: number;

    // Clinical services
    standaloneCKDClinic?: boolean;
    clinicalCareNonDialysis?: boolean;
    avFistulaCreation?: boolean;
    cuffedPDCatheter?: boolean;
    permcathInsertion?: boolean;
    maintenanceHD?: boolean;
    standalonePediatricHD?: boolean;
    housedInAdultUnit?: boolean;
    maintenancePD?: boolean;
    manualCAPD?: boolean;
    cyclerCCPD?: boolean;
    kidneyTransplant?: boolean;
    livingDonorTransplant?: boolean;
    deceasedDonorTransplant?: boolean;

    // Available services
    routineLabServices?: boolean;
    crossMatchLab?: boolean;
    hlaTypingLab?: boolean;
    donorSpecificAntibodies?: boolean;
    therapeuticDrugMonitoring?: boolean;
    virologyLab?: boolean;
    ultrasound?: boolean;
    doppler?: boolean;
    nuclearMedicine?: boolean;
    ctOrMri?: boolean;
    echo?: boolean;
    urology?: boolean;
    interventionalRadiology?: boolean;
    picu?: boolean;
    nicu?: boolean;
    renalHistopathology?: boolean;
    ambulatoryBP?: boolean;

    // Personnel
    pediatricNephrologists?: boolean;
    ckdNurse?: boolean;
    dialysisNurse?: boolean;
    hdTechnicians?: boolean;
    transplantCoordinator?: boolean;
    socialWorker?: boolean;
    renalDietician?: boolean;
    psychologist?: boolean;
    patientSupportGroups?: boolean;
    inPersonEducation?: boolean;
    onlineEducation?: boolean;
}

export interface InstituteStatusInfo {
    approvalStatus: InstituteStatus;
    isApproved: boolean;
    isRejected: boolean;
    isPending: boolean;
    isSuspended: boolean;
    rejectionReason?: string;
    approvedAt?: Date;
    approvedBy?: string;
}

export interface PublicRegistrationInput extends CreateInstituteInput {
    // Admin User Information
    adminEmail: string;
    adminPassword: string;
    adminFirstName: string;
    adminLastName: string;
}

export interface RegistrationResponse {
    institute: Institute;
    user: User;
    token: string;
}
