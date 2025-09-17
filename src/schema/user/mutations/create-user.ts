import { userService } from '../services/userService';

const createUser = async (_parent: any, args: any, _context: any) => {
  try {
    const user = await userService.createUser(args.input);
    return user;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to create user');
  }
};

export default createUser;
