import { shield, rule, deny, allow } from 'graphql-shield';
import { GraphQLError } from 'graphql';
import { logger } from './utils/logger';
import { UserRole, InstituteStatus } from './types';

// Permission calculation utilities
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

export const calculateUserPermissions = (role: UserRole, instituteStatus: any): UserPermissions => {
  const permissions: UserPermissions = {
    canManageUsers: false,
    canManageInstitute: false,
    canViewAllInstitutes: false,
    canApproveInstitutes: false,
    canEnterData: false,
    canViewReports: false,
    canExportData: false,
    canManageSystem: false,
  };

  switch (role) {
    case UserRole.SUPER_ADMIN:
      return {
        canManageUsers: true,
        canManageInstitute: true,
        canViewAllInstitutes: true,
        canApproveInstitutes: true,
        canEnterData: true,
        canViewReports: true,
        canExportData: true,
        canManageSystem: true,
      };

    case UserRole.INSTITUTE_ADMIN:
      const isInstituteApproved = instituteStatus?.isApproved || false;
      return {
        canManageUsers: isInstituteApproved,
        canManageInstitute: isInstituteApproved,
        canViewAllInstitutes: false,
        canApproveInstitutes: false,
        canEnterData: isInstituteApproved,
        canViewReports: isInstituteApproved,
        canExportData: isInstituteApproved,
        canManageSystem: false,
      };

    case UserRole.ADMIN:
      return {
        canManageUsers: true,
        canManageInstitute: false,
        canViewAllInstitutes: true,
        canApproveInstitutes: false,
        canEnterData: true,
        canViewReports: true,
        canExportData: true,
        canManageSystem: false,
      };

    case UserRole.DATA_ENTRY:
      const canEnterData = instituteStatus?.isApproved || false;
      return {
        canManageUsers: false,
        canManageInstitute: false,
        canViewAllInstitutes: false,
        canApproveInstitutes: false,
        canEnterData: canEnterData,
        canViewReports: canEnterData,
        canExportData: false,
        canManageSystem: false,
      };

    default:
      return permissions;
  }
};

export const calculateSystemAccess = (user: any, instituteStatus: any): boolean => {
  // User must be active
  if (user.status !== 1) {
    return false;
  }

  // Super admin always has access
  if (user.role === UserRole.SUPER_ADMIN) {
    return true;
  }

  // Admin always has access (system-level admin)
  if (user.role === UserRole.ADMIN) {
    return true;
  }

  // Institute-based users need approved institute
  if (user.role === UserRole.INSTITUTE_ADMIN || user.role === UserRole.DATA_ENTRY) {
    if (!instituteStatus) {
      return false; // No institute assigned
    }

    if (instituteStatus.isRejected || instituteStatus.isSuspended) {
      return false; // Institute rejected or suspended
    }

    // Allow access for pending institutes (limited functionality)
    // Full access only for approved institutes
    return true;
  }

  return false;
};

export const generateStatusMessage = (user: any, instituteStatus: any): string => {
  if (user.status !== 1) {
    return 'Your account is disabled. Please contact support.';
  }

  if (user.role === UserRole.SUPER_ADMIN) {
    return 'Full system access - Super Administrator';
  }

  if (user.role === UserRole.ADMIN) {
    return 'System administrator with full access';
  }

  if (!instituteStatus) {
    return 'No institute assigned. Please contact your administrator.';
  }

  switch (instituteStatus.approvalStatus) {
    case InstituteStatus.PENDING_APPROVAL:
      return 'Your institute registration is pending approval. Limited access available.';
    case InstituteStatus.APPROVED:
      return 'Your institute is approved. Full access available.';
    case InstituteStatus.REJECTED:
      return `Your institute registration was rejected. Reason: ${instituteStatus.rejectionReason || 'Not specified'}`;
    case InstituteStatus.SUSPENDED:
      return 'Your institute has been suspended. Please contact support.';
    default:
      return 'Unknown status. Please contact support.';
  }
};


