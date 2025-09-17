import { GraphQLError } from 'graphql';
import { getPrismaInstance } from '../../../datasources/prisma';
import { logger } from '../../../utils/logger';

export const patientFollowUps = async (
    _parent: any,
    args: { patientId: string },
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
                id: args.patientId,
                instituteId: context.user.instituteId
            }
        });

        if (!patient) {
            throw new GraphQLError('Patient not found or access denied', {
                extensions: { code: 'NOT_FOUND' }
            });
        }

        // Get all follow-ups for the patient, ordered by follow-up date (most recent first)
        const followUps = await prisma.patientFollowUp.findMany({
            where: {
                patientId: args.patientId,
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
            },
            orderBy: [
                { followUpDate: 'desc' },
                { visitNumber: 'desc' }
            ]
        });

        logger.info(`Retrieved ${followUps.length} follow-ups for patient ${args.patientId} by user ${context.user.id}`);

        return followUps;

    } catch (error) {
        logger.error('Error in patientFollowUps query:', error);

        if (error instanceof GraphQLError) {
            throw error;
        }

        throw new GraphQLError('Failed to retrieve patient follow-ups', {
            extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
    }
};
