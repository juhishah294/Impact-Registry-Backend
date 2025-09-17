import { patients } from './get-patients';
import { patient } from './get-patient';
import { patientByPatientId } from './get-patient-by-patient-id';
import { generateSignedUrl } from './generate-signed-url';
import { patientFollowUps } from './get-patient-followups';
import { patientFollowUp } from './get-patient-followup';
import { followUpMedications } from './get-followup-medications';

export const PatientQueryFields = {
    patients,
    patient,
    patientByPatientId,
    generateSignedUrl,
    patientFollowUps,
    patientFollowUp,
    followUpMedications,
};

export {
    patients,
    patient,
    patientByPatientId,
    generateSignedUrl,
    patientFollowUps,
    patientFollowUp,
    followUpMedications,
};
