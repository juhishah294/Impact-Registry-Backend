import { instituteService } from '../services/instituteService';
import ValidationException from '../../../utils/errors/validation-error';

const registerInstituteWithAdmin = async (_parent: any, args: any, _context: any) => {
    try {
        const result = await instituteService.registerInstituteWithAdmin(args.input);
        return result;
    } catch (error) {
        if (error instanceof ValidationException) {
            throw error; // Re-throw ValidationException as-is
        }
        throw new Error(error instanceof Error ? error.message : 'Failed to register institute with admin');
    }
};

export default registerInstituteWithAdmin;
