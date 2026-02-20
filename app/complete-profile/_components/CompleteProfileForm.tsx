"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import FormFields from "@/components/shared/FormFields";
import SubmitSection from "@/components/shared/SubmitSection";
import Notification from "../_components/Notification";
import { useState } from "react";
import {
  CompleteProfileFormType,
  completeProfileSchema,
} from "./completeProfileSchema";

const LocationPicker = dynamic(() => import("./LocationPicker"), {
  ssr: false,
});

const TimeSlotPicker = dynamic(() => import("./TimeSlotPicker"), {
  ssr: false,
});

export default function CompleteProfileForm({ session }: { session: any }) {
  const router = useRouter();
  const [notification, setNotification] = useState<{
    message: string | null;
    type: "success" | "error";
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<CompleteProfileFormType>({
    resolver: zodResolver(completeProfileSchema),
    mode: "onChange",
    defaultValues: {
      firstName: session?.user?.name?.split(" ")[0] || "",
      lastName: session?.user?.name?.split(" ")[1] || "",
      phone: "",
      dateOfBirth: "",
      role: "FREELANCER",
      email: session?.user?.email || "",
      avatar: session?.user?.avatar || "",
      bio: "",
      serviceArea: "",
      servicesOffered: [],
      isAvailable: true,
      availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      availabilitySlots: [],
      location: {
        type: "Point",
        coordinates: [0, 0],
      },
    },
  });

  const {
    handleSubmit,
    control,
    setValue,
    trigger,
    formState: { isValid, errors },
  } = methods;

  const onSubmit = async (data: CompleteProfileFormType) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/complete-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Profile update failed");

      setNotification({
        message: "Profile completed successfully!",
        type: "success",
      });

      setTimeout(() => router.push("/dealoforge/dashboard"), 1500);
    } catch (err: any) {
      setNotification({ message: err.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormFields
          control={control}
          errors={errors}
          setValue={setValue}
          trigger={trigger}
        />

        <LocationPicker control={control} setValue={setValue} />

        <TimeSlotPicker control={control} setValue={setValue} />

        <SubmitSection
          isLoading={isLoading}
          isValid={isValid}
          termsAccepted={true}
        />
      </form>
    </FormProvider>
  );
}
