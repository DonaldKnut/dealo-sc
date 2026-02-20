import React from "react";
import TextInput from "../../../components/forms/_components/TextInput";
import SkillsInput from "../../../components/forms/_components/SkillsInput";
import { Control, FieldErrors, UseFormSetValue } from "react-hook-form";
import SelectInput from "../../../components/forms/_components/SelectInput";
import LanguagesInput from "../../../components/forms/_components/LanguagesInput";
import FileUpload from "../../../components/forms/_components/FileUpload";

interface FreelancerFieldsProps {
  control: Control<any>;
  errors: FieldErrors<any>; // Ensure errors are passed
  trigger: () => Promise<boolean>;
  setValue: UseFormSetValue<any>;
}

const FreelancerFields: React.FC<FreelancerFieldsProps> = ({
  control,
  errors,
  trigger,
  setValue,
}) => (
  <>
    <TextInput
      name="bio"
      label="Bio"
      control={control}
      isTextArea={true}
      errorMessage={
        errors.bio?.message ? String(errors.bio.message) : undefined
      }
    />
    <SkillsInput
      name="skills"
      label="Skills"
      control={control}
      trigger={trigger}
      setValue={setValue} // Pass setValue here
      errorMessage={
        errors.skills?.message ? String(errors.skills.message) : undefined
      }
    />
    <TextInput
      name="hourlyRate"
      label="Hourly Rate ($)"
      control={control}
      type="number"
      errorMessage={
        errors.hourlyRate?.message
          ? String(errors.hourlyRate.message)
          : undefined
      }
    />
    <SelectInput
      name="availability"
      label="Availability"
      control={control}
      options={[
        { value: "full_time", label: "Full Time" },
        { value: "part_time", label: "Part Time" },
        { value: "as_needed", label: "As Needed" },
      ]}
      errorMessage={
        errors.availability?.message
          ? String(errors.availability.message)
          : undefined
      }
    />
    <SelectInput
      name="experienceLevel"
      label="Experience Level"
      control={control}
      options={[
        { value: "beginner", label: "Beginner" },
        { value: "intermediate", label: "Intermediate" },
        { value: "expert", label: "Expert" },
      ]}
      errorMessage={
        errors.experienceLevel?.message
          ? String(errors.experienceLevel.message)
          : undefined
      }
    />
    <SelectInput
      name="preferredWorkType"
      label="Preferred Work Type"
      control={control}
      options={[
        { value: "remote", label: "Remote" },
        { value: "on_site", label: "On-Site" },
        { value: "hybrid", label: "Hybrid" },
      ]}
      errorMessage={
        errors.preferredWorkType?.message
          ? String(errors.preferredWorkType.message)
          : undefined
      }
    />
    <LanguagesInput
      name="languagesSpoken"
      label="Languages Spoken"
      control={control}
      trigger={trigger}
      setValue={setValue}
      errorMessage={
        errors.languagesSpoken?.message
          ? String(errors.languagesSpoken.message)
          : undefined
      }
    />
    <p>Profile Picture</p>
    <FileUpload
      name="profilePicture"
      label="Profile Picture"
      control={control}
      errorMessage={
        errors.profilePicture?.message
          ? String(errors.profilePicture.message)
          : undefined
      }
    />
    {/* <p>Portfolio / Resume</p>
    <FileUpload
      name="portfolioImages"
      label="Portfolio Images"
      control={control}
      errorMessage={
        errors.portfolioImages?.message
          ? String(errors.portfolioImages.message)
          : undefined
      }
    /> */}
    <TextInput
      name="portfolioUrl"
      label="LinkedIn Url"
      control={control}
      errorMessage={
        errors.portfolioUrl?.message
          ? String(errors.portfolioUrl.message)
          : undefined
      }
    />
    <TextInput
      name="location"
      label="Location"
      control={control}
      errorMessage={
        errors.location?.message ? String(errors.location.message) : undefined
      }
    />
  </>
);

export default FreelancerFields;
