import { userService } from '../services/userService';
import { UserRole } from '../../../types';

const disableUser = async (_parent: any, args: any, context: any) => {
    try {
        // Only SUPER_ADMIN can disable users
        if (!context.user || context.user.role !== UserRole.SUPER_ADMIN) {
            throw new Error('Access denied. Only super admin can disable users.');
        }

        const user = await userService.disableUser(args.id);
        return user;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to disable user');
    }
};

export default disableUser;
