import { instituteService } from '../services/instituteService';
import { UserRole } from '../../../types';

const enableInstitute = async (_parent: any, args: any, context: any) => {
    try {
        // Only SUPER_ADMIN can enable institutes
        if (!context.user || context.user.role !== UserRole.SUPER_ADMIN) {
            throw new Error('Access denied. Only super admin can enable institutes.');
        }

        const institute = await instituteService.enableInstitute(args.id);
        return institute;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to enable institute');
    }
};

export default enableInstitute;
