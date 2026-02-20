import CustomFormField from "../CustomFormField";
import { FormFieldType } from "../CustomFormField";
import { Control } from "react-hook-form";

interface MedicalDetailsProps {
  control: Control<any>; // Require control prop
}

const MedicalDetails = ({ control }: MedicalDetailsProps) => (
  <div>
    <CustomFormField
      control={control}
      name="primaryPhysician"
      label="Primary Physician"
      fieldType={FormFieldType.INPUT}
    />
    <CustomFormField
      control={control}
      name="insuranceProvider"
      label="Insurance Provider"
      fieldType={FormFieldType.INPUT}
    />
    <CustomFormField
      control={control}
      name="insurancePolicyNumber"
      label="Insurance Policy Number"
      fieldType={FormFieldType.INPUT}
    />
    <CustomFormField
      control={control}
      name="allergies"
      label="Allergies"
      fieldType={FormFieldType.TEXTAREA}
    />
    <CustomFormField
      control={control}
      name="currentMedication"
      label="Current Medication"
      fieldType={FormFieldType.TEXTAREA}
    />
    <CustomFormField
      control={control}
      name="familyMedicalHistory"
      label="Family Medical History"
      fieldType={FormFieldType.TEXTAREA}
    />
    <CustomFormField
      control={control}
      name="pastMedicalHistory"
      label="Past Medical History"
      fieldType={FormFieldType.TEXTAREA}
    />
  </div>
);

export default MedicalDetails;
