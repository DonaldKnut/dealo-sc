import { Control, FieldErrors } from "react-hook-form";
import CustomFormField from "../CustomFormField";
import { FormFieldType } from "../CustomFormField";

interface InstructorFormProps {
  control: Control<any>;
  errors?: FieldErrors<any>;
}

const InstructorForm = ({ control, errors }: InstructorFormProps) => (
  <div>
    <CustomFormField
      control={control}
      name="subjects"
      label="Subjects Taught"
      fieldType={FormFieldType.TEXTAREA}
    />
    <CustomFormField
      control={control}
      name="teachingExperience"
      label="Teaching Experience"
      fieldType={FormFieldType.INPUT}
    />
    <CustomFormField
      control={control}
      name="qualifications"
      label="Qualifications"
      fieldType={FormFieldType.TEXTAREA}
    />
    <CustomFormField
      control={control}
      name="teachingStyle"
      label="Teaching Style"
      fieldType={FormFieldType.TEXTAREA}
    />
  </div>
);

export default InstructorForm;
