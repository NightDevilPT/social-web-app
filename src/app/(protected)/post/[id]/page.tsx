import React from "react";
import { PostDetailCards } from "@/components/common/post-detail-card";

const PostDetailPage: React.FC<{ params: Promise<{ id: string }> }> = async ({ params }) => {
	const postId = (await params).id;

	return (
		<div className="container p-4">
			<PostDetailCards postId={postId} />
		</div>
	);
};

export default PostDetailPage;
