import { GraphQLError } from 'graphql';
import { patientService } from '../services/patientService';
import { logger } from '../../../utils/logger';
import ValidationException from '../../../utils/errors/validation-error';

export const generateSignedUrl = async (
    _parent: any,
    args: { consentId: string; expiresIn?: number },
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

        const expiresIn = args.expiresIn || 3600; // Default 1 hour

        const result = await patientService.generateSignedUrl(
            args.consentId,
            context.user.instituteId,
            expiresIn
        );

        logger.info(`Generated signed URL for consent ${args.consentId} by user ${context.user.id}`);

        return result;

    } catch (error) {
        logger.error('Error in generateSignedUrl query:', error);

        if (error instanceof ValidationException) {
            throw error;
        }

        if (error instanceof GraphQLError) {
            throw error;
        }

        throw new GraphQLError('Failed to generate signed URL', {
            extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
    }
};
