import { z } from "zod";

// Validation schema
export const signupSchema = z
	.object({
		username: z.string().min(2, "Username must be at least 2 characters."),
		email: z.string().email("Invalid email address."),
		password: z.string().min(8, "Password must be at least 8 characters."),
		confirmPassword: z
			.string()
			.min(8, "Password must be at least 8 characters."),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords must match.",
		path: ["confirmPassword"],
	});

export type SignupFormData = z.infer<typeof signupSchema>;
