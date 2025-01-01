"use client";

import { useEffect, useState } from "react";
import AddPostDialog from "./_components/createPostModel";
import AddCommentDialog from "./_components/addCommentModal";
import PostCard from "./_components/postCards";

export type Post = {
	id: string;
	title: string;
	content: string;
	createdAt: string;
	updatedAt: string;
	user: {
		username: string;
	};
	likes: { id: string }[];
	comments: { id: string; content: string }[];
};

const dummyPosts: Post[] = [
	{
		id: "1",
		title: "Exploring the Future of AI",
		content:
			"Artificial intelligence is shaping the future of technology, transforming the way we work, live, and play.",
		createdAt: "2025-01-01T10:00:00Z",
		updatedAt: "2025-01-01T10:00:00Z",
		user: { username: "JohnDoe" },
		likes: [{ id: "like1" }, { id: "like2" }],
		comments: [
			{ id: "comment1", content: "This is fascinating!" },
			{ id: "comment2", content: "Can't wait to see what's next." },
		],
	},
	{
		id: "2",
		title: "The Beauty of Nature",
		content:
			"Nature offers breathtaking beauty, from majestic mountains to serene forests and captivating wildlife.",
		createdAt: "2025-01-02T12:00:00Z",
		updatedAt: "2025-01-02T12:00:00Z",
		user: { username: "JaneSmith" },
		likes: [{ id: "like3" }, { id: "like4" }, { id: "like5" }],
		comments: [{ id: "comment3", content: "Absolutely stunning!" }],
	},
	{
		id: "3",
		title: "Mastering Web Development",
		content:
			"Web development is an ever-evolving field that offers exciting opportunities for developers worldwide.",
		createdAt: "2025-01-03T15:00:00Z",
		updatedAt: "2025-01-03T15:00:00Z",
		user: { username: "DevGuru" },
		likes: [{ id: "like6" }],
		comments: [],
	},
];

export default function PostsPage() {
	const [posts, setPosts] = useState<Post[]>([]);
	const [loading, setLoading] = useState(true);

	// Simulate fetching data
	useEffect(() => {
		setTimeout(() => {
			setPosts(dummyPosts);
			setLoading(false);
		}, 1000); // Simulate a network delay of 1 second
	}, []);

	if (loading) {
		return <p className="text-center mt-8">Loading posts...</p>;
	}

	return (
		<div className="container mx-auto p-6">
			<header className="mb-8 text-center">
				<h1 className="text-3xl font-bold">All Posts</h1>
				<p className="text-gray-600">
					Browse through the latest posts by users.
				</p>
				<AddPostDialog />
				<AddCommentDialog />
			</header>
			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{posts.map((post) => (
					<PostCard key={post.id} {...post}></PostCard>
				))}
			</div>
		</div>
	);
}
