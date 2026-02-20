import { Control, Controller, FieldErrors } from "react-hook-form";

interface StudentFormProps {
  control: Control<any>;
  errors?: FieldErrors<any>;
}

const StudentForm = ({ control, errors }: StudentFormProps) => {
  return (
    <div>
      <Controller
        name="course"
        control={control}
        render={({ field }) => (
          <input {...field} type="text" placeholder="Course of study" />
        )}
      />
      <Controller
        name="year"
        control={control}
        render={({ field }) => (
          <input {...field} type="number" placeholder="Year of study" />
        )}
      />
    </div>
  );
};

export default StudentForm;
