export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthPayload {
  token: string;
  user: User;
  expiresIn: number;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface SignupInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface AuthContext {
  user?: User;
  token?: string;
  isAuthenticated: boolean;
}

export interface PasswordResetInput {
  email: string;
}

export interface PasswordResetConfirmInput {
  token: string;
  newPassword: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  RESEARCHER = 'RESEARCHER',
  COORDINATOR = 'COORDINATOR',
  MONITOR = 'MONITOR'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
  SUSPENDED = 'SUSPENDED'
}

export interface TokenValidationResult {
  isValid: boolean;
  payload?: JwtPayload;
  error?: string;
}

export interface AuthenticationError {
  message: string;
  code: string;
  statusCode: number;
}
