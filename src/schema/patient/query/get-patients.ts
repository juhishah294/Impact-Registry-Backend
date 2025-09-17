import { GraphQLError } from 'graphql';
import { patientService } from '../services/patientService';
import { logger } from '../../../utils/logger';

export const patients = async (
    _parent: any,
    args: { limit?: number; offset?: number },
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

        const limit = args.limit || 50;
        const offset = args.offset || 0;

        const patients = await patientService.getPatientsByInstitute(
            context.user.instituteId,
            limit,
            offset
        );

        logger.info(`Retrieved ${patients.length} patients for institute ${context.user.instituteId}`);

        return patients;

    } catch (error) {
        logger.error('Error in patients query:', error);

        if (error instanceof GraphQLError) {
            throw error;
        }

        throw new GraphQLError('Failed to retrieve patients', {
            extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
    }
};
