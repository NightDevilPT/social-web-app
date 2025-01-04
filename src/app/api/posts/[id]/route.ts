import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/db";
import { COOKIE_NAME, JWT_SECRET } from "@/config";
import { Post } from "@/interface/post";

export async function GET(
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
		try {
			jwt.verify(token, JWT_SECRET) as { id: string };
		} catch (err: any) {
			console.error("Error adding comment:", (err as Error)?.message);
			return NextResponse.json(
				{ message: "Invalid or expired token" },
				{ status: 401 }
			);
		}

		// Extract the post ID from route parameters
		const postId = (await params).id;

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
				_count: {
					select: {
						likes: {
							where: {
								isActive: true,
							},
						},
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

		// Format the post data
		const formattedPost: Post = {
			id: post.id,
			title: post.title,
			content: post.content,
			createdAt: post.createdAt.toISOString(),
			updatedAt: post.updatedAt.toISOString(),
			user: { username: post.user.username },
			likes: post._count.likes,
			comments: post._count.comments,
		};

		return NextResponse.json(formattedPost);
	} catch (error: any) {
		console.error("Error adding comment:", (error as Error)?.message);
		return NextResponse.json(
			{
				message: "An error occurred while fetching the post",
				error: error.message,
			},
			{ status: 500 }
		);
	}
}

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
		} catch (error: any) {
			console.error("Error adding comment:", (error as Error)?.message);
			return NextResponse.json(
				{ message: "Invalid or expired token" },
				{ status: 401 }
			);
		}

		// Extract user ID from the token
		const userId = decodedToken.id;

		// Extract the post ID from route parameters
		const postId = (await params).id;

		if (!postId) {
			return NextResponse.json(
				{ message: "Post ID is required" },
				{ status: 400 }
			);
		}

		// Parse the request body
		const body = await request.json();

		// Fetch the post to ensure it exists and belongs to the user
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

		// Update the post in the database
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
		console.error("Error adding comment:", (error as Error)?.message);
		return NextResponse.json(
			{
				message: "An error occurred while updating the post",
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
		} catch (error: any) {
			console.error("Error adding comment:", (error as Error)?.message);
			return NextResponse.json(
				{ message: "Invalid or expired token" },
				{ status: 401 }
			);
		}

		// Extract user ID from the token
		const userId = decodedToken.id;

		// Extract the post ID from route parameters
		const postId = (await params).id;

		if (!postId) {
			return NextResponse.json(
				{ message: "Post ID is required" },
				{ status: 400 }
			);
		}

		// Fetch the post to ensure it exists and belongs to the user
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
		console.error("Error adding comment:", (error as Error)?.message);
		return NextResponse.json(
			{
				message: "An error occurred while deleting the post",
				error: error.message,
			},
			{ status: 500 }
		);
	}
}
