import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/db";
import { COOKIE_NAME, JWT_SECRET } from "@/config";

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
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
		const commentId = (await params).id;
		const { content } = body;

		if (!commentId || !content) {
			return NextResponse.json(
				{ message: "Comment ID and new content are required" },
				{ status: 400 }
			);
		}

		// Fetch the comment to ensure it exists and belongs to the user
		const comment = await prisma.comment.findUnique({
			where: { id: commentId },
			select: { createdAt: true, userId: true },
		});

		if (!comment) {
			return NextResponse.json(
				{ message: "Comment not found" },
				{ status: 404 }
			);
		}

		if (comment.userId !== userId) {
			return NextResponse.json(
				{ message: "You are not authorized to edit this comment" },
				{ status: 403 }
			);
		}

		// Check if the comment is still editable (within 1 hour)
		const createdTime = new Date(comment.createdAt);
		const currentTime = new Date();
		const timeDifference =
			(currentTime.getTime() - createdTime.getTime()) / (1000 * 60); // Time difference in minutes

		if (timeDifference > 60) {
			return NextResponse.json(
				{ message: "Comment can no longer be edited" },
				{ status: 403 }
			);
		}

		// Update the comment
		const updatedComment = await prisma.comment.update({
			where: { id: commentId },
			data: { content },
		});

		return NextResponse.json({
			message: "Comment updated successfully",
			updatedComment: {
				id: updatedComment.id,
				content: updatedComment.content,
				updatedAt: updatedComment.updatedAt.toISOString(),
			},
		});
	} catch (error: any) {
		console.error("Error updating comment:", error.message);
		return NextResponse.json(
			{
				message: "An error occurred while updating the comment",
				error: error.message,
			},
			{ status: 500 }
		);
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
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
		} catch (err: any) {
			console.log(err);
			return NextResponse.json(
				{ message: "Invalid or expired token" },
				{ status: 401 }
			);
		}

		// Extract user ID from the token
		const userId = decodedToken.id;

		// Extract comment ID from route parameters
		const commentId = (await params).id;

		if (!commentId) {
			return NextResponse.json(
				{ message: "Comment ID is required" },
				{ status: 400 }
			);
		}

		// Fetch the comment to ensure it exists and belongs to the user
		const comment = await prisma.comment.findUnique({
			where: { id: commentId },
			select: { userId: true },
		});

		if (!comment) {
			return NextResponse.json(
				{ message: "Comment not found" },
				{ status: 404 }
			);
		}

		if (comment.userId !== userId) {
			return NextResponse.json(
				{ message: "You are not authorized to delete this comment" },
				{ status: 403 }
			);
		}

		// Delete the comment
		await prisma.comment.delete({
			where: { id: commentId },
		});

		return NextResponse.json({
			message: "Comment deleted successfully",
		});
	} catch (error: any) {
		console.error("Error deleting comment:", error.message);
		return NextResponse.json(
			{
				message: "An error occurred while deleting the comment",
				error: error.message,
			},
			{ status: 500 }
		);
	}
}
