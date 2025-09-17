import { GraphQLError } from 'graphql';
import { getPrismaInstance } from '../../../datasources/prisma';
import { logger } from '../../../utils/logger';

export const followUpMedications = async (
    _parent: any,
    args: { followUpId: string },
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
                id: args.followUpId,
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

        // Get all medications for the follow-up
        const medications = await prisma.followUpMedication.findMany({
            where: {
                followUpId: args.followUpId,
                status: 1 // Active records only
            },
            include: {
                followUp: {
                    include: {
                        patient: true
                    }
                }
            },
            orderBy: [
                { isNewMedication: 'desc' }, // New medications first
                { genericName: 'asc' }       // Then alphabetically
            ]
        });

        logger.info(`Retrieved ${medications.length} medications for follow-up ${args.followUpId} by user ${context.user.id}`);

        return medications;

    } catch (error) {
        logger.error('Error in followUpMedications query:', error);

        if (error instanceof GraphQLError) {
            throw error;
        }

        throw new GraphQLError('Failed to retrieve follow-up medications', {
            extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
    }
};
