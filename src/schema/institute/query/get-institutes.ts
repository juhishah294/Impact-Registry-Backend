import { instituteService } from '../services/instituteService';

const getInstitutes = async () => {
    try {
        return await instituteService.getAllInstitutes();
    } catch (error) {
        throw new Error('Failed to fetch institutes');
    }
};

export default getInstitutes;
