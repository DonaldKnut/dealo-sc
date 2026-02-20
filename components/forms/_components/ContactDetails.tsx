import CustomFormField from "../CustomFormField";
import { Control, useFormContext } from "react-hook-form";
import { FormFieldType } from "../CustomFormField";

interface ContactDetailsProps {
  control: Control<any>;
}

const ContactDetails = ({ control }: ContactDetailsProps) => {
  return (
    <div>
      <CustomFormField
        name="address"
        label="Address"
        fieldType={FormFieldType.TEXTAREA}
        control={control}
      />
      <CustomFormField
        name="city"
        label="City"
        fieldType={FormFieldType.INPUT}
        control={control}
      />
      <CustomFormField
        name="state"
        label="State"
        fieldType={FormFieldType.INPUT}
        control={control}
      />
      <CustomFormField
        name="zipCode"
        label="Zip Code"
        fieldType={FormFieldType.INPUT}
        control={control}
      />
      <CustomFormField
        name="country"
        label="Country"
        fieldType={FormFieldType.INPUT}
        control={control}
      />
    </div>
  );
};

export default ContactDetails;
