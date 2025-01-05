"use client";

import { useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogFooter,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { apiService } from "@/service/api-service/api.service";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { PostFormData, postSchema } from "@/schema/post";

type PostModalProps = {
	isOpen: boolean;
	setIsOpen:any;
	post?: { id: string; title: string; content: string };
	triggerText: string;
	onSuccess?: () => void;
};

export function PostModal({
	post,
	triggerText,
	onSuccess,
	isOpen,
	setIsOpen
}: PostModalProps) {
	const form = useForm<PostFormData>({
		resolver: zodResolver(postSchema),
		defaultValues: {
			title: post?.title || "",
			content: post?.content || "",
		},
	});

	useEffect(() => {
		if (post) {
			form.reset({
				title: post.title,
				content: post.content,
			});
		} else {
			form.reset({
				title: "",
				content: "",
			});
		}
	}, [post, form]);

	const mutation = useMutation({
		mutationFn: (data: PostFormData) => {
			if (post) {
				return apiService.put(`/posts/${post.id}`, data); // Edit post
			} else {
				return apiService.post("/posts", data); // Create post
			}
		},
		onSuccess: () => {
			const message = post
				? "Post updated successfully!"
				: "Post created successfully!";
			toast({
				title: "Success",
				description: message,
				variant: "success",
			});
			form.reset();
			if (onSuccess) onSuccess();
		},
		onError: (error: any) => {
			const message = post
				? "Failed to update post."
				: "Failed to create post.";
			toast({
				title: "Error",
				description: error.message || message,
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
				<Button>{triggerText}</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{post ? "Edit Post" : "Create Post"}
					</DialogTitle>
					<DialogDescription>
						{post
							? "Update the details of your post."
							: "Fill in the details to create a new post."}
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input
											placeholder="Post Title"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="content"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Content</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Post Content"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<Button
								type="button"
								variant="secondary"
								onClick={() => form.reset()}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={mutation.isPending}>
								{mutation.isPending
									? post
										? "Updating..."
										: "Submitting..."
									: "Submit"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
