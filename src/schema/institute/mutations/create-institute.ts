import { instituteService } from '../services/instituteService';

const registerInstitute = async (_parent: any, args: any, _context: any) => {
    try {
        const institute = await instituteService.createInstitute(args.input);
        return institute;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to register institute');
    }
};

export default registerInstitute;
