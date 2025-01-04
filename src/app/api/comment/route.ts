import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/db";
import { COOKIE_NAME, JWT_SECRET } from "@/config";

export async function POST(request: NextRequest) {
	try {
		// Retrieve the token from cookies
		const token = request.cookies.get(COOKIE_NAME)?.value;

		if (!token) {
			return NextResponse.json(
				{ message: "Authentication token is missing" },
				{ status: 401 }
			);
		}

		// Verify the JWT token
		let decodedToken;
		try {
			decodedToken = jwt.verify(token, JWT_SECRET) as { id: string };
		} catch (err: any) {
			console.log(err);
			return NextResponse.json(
				{ message: "Invalid or expired token" },
				{ status: 401 }
			);
		}

		// Extract user ID from the token
		const userId = decodedToken.id;

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

export async function GET(request: NextRequest) {
	try {
		// Retrieve the token from cookies
		const token = request.cookies.get(COOKIE_NAME)?.value;

		if (!token) {
			return NextResponse.json(
				{ message: "Authentication token is missing" },
				{ status: 401 }
			);
		}

		// Verify the JWT token
		const decodedToken = jwt.verify(token, JWT_SECRET) as { id: string };
		if (!decodedToken) {
			return NextResponse.json(
				{ message: "Invalid or expired token" },
				{ status: 401 }
			);
		}

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
			comments: formattedComments,
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
