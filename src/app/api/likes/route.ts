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
		const decodedToken = jwt.verify(token, JWT_SECRET) as { id: string };
		const userId = decodedToken.id;

		// Parse the request body
		const body = await request.json();
		const { postId } = body;

		if (!postId) {
			return NextResponse.json(
				{ message: "Post ID is required" },
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

		// Check if a like already exists
		const existingLike = await prisma.like.findFirst({
			where: { userId, postId },
		});

		if (existingLike) {
			// Toggle the isActive field
			const updatedLike = await prisma.like.update({
				where: { id: existingLike.id },
				data: { isActive: !existingLike.isActive },
			});

			return NextResponse.json({
				message: "Like toggled successfully",
				like: {
					id: updatedLike.id,
					isActive: updatedLike.isActive,
					createdAt: updatedLike.createdAt.toISOString(),
				},
			});
		} else {
			// Create a new like
			const newLike = await prisma.like.create({
				data: {
					userId,
					postId,
					isActive: true,
				},
			});

			return NextResponse.json({
				message: "Like added successfully",
				like: {
					id: newLike.id,
					isActive: newLike.isActive,
					createdAt: newLike.createdAt.toISOString(),
				},
			});
		}
	} catch (error: any) {
		console.error("Error toggling like:", error.message);
		return NextResponse.json(
			{
				message: "An error occurred while toggling the like",
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
		jwt.verify(token, JWT_SECRET);

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

		// Fetch active likes with pagination
		const [likes, totalLikes] = await Promise.all([
			prisma.like.findMany({
				where: { postId, isActive: true },
				skip,
				take: limit,
				orderBy: { createdAt: "desc" },
				include: {
					user: { select: { id: true, username: true } },
				},
			}),
			prisma.like.count({ where: { postId, isActive: true } }),
		]);

		const formattedLikes = likes.map((like) => ({
			id: like.id,
			user: { id: like.user.id, username: like.user.username },
			postId: like.postId,
			createdAt: like.createdAt.toISOString(),
		}));

		const totalPages = Math.ceil(totalLikes / limit);

		const response = {
			likes: formattedLikes,
			meta: {
				page,
				limit,
				totalLikes,
				totalPages,
				hasNextPage: page < totalPages,
				hasPreviousPage: page > 1,
			},
		};

		return NextResponse.json(response);
	} catch (error: any) {
		console.error("Error fetching likes:", error.message);
		return NextResponse.json(
			{
				message: "An error occurred while fetching likes",
				error: error.message,
			},
			{ status: 500 }
		);
	}
}
