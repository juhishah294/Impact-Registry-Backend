import registerInstituteWithAdmin from './register-institute-with-admin';
import registerUserToInstitute from './register-user-to-institute';
import approveInstitute from './approve-institute';
import rejectInstitute from './reject-institute';
import suspendInstitute from './suspend-institute';
import registerInstitute from './create-institute';
import disableInstitute from './disable-institute';
import enableInstitute from './enable-institute';

const InstituteMutationFields = {
    registerInstituteWithAdmin,
    registerUserToInstitute,
    approveInstitute,
    rejectInstitute,
    suspendInstitute,
    registerInstitute,
    disableInstitute,
    enableInstitute,
};

export default InstituteMutationFields;
