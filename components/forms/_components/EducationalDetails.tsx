import CustomFormField from "../CustomFormField";
import { Control, useFormContext } from "react-hook-form";
import { FormFieldType } from "../CustomFormField";

interface EducationDetailsProps {
  control: Control<any>;
}

const EducationalDetails = ({ control }: EducationDetailsProps) => {
  return (
    <div>
      <CustomFormField
        name="highestQualification"
        label="Highest Qualification"
        fieldType={FormFieldType.SELECT}
        control={control}
      >
        <option value="High School">High School</option>
        <option value="Bachelors">Bachelors</option>
        <option value="Masters">Masters</option>
        <option value="PhD">PhD</option>
      </CustomFormField>
      <CustomFormField
        name="universityName"
        label="University Name"
        fieldType={FormFieldType.INPUT}
        control={control}
      />
      <CustomFormField
        name="graduationYear"
        label="Graduation Year"
        fieldType={FormFieldType.DATE_PICKER}
        control={control}
        dateFormat="yyyy"
      />
    </div>
  );
};

export default EducationalDetails;
