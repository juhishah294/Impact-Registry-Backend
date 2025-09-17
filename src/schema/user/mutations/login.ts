import { userService } from '../services/userService';
import { generateToken } from '../../../utils/jwt';

const login = async (_parent: any, args: any, _context: any) => {
  try {
    const { email, password } = args;

    // Authenticate user
    const user = await userService.authenticateUser(email, password);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user,
      token,
    };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Login failed');
  }
};

export default login;
