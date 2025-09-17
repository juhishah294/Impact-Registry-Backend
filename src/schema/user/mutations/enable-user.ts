import { userService } from '../services/userService';
import { UserRole } from '../../../types';

const enableUser = async (_parent: any, args: any, context: any) => {
    try {
        // Only SUPER_ADMIN can enable users
        if (!context.user || context.user.role !== UserRole.SUPER_ADMIN) {
            throw new Error('Access denied. Only super admin can enable users.');
        }

        const user = await userService.enableUser(args.id);
        return user;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to enable user');
    }
};

export default enableUser;
