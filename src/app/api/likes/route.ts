import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { authMiddleware } from "@/lib/auth-middleware";

async function toggleLikeHandler(request: NextRequest) {
	try {
		const userId = (request as any).userId; // Access userId from middleware

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

export const POST = authMiddleware(toggleLikeHandler);
