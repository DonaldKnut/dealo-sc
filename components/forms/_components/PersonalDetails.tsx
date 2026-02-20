import CustomFormField from "../CustomFormField";
import { useFormContext } from "react-hook-form";
import { FormFieldType } from "../CustomFormField"; // Import the enum for field types

const PersonalDetails = () => {
  const { control } = useFormContext(); // Access the control from the form context

  return (
    <div>
      <CustomFormField
        name="name"
        label="Name"
        fieldType={FormFieldType.INPUT} // Specify the type of input
        control={control} // Pass the control prop
      />
      <CustomFormField
        name="email"
        label="Email"
        type="email"
        fieldType={FormFieldType.INPUT} // Specify the type of input
        control={control} // Pass the control prop
      />
      <CustomFormField
        name="phone"
        label="Phone"
        type="tel"
        fieldType={FormFieldType.PHONE_INPUT} // Specify the phone input type
        control={control} // Pass the control prop
      />
      <CustomFormField
        name="birthDate"
        label="Birthdate"
        fieldType={FormFieldType.DATE_PICKER} // Specify the date picker type
        control={control} // Pass the control prop
        dateFormat="MM/dd/yyyy" // Specify the date format if needed
      />
      <CustomFormField
        name="gender"
        label="Gender"
        fieldType={FormFieldType.SELECT} // Specify the select input type
        control={control} // Pass the control prop
      >
        {/* Add options for the select field */}
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </CustomFormField>
      <CustomFormField
        name="address"
        label="Address"
        fieldType={FormFieldType.TEXTAREA} // Specify the textarea input type
        control={control} // Pass the control prop
      />
    </div>
  );
};

export default PersonalDetails;