// Authentication rule
const isAuthenticated = rule({ cache: 'contextual' })(
  async (_parent, _args, context) => {
    try {
      // Check for authentication errors first
      if (context.authError) {
        return new GraphQLError(context.authError.message, {
          extensions: {
            code: context.authError.code,
            expiredAt: context.authError.expiredAt
          }
        });
      }

      if (!context.user) {
        return new GraphQLError('Authentication required', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }
      return true;
    } catch (error) {
      logger.error('Authentication error:', error);
      return new GraphQLError('Authentication failed', {
        extensions: { code: 'UNAUTHENTICATED' }
      });
    }
  }
);

// Role-based authorization rules for our current system
const isSuperAdmin = rule({ cache: 'contextual' })(
  async (_parent, _args, context) => {
    if (!context.user || context.user.role !== UserRole.SUPER_ADMIN) {
      return new GraphQLError('Super admin access required', {
        extensions: { code: 'FORBIDDEN' }
      });
    }
    return true;
  }
);

const isAdmin = rule({ cache: 'contextual' })(
  async (_parent, _args, context) => {
    const allowedRoles = [UserRole.SUPER_ADMIN, UserRole.ADMIN];
    if (!context.user || !allowedRoles.includes(context.user.role)) {
      return new GraphQLError('Admin access required', {
        extensions: { code: 'FORBIDDEN' }
      });
    }
    return true;
  }
);

const isInstituteAdmin = rule({ cache: 'contextual' })(
  async (_parent, _args, context) => {
    const allowedRoles = [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.INSTITUTE_ADMIN];
    if (!context.user || !allowedRoles.includes(context.user.role)) {
      return new GraphQLError('Institute admin access required', {
        extensions: { code: 'FORBIDDEN' }
      });
    }
    return true;
  }
);


// Permission matrix for our current system
export const servicePermissions = shield({
  Query: {
    // Basic queries
    hello: allow,
    me: isAuthenticated,
    userStatus: isAuthenticated,

    // Institute queries
    institutes: isAdmin,
    institute: isInstituteAdmin,
    pendingInstitutes: isSuperAdmin,
    approvedInstitutes: isAdmin,
  },

  Mutation: {
    // Authentication mutations
    login: allow,

    // User mutations
    createUser: isAdmin,
    disableUser: isSuperAdmin,
    enableUser: isSuperAdmin,

    // Institute mutations
    registerInstitute: allow, // Public registration
    registerInstituteWithAdmin: allow, // Public registration
    registerUserToInstitute: isInstituteAdmin,
    approveInstitute: isSuperAdmin,
    rejectInstitute: isSuperAdmin,
    suspendInstitute: isSuperAdmin,
    disableInstitute: isSuperAdmin,
    enableInstitute: isSuperAdmin,

    // Patient management
    patients: isAuthenticated,
    patient: isAuthenticated,
    patientByPatientId: isAuthenticated,
    createPatient: isAuthenticated,
    updatePatient: isAuthenticated,
    deletePatient: isAuthenticated,
    uploadConsentDocument: isAuthenticated,
    generateSignedUrl: isAuthenticated,
  }
}, {
  allowExternalErrors: true,
  fallbackRule: deny,
  fallbackError: new GraphQLError('Access denied', {
    extensions: { code: 'FORBIDDEN' }
  })
});

// Development permissions (all enabled)
export const servicePermissionsWithAllEnabled = shield({}, {
  allowExternalErrors: true,
  fallbackRule: allow
});

// Test permissions (all disabled)
export const servicePermissionsWithAllDisabled = shield({}, {
  allowExternalErrors: true,
  fallbackRule: deny,
  fallbackError: new GraphQLError('Access denied in test mode', {
    extensions: { code: 'FORBIDDEN' }
  })
});

export { servicePermissions as default };
