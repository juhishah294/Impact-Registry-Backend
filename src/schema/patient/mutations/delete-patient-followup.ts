import { GraphQLError } from 'graphql';
import { getPrismaInstance } from '../../../datasources/prisma';
import { logger } from '../../../utils/logger';

export const deletePatientFollowUp = async (
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

        // Delete associated follow-up medications first
        await prisma.followUpMedication.deleteMany({
            where: { followUpId: args.id }
        });

        // Delete the follow-up record
        await prisma.patientFollowUp.delete({
            where: { id: args.id }
        });

        logger.info(`Patient follow-up deleted by user ${context.user.id}: ${args.id}`);

        return true;

    } catch (error) {
        logger.error('Error in deletePatientFollowUp mutation:', error);

        if (error instanceof GraphQLError) {
            throw error;
        }

        throw new GraphQLError('Failed to delete patient follow-up', {
            extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
    }
};
