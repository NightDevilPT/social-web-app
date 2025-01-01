"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { apiService } from "@/service/api-service/api.service";
import { toast } from "@/hooks/use-toast";

// Validation schema
const signupSchema = z
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

type SignupFormData = z.infer<typeof signupSchema>;

export function SignupForm() {
	const form = useForm<SignupFormData>({
		resolver: zodResolver(signupSchema),
		defaultValues: {
			username: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const mutation = useMutation({
		mutationFn: (data: SignupFormData) =>
			apiService.post("/users", {
				username: data.username,
				email: data.email,
				password: data.password,
			}),
		onSuccess: () => {
			toast({
				title: "Success",
				description: "User registered successfully!",
        variant:"success"
			});
			form.reset();
		},
		onError: (error: any) => {
			toast({
				title: "Error",
				description: error.message || "An unexpected error occurred.",
				variant: "destructive",
			});
			form.setError("root", {
				message: error.message || "An unexpected error occurred.",
			});
		},
	});

	const handleSubmit = (data: SignupFormData) => {
		mutation.mutate(data);
	};

	return (
		<div className="flex flex-col gap-6">
			<Card className="border-none">
				<CardHeader>
					<CardTitle className="text-2xl">Sign Up</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handleSubmit)}
							className="space-y-6"
						>
							{/* Username Field */}
							<FormField
								control={form.control}
								name="username"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Username</FormLabel>
										<FormControl>
											<Input
												placeholder="JohnDoe"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Email Field */}
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												type="email"
												placeholder="m@example.com"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Password Field */}
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="Enter your password"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Confirm Password Field */}
							<FormField
								control={form.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Confirm Password</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="Re-enter your password"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Root-level error message */}
							{form.formState.errors.root && (
								<p className="text-sm text-red-500">
									{form.formState.errors.root.message}
								</p>
							)}

							{/* Submit Button */}
							<Button
								type="submit"
								className="w-full"
								disabled={mutation.isPending}
							>
								{mutation.isPending
									? "Registering..."
									: "Sign Up"}
							</Button>

							{/* Redirect to Login */}
							<div className="text-center text-sm">
								Already have an account?{" "}
								<Link
									href="/auth/login"
									className="underline underline-offset-4"
								>
									Login
								</Link>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
