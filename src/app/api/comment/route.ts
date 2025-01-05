import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { authMiddleware } from "@/lib/auth-middleware";

async function addCommentHandler(request: NextRequest) {
	try {
		const userId = (request as any).userId; // Access userId from middleware

		// Parse request body
		const body = await request.json();
		const { postId, content } = body;

		if (!postId || !content) {
			return NextResponse.json(
				{ message: "Post ID and content are required" },
				{ status: 400 }
			);
		}

		// Check if the post exists
		const post = await prisma.post.findUnique({
			where: { id: postId },
		});

		if (!post) {
			return NextResponse.json(
				{ message: "Post not found" },
				{ status: 404 }
			);
		}

		// Create a new comment
		const comment = await prisma.comment.create({
			data: {
				content,
				user: {
					connect: { id: userId },
				},
				post: {
					connect: { id: postId },
				},
			},
		});

		return NextResponse.json({
			message: "Comment added successfully",
			comment: {
				id: comment.id,
				content: comment.content,
				createdAt: comment.createdAt.toISOString(),
			},
		});
	} catch (error: any) {
		console.error("Error adding comment:", error.message);
		return NextResponse.json(
			{
				message: "An error occurred while adding the comment",
				error: error.message,
			},
			{ status: 500 }
		);
	}
}

async function getCommentsHandler(request: NextRequest) {
	try {
		// Extract query parameters
		const { searchParams } = new URL(request.url);
		const postId = searchParams.get("postId");
		const page = parseInt(searchParams.get("page") || "1", 10);
		const limit = parseInt(searchParams.get("limit") || "10", 10);

		if (!postId) {
			return NextResponse.json(
				{ message: "Post ID is required" },
				{ status: 400 }
			);
		}

		if (page <= 0 || limit <= 0) {
			return NextResponse.json(
				{ message: "Page and limit must be positive integers" },
				{ status: 400 }
			);
		}

		const skip = (page - 1) * limit;

		// Check if the post exists
		const post = await prisma.post.findUnique({
			where: { id: postId },
		});

		if (!post) {
			return NextResponse.json(
				{ message: "Post not found" },
				{ status: 404 }
			);
		}

		// Fetch comments with pagination
		const [comments, totalComments] = await Promise.all([
			prisma.comment.findMany({
				where: { postId },
				skip,
				take: limit,
				orderBy: { createdAt: "desc" },
				include: {
					user: { select: { username: true } },
				},
			}),
			prisma.comment.count({ where: { postId } }),
		]);

		// Format comments
		const formattedComments = comments.map((comment) => ({
			id: comment.id,
			content: comment.content,
			createdAt: comment.createdAt.toISOString(),
			user: { username: comment.user.username },
		}));

		const totalPages = Math.ceil(totalComments / limit);

		const response = {
			data: formattedComments,
			meta: {
				page,
				limit,
				totalComments,
				totalPages,
				hasNextPage: page < totalPages,
				hasPreviousPage: page > 1,
			},
		};

		return NextResponse.json(response);
	} catch (error: any) {
		console.error("Error fetching comments:", error.message);
		return NextResponse.json(
			{
				message: "An error occurred while fetching comments",
				error: error.message,
			},
			{ status: 500 }
		);
	}
}

export const GET = authMiddleware(getCommentsHandler);
export const POST = authMiddleware(addCommentHandler);
