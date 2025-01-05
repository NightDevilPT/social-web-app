"use client";

import { Post } from "@/interface/post";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { BiSolidCommentDetail } from "react-icons/bi";
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
} from "../ui/card";
import { useRouter } from "next/navigation";

export const PostCard: React.FC<{ postData: Post }> = ({ postData }) => {
	const router = useRouter();
	return (
		<Card
			className="p-2 space-y-2 border rounded-md shadow-sm cursor-pointer"
			onClick={() => router.push(`/post/${postData.id}`)}
		>
			<CardHeader className="p-0 px-3 py-2 border-b">
				<CardTitle className="text-lg font-semibold">
					{postData.title}
				</CardTitle>
			</CardHeader>
			<CardContent className="p-0 px-3 py-1 text-sm">
				<p className=" line-clamp-4">{postData.content}</p>
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
					<button className="grid grid-cols-2 gap-1">
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
	);
};
