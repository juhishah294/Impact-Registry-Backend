import { getPrismaInstance } from '../../../datasources/prisma';
import { logger } from '../../../utils/logger';
import { generateToken } from '../../../utils/jwt';
import ValidationException from '../../../utils/errors/validation-error';
import { CreateInstituteInput, PublicRegistrationInput, RegistrationResponse, UserRole } from '../../../types';


export class InstituteService {
    private prisma = getPrismaInstance();

    async createInstitute(input: CreateInstituteInput) {
        try {
            const institute = await this.prisma.institute.create({
                data: {
                    centerName: input.centerName,
                    address: input.address,
                    contactInformation: input.contactInformation,
                    headOfDepartment: input.headOfDepartment,
                    headOfDepartmentContact: input.headOfDepartmentContact,
                    coInvestigatorName: input.coInvestigatorName,
                    coInvestigatorContact: input.coInvestigatorContact,

                    // Center Type
                    isPublicSector: input.isPublicSector || false,
                    isPrivateNonProfit: input.isPrivateNonProfit || false,
                    isCorporateHospital: input.isCorporateHospital || false,
                    isPrivatePractice: input.isPrivatePractice || false,

                    // Payment modes
                    privateInsurance: input.privateInsurance || false,
                    governmentInsurance: input.governmentInsurance || false,
                    selfPayment: input.selfPayment || false,

                    // Public sector coverage
                    medications100Percent: input.medications100Percent || false,
                    medicationsReduced: input.medicationsReduced || false,
                    medicationsFullCost: input.medicationsFullCost || false,
                    lab100Percent: input.lab100Percent || false,
                    labReduced: input.labReduced || false,
                    labFullCost: input.labFullCost || false,
                    hd100Percent: input.hd100Percent || false,
                    hdReduced: input.hdReduced || false,
                    hdFullCost: input.hdFullCost || false,
                    pd100Percent: input.pd100Percent || false,
                    pdReduced: input.pdReduced || false,
                    pdFullCost: input.pdFullCost || false,
                    transplant100Percent: input.transplant100Percent || false,
                    transplantReduced: input.transplantReduced || false,
                    transplantFullCost: input.transplantFullCost || false,

                    // Teaching hospital
                    isTeachingHospital: input.isTeachingHospital || false,
                    isUGCenter: input.isUGCenter || false,
                    isPGCenter: input.isPGCenter || false,

                    // Pediatric nephrology training
                    hasPediatricTraining: input.hasPediatricTraining || false,
                    trainingType: input.trainingType,

                    // Capacity
                    numberOfBeds: input.numberOfBeds || 0,
                    numberOfFaculty: input.numberOfFaculty || 0,
                    averageTrainees: input.averageTrainees || 0,

                    // Clinical services
                    standaloneCKDClinic: input.standaloneCKDClinic || false,
                    clinicalCareNonDialysis: input.clinicalCareNonDialysis || false,
                    avFistulaCreation: input.avFistulaCreation || false,
                    cuffedPDCatheter: input.cuffedPDCatheter || false,
                    permcathInsertion: input.permcathInsertion || false,
                    maintenanceHD: input.maintenanceHD || false,
                    standalonePediatricHD: input.standalonePediatricHD || false,
                    housedInAdultUnit: input.housedInAdultUnit || false,
                    maintenancePD: input.maintenancePD || false,
                    manualCAPD: input.manualCAPD || false,
                    cyclerCCPD: input.cyclerCCPD || false,
                    kidneyTransplant: input.kidneyTransplant || false,
                    livingDonorTransplant: input.livingDonorTransplant || false,
                    deceasedDonorTransplant: input.deceasedDonorTransplant || false,

                    // Available services
                    routineLabServices: input.routineLabServices || false,
                    crossMatchLab: input.crossMatchLab || false,
                    hlaTypingLab: input.hlaTypingLab || false,
                    donorSpecificAntibodies: input.donorSpecificAntibodies || false,
                    therapeuticDrugMonitoring: input.therapeuticDrugMonitoring || false,
                    virologyLab: input.virologyLab || false,
                    ultrasound: input.ultrasound || false,
                    doppler: input.doppler || false,
                    nuclearMedicine: input.nuclearMedicine || false,
                    ctOrMri: input.ctOrMri || false,
                    echo: input.echo || false,
                    urology: input.urology || false,
                    interventionalRadiology: input.interventionalRadiology || false,
                    picu: input.picu || false,
                    nicu: input.nicu || false,
                    renalHistopathology: input.renalHistopathology || false,
                    ambulatoryBP: input.ambulatoryBP || false,

                    // Personnel
                    pediatricNephrologists: input.pediatricNephrologists || false,
                    ckdNurse: input.ckdNurse || false,
                    dialysisNurse: input.dialysisNurse || false,
                    hdTechnicians: input.hdTechnicians || false,
                    transplantCoordinator: input.transplantCoordinator || false,
                    socialWorker: input.socialWorker || false,
                    renalDietician: input.renalDietician || false,
                    psychologist: input.psychologist || false,
                    patientSupportGroups: input.patientSupportGroups || false,
                    inPersonEducation: input.inPersonEducation || false,
                    onlineEducation: input.onlineEducation || false,

                    status: 1, // Active
                },
            });

            logger.info(`Institute created successfully: ${institute.centerName}`);
            return institute;
        } catch (error) {
            logger.error('Error creating institute:', error);
            throw new Error('Failed to create institute');
        }
    }

