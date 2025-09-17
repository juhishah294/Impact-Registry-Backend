export enum UserRole {
    SUPER_ADMIN = 'SUPER_ADMIN',
    INSTITUTE_ADMIN = 'INSTITUTE_ADMIN',
    ADMIN = 'ADMIN',
    DATA_ENTRY = 'DATA_ENTRY'
}

export enum UserStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    SUSPENDED = 'SUSPENDED',
    PENDING = 'PENDING'
}

export enum InstituteStatus {
    PENDING_APPROVAL = 'PENDING_APPROVAL',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    SUSPENDED = 'SUSPENDED'
}
