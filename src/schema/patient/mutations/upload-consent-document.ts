import { GraphQLError } from 'graphql';
import { patientService } from '../services/patientService';
import { logger } from '../../../utils/logger';
import ValidationException from '../../../utils/errors/validation-error';
import { UploadConsentInput } from '../../../types';

export const uploadConsentDocument = async (
    _parent: any,
    args: { input: UploadConsentInput; file: any },
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

        // Handle file upload
        const { createReadStream, filename, mimetype } = await args.file;

        // Read file into buffer
        const stream = createReadStream();
        const chunks: Buffer[] = [];

        for await (const chunk of stream) {
            chunks.push(chunk);
        }

        const fileBuffer = Buffer.concat(chunks);

        const consentDocument = await patientService.uploadConsentDocument(
            args.input,
            fileBuffer,
            mimetype,
            filename,
            context.user.id,
            context.user.instituteId
        );

        logger.info(`Consent document uploaded by user ${context.user.id} for patient: ${args.input.patientId}`);

        return consentDocument;

    } catch (error) {
        logger.error('Error in uploadConsentDocument mutation:', error);

        if (error instanceof ValidationException) {
            throw error;
        }

        if (error instanceof GraphQLError) {
            throw error;
        }

        throw new GraphQLError('Failed to upload consent document', {
            extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
    }
};
