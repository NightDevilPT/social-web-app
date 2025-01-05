"use client";

import React, { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { CommentsApiResponse } from "@/interface/comment";
import { apiService } from "@/service/api-service/api.service";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CommentModal } from "./comment-modal";
import LoadingComponent from "./loading";
import ErrorUI from "./error";

// Function to fetch comments with pagination
const fetchComments = async ({
	postId,
	pageParam = 1,
}: {
	postId: string;
	pageParam?: number;
}): Promise<CommentsApiResponse> => {
	return await apiService.get<CommentsApiResponse>(
		`/comment?postId=${postId}&page=${pageParam}&limit=10`
	);
};

const CommentSection: React.FC<{ postId: string; refresh: () => void }> = ({
	postId,
	refresh,
}) => {
	const [isCommentModalOpen, setCommentModalOpen] = useState<boolean>(false);

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

	if (isLoading)
		return (
			<div className={`container mt-5`}>
				<LoadingComponent />
			</div>
		);

	if (isError) {
		return (
			<div className={`container mt-5`}>
				<ErrorUI message={error.message} />
			</div>
		);
	}

	return (
		<div className="space-y-4 mt-5">
			{/* Add Comment Button */}
			<div className="w-full flex justify-end">
				<CommentModal
					triggerText="Add your comment"
					setIsOpen={setCommentModalOpen}
					isOpen={isCommentModalOpen}
					onSuccess={() => {
						console.log("Comment saved");
						refetch();
						refresh();
					}}
					postId={postId}
				/>
			</div>

			{/* Display Comments */}
			{data?.pages.map((page, pageIndex) => (
				<React.Fragment key={pageIndex}>
					{page.data.length === 0 ? (
						<div className="w-full text-center text-secondary">
							No comments available
						</div>
					) : (
						page.data.map((comment) => (
							<Card
								key={comment.id}
								className="border-0 shadow-sm"
							>
								<CardContent className="p-3">
									<span className="text-sm text-foreground">
										{comment.content}
									</span>
									<div className="w-full flex justify-end text-xs text-gray-500">
										Commented by {comment.user.username} at{" "}
										{new Date(
											comment.createdAt
										).toLocaleString()}
									</div>
								</CardContent>
							</Card>
						))
					)}
				</React.Fragment>
			))}

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
