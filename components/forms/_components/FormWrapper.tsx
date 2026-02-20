import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";

interface FormWrapperProps {
  validationSchema: z.ZodTypeAny;
  onSubmit: (values: any) => void;
  defaultValues: any;
  children: React.ReactNode;
}

const FormWrapper: FC<FormWrapperProps> = ({
  validationSchema,
  onSubmit,
  defaultValues,
  children,
}) => {
  const methods = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues,
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  );
};

export default FormWrapper;
