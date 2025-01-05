"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PostsApiResponse } from "@/interface/post";
import { apiService } from "@/service/api-service/api.service";
import LoadingComponent from "@/components/common/loading";
import ErrorUI from "@/components/common/error";
import { PostModal } from "@/components/common/post-modal";
import { PostCard } from "@/components/common/post-card";

// Function to fetch posts with pagination
const fetchPosts = async (page: number = 1): Promise<PostsApiResponse> => {
	return await apiService.get<PostsApiResponse>(
		`/posts?page=${page}&limit=10`
	);
};

const PostsPage: React.FC = () => {
	const [page, setPage] = useState<number>(1);
	const [isPostModalOpen, setIsPostModalOpen] = useState<boolean>(false);

	const { data, isLoading, isError, error, isFetching, refetch } = useQuery({
		queryKey: ["posts", page],
		queryFn: () => fetchPosts(page),
	});

	return (
		<div className="container h-full p-6">
			{!isError ? (
				<>
					{/* Header Section */}
					<div className="w-full flex justify-between items-center mb-6">
						<h1 className="text-2xl font-bold">Posts</h1>
						<PostModal
							isOpen={isPostModalOpen}
							setIsOpen={setIsPostModalOpen}
							triggerText="Create Post"
							onSuccess={() => {
								console.log("Post created!");
								refetch();
								setIsPostModalOpen(false);
							}}
						/>
					</div>

					{/* Posts Grid */}
					{!isLoading ? (
						<div className="grid grid-cols-4 max-2xl:grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-6">
							{data?.data.map((post) => (
								<PostCard key={post.id} postData={post} />
							))}
						</div>
					) : (
						<LoadingComponent />
					)}

					{/* Pagination Controls */}
					<div className="flex justify-between items-center mt-6">
						<button
							onClick={() => setPage((prev) => prev - 1)}
							disabled={!data?.meta.hasPreviousPage || isFetching}
							className={`px-4 py-2 bg-blue-500 text-white rounded-md ${
								!data?.meta.hasPreviousPage
									? "opacity-50 cursor-not-allowed"
									: "hover:bg-blue-600"
							}`}
						>
							Previous
						</button>
						<span className="text-foreground">Page {page}</span>
						<button
							onClick={() => setPage((prev) => prev + 1)}
							disabled={!data?.meta.hasNextPage || isFetching}
							className={`px-4 py-2 bg-blue-500 text-white rounded-md ${
								!data?.meta.hasNextPage
									? "opacity-50 cursor-not-allowed"
									: "hover:bg-blue-600"
							}`}
						>
							Next
						</button>
					</div>
				</>
			) : (
				// Error UI
				<ErrorUI
					message={
						error?.message ||
						"Failed to load posts. Please try again later."
					}
					onRetry={refetch}
				/>
			)}
		</div>
	);
};

export default PostsPage;
