import { userService } from '../services/userService';
import { instituteService } from '../../institute/services/instituteService';
import { UserRole, InstituteStatus } from '../../../types';
import {
    calculateUserPermissions,
    calculateSystemAccess,
    generateStatusMessage
} from '../../../permissions';

const userStatus = async (_parent: any, _args: any, context: any) => {
    try {
        if (!context.user) {
            throw new Error('Authentication required');
        }

        const user = await userService.getUserById(context.user.id);
        if (!user) {
            throw new Error('User not found');
        }

        // Get institute information if user belongs to one
        let instituteStatus: any = null;
        if (user.instituteId) {
            const institute = await instituteService.getInstituteById(user.instituteId);
            if (institute) {
                instituteStatus = {
                    approvalStatus: institute.approvalStatus,
                    isApproved: institute.approvalStatus === InstituteStatus.APPROVED,
                    isRejected: institute.approvalStatus === InstituteStatus.REJECTED,
                    isPending: institute.approvalStatus === InstituteStatus.PENDING_APPROVAL,
                    isSuspended: institute.approvalStatus === InstituteStatus.SUSPENDED,
                    rejectionReason: institute.rejectionReason,
                    approvedAt: institute.approvedAt,
                    approvedBy: institute.approvedBy,
                };
            }
        }

        // Determine user status
        const isActive = user.status === 1;
        const isDisabled = user.status === 0;

        // Calculate permissions based on role and institute status
        const permissions = calculateUserPermissions(user.role as UserRole, instituteStatus);

        // Determine if user can access system
        const canAccessSystem = calculateSystemAccess(user, instituteStatus);

        // Generate status message
        const statusMessage = generateStatusMessage(user, instituteStatus);

        return {
            user,
            isActive,
            isDisabled,
            instituteStatus,
            permissions,
            canAccessSystem,
            statusMessage,
        };
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to fetch user status');
    }
};

export default userStatus;
