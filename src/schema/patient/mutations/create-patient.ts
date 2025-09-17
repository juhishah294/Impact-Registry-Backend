import { GraphQLError } from 'graphql';
import { patientService } from '../services/patientService';
import { logger } from '../../../utils/logger';
import ValidationException from '../../../utils/errors/validation-error';
import { CreatePatientInput } from '../../../types';

export const createPatient = async (
    _parent: any,
    args: { input: CreatePatientInput },
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

        const patient = await patientService.createPatient(args.input, context.user.instituteId);

        logger.info(`Patient created by user ${context.user.id}: ${patient.patientId}`);

        return patient;

    } catch (error) {
        logger.error('Error in createPatient mutation:', error);

        if (error instanceof ValidationException) {
            throw error;
        }

        if (error instanceof GraphQLError) {
            throw error;
        }

        throw new GraphQLError('Failed to create patient', {
            extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
    }
};
