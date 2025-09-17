import { GraphQLError } from 'graphql';
import { getPrismaInstance } from '../../../datasources/prisma';
import { logger } from '../../../utils/logger';
import ValidationException from '../../../utils/errors/validation-error';
import { MedicationFrequency, RouteOfAdministration } from '@prisma/client';

interface CreateFollowUpMedicationInput {
    followUpId: string;
    genericName: string;
    frequency: MedicationFrequency;
    routeOfAdministration: RouteOfAdministration;
    meanDosePerDay?: number;
    startDate: Date;
    stopDate?: Date;
    isNewMedication: boolean;
    isDiscontinued: boolean;
    adherence?: boolean;
    adherenceNotes?: string;
}

export const createFollowUpMedication = async (
    _parent: any,
    args: { input: CreateFollowUpMedicationInput },
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
        const followUp = await prisma.patientFollowUp.findFirst({
            where: {
                id: args.input.followUpId,
                patient: {
                    instituteId: context.user.instituteId
                }
            }
        });

        if (!followUp) {
            throw new GraphQLError('Follow-up not found or access denied', {
                extensions: { code: 'NOT_FOUND' }
            });
        }

        // Create the follow-up medication record
        const medication = await prisma.followUpMedication.create({
            data: args.input,
            include: {
                followUp: {
                    include: {
                        patient: true
                    }
                }
            }
        });

        logger.info(`Follow-up medication created by user ${context.user.id} for follow-up ${args.input.followUpId}`);

        return medication;

    } catch (error) {
        logger.error('Error in createFollowUpMedication mutation:', error);

        if (error instanceof ValidationException) {
            throw error;
        }

        if (error instanceof GraphQLError) {
            throw error;
        }

        throw new GraphQLError('Failed to create follow-up medication', {
            extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
    }
};
