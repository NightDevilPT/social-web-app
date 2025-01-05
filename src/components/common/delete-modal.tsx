"use client";

import React from "react";
import { useMutation } from "@tanstack/react-query";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogFooter,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { apiService } from "@/service/api-service/api.service";
import { toast } from "@/hooks/use-toast";

interface DeletePostModalProps {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
	postId: string;
	triggerText: string;
	onSuccess?: () => void;
}

export function DeletePostModal({
	isOpen,
	setIsOpen,
	postId,
	triggerText,
	onSuccess,
}: DeletePostModalProps) {
	const mutation = useMutation({
		mutationFn: () => apiService.delete(`/posts/${postId}`),
		onSuccess: () => {
			toast({
				title: "Success",
				description: "Post deleted successfully!",
				variant: "success",
			});
			if (onSuccess) onSuccess();
			setIsOpen(false);
		},
		onError: (error: any) => {
			toast({
				title: "Error",
				description: error.message || "Failed to delete the post.",
				variant: "destructive",
			});
		},
	});

	const handleDelete = () => {
		mutation.mutate();
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant="destructive">{triggerText}</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete Post</DialogTitle>
					<DialogDescription>
						Are you sure you want to delete this post? This action
						cannot be undone.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button
						type="button"
						variant="secondary"
						onClick={() => setIsOpen(false)}
					>
						Cancel
					</Button>
					<Button
						type="button"
						variant="destructive"
						onClick={handleDelete}
						disabled={mutation.isPending}
					>
						{mutation.isPending ? "Deleting..." : "Delete"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
