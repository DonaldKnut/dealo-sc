import { Control, FieldErrors } from "react-hook-form";
import CustomFormField from "../CustomFormField";
import { FormFieldType } from "../CustomFormField";

interface JobSeekerFormProps {
  control: Control<any>;
  errors?: FieldErrors<any>;
}

const JobSeekerForm = ({ control, errors }: JobSeekerFormProps) => (
  <div>
    <CustomFormField
      control={control}
      name="desiredPosition"
      label="Desired Position"
      fieldType={FormFieldType.INPUT}
    />
    <CustomFormField
      control={control}
      name="experience"
      label="Years of Experience"
      fieldType={FormFieldType.INPUT}
    />
    <CustomFormField
      control={control}
      name="education"
      label="Education Level"
      fieldType={FormFieldType.INPUT}
    />
    <CustomFormField
      control={control}
      name="resume"
      label="Resume URL"
      fieldType={FormFieldType.INPUT}
    />
  </div>
);

export default JobSeekerForm;
