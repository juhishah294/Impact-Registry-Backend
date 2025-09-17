import { GraphQLError } from 'graphql';
import { getPrismaInstance } from '../../../datasources/prisma';
import { logger } from '../../../utils/logger';
import ValidationException from '../../../utils/errors/validation-error';
import {
    FamilyIncomeRange,
    PaymentMode,
    InsuranceType,
    EducationLevel,
    PrimaryCaregiver,
    Occupation,
    CKDStage,
    BPClassification,
    TannerStage,
    ProteinuriaLevel
} from '@prisma/client';

interface CreatePatientFollowUpInput {
    patientId: string;
    followUpDate: Date;
    visitNumber: number;

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
    newSymptomsSinceLastVisit?: string[];

    // Structured Comorbidity Status Checklist
    hasHypertension?: boolean;
    hasGrowthFailure?: boolean;
    hasAnemia?: boolean;
    hasBoneMineralDisease?: boolean;
    hasMetabolicAcidosis?: boolean;
    otherComorbidities?: string[];

    // Hospitalization tracking
    hasHospitalizationSinceLastVisit?: boolean;
    hospitalizationDetails?: string;

    // 3. Physical Examination Updates
    currentHeight?: number;
    currentHeightSDS?: number;
    currentWeight?: number;
    currentBMI?: number;
    currentBMISDS?: number;
    currentSystolicBP?: number;
    currentDiastolicBP?: number;
    currentSBPPercentile?: number;
    currentDBPPercentile?: number;
    currentBPClassification?: BPClassification;
    currentTannerStage?: TannerStage;

    // 4. Laboratory Investigations (Follow-up)
    followUpSerumCreatinine?: number;
    followUpSerumUrea?: number;
    followUpEGFR?: number;
    followUpProteinuriaDipstick?: ProteinuriaLevel;
    followUpHemoglobin?: number;
    followUpSodium?: number;
    followUpPotassium?: number;
    followUpChloride?: number;
    followUpBicarbonate?: number;
    followUpCalcium?: number;
    followUpPhosphorus?: number;
    followUpVitaminD?: number;
    followUpIronLevel?: number;
    followUpFerritin?: number;
    followUpPTH?: number;
    followUpALP?: number;
    followUpUricAcid?: number;

    // Follow-up Imaging and Tests
    followUpOtherImaging?: string;
    followUpGeneticTests?: string;

    // 5. Medication Adherence
    overallMedicationAdherence?: boolean;
    adherenceNonComplianceReason?: string;

    // Clinical notes
    clinicalNotes?: string;
    nextFollowUpDate?: Date;
}

export const createPatientFollowUp = async (
    _parent: any,
    args: { input: CreatePatientFollowUpInput },
    context: any
) => {
    try {
        if (!context.user) {
            throw new GraphQLError('Authentication required', {
                extensions: { code: 'UNAUTHENTICATED' }
            });
        }

        if (!context.user.instituteId) {
            throw new GraphQLError('User must be associated with an institute', {
                extensions: { code: 'FORBIDDEN' }
            });
        }

        const prisma = getPrismaInstance();

        // Verify patient exists and belongs to user's institute
        const patient = await prisma.patient.findFirst({
            where: {
                id: args.input.patientId,
                instituteId: context.user.instituteId
            }
        });

        if (!patient) {
            throw new GraphQLError('Patient not found or access denied', {
                extensions: { code: 'NOT_FOUND' }
            });
        }

        // Create the follow-up record
        const followUp = await prisma.patientFollowUp.create({
            data: {
                ...args.input,
                patientId: args.input.patientId
            },
            include: {
                patient: {
                    include: {
                        institute: true,
                        address: true
                    }
                },
                followUpMedications: true
            }
        });

        logger.info(`Patient follow-up created by user ${context.user.id} for patient ${args.input.patientId}`);

        return followUp;

    } catch (error) {
        logger.error('Error in createPatientFollowUp mutation:', error);

        if (error instanceof ValidationException) {
            throw error;
        }

        if (error instanceof GraphQLError) {
            throw error;
        }

        throw new GraphQLError('Failed to create patient follow-up', {
            extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
    }
};
