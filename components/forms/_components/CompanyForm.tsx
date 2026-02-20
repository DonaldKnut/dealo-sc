import { Control, FieldErrors } from "react-hook-form";
import CustomFormField from "../CustomFormField";
import { FormFieldType } from "../CustomFormField";

interface CompanyFormProps {
  control: Control<any>;
  errors?: FieldErrors<any>;
}

const CompanyForm = ({ control, errors }: CompanyFormProps) => (
  <div>
    <CustomFormField
      control={control}
      name="companyName"
      label="Company Name"
      fieldType={FormFieldType.INPUT}
    />
    <CustomFormField
      control={control}
      name="industry"
      label="Industry"
      fieldType={FormFieldType.INPUT}
    />
    <CustomFormField
      control={control}
      name="companySize"
      label="Company Size"
      fieldType={FormFieldType.INPUT}
    />
    <CustomFormField
      control={control}
      name="website"
      label="Company Website"
      fieldType={FormFieldType.INPUT}
    />
  </div>
);

export default CompanyForm;
