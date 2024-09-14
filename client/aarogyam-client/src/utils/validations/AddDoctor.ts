import z from "zod";

export const AddDoctorSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits." }),
  specialities: z
    .array(z.object({ value: z.string(), label: z.string() }))
    .min(1, { message: "At least one speciality is required." }),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Please select a gender.",
  }),
});
