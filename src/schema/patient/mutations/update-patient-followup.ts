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

interface UpdatePatientFollowUpInput {
    followUpDate?: Date;
    visitNumber?: number;

    // All the same fields as CreatePatientFollowUpInput but optional
    hasSocioeconomicChanges?: boolean;
    hasResidenceChange?: boolean;
    hasContactChange?: boolean;
    hasIncomeChange?: boolean;
    hasEducationStatusChange?: boolean;
    hasPaymentStatusChange?: boolean;

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

    newGuardianName?: string;
    newGuardianPhone?: string;
    newGuardianEmail?: string;
    newGuardianRelationship?: string;

    currentCKDStage?: CKDStage;
    isDialysisInitiated?: boolean;
    dialysisNotInitiatedReason?: string;
    newSymptomsSinceLastVisit?: string[];

    hasHypertension?: boolean;
    hasGrowthFailure?: boolean;
    hasAnemia?: boolean;
    hasBoneMineralDisease?: boolean;
    hasMetabolicAcidosis?: boolean;
    otherComorbidities?: string[];

    hasHospitalizationSinceLastVisit?: boolean;
    hospitalizationDetails?: string;

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

    followUpOtherImaging?: string;
    followUpGeneticTests?: string;

    overallMedicationAdherence?: boolean;
    adherenceNonComplianceReason?: string;

    clinicalNotes?: string;
    nextFollowUpDate?: Date;
}

export const updatePatientFollowUp = async (
    _parent: any,
    args: { id: string; input: UpdatePatientFollowUpInput },
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

        // Verify follow-up exists and belongs to user's institute
        const existingFollowUp = await prisma.patientFollowUp.findFirst({
            where: {
                id: args.id,
                patient: {
                    instituteId: context.user.instituteId
                }
            }
        });

        if (!existingFollowUp) {
            throw new GraphQLError('Follow-up not found or access denied', {
                extensions: { code: 'NOT_FOUND' }
            });
        }

        // Update the follow-up record
        const followUp = await prisma.patientFollowUp.update({
            where: { id: args.id },
            data: args.input,
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

        logger.info(`Patient follow-up updated by user ${context.user.id}: ${args.id}`);

        return followUp;

    } catch (error) {
        logger.error('Error in updatePatientFollowUp mutation:', error);

        if (error instanceof ValidationException) {
            throw error;
        }

        if (error instanceof GraphQLError) {
            throw error;
        }

        throw new GraphQLError('Failed to update patient follow-up', {
            extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
    }
};
