import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/db";
import { FetchPostsResponse, Post } from "@/interface/post";

// Environment variable for JWT secret
const JWT_SECRET = process.env.NEXT_JWT_SECRET || "your_jwt_secret_key";
const COOKIE_NAME = "auth_token";

export async function POST(request: NextRequest) {
	try {
		// Get the token from cookies
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

		// Extract user ID from token
		const userId = decodedToken.id;

		// Parse the request body to get post data
		const { title, content } = await request.json();

		if (!title || !content) {
			return NextResponse.json(
				{ message: "Title and content are required" },
				{ status: 400 }
			);
		}

		// Create the post in the database with relation to the user
		const post = await prisma.post.create({
			data: {
				title,
				content,
				userId,
			},
		});

		return NextResponse.json(
			{
				message: "Post created successfully",
				post,
			},
			{ status: 201 }
		);
	} catch (error: any) {
		console.error("Error creating post:", error.message);
		return NextResponse.json(
			{
				message: "An error occurred while creating the post",
				error: error.message || "Unknown error",
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

		// Extract query parameters
		const { searchParams } = new URL(request.url);
		const page = parseInt(searchParams.get("page") || "1", 10);
		const limit = parseInt(searchParams.get("limit") || "10", 10);

		if (page <= 0 || limit <= 0) {
			return NextResponse.json(
				{ message: "Page and limit must be positive integers" },
				{ status: 400 }
			);
		}

		const skip = (page - 1) * limit;

		// Fetch posts and total post count
		const [posts, totalPosts] = await Promise.all([
			prisma.post.findMany({
				skip,
				take: limit,
				orderBy: { createdAt: "desc" },
				include: {
					user: { select: { username: true } },
					likes: { select: { id: true } },
					comments: { select: { id: true, content: true } },
				},
			}),
			prisma.post.count(),
		]);

		const formattedPosts: Post[] = posts.map((post) => ({
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
		}));

		const totalPages = Math.ceil(totalPosts / limit);

		const response: FetchPostsResponse = {
			posts: formattedPosts,
			meta: {
				page,
				limit,
				totalPosts,
				totalPages,
				hasNextPage: page < totalPages,
				hasPreviousPage: page > 1,
			},
		};

		return NextResponse.json(response);
	} catch (error: any) {
		console.error("Error fetching posts:", error.message);
		return NextResponse.json(
			{
				message: "An error occurred while fetching posts",
				error: error.message,
			},
			{ status: 500 }
		);
	}
}
