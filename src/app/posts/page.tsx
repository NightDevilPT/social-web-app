"use client";

import React, { useState } from "react";
import PostCard from "./_components/postCards";
import AddPostDialog from "./_components/createPostModel";
import { useInfiniteQuery } from "@tanstack/react-query";
import { apiService } from "@/service/api-service/api.service";
import { FetchPostsResponse, Post } from "@/interface/post";
import { Button } from "@/components/ui/button"; // Assuming ShadCN's Button component
import { useRouter } from "next/navigation";

export default function PostsPage() {
	const [currentPageIndex, setCurrentPageIndex] = useState(0);
	const [fetching, setFetching] = useState<boolean>(false);
	const router = useRouter();

	const fetchPosts = async ({
		pageParam = 1,
	}): Promise<FetchPostsResponse> => {
		setFetching(true);
		const params = { page: pageParam, limit: 5 };
		const response = await apiService.get<FetchPostsResponse>(
			"/posts",
			params
		);
		setFetching(false);
		return response;
	};

	const { data, error, fetchNextPage, isFetchingNextPage, status, refetch } =
		useInfiniteQuery({
			queryKey: ["posts"],
			queryFn: fetchPosts,
			getNextPageParam: (lastPage) =>
				lastPage.meta.page < lastPage.meta.totalPages
					? lastPage.meta.page + 1
					: undefined,
			initialPageParam: 1,
		});

	if (status === "pending") {
		return (
			<p className="text-center mt-8 text-gray-500">Loading posts...</p>
		);
	}

	if (status === "error") {
		if (error.message === "Authentication token is missing") {
			router.push("/auth/login");
		}
		return (
			<p className="text-center mt-8 text-red-500">
				{error instanceof Error ? error.message : "An error occurred"}
			</p>
		);
	}

	const currentPage = data?.pages[currentPageIndex];

	const handleNextPage = async () => {
		if (currentPageIndex < data.pages.length - 1) {
			setCurrentPageIndex((prev) => prev + 1);
		} else if (data.pages.length > 0) {
			await fetchNextPage();
			setCurrentPageIndex((prev) => prev + 1);
		}
	};

	const handlePreviousPage = () => {
		setCurrentPageIndex((prev) => Math.max(prev - 1, 0));
	};

	const handlePostCreation = () => {
		setCurrentPageIndex(0);
		refetch();
	};

	return (
		<div className="container mx-auto px-4 py-6">
			<header className="mb-8 text-center">
				<h1 className="text-4xl font-bold text-gray-800">All Posts</h1>
				<p className="text-gray-600 mt-2">
					Discover the latest updates and stories from our users.
				</p>
				<div className="mt-4 flex justify-center gap-4">
					<AddPostDialog setShouldRefresh={handlePostCreation} />
				</div>
			</header>
			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{currentPage?.posts.length ? (
					currentPage.posts.map((post: Post) => (
						<PostCard key={post.id} {...post} />
					))
				) : (
					<p className="col-span-full text-center text-gray-500">
						No posts available at the moment.
					</p>
				)}
			</div>
			<footer className="mt-8 flex items-center justify-center gap-4">
				<Button
					variant="outline"
					onClick={handlePreviousPage}
					disabled={currentPageIndex === 0 || fetching}
				>
					Previous
				</Button>
				<span className="text-gray-600">
					Page {currentPage?.meta.page} of{" "}
					{data?.pages[0]?.meta.totalPages}
				</span>
				<Button
					variant="outline"
					onClick={handleNextPage}
					disabled={
						(!currentPage?.meta.hasNextPage &&
							currentPageIndex === data.pages.length - 1) ||
						fetching
					}
				>
					Next
				</Button>
			</footer>
			{isFetchingNextPage && (
				<p className="text-center mt-4 text-gray-500">
					Loading next page...
				</p>
			)}
		</div>
	);
}
