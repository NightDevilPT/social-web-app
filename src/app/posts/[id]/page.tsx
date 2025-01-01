import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type Post = {
	id: string;
	title: string;
	content: string;
	createdAt: string;
	user: {
		username: string;
	};
	likes: { id: string }[];
	comments: { id: string; content: string; user: { username: string } }[];
};

const dummyPost: Post = {
	id: "1",
	title: "Exploring the Future of AI",
	content:
		"Artificial intelligence is shaping the future of technology, transforming the way we work, live, and play. From advancements in healthcare to autonomous vehicles, AI is revolutionizing industries and creating new opportunities.",
	createdAt: "2025-01-01T10:00:00Z",
	user: { username: "JohnDoe" },
	likes: [{ id: "like1" }, { id: "like2" }, { id: "like3" }],
	comments: [
		{
			id: "comment1",
			content: "This is fascinating!",
			user: { username: "Alice" },
		},
		{
			id: "comment2",
			content: "Can't wait to see what's next.",
			user: { username: "Bob" },
		},
	],
};

export default function SinglePostPage() {
	const post = dummyPost; // Replace with actual data fetching logic

	return (
		<div className="container mx-auto p-6">
			<Card>
				<CardHeader>
					<CardTitle className="text-3xl font-bold">
						{post.title}
					</CardTitle>
					<p className="text-sm text-gray-500">
						By {post.user.username} •{" "}
						{new Date(post.createdAt).toLocaleDateString()}
					</p>
				</CardHeader>
				<CardContent>
					<p className="mb-6">{post.content}</p>
					<Separator className="my-4" />
					<section className="mb-6">
						<h2 className="text-xl font-bold">Likes</h2>
						<p>{post.likes.length} people liked this post.</p>
					</section>
					<Separator className="my-4" />
					<section>
						<h2 className="text-xl font-bold mb-4">Comments</h2>
						{post.comments.length > 0 ? (
							<div className="space-y-4">
								{post.comments.map((comment) => (
									<div
										key={comment.id}
										className="border rounded-md p-4"
									>
										<p className="font-semibold">
											{comment.user.username}
										</p>
										<p className="text-gray-700">
											{comment.content}
										</p>
									</div>
								))}
							</div>
						) : (
							<p>No comments yet.</p>
						)}
					</section>
				</CardContent>
			</Card>
		</div>
	);
}
