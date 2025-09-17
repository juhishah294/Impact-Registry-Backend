import { GraphQLError } from 'graphql';
import { patientService } from '../services/patientService';
import { logger } from '../../../utils/logger';

export const patientByPatientId = async (
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

        const patient = await patientService.getPatientByPatientId(
            args.patientId,
            context.user.instituteId
        );

        if (!patient) {
            throw new GraphQLError('Patient not found', {
                extensions: { code: 'NOT_FOUND' }
            });
        }

        logger.info(`Retrieved patient by patientId ${args.patientId} for user ${context.user.id}`);

        return patient;

    } catch (error) {
        logger.error('Error in patientByPatientId query:', error);

        if (error instanceof GraphQLError) {
            throw error;
        }

        throw new GraphQLError('Failed to retrieve patient', {
            extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
    }
};
