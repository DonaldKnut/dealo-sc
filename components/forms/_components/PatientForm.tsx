import { Control, FieldErrors } from "react-hook-form";
import CustomFormField from "../CustomFormField";
import { FormFieldType } from "../CustomFormField";

interface PatientFormProps {
  control: Control<any>;
  errors?: FieldErrors<any>;
}

const PatientForm = ({ control, errors }: PatientFormProps) => (
  <div>
    <CustomFormField
      control={control}
      name="medicalHistory"
      label="Medical History"
      fieldType={FormFieldType.TEXTAREA}
    />
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
  </div>
);

export default PatientForm;
