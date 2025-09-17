import { getPrismaInstance } from '../../../datasources/prisma';
import bcrypt from 'bcryptjs';
import { logger } from '../../../utils/logger';
import { generateToken } from '../../../utils/jwt';
import ValidationException from '../../../utils/errors/validation-error';
import { CreateUserInput, UserRegistrationInput, LoginResponse } from '../../../types';

export class UserService {
    private prisma = getPrismaInstance();

    async createUser(input: CreateUserInput) {
        try {
            // Hash password
            const hashedPassword = await bcrypt.hash(input.password, 12);

            // Create user
            const user = await this.prisma.user.create({
                data: {
                    email: input.email,
                    password: hashedPassword,
                    firstName: input.firstName,
                    lastName: input.lastName,
                    role: input.role as any,
                    instituteId: input.instituteId,
                    status: 1, // Active
                },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    status: true,
                    instituteId: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });

            logger.info(`User created successfully: ${user.email}`);
            return user;
        } catch (error: any) {
            logger.error('Error creating user:', error);

            // Handle Prisma unique constraint violation
            if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
                throw new ValidationException('Email already registered', 'EMAIL_ALREADY_EXISTS');
            }

            throw new Error('Failed to create user');
        }
    }

    async authenticateUser(email: string, password: string) {
        try {
            // Find user by email
            const user = await this.prisma.user.findUnique({
                where: { email },
            });

            if (!user) {
                logger.warn(`Login attempt for non-existent user: ${email}`);
                return null;
            }

            // Check if user is active
            if (user.status !== 1) {
                logger.warn(`Login attempt for inactive user: ${email}`);
                return null;
            }

            // Verify password
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                logger.warn(`Invalid password for user: ${email}`);
                return null;
            }

            // Return user without password
            const { password: _, ...userWithoutPassword } = user;
            logger.info(`User authenticated successfully: ${email}`);
            return userWithoutPassword;
        } catch (error) {
            logger.error('Error authenticating user:', error);
            throw new Error('Authentication failed');
        }
    }

    async getUserById(id: string) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    status: true,
                    instituteId: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });

            return user;
        } catch (error) {
            logger.error('Error getting user by ID:', error);
            throw new Error('Failed to get user');
        }
    }

    async getAllUsers() {
        try {
            const users = await this.prisma.user.findMany({
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    status: true,
                    createdAt: true,
                    updatedAt: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });

            return users;
        } catch (error) {
            logger.error('Error getting all users:', error);
            throw new Error('Failed to get users');
        }
    }

    async registerUserToInstitute(input: UserRegistrationInput): Promise<LoginResponse> {
        try {
            // Validate input
            this.validateUserRegistrationInput(input);

            // Check if email already exists
            const existingUser = await this.prisma.user.findUnique({
                where: { email: input.email },
            });

            if (existingUser) {
                throw new ValidationException('Email already registered', 'EMAIL_ALREADY_EXISTS');
            }

            // Verify institute exists
            const institute = await this.prisma.institute.findUnique({
                where: { id: input.instituteId },
            });

            if (!institute) {
                throw new ValidationException('Institute not found', 'INSTITUTE_NOT_FOUND');
            }

            // Create user
            const userInput: CreateUserInput = {
                email: input.email,
                password: input.password,
                firstName: input.firstName,
                lastName: input.lastName,
                role: input.role,
                instituteId: input.instituteId,
            };
            const user = await this.createUser(userInput);

            // Generate token for the user
            const token = generateToken({
                userId: user.id,
                email: user.email,
                role: user.role,
            });

            logger.info(`User registered to institute successfully: ${user.email} for ${institute.centerName}`);
            return { user: user as any, token };
        } catch (error) {
            logger.error('Error registering user to institute:', error);
            if (error instanceof ValidationException) {
                throw error;
            }
            throw new Error('Failed to register user to institute');
        }
    }

    async disableUser(id: string) {
        try {
            const user = await this.prisma.user.update({
                where: { id },
                data: { status: 0 }, // 0 = Disabled/Inactive
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    status: true,
                    instituteId: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });

            logger.info(`User disabled successfully: ${user.email}`);
            return user;
        } catch (error) {
            logger.error('Error disabling user:', error);
            throw new Error('Failed to disable user');
        }
    }

    async enableUser(id: string) {
        try {
            const user = await this.prisma.user.update({
                where: { id },
                data: { status: 1 }, // 1 = Active
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    status: true,
                    instituteId: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });

            logger.info(`User enabled successfully: ${user.email}`);
            return user;
        } catch (error) {
            logger.error('Error enabling user:', error);
            throw new Error('Failed to enable user');
        }
    }

    private validateUserRegistrationInput(input: UserRegistrationInput): void {
        if (!input.email || !input.password || !input.firstName || !input.lastName || !input.instituteId) {
            throw new ValidationException('Required fields are missing', 'MISSING_REQUIRED_FIELDS');
        }

        if (input.password.length < 6) {
            throw new ValidationException('Password must be at least 6 characters long', 'PASSWORD_TOO_SHORT');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.email)) {
            throw new ValidationException('Invalid email format', 'INVALID_EMAIL_FORMAT');
        }
    }
}

export const userService = new UserService();
