import { instituteService } from '../services/instituteService';

const getInstitute = async (_parent: any, args: any) => {
    try {
        return await instituteService.getInstituteById(args.id);
    } catch (error) {
        throw new Error('Failed to fetch institute');
    }
};

export default getInstitute;
