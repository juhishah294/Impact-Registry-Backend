import { createPatient } from './create-patient';
import { updatePatient } from './update-patient';
import { deletePatient } from './delete-patient';
import { uploadConsentDocument } from './upload-consent-document';
import { createPatientFollowUp } from './create-patient-followup';
import { updatePatientFollowUp } from './update-patient-followup';
import { deletePatientFollowUp } from './delete-patient-followup';
import { createFollowUpMedication } from './create-followup-medication';
import { updateFollowUpMedication } from './update-followup-medication';
import { deleteFollowUpMedication } from './delete-followup-medication';

export const PatientMutationFields = {
    createPatient,
    updatePatient,
    deletePatient,
    uploadConsentDocument,
    createPatientFollowUp,
    updatePatientFollowUp,
    deletePatientFollowUp,
    createFollowUpMedication,
    updateFollowUpMedication,
    deleteFollowUpMedication,
};

export {
    createPatient,
    updatePatient,
    deletePatient,
    uploadConsentDocument,
    createPatientFollowUp,
    updatePatientFollowUp,
    deletePatientFollowUp,
    createFollowUpMedication,
    updateFollowUpMedication,
    deleteFollowUpMedication,
};
