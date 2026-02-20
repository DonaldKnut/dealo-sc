import { Control, Controller } from "react-hook-form";

interface AdminFormProps {
  control: Control<any>;
}

const AdminForm = ({ control }: AdminFormProps) => {
  return (
    <div>
      <Controller
        name="department"
        control={control}
        render={({ field }) => (
          <input {...field} type="text" placeholder="Department" />
        )}
      />
      <Controller
        name="adminLevel"
        control={control}
        render={({ field }) => (
          <input {...field} type="text" placeholder="Admin Level" />
        )}
      />
    </div>
  );
};

export default AdminForm;
