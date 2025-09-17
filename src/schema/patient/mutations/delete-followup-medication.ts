import { GraphQLError } from 'graphql';
import { getPrismaInstance } from '../../../datasources/prisma';
import { logger } from '../../../utils/logger';

export const deleteFollowUpMedication = async (
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

        // Delete the medication record
        await prisma.followUpMedication.delete({
            where: { id: args.id }
        });

        logger.info(`Follow-up medication deleted by user ${context.user.id}: ${args.id}`);

        return true;

    } catch (error) {
        logger.error('Error in deleteFollowUpMedication mutation:', error);

        if (error instanceof GraphQLError) {
            throw error;
        }

        throw new GraphQLError('Failed to delete follow-up medication', {
            extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
    }
};
