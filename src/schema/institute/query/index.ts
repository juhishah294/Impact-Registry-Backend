import getInstitutes from './get-institutes';
import getInstitute from './get-institute';
import getPendingInstitutes from './get-pending-institutes';
import getApprovedInstitutes from './get-approved-institutes';

const InstituteQueryFields = {
    institutes: getInstitutes,
    institute: getInstitute,
    pendingInstitutes: getPendingInstitutes,
    approvedInstitutes: getApprovedInstitutes,
};

export default InstituteQueryFields;
