export interface UserEntity {
  id: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  gender?: string;
  nationality?: string;
  role: string;
  status: number;
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  provinceId?: string;
  profilePicture?: string;
  address?: AddressEntity;
  documents?: DocumentEntity[];
}

export interface AddressEntity {
  id: string;
  userId: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentEntity {
  id: string;
  userId: string;
  type: number;
  name: string;
  description?: string;
  file: string;
  status: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  gender?: string;
  nationality?: string;
  role: string;
  provinceId?: string;
}

export interface UpdateUserInput {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  gender?: string;
  nationality?: string;
  role?: string;
  status?: number;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  twoFactorEnabled?: boolean;
  provinceId?: string;
  profilePicture?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: UserEntity;
  token: string;
  refreshToken: string;
}

export interface UserFilters {
  role?: string;
  status?: number;
  provinceId?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  search?: string;
}

export interface UserPagination {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UsersResponse {
  users: UserEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
