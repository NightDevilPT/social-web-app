import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/db";
import { COOKIE_NAME, JWT_SECRET } from "@/config";

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
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
		} catch (err) {
			return NextResponse.json(
				{ message: "Invalid or expired token" },
				{ status: 401 }
			);
		}

		// Extract user ID from the token
		const userId = decodedToken.id;

		// Extract the post ID from route parameters
		const postId = params.id;
		console.log(postId,'postid')

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
				user: { select: { username: true } },
				likes: { select: { id: true } },
				comments: { select: { id: true, content: true } },
			},
		});

		if (!post) {
			return NextResponse.json(
				{ message: "Post not found" },
				{ status: 404 }
			);
		}

		// Format the post data
		const formattedPost = {
			id: post.id,
			title: post.title,
			content: post.content,
			createdAt: post.createdAt.toISOString(),
			updatedAt: post.updatedAt.toISOString(),
			user: { username: post.user.username },
			likes: post.likes.map((like) => ({ id: like.id })),
			comments: post.comments.map((comment) => ({
				id: comment.id,
				content: comment.content,
			})),
		};

		return NextResponse.json(formattedPost);
	} catch (error: any) {
		console.error("Error fetching post by ID:", error.message);
		return NextResponse.json(
			{
				message: "An error occurred while fetching the post",
				error: error.message,
			},
			{ status: 500 }
		);
	}
}
