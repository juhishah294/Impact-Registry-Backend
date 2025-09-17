import { instituteService } from '../services/instituteService';

const getPendingInstitutes = async () => {
    try {
        return await instituteService.getPendingInstitutes();
    } catch (error) {
        throw new Error('Failed to fetch pending institutes');
    }
};

export default getPendingInstitutes;
