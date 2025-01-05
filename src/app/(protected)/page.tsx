"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PostsApiResponse } from "@/interface/post";
import { apiService } from "@/service/api-service/api.service";
import LoadingComponent from "@/components/common/loading";
import ErrorUI from "@/components/common/error";
import { PostModal } from "@/components/common/post-modal";
import { PostCard } from "@/components/common/post-card";

const fetchPosts = async (page = 1) => {
	const response = await apiService.get<PostsApiResponse>(
		`/posts?page=${page}&limit=${10}`
	);
	return response;
};


const PostsPage: React.FC = () => {
	const [page, setPage] = useState<number>(1);
	const [openCreatePostModal, setOpenCreatePostModal] =
		useState<boolean>(false);

	const { data, isLoading, isError, error, isFetching, refetch } = useQuery({
		queryKey: ["posts", page],
		queryFn: () => fetchPosts(page),
	});

	return (
		<div className="container h-full p-6">
			{!isError && (
				<React.Fragment>
					<div
						className={`w-full h-auto flex justify-between items-center`}
					>
						<h1 className="text-2xl font-bold mb-6">Posts</h1>
						<PostModal
							isOpen={openCreatePostModal}
							setIsOpen={setOpenCreatePostModal}
							triggerText="Create Post"
							onSuccess={() => {
								console.log("Post created!");
								refetch();
								setOpenCreatePostModal(false);
							}}
						/>
					</div>
					{!isLoading && (
						<div className="grid grid-cols-4 max-2xl:grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-6">
							{data?.data.map((post) => (
								<PostCard key={post.id} postData={post} />
							))}
						</div>
					)}
					{isLoading && <LoadingComponent />}
					<div className="flex justify-between items-center mt-6">
						<button
							onClick={() => setPage((pre) => pre - 1)}
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
							onClick={() => setPage((pre) => pre + 1)}
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
				</React.Fragment>
			)}
			{isError && (
				<ErrorUI
					message={
						error?.message ||
						"Failed to load posts. Please try again later."
					}
					onRetry={() => refetch()} // Retry fetching posts
				/>
			)}
		</div>
	);
};

export default PostsPage;
