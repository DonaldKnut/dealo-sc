import { Control, FieldErrors, UseFormSetValue } from "react-hook-form";
import CustomFormField from "../CustomFormField";
import { FormFieldType } from "../CustomFormField";

interface FreelancerFormProps {
  control: Control<any>;
  errors?: FieldErrors<any>;
  setValue?: UseFormSetValue<any>;
  trigger?: () => void;
}

const FreelancerForm = ({
  control,
  errors,
  setValue,
  trigger,
}: FreelancerFormProps) => (
  <div>
    <CustomFormField
      control={control}
      name="skills"
      label="Skills"
      fieldType={FormFieldType.TEXTAREA}
    />
    <CustomFormField
      control={control}
      name="experience"
      label="Years of Experience"
      fieldType={FormFieldType.INPUT}
    />
    <CustomFormField
      control={control}
      name="portfolio"
      label="Portfolio URL"
      fieldType={FormFieldType.INPUT}
    />
    <CustomFormField
      control={control}
      name="hourlyRate"
      label="Hourly Rate"
      fieldType={FormFieldType.INPUT}
    />
  </div>
);

export default FreelancerForm;
