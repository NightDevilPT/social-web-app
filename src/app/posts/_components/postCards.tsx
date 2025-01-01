import React from "react";
import { Post } from "../page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const PostCard = (post: Post) => {
	return (
		<Card
			key={post.id}
			className="hover:shadow-lg transition-shadow border-none"
		>
			<CardHeader>
				<CardTitle>{post.title}</CardTitle>
				<p className="text-sm text-gray-500">
					By {post.user.username} •{" "}
					{new Date(post.createdAt).toLocaleDateString()}
				</p>
			</CardHeader>
			<CardContent>
				<p className="mb-4">{post.content.slice(0, 100)}...</p>
				<div className="flex justify-between text-sm text-gray-600">
					<span>{post.likes.length} likes</span>
					<span>{post.comments.length} comments</span>
				</div>
				<Link
					href={`/posts/${post.id}`}
					className="mt-4 inline-block text-blue-500 underline underline-offset-4 hover:text-blue-700"
				>
					Read more
				</Link>
			</CardContent>
		</Card>
	);
};

export default PostCard;
