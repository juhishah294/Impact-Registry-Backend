import { GraphQLError } from 'graphql';
import { getPrismaInstance } from '../../../datasources/prisma';
import { logger } from '../../../utils/logger';
import ValidationException from '../../../utils/errors/validation-error';
import { MedicationFrequency, RouteOfAdministration } from '@prisma/client';

interface UpdateFollowUpMedicationInput {
    genericName?: string;
    frequency?: MedicationFrequency;
    routeOfAdministration?: RouteOfAdministration;
    meanDosePerDay?: number;
    startDate?: Date;
    stopDate?: Date;
    isNewMedication?: boolean;
    isDiscontinued?: boolean;
    adherence?: boolean;
    adherenceNotes?: string;
}

export const updateFollowUpMedication = async (
    _parent: any,
    args: { id: string; input: UpdateFollowUpMedicationInput },
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

        // Verify medication exists and belongs to user's institute
        const existingMedication = await prisma.followUpMedication.findFirst({
            where: {
                id: args.id,
                followUp: {
                    patient: {
                        instituteId: context.user.instituteId
                    }
                }
            }
        });

        if (!existingMedication) {
            throw new GraphQLError('Follow-up medication not found or access denied', {
                extensions: { code: 'NOT_FOUND' }
            });
        }

        // Update the medication record
        const medication = await prisma.followUpMedication.update({
            where: { id: args.id },
            data: args.input,
            include: {
                followUp: {
                    include: {
                        patient: true
                    }
                }
            }
        });

        logger.info(`Follow-up medication updated by user ${context.user.id}: ${args.id}`);

        return medication;

    } catch (error) {
        logger.error('Error in updateFollowUpMedication mutation:', error);

        if (error instanceof ValidationException) {
            throw error;
        }

        if (error instanceof GraphQLError) {
            throw error;
        }

        throw new GraphQLError('Failed to update follow-up medication', {
            extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
    }
};
