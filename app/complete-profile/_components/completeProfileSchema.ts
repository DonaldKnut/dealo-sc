import * as z from "zod";

export const completeProfileSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z.string().min(10),
  dateOfBirth: z.string(),
  role: z.string(),
  email: z.string().email(),
  avatar: z.string().optional(),
  bio: z.string().min(10),
  serviceArea: z.string().min(2),
  servicesOffered: z.array(z.string().min(2)),
  isAvailable: z.boolean().optional(),
  availableDays: z.array(z.string()).optional(),
  availabilitySlots: z
    .array(
      z.object({
        day: z.string(),
        startTime: z.string(),
        endTime: z.string(),
      })
    )
    .optional(),
  location: z
    .object({
      type: z.literal("Point"),
      coordinates: z.tuple([z.number(), z.number()]),
    })
    .optional(),
});

export type CompleteProfileFormType = z.infer<typeof completeProfileSchema>;