    async getInstituteById(id: string) {
        try {
            const institute = await this.prisma.institute.findUnique({
                where: { id },
                include: {
                    users: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                            role: true,
                            status: true,
                            instituteId: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    },
                },
            });

            return institute;
        } catch (error) {
            logger.error('Error getting institute by ID:', error);
            throw new Error('Failed to get institute');
        }
    }

    async getAllInstitutes() {
        try {
            const institutes = await this.prisma.institute.findMany({
                include: {
                    users: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                            role: true,
                            status: true,
                            instituteId: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });

            return institutes;
        } catch (error) {
            logger.error('Error getting all institutes:', error);
            throw new Error('Failed to get institutes');
        }
    }

    async updateInstitute(id: string, input: Partial<CreateInstituteInput>) {
        try {
            const institute = await this.prisma.institute.update({
                where: { id },
                data: input,
            });

            logger.info(`Institute updated successfully: ${institute.centerName}`);
            return institute;
        } catch (error) {
            logger.error('Error updating institute:', error);
            throw new Error('Failed to update institute');
        }
    }

    async getPendingInstitutes() {
        try {
            const institutes = await this.prisma.institute.findMany({
                where: { approvalStatus: 'PENDING_APPROVAL' },
                orderBy: { createdAt: 'desc' },
                include: {
                    users: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                            role: true,
                            status: true,
                            instituteId: true,
                            createdAt: true,
                            updatedAt: true
                        }
                    }
                },
            });
            return institutes;
        } catch (error) {
            logger.error('Error fetching pending institutes:', error);
            throw new Error('Failed to fetch pending institutes');
        }
    }

    async getApprovedInstitutes() {
        try {
            const institutes = await this.prisma.institute.findMany({
                where: { approvalStatus: 'APPROVED' },
                orderBy: { createdAt: 'desc' },
                include: {
                    users: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                            role: true,
                            status: true,
                            instituteId: true,
                            createdAt: true,
                            updatedAt: true
                        }
                    }
                },
            });
            return institutes;
        } catch (error) {
            logger.error('Error fetching approved institutes:', error);
            throw new Error('Failed to fetch approved institutes');
        }
    }

    async approveInstitute(id: string, approvedBy: string) {
        try {
            const institute = await this.prisma.institute.update({
                where: { id },
                data: {
                    approvalStatus: 'APPROVED',
                    approvedBy,
                    approvedAt: new Date(),
                    rejectionReason: null, // Clear any previous rejection reason
                },
                include: {
                    users: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                            role: true,
                            status: true,
                            instituteId: true,
                            createdAt: true,
                            updatedAt: true
                        }
                    }
                },
            });
            logger.info(`Institute approved successfully: ${institute.centerName} by user ${approvedBy}`);
            return institute;
        } catch (error) {
            logger.error(`Error approving institute ${id}:`, error);
            throw new Error('Failed to approve institute');
        }
    }

    async rejectInstitute(id: string, reason: string, rejectedBy: string) {
        try {
            const institute = await this.prisma.institute.update({
                where: { id },
                data: {
                    approvalStatus: 'REJECTED',
                    approvedBy: rejectedBy,
                    approvedAt: new Date(),
                    rejectionReason: reason,
                },
                include: {
                    users: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                            role: true,
                            status: true,
                            instituteId: true,
                            createdAt: true,
                            updatedAt: true
                        }
                    }
                },
            });
            logger.info(`Institute rejected: ${institute.centerName} by user ${rejectedBy}. Reason: ${reason}`);
            return institute;
        } catch (error) {
            logger.error(`Error rejecting institute ${id}:`, error);
            throw new Error('Failed to reject institute');
        }
    }

    async suspendInstitute(id: string, suspendedBy: string) {
        try {
            const institute = await this.prisma.institute.update({
                where: { id },
                data: {
                    approvalStatus: 'SUSPENDED',
                    approvedBy: suspendedBy,
                    approvedAt: new Date(),
                },
                include: {
                    users: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                            role: true,
                            status: true,
                            instituteId: true,
                            createdAt: true,
                            updatedAt: true
                        }
                    }
                },
            });
            logger.info(`Institute suspended: ${institute.centerName} by user ${suspendedBy}`);
            return institute;
        } catch (error) {
            logger.error(`Error suspending institute ${id}:`, error);
            throw new Error('Failed to suspend institute');
        }
    }

    async registerInstituteWithAdmin(input: PublicRegistrationInput): Promise<RegistrationResponse> {
        try {
            // Validate required fields
            this.validateRegistrationInput(input);

            // Check if email already exists
            const existingUser = await this.prisma.user.findUnique({
                where: { email: input.adminEmail },
            });

            if (existingUser) {
                throw new ValidationException('Email already registered', 'EMAIL_ALREADY_EXISTS');
            }

            // Check if institute name already exists
            const existingInstitute = await this.prisma.institute.findFirst({
                where: { centerName: input.centerName },
            });

            if (existingInstitute) {
                throw new ValidationException('Institute with this name already exists', 'INSTITUTE_NAME_EXISTS');
            }

            // Create institute
            const institute = await this.createInstitute({
                centerName: input.centerName,
                address: input.address,
                contactInformation: input.contactInformation,
                headOfDepartment: input.headOfDepartment,
                headOfDepartmentContact: input.headOfDepartmentContact,
                coInvestigatorName: input.coInvestigatorName,
                coInvestigatorContact: input.coInvestigatorContact,
                isPublicSector: input.isPublicSector,
                isPrivateNonProfit: input.isPrivateNonProfit,
                isCorporateHospital: input.isCorporateHospital,
                isPrivatePractice: input.isPrivatePractice,
                privateInsurance: input.privateInsurance,
                governmentInsurance: input.governmentInsurance,
                selfPayment: input.selfPayment,
                medications100Percent: input.medications100Percent,
                medicationsReduced: input.medicationsReduced,
                medicationsFullCost: input.medicationsFullCost,
                lab100Percent: input.lab100Percent,
                labReduced: input.labReduced,
                labFullCost: input.labFullCost,
                hd100Percent: input.hd100Percent,
                hdReduced: input.hdReduced,
                hdFullCost: input.hdFullCost,
                pd100Percent: input.pd100Percent,
                pdReduced: input.pdReduced,
                pdFullCost: input.pdFullCost,
                transplant100Percent: input.transplant100Percent,
                transplantReduced: input.transplantReduced,
                transplantFullCost: input.transplantFullCost,
                isTeachingHospital: input.isTeachingHospital,
                isUGCenter: input.isUGCenter,
                isPGCenter: input.isPGCenter,
                hasPediatricTraining: input.hasPediatricTraining,
                trainingType: input.trainingType,
                numberOfBeds: input.numberOfBeds,
                numberOfFaculty: input.numberOfFaculty,
                averageTrainees: input.averageTrainees,
                standaloneCKDClinic: input.standaloneCKDClinic,
                clinicalCareNonDialysis: input.clinicalCareNonDialysis,
                avFistulaCreation: input.avFistulaCreation,
                cuffedPDCatheter: input.cuffedPDCatheter,
                permcathInsertion: input.permcathInsertion,
                maintenanceHD: input.maintenanceHD,
                standalonePediatricHD: input.standalonePediatricHD,
                housedInAdultUnit: input.housedInAdultUnit,
                maintenancePD: input.maintenancePD,
                manualCAPD: input.manualCAPD,
                cyclerCCPD: input.cyclerCCPD,
                kidneyTransplant: input.kidneyTransplant,
                livingDonorTransplant: input.livingDonorTransplant,
                deceasedDonorTransplant: input.deceasedDonorTransplant,
                routineLabServices: input.routineLabServices,
                crossMatchLab: input.crossMatchLab,
                hlaTypingLab: input.hlaTypingLab,
                donorSpecificAntibodies: input.donorSpecificAntibodies,
                therapeuticDrugMonitoring: input.therapeuticDrugMonitoring,
                virologyLab: input.virologyLab,
                ultrasound: input.ultrasound,
                doppler: input.doppler,
                nuclearMedicine: input.nuclearMedicine,
                ctOrMri: input.ctOrMri,
                echo: input.echo,
                urology: input.urology,
                interventionalRadiology: input.interventionalRadiology,
                picu: input.picu,
                nicu: input.nicu,
                renalHistopathology: input.renalHistopathology,
                ambulatoryBP: input.ambulatoryBP,
                pediatricNephrologists: input.pediatricNephrologists,
                ckdNurse: input.ckdNurse,
                dialysisNurse: input.dialysisNurse,
                hdTechnicians: input.hdTechnicians,
                transplantCoordinator: input.transplantCoordinator,
                socialWorker: input.socialWorker,
                renalDietician: input.renalDietician,
                psychologist: input.psychologist,
                patientSupportGroups: input.patientSupportGroups,
                inPersonEducation: input.inPersonEducation,
                onlineEducation: input.onlineEducation,
            });

            // Create admin user for the institute
            const hashedPassword = await this.hashPassword(input.adminPassword);
            const adminUser = await this.prisma.user.create({
                data: {
                    email: input.adminEmail,
                    password: hashedPassword,
                    firstName: input.adminFirstName,
                    lastName: input.adminLastName,
                    role: UserRole.INSTITUTE_ADMIN as any,
                    instituteId: institute.id,
                    status: 1,
                },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    status: true,
                    instituteId: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });

            // Generate token for the admin user
            const token = generateToken({
                userId: adminUser.id,
                email: adminUser.email,
                role: adminUser.role,
            });

            logger.info(`Institute and admin user registered successfully: ${institute.centerName}`);
            return {
                institute: { ...institute, users: [] } as any,
                user: adminUser as any,
                token
            };
        } catch (error) {
            logger.error('Error registering institute with admin:', error);
            if (error instanceof ValidationException) {
                throw error;
            }
            throw new Error('Failed to register institute with admin');
        }
    }

    private async hashPassword(password: string): Promise<string> {
        const bcrypt = await import('bcryptjs');
        return bcrypt.hash(password, 12);
    }

    async disableInstitute(id: string) {
        try {
            const institute = await this.prisma.institute.update({
                where: { id },
                data: { status: 0 }, // 0 = Disabled/Inactive
                include: {
                    users: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                            role: true,
                            status: true,
                            instituteId: true,
                            createdAt: true,
                            updatedAt: true
                        }
                    }
                },
            });

            logger.info(`Institute disabled successfully: ${institute.centerName}`);
            return institute;
        } catch (error) {
            logger.error('Error disabling institute:', error);
            throw new Error('Failed to disable institute');
        }
    }

    async enableInstitute(id: string) {
        try {
            const institute = await this.prisma.institute.update({
                where: { id },
                data: { status: 1 }, // 1 = Active
                include: {
                    users: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                            role: true,
                            status: true,
                            instituteId: true,
                            createdAt: true,
                            updatedAt: true
                        }
                    }
                },
            });

            logger.info(`Institute enabled successfully: ${institute.centerName}`);
            return institute;
        } catch (error) {
            logger.error('Error enabling institute:', error);
            throw new Error('Failed to enable institute');
        }
    }

    private validateRegistrationInput(input: PublicRegistrationInput): void {
        if (!input.centerName || !input.address || !input.adminEmail || !input.adminPassword) {
            throw new ValidationException('Required fields are missing', 'MISSING_REQUIRED_FIELDS');
        }

        if (input.adminPassword.length < 6) {
            throw new ValidationException('Password must be at least 6 characters long', 'PASSWORD_TOO_SHORT');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.adminEmail)) {
            throw new ValidationException('Invalid email format', 'INVALID_EMAIL_FORMAT');
        }
    }
}

export const instituteService = new InstituteService();
