import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { Post } from "@/interface/post";
import { authMiddleware } from "@/lib/auth-middleware";

// GET Handler
async function getPostHandler(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> } // Corrected type for params
) {
	try {
		const postId = (await params).id;
		const userId = (request as any).userId;

		console.log(postId, userId, "IDIDIDIDI");

		if (!postId) {
			return NextResponse.json(
				{ message: "Post ID is required" },
				{ status: 400 }
			);
		}

		// Fetch the post by ID
		const post = await prisma.post.findUnique({
			where: { id: postId },
			include: {
				user: { select: { username: true,id:true } },
				likes: { where: { userId }, select: { isActive: true } }, // Check if the user has liked this post
				_count: {
					select: {
						likes: { where: { isActive: true } },
						comments: true,
					},
				},
			},
		});

		if (!post) {
			return NextResponse.json(
				{ message: "Post not found" },
				{ status: 404 }
			);
		}

		const formattedPost: Post = {
			id: post.id,
			title: post.title,
			content: post.content,
			createdAt: post.createdAt.toISOString(),
			updatedAt: post.updatedAt.toISOString(),
			user: { username: post.user.username },
			likes: post._count.likes,
			comments: post._count.comments,
			isAccessable:post.user.id ===userId,
			isLiked: post.likes.some((like) => like.isActive), // Check if the user has liked the post
		};

		return NextResponse.json(formattedPost);
	} catch (error: any) {
		console.error("Error fetching post:", error.message);
		return NextResponse.json(
			{
				message: "An error occurred while fetching the post",
				error: error.message,
			},
			{ status: 500 }
		);
	}
}

// PUT Handler
async function updatePostHandler(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> } // Corrected type for params
) {
	try {
		const postId = (await params).id;
		const userId = (request as any).userId;

		if (!postId) {
			return NextResponse.json(
				{ message: "Post ID is required" },
				{ status: 400 }
			);
		}

		const body = await request.json();

		// Fetch the post
		const post = await prisma.post.findUnique({
			where: { id: postId },
		});

		if (!post) {
			return NextResponse.json(
				{ message: "Post not found" },
				{ status: 404 }
			);
		}

		if (post.userId !== userId) {
			return NextResponse.json(
				{ message: "You are not authorized to update this post" },
				{ status: 403 }
			);
		}

		const updatedPost = await prisma.post.update({
			where: { id: postId },
			data: {
				title: body.title || post.title,
				content: body.content || post.content,
				updatedAt: new Date(),
			},
		});

		return NextResponse.json({
			message: "Post updated successfully",
			post: {
				id: updatedPost.id,
				title: updatedPost.title,
				content: updatedPost.content,
				createdAt: updatedPost.createdAt.toISOString(),
				updatedAt: updatedPost.updatedAt.toISOString(),
			},
		});
	} catch (error: any) {
		console.error("Error updating post:", error.message);
		return NextResponse.json(
			{
				message: "An error occurred while updating the post",
				error: error.message,
			},
			{ status: 500 }
		);
	}
}

// DELETE Handler
async function deletePostHandler(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> } // Corrected type for params
) {
	try {
		const postId = (await params).id;
		const userId = (request as any).userId;

		if (!postId) {
			return NextResponse.json(
				{ message: "Post ID is required" },
				{ status: 400 }
			);
		}

		const post = await prisma.post.findUnique({
			where: { id: postId },
		});

		if (!post) {
			return NextResponse.json(
				{ message: "Post not found" },
				{ status: 404 }
			);
		}

		if (post.userId !== userId) {
			return NextResponse.json(
				{ message: "You are not authorized to delete this post" },
				{ status: 403 }
			);
		}

		// Delete related likes and comments
		await prisma.like.deleteMany({ where: { postId } });
		await prisma.comment.deleteMany({ where: { postId } });

		// Delete the post
		await prisma.post.delete({
			where: { id: postId },
		});

		return NextResponse.json({
			message: "Post and related data deleted successfully",
		});
	} catch (error: any) {
		console.error("Error deleting post:", error.message);
		return NextResponse.json(
			{
				message: "An error occurred while deleting the post",
				error: error.message,
			},
			{ status: 500 }
		);
	}
}

// Export Handlers
export const GET = authMiddleware(getPostHandler);
export const PUT = authMiddleware(updatePostHandler);
export const DELETE = authMiddleware(deletePostHandler);
