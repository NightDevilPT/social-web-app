"use client";

import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { BiSolidCommentDetail } from "react-icons/bi";
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
} from "../ui/card";
import { Post } from "@/interface/post";
import { useQuery } from "@tanstack/react-query";
import LoadingComponent from "./loading";
import ErrorUI from "./error";
import { apiService } from "@/service/api-service/api.service";
import React, { useState } from "react";
import CommentSection from "./comment";
import { PostModal } from "./post-modal";

const fetchPost = async (postId: string): Promise<Post> => {
	const response = await apiService.get<Post>(`/posts/${postId}`);
	return response;
};

export const PostDetailCards = ({ postId }: { postId: string }) => {
	const [postModal, setPostModal] = useState<boolean>(false);
	const {
		data: postData,
		isLoading,
		isError,
		error,
		refetch,
	} = useQuery({
		queryKey: ["post", postId],
		queryFn: () => fetchPost(postId),
		enabled: !!postId,
	});

	if (isLoading) {
		return (
			<div className="container h-auto p-3">
				<LoadingComponent />
			</div>
		);
	}

	if (isError) {
		return (
			<div className="container h-auto p-3">
				<ErrorUI
					message={(error as Error).message || "Something went wrong"}
				/>
			</div>
		);
	}

	if (!postData) {
		return <div className="container h-auto p-3">Post not found</div>;
	}

	const togglePostLike = async () => {
		await apiService.post(`/likes`, { postId });
		refetch();
	};

	return (
		<React.Fragment>
			<div className={`w-full h-auto flex justify-end items-center`}>
				<PostModal
					triggerText="Edit Post"
					post={postData}
					isOpen={postModal}
					setIsOpen={setPostModal}
					onSuccess={() => {
						console.log("post updated");
						setPostModal(false);
						refetch();
					}}
				/>
			</div>
			<Card className="p-2 mt-3 space-y-2 border rounded-md shadow-sm cursor-pointer">
				<CardHeader className="p-0 px-3 py-2 border-b">
					<CardTitle className="text-lg font-semibold">
						{postData.title}
					</CardTitle>
				</CardHeader>
				<CardContent className="p-0 px-3 py-1 text-sm">
					<p className="">{postData.content}</p>
				</CardContent>
				<CardFooter className="p-0 px-3 flex justify-between items-center text-xs">
					<div className="flex gap-1 items-center">
						<span className="font-medium">
							{postData.user.username} :
						</span>
						<span className="text-gray-500">
							{new Date(postData.createdAt).toLocaleDateString()}
						</span>
					</div>
					<div className="grid grid-cols-2 gap-3">
						<span className="grid grid-cols-2 gap-1">
							{postData.comments}{" "}
							<BiSolidCommentDetail className={`w-4 h-4`} />
						</span>
						<button
							className={`grid grid-cols-2 gap-1 rounded-md ${isLoading&&'opacity-45'}`}
							onClick={togglePostLike}
							disabled={isLoading}
						>
							{postData.likes}{" "}
							{postData.isLiked ? (
								<AiFillLike className={`w-4 h-4`} />
							) : (
								<AiOutlineLike className={`w-4 h-4`} />
							)}
						</button>
					</div>
				</CardFooter>
			</Card>
			<CommentSection postId={postId} refresh={refetch} />
		</React.Fragment>
	);
};
