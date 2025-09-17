import { getPrismaInstance } from '../../../datasources/prisma';
import { logger } from '../../../utils/logger';
import { s3FileStorage } from '../../../utils/aws/s3FileStorage';
import ValidationException from '../../../utils/errors/validation-error';
import {
    CreatePatientInput,
    UpdatePatientInput,
    UploadConsentInput,
    ConsentStatus
} from '../../../types';

export class PatientService {
    private prisma = getPrismaInstance();

    async createPatient(input: CreatePatientInput, instituteId: string) {
        try {
            // Check if patient ID already exists in the institute
            const existingPatient = await this.prisma.patient.findFirst({
                where: {
                    patientId: input.patientId,
                    instituteId: instituteId,
                }
            });

            if (existingPatient) {
                throw new ValidationException('Patient ID already exists in this institute', 'PATIENT_ID_EXISTS');
            }

            // Create patient with address in a transaction
            const result = await this.prisma.$transaction(async (tx) => {
                // Create patient
                const patient = await tx.patient.create({
                    data: {
                        patientId: input.patientId,
                        firstName: input.firstName,
                        lastName: input.lastName,
                        dateOfBirth: new Date(input.dateOfBirth),
                        gender: input.gender as any,
                        email: input.email,
                        phone: input.phone,
                        medicalHistory: input.medicalHistory,
                        instituteId: instituteId,

                        // Contact Information (Guardian/Parent details)
                        guardianName: input.guardianName,
                        guardianPhone: input.guardianPhone,
                        guardianEmail: input.guardianEmail,
                        guardianRelationship: input.guardianRelationship,

                        // Socioeconomic Information
                        motherEducationLevel: input.motherEducationLevel as any,
                        fatherEducationLevel: input.fatherEducationLevel as any,
                        primaryCaregiver: input.primaryCaregiver as any,
                        earningMembersCount: input.earningMembersCount,
                        primaryEarnerOccupation: input.primaryEarnerOccupation as any,
                        dependentsCount: input.dependentsCount,
                        familyIncome: input.familyIncome as any,

                        // Payment Information for CKD Care
                        paymentMode: input.paymentMode as any,
                        hasHealthInsurance: input.hasHealthInsurance || false,
                        insuranceType: input.insuranceType as any,
                        insuranceProvider: input.insuranceProvider,
                        insurancePolicyNumber: input.insurancePolicyNumber,
                        otherPaymentDetails: input.otherPaymentDetails,

                        // Consent fields
                        consentType: input.consentType as any,
                        isVerbalConsent: input.isVerbalConsent || false,
                        isWrittenConsent: input.isWrittenConsent || false,
                        consentNotes: input.consentNotes,
                        assentRequired: input.assentRequired || false,
                        ethicsApprovalRequired: input.ethicsApprovalRequired || false,

                        status: 1, // Active
                    },
                    include: {
                        institute: {
                            select: {
                                id: true,
                                centerName: true,
                            }
                        }
                    }
                });

                // Create address if provided
                if (input.address) {
                    await tx.patientAddress.create({
                        data: {
                            patientId: patient.id,
                            line1: input.address.line1,
                            line2: input.address.line2,
                            city: input.address.city,
                            state: input.address.state,
                            country: input.address.country,
                            postalCode: input.address.postalCode,
                        }
                    });
                }

                return patient;
            });

            logger.info(`Patient created successfully: ${result.patientId} in institute ${instituteId}`);
            return result;

        } catch (error) {
            logger.error('Error creating patient:', error);
            if (error instanceof ValidationException) {
                throw error;
            }
            throw new Error('Failed to create patient');
        }
    }

