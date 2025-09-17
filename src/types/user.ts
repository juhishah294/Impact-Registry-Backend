import { UserRole, UserStatus } from './enums';

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    status: UserStatus;
    instituteId?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateUserInput {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    instituteId?: string;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface LoginResponse {
    user: User;
    token: string;
}

export interface UserPermissions {
    canManageUsers: boolean;
    canManageInstitute: boolean;
    canViewAllInstitutes: boolean;
    canApproveInstitutes: boolean;
    canEnterData: boolean;
    canViewReports: boolean;
    canExportData: boolean;
    canManageSystem: boolean;
}

export interface UserRegistrationInput {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    instituteId: string;
    role: UserRole;
}
