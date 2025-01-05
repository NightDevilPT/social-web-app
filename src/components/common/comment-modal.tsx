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
import { CommentFormData, commentSchema } from "@/schema/comment";

interface CommentModalProps {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
	postId: string;
	triggerText: string;
	onSuccess?: () => void;
}

export function CommentModal({
	isOpen,
	setIsOpen,
	postId,
	triggerText,
	onSuccess,
}: CommentModalProps) {
	const form = useForm<CommentFormData>({
		resolver: zodResolver(commentSchema),
		defaultValues: {
			content: "",
		},
	});

	useEffect(() => {
		if (!isOpen) {
			form.reset(); // Reset form on close
		}
	}, [isOpen, form]);

	const mutation = useMutation({
		mutationFn: (data: CommentFormData) =>
			apiService.post(`/comment`, { ...data, postId }),
		onSuccess: () => {
			toast({
				title: "Success",
				description: "Comment added successfully!",
				variant: "success",
			});
			form.reset();
			if (onSuccess) onSuccess();
			setIsOpen(false);
		},
		onError: (error: any) => {
			toast({
				title: "Error",
				description: error.message || "Failed to add comment.",
				variant: "destructive",
			});
		},
	});

	const handleSubmit = (data: CommentFormData) => {
		mutation.mutate(data);
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button>{triggerText}</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add a Comment</DialogTitle>
					<DialogDescription>
						Share your thoughts by adding a comment to this post.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="content"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Comment</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Write your comment here..."
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
									? "Submitting..."
									: "Submit"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