    async getPatientById(id: string, instituteId: string) {
        try {
            const patient = await this.prisma.patient.findFirst({
                where: {
                    id: id,
                    instituteId: instituteId, // Ensure user can only access patients from their institute
                },
                include: {
                    institute: {
                        select: {
                            id: true,
                            centerName: true,
                        }
                    },
                    address: true,
                    consentDocuments: {
                        where: { status: 1 }, // Only active documents
                        orderBy: { createdAt: 'desc' },
                        include: {
                            uploadedBy: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    email: true,
                                }
                            },
                            verifiedBy: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    email: true,
                                }
                            }
                        }
                    }
                }
            });

            return patient;
        } catch (error) {
            logger.error('Error getting patient by ID:', error);
            throw new Error('Failed to get patient');
        }
    }

    async getPatientByPatientId(patientId: string, instituteId: string) {
        try {
            const patient = await this.prisma.patient.findFirst({
                where: {
                    patientId: patientId,
                    instituteId: instituteId,
                },
                include: {
                    institute: {
                        select: {
                            id: true,
                            centerName: true,
                        }
                    },
                    address: true,
                    consentDocuments: {
                        where: { status: 1 },
                        orderBy: { createdAt: 'desc' }
                    }
                }
            });

            return patient;
        } catch (error) {
            logger.error('Error getting patient by patient ID:', error);
            throw new Error('Failed to get patient');
        }
    }

    async getPatientsByInstitute(instituteId: string, limit: number = 50, offset: number = 0) {
        try {
            const patients = await this.prisma.patient.findMany({
                where: {
                    instituteId: instituteId,
                    status: 1, // Only active patients
                },
                include: {
                    institute: {
                        select: {
                            id: true,
                            centerName: true,
                        }
                    },
                    address: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                take: limit,
                skip: offset,
            });

            return patients;
        } catch (error) {
            logger.error('Error getting patients by institute:', error);
            throw new Error('Failed to get patients');
        }
    }

    async updatePatient(id: string, input: UpdatePatientInput, instituteId: string) {
        try {
            // Verify patient belongs to the institute
            const existingPatient = await this.prisma.patient.findFirst({
                where: {
                    id: id,
                    instituteId: instituteId,
                }
            });

            if (!existingPatient) {
                throw new ValidationException('Patient not found or access denied', 'PATIENT_NOT_FOUND');
            }

            const result = await this.prisma.$transaction(async (tx) => {
                // Update patient
                const patient = await tx.patient.update({
                    where: { id: id },
                    data: {
                        firstName: input.firstName,
                        lastName: input.lastName,
                        dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : undefined,
                        gender: input.gender as any,
                        email: input.email,
                        phone: input.phone,
                        medicalHistory: input.medicalHistory,

                        // Contact Information (Guardian/Parent details)
                        guardianName: input.guardianName,
                        guardianPhone: input.guardianPhone,
                        guardianEmail: input.guardianEmail,
                        guardianRelationship: input.guardianRelationship,

                        // Socioeconomic Information
                        motherEducationLevel: input.motherEducationLevel as any,
                        fatherEducationLevel: input.fatherEducationLevel as any,
                        primaryCaregiver: input.primaryCaregiver as any,
                        earningMembersCount: input.earningMembersCount,
                        primaryEarnerOccupation: input.primaryEarnerOccupation as any,
                        dependentsCount: input.dependentsCount,
                        familyIncome: input.familyIncome as any,

                        // Payment Information for CKD Care
                        paymentMode: input.paymentMode as any,
                        hasHealthInsurance: input.hasHealthInsurance,
                        insuranceType: input.insuranceType as any,
                        insuranceProvider: input.insuranceProvider,
                        insurancePolicyNumber: input.insurancePolicyNumber,
                        otherPaymentDetails: input.otherPaymentDetails,

                        // Consent updates
                        consentStatusEnum: input.consentStatusEnum as any,
                        consentType: input.consentType as any,
                        consentObtainedDate: input.consentObtainedDate ? new Date(input.consentObtainedDate) : undefined,
                        isVerbalConsent: input.isVerbalConsent,
                        isWrittenConsent: input.isWrittenConsent,
                        consentNotes: input.consentNotes,

                        // Assent updates
                        assentRequired: input.assentRequired,
                        assentObtained: input.assentObtained,
                        assentDate: input.assentDate ? new Date(input.assentDate) : undefined,

                        // Ethics approval updates
                        ethicsApprovalRequired: input.ethicsApprovalRequired,
                        ethicsApprovalNumber: input.ethicsApprovalNumber,
                        ethicsApprovalDate: input.ethicsApprovalDate ? new Date(input.ethicsApprovalDate) : undefined,
                    },
                    include: {
                        institute: {
                            select: {
                                id: true,
                                centerName: true,
                            }
                        },
                        address: true,
                    }
                });

                // Update address if provided
                if (input.address) {
                    await tx.patientAddress.upsert({
                        where: { patientId: id },
                        update: {
                            line1: input.address.line1,
                            line2: input.address.line2,
                            city: input.address.city,
                            state: input.address.state,
                            country: input.address.country,
                            postalCode: input.address.postalCode,
                        },
                        create: {
                            patientId: id,
                            line1: input.address.line1,
                            line2: input.address.line2,
                            city: input.address.city,
                            state: input.address.state,
                            country: input.address.country,
                            postalCode: input.address.postalCode,
                        }
                    });
                }

                return patient;
            });

            logger.info(`Patient updated successfully: ${id}`);
            return result;

        } catch (error) {
            logger.error('Error updating patient:', error);
            if (error instanceof ValidationException) {
                throw error;
            }
            throw new Error('Failed to update patient');
        }
    }

    async uploadConsentDocument(
        input: UploadConsentInput,
        fileBuffer: Buffer,
        mimeType: string,
        originalFileName: string,
        uploadedById: string,
        instituteId: string
    ) {
        try {
            // Verify patient belongs to the institute
            const patient = await this.prisma.patient.findFirst({
                where: {
                    id: input.patientId,
                    instituteId: instituteId,
                }
            });

            if (!patient) {
                throw new ValidationException('Patient not found or access denied', 'PATIENT_NOT_FOUND');
            }

            // Upload file to S3
            const uploadResult = await s3FileStorage.uploadConsentDocument({
                patientId: input.patientId,
                instituteId: instituteId,
                documentType: input.documentType,
                originalFileName: originalFileName,
                fileBuffer: fileBuffer,
                mimeType: mimeType,
            });

            // Save document metadata to database
            const consentDocument = await this.prisma.informedConsent.create({
                data: {
                    patientId: input.patientId,
                    documentType: input.documentType as any,
                    fileName: uploadResult.fileName,
                    originalFileName: uploadResult.originalFileName,
                    s3Key: uploadResult.s3Key,
                    s3Url: uploadResult.s3Url,
                    cloudFrontUrl: uploadResult.cloudFrontUrl,
                    fileSize: uploadResult.fileSize,
                    mimeType: uploadResult.mimeType,

                    // Document metadata
                    documentTitle: input.documentTitle,
                    documentDescription: input.documentDescription,
                    version: input.version,

                    // Consent fields
                    consentStatus: input.consentStatus as any || ConsentStatus.PENDING,
                    obtainedDate: input.obtainedDate ? new Date(input.obtainedDate) : undefined,
                    expiryDate: input.expiryDate ? new Date(input.expiryDate) : undefined,
                    witnessName: input.witnessName,

                    // Ethics fields
                    ethicsCommittee: input.ethicsCommittee,
                    approvalNumber: input.approvalNumber,
                    approvalDate: input.approvalDate ? new Date(input.approvalDate) : undefined,

                    // Audit fields
                    uploadedById: uploadedById,

                    status: 1, // Active
                },
                include: {
                    patient: {
                        select: {
                            id: true,
                            patientId: true,
                            firstName: true,
                            lastName: true,
                        }
                    },
                    uploadedBy: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                        }
                    }
                }
            });

            logger.info(`Consent document uploaded successfully for patient: ${input.patientId}`);
            return consentDocument;

        } catch (error) {
            logger.error('Error uploading consent document:', error);
            if (error instanceof ValidationException) {
                throw error;
            }
            throw new Error('Failed to upload consent document');
        }
    }

    async generateSignedUrl(consentId: string, instituteId: string, expiresIn: number = 3600) {
        try {
            // Verify consent document belongs to the institute
            const consent = await this.prisma.informedConsent.findFirst({
                where: {
                    id: consentId,
                    patient: {
                        instituteId: instituteId,
                    }
                }
            });

            if (!consent) {
                throw new ValidationException('Consent document not found or access denied', 'CONSENT_NOT_FOUND');
            }

            // Generate signed URL for secure access
            const signedUrl = await s3FileStorage.generateSignedUrl(consent.s3Key, expiresIn);

            return {
                signedUrl,
                expiresIn,
                fileName: consent.originalFileName,
                fileSize: consent.fileSize,
                mimeType: consent.mimeType,
            };

        } catch (error) {
            logger.error('Error generating signed URL:', error);
            if (error instanceof ValidationException) {
                throw error;
            }
            throw new Error('Failed to generate signed URL');
        }
    }

    async deletePatient(id: string, instituteId: string) {
        try {
            // Verify patient belongs to the institute
            const patient = await this.prisma.patient.findFirst({
                where: {
                    id: id,
                    instituteId: instituteId,
                },
                include: {
                    consentDocuments: true,
                }
            });

            if (!patient) {
                throw new ValidationException('Patient not found or access denied', 'PATIENT_NOT_FOUND');
            }

            // Soft delete - set status to 0
            await this.prisma.patient.update({
                where: { id: id },
                data: { status: 0 }
            });

            // Also soft delete consent documents
            await this.prisma.informedConsent.updateMany({
                where: { patientId: id },
                data: { status: 0 }
            });

            logger.info(`Patient soft deleted successfully: ${id}`);
            return true;

        } catch (error) {
            logger.error('Error deleting patient:', error);
            if (error instanceof ValidationException) {
                throw error;
            }
            throw new Error('Failed to delete patient');
        }
    }
}

export const patientService = new PatientService();
