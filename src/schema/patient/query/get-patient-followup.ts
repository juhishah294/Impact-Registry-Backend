import { GraphQLError } from 'graphql';
import { getPrismaInstance } from '../../../datasources/prisma';
import { logger } from '../../../utils/logger';

export const patientFollowUp = async (
    _parent: any,
    args: { id: string },
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

        // Get the specific follow-up with all related data
        const followUp = await prisma.patientFollowUp.findFirst({
            where: {
                id: args.id,
                patient: {
                    instituteId: context.user.instituteId
                },
                status: 1 // Active records only
            },
            include: {
                patient: {
                    include: {
                        institute: true,
                        address: true
                    }
                },
                followUpMedications: {
                    where: { status: 1 },
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!followUp) {
            throw new GraphQLError('Follow-up not found or access denied', {
                extensions: { code: 'NOT_FOUND' }
            });
        }

        logger.info(`Retrieved follow-up ${args.id} for user ${context.user.id}`);

        return followUp;

    } catch (error) {
        logger.error('Error in patientFollowUp query:', error);

        if (error instanceof GraphQLError) {
            throw error;
        }

        throw new GraphQLError('Failed to retrieve patient follow-up', {
            extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
    }
};
