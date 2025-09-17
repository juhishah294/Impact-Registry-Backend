import { instituteService } from '../services/instituteService';

const getApprovedInstitutes = async () => {
    try {
        return await instituteService.getApprovedInstitutes();
    } catch (error) {
        throw new Error('Failed to fetch approved institutes');
    }
};

export default getApprovedInstitutes;
