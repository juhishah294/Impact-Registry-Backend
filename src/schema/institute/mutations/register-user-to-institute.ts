import { userService } from '../../user/services/userService';
import ValidationException from '../../../utils/errors/validation-error';

const registerUserToInstitute = async (_parent: any, args: any, _context: any) => {
    try {
        const result = await userService.registerUserToInstitute(args.input);
        return result;
    } catch (error) {
        if (error instanceof ValidationException) {
            throw error; // Re-throw ValidationException as-is
        }
        throw new Error(error instanceof Error ? error.message : 'Failed to register user to institute');
    }
};

export default registerUserToInstitute;
