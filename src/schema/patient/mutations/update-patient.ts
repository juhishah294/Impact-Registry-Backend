import { GraphQLError } from 'graphql';
import { patientService } from '../services/patientService';
import { logger } from '../../../utils/logger';
import ValidationException from '../../../utils/errors/validation-error';
import { UpdatePatientInput } from '../../../types';

export const updatePatient = async (
    _parent: any,
    args: { id: string; input: UpdatePatientInput },
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

        const patient = await patientService.updatePatient(
            args.id,
            args.input,
            context.user.instituteId
        );

        logger.info(`Patient updated by user ${context.user.id}: ${args.id}`);

        return patient;

    } catch (error) {
        logger.error('Error in updatePatient mutation:', error);

        if (error instanceof ValidationException) {
            throw error;
        }

        if (error instanceof GraphQLError) {
            throw error;
        }

        throw new GraphQLError('Failed to update patient', {
            extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
    }
};
