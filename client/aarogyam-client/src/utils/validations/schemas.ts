import { z } from "zod";

export const SignUpSchema = z
  .object({
    name: z.string().min(3, {
      message: "Name must be at least 3 characters.",
    }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." })
      .max(20, {
        message: "Password must be max 20 characters long.",
      })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,20}$/,
        "Password must include one small letter, one uppercase letter and one number"
      ),
    confirm_password: z.string(),
    phone: z
      .string()
      .length(10, { message: "Phone number must be of 10 digits." }),
    /*profileImage: zfd
    .file(z.instanceof(File))
    .refine((file) => file.size < 2 * 1024 * 1024, {
      message: "File can't be bigger than 2 MB.",
    })
    .refine(
      (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
      {
        message: "File format must be from (jpg, jpeg, png)",
      }
    )
    .optional(),*/
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords don't match",
  });

export const LoginSchema = z.object({
  emailOrPhone: z
    .string()
    .min(1, { message: "This field is required." })
    .refine(
      (value) => {
        const isEmail = z.string().email().safeParse(value).success;
        const isPhoneNumber = /^[0-9]{10}$/.test(value);
        return isEmail || isPhoneNumber;
      },
      {
        message: "Must be a valid email address or a 10-digit phone number.",
      }
    ),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
});

export const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(30, { message: "Name must not be longer than 30 characters." }),
  email: z.string({ required_error: "Email is required." }).email(),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits." })
    .max(15, { message: "Phone number must be less than 15 digits." })
    .optional(),
  address: z.string().optional(),
  profileImage: z.string().optional(),
  emergencyContacts: z
    .array(
      z.object({
        name: z.string().min(1, { message: "Name is required." }),
        relation: z.string().min(1, { message: "Relation is required." }),
        phoneNo: z
          .string()
          .min(10, { message: "Phone number must be at least 10 digits." })
          .max(15, { message: "Phone number must be less than 15 digits." }),
      })
    )
    .max(5, { message: "You can add up to 5 emergency contacts." })
    .optional(),
});
