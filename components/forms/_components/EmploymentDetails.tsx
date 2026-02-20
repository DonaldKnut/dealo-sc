import CustomFormField from "../CustomFormField";
import { Control, useFormContext } from "react-hook-form";
import { FormFieldType } from "../CustomFormField";

interface EmploymentDetailsProps {
  control: Control<any>;
}

const EmploymentDetails = ({ control }: EmploymentDetailsProps) => {
  return (
    <div>
      <CustomFormField
        name="jobTitle"
        label="Job Title"
        fieldType={FormFieldType.INPUT}
        control={control}
      />
      <CustomFormField
        name="companyName"
        label="Company Name"
        fieldType={FormFieldType.INPUT}
        control={control}
      />
      <CustomFormField
        name="startDate"
        label="Start Date"
        fieldType={FormFieldType.DATE_PICKER}
        control={control}
        dateFormat="MM/yyyy"
      />
      <CustomFormField
        name="endDate"
        label="End Date"
        fieldType={FormFieldType.DATE_PICKER}
        control={control}
        dateFormat="MM/yyyy"
      />
      <CustomFormField
        name="currentlyEmployed"
        label="Currently Employed"
        fieldType={FormFieldType.CHECKBOX}
        control={control}
      />
    </div>
  );
};

export default EmploymentDetails;
