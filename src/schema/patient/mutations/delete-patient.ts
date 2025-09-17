import { GraphQLError } from 'graphql';
import { patientService } from '../services/patientService';
import { logger } from '../../../utils/logger';
import ValidationException from '../../../utils/errors/validation-error';

export const deletePatient = async (
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

        const success = await patientService.deletePatient(args.id, context.user.instituteId);

        logger.info(`Patient deleted by user ${context.user.id}: ${args.id}`);

        return success;

    } catch (error) {
        logger.error('Error in deletePatient mutation:', error);

        if (error instanceof ValidationException) {
            throw error;
        }

        if (error instanceof GraphQLError) {
            throw error;
        }

        throw new GraphQLError('Failed to delete patient', {
            extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
    }
};
