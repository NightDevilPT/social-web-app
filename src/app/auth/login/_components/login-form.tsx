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
import { useRouter } from "next/navigation";

// Validation schema
const loginSchema = z.object({
	email: z.string().email("Invalid email address."),
	password: z.string().min(8, "Password must be at least 8 characters."),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
	const form = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const router = useRouter();

	const mutation = useMutation({
		mutationFn: (data: LoginFormData) =>
			apiService.post("/users/login", {
				email: data.email,
				password: data.password,
			}),
		onSuccess: (data) => {
      console.log(data,'Login')
			toast({
				title: "Success",
				description: "Login successful!",
				variant: "success",
			});

			// Navigate to dashboard or desired page
			router.push("/posts");
		},
		onError: (error: any) => {
			toast({
				title: "Error",
				description: error.message || "Invalid email or password.",
				variant: "destructive",
			});
			form.setError("root", {
				message: error.message || "An unexpected error occurred.",
			});
		},
	});

	const handleSubmit = (data: LoginFormData) => {
		mutation.mutate(data);
	};

	return (
		<div className="flex flex-col gap-6">
			<Card className="border-none">
				<CardHeader>
					<CardTitle className="text-2xl">Login</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handleSubmit)}
							className="space-y-6"
						>
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
								{mutation.isPending ? "Logging in..." : "Login"}
							</Button>

							{/* Redirect to Signup */}
							<div className="text-center text-sm">
								Don&apos;t have an account?{" "}
								<Link
									href="/auth/signup"
									className="underline underline-offset-4"
								>
									Sign up
								</Link>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
