import { User, UserPermissions } from './user';
import { InstituteStatusInfo } from './institute';

export interface UserStatusResponse {
    user: User;
    isActive: boolean;
    isDisabled: boolean;
    instituteStatus?: InstituteStatusInfo;
    permissions: UserPermissions;
    canAccessSystem: boolean;
    statusMessage: string;
}
