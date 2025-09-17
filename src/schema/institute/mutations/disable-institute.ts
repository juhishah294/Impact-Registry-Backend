import { instituteService } from '../services/instituteService';
import { UserRole } from '../../../types';

const disableInstitute = async (_parent: any, args: any, context: any) => {
    try {
        // Only SUPER_ADMIN can disable institutes
        if (!context.user || context.user.role !== UserRole.SUPER_ADMIN) {
            throw new Error('Access denied. Only super admin can disable institutes.');
        }

        const institute = await instituteService.disableInstitute(args.id);
        return institute;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to disable institute');
    }
};

export default disableInstitute;
