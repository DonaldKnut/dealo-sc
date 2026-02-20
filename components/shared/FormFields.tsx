"use client";

import React from "react";
import { Control, UseFormSetValue, useWatch } from "react-hook-form";
import { Role, ServiceCategory } from "@/types/role";
import TextInput from "@/components/forms/_components/TextInput";
import FileUpload from "@/components/forms/_components/FileUpload";
import CustomPhoneInput from "@/components/forms/_components/PhoneInput";
import FreelancerFields from "@/components/forms/_components/FreelancerForm";
import CompanyFields from "@/components/forms/_components/CompanyForm";
import DoctorFields from "@/components/forms/_components/DoctorForm";
import JobSeekerFields from "@/components/forms/_components/JobSeekerForm";
import PatientFields from "@/components/forms/_components/PatientForm";
import InstructorFields from "@/components/forms/_components/InstructorForm";
import StudentFields from "@/components/forms/_components/StudentForm";

interface FormFieldsProps {
  control: Control<any>;
  errors: any;
  setValue: UseFormSetValue<any>;
  trigger: () => void;
}

const FormFields: React.FC<FormFieldsProps> = ({
  control,
  errors,
  setValue,
  trigger,
}) => {
  const selectedRole = useWatch({ control, name: "role" });

  return (
    <>
      {/* Shared Base Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          name="firstName"
          label="First Name"
          control={control}
          errorMessage={errors.firstName?.message}
        />
        <TextInput
          name="lastName"
          label="Last Name"
          control={control}
          errorMessage={errors.lastName?.message}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          name="dateOfBirth"
          label="Date of Birth"
          type="date"
          control={control}
          errorMessage={errors.dateOfBirth?.message}
        />
        <TextInput
          name="email"
          label="Email Address"
          type="email"
          control={control}
          errorMessage={errors.email?.message}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          name="password"
          label="Password"
          type="password"
          control={control}
          errorMessage={errors.password?.message}
        />
        <CustomPhoneInput
          name="phone"
          control={control}
          errors={errors}
          label="Phone Number"
        />
      </div>
      <FileUpload
        name="avatar"
        label="Profile Picture"
        control={control}
        errors={errors}
        errorMessage={errors.avatar?.message}
      />

      {/* Role-Specific Fields */}
      {selectedRole === Role.FREELANCER && (
        <FreelancerFields
          control={control}
          errors={errors}
          setValue={setValue}
          trigger={trigger}
        />
      )}

      {selectedRole === Role.COMPANY && (
        <CompanyFields control={control} errors={errors} />
      )}

      {selectedRole === Role.DOCTOR && (
        <DoctorFields control={control} errors={errors} />
      )}

      {selectedRole === Role.INSTRUCTOR && (
        <InstructorFields control={control} errors={errors} />
      )}

      {selectedRole === Role.STUDENT && (
        <StudentFields control={control} errors={errors} />
      )}

      {selectedRole === Role.PATIENT && (
        <PatientFields control={control} errors={errors} />
      )}

      {selectedRole === Role.JOB_SEEKER && (
        <JobSeekerFields control={control} errors={errors} />
      )}
    </>
  );
};

export default FormFields;
