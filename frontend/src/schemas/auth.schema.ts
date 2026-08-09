import { z } from "zod";


export const loginSchema = z.object({
    email: z
        .email("Email is not valid"),

    password: z
        .string()
        .min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
    fullName: z
        .string()
        .min(3, "Full name must be at least 3 characters"),

    email: z
        .email("Email is not valid"),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters"),

    confirmPassword: z
        .string()
}).refine(
    (data) => data.password === data.confirmPassword,
    {
        message: "Password do not match",
        path: ["confirm Password"],
    }
);

export type RegisterFormData = z.infer<typeof registerSchema>;
