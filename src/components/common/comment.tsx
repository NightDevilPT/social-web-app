"use client";

import { CommentsApiResponse } from "@/interface/comment";
import { apiService } from "@/service/api-service/api.service";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CommentModal } from "./comment-modal";

const fetchComments = async ({
	postId,
	pageParam = 1,
}: {
	postId: string;
	pageParam?: number;
}): Promise<CommentsApiResponse> => {
	const response = await apiService.get<CommentsApiResponse>(
		`/comment?postId=${postId}&page=${pageParam}&limit=10`
	);
	return response;
};

const CommentSection = ({
	postId,
	refresh,
}: {
	postId: string;
	refresh: any;
}) => {
	const [commentModal, setCommentModal] = useState<boolean>(false);
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		isError,
		refetch,
		error,
	} = useInfiniteQuery({
		queryKey: ["comments", postId],
		queryFn: ({ pageParam }) => fetchComments({ postId, pageParam }),
		getNextPageParam: (lastPage) =>
			lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
		initialPageParam: 1,
	});

	if (isLoading) return <p>Loading comments...</p>;
	if (isError)
		return (
			<p className="text-red-500">
				{error instanceof Error
					? error.message
					: "Something went wrong"}
			</p>
		);

	return (
		<div className="space-y-4 mt-5">
			<div className={`w-full h-auto flex justify-end items-center`}>
				<CommentModal
					triggerText="Add your comment"
					setIsOpen={setCommentModal}
					isOpen={commentModal}
					onSuccess={() => {
						console.log("comment saved");
						refetch();
						refresh();
					}}
					postId={postId}
				/>
			</div>
			{data?.pages.map((page,index) => {
				if (page.data.length === 0)
					return (
						<div className={`w-full text-center text-secondary`} key={index}>
							There is no comments
						</div>
					);
				return page?.data.map((comment) => (
					<Card key={comment.id} className="border-0 p-0 shadow-sm">
						<CardContent className="p-3">
							<span className="text-sm text-foreground">
								{comment.content}
							</span>
							<div
								className={`w-full h-auto flex justify-end items-center text-xs text-gray-500`}
							>
								Commented by {comment.user.username} at{" "}
								{new Date(comment.createdAt).toLocaleString()}
							</div>
						</CardContent>
					</Card>
				));
			})}

			{/* Load More Button */}
			{hasNextPage && (
				<div className="flex justify-center mt-4">
					<Button
						onClick={() => fetchNextPage()}
						disabled={isFetchingNextPage}
					>
						{isFetchingNextPage ? "Loading more..." : "Load More"}
					</Button>
				</div>
			)}
		</div>
	);
};

export default CommentSection;
