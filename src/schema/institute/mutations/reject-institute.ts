import { instituteService } from '../services/instituteService';
import { UserRole } from '../../../types';

const rejectInstitute = async (_parent: any, args: any, context: any) => {
    try {
        if (!context.user || context.user.role !== UserRole.SUPER_ADMIN) {
            throw new Error('Unauthorized: Super admin access required');
        }
        const institute = await instituteService.rejectInstitute(args.id, args.reason, context.user.id);
        return institute;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to reject institute');
    }
};

export default rejectInstitute;
