"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { apiService } from "@/service/api-service/api.service";
import { useRouter } from "next/navigation";

// Validation schema
const postSchema = z.object({
	title: z.string().min(3, "Title must be at least 3 characters long."),
	content: z.string().min(10, "Content must be at least 10 characters long."),
});

type PostFormData = z.infer<typeof postSchema>;

export default function AddPostDialog({
	setShouldRefresh,
}: {
	setShouldRefresh: any;
}) {
	const [isOpen, setIsOpen] = useState(false); // State to control modal visibility
	const router = useRouter();

	const form = useForm<PostFormData>({
		resolver: zodResolver(postSchema),
		defaultValues: {
			title: "",
			content: "",
		},
	});

	// Mutation to handle post creation
	const mutation = useMutation({
		mutationFn: (data: PostFormData) => apiService.post("/posts", data),
		onSuccess: () => {
			toast({
				title: "Success",
				description: "Post created successfully!",
				variant: "success",
			});
			form.reset(); // Reset form fields after success
			setShouldRefresh();
			setIsOpen(false); // Close the modal
		},
		onError: (error: any) => {
			if (error.message === "Authentication token is missing") {
				router.push("/auth/login");
			}
			toast({
				title: "Error",
				description:
					error.message ||
					"An error occurred while creating the post.",
				variant: "destructive",
			});
		},
	});

	const handleSubmit = (data: PostFormData) => {
		mutation.mutate(data);
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button onClick={() => setIsOpen(true)}>Add New Post</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add New Post</DialogTitle>
					<DialogDescription>
						Fill in the fields below to create a new post.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)}>
						<div className="space-y-4">
							{/* Title Field */}
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Post Title</FormLabel>
										<FormControl>
											<Input
												id="title"
												placeholder="Enter post title"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Content Field */}
							<FormField
								control={form.control}
								name="content"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Post Content</FormLabel>
										<FormControl>
											<Textarea
												id="content"
												placeholder="Enter post content"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<DialogFooter>
							<Button
								type="button"
								variant="secondary"
								onClick={() => setIsOpen(false)}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={mutation.isPending}>
								{mutation.isPending ? "Adding..." : "Add Post"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
