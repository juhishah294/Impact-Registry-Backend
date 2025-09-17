import UserMutationFields from './user/mutations';
import InstituteMutationFields from './institute/mutations';
import { PatientMutationFields } from './patient/mutations';

const mutationFields = {
  ...UserMutationFields,
  ...InstituteMutationFields,
  ...PatientMutationFields,
};

export default mutationFields;