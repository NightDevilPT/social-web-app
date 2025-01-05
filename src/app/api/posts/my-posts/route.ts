import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { Post } from "@/interface/post";
import { PaginatedResponse } from "@/interface/common";
import { authMiddleware } from "@/lib/auth-middleware";

async function fetchUserPostsHandler(request: NextRequest) {
  try {
    const userId = (request as any).userId; // Access userId from the middleware

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

    // Fetch posts created by the user with like and comment counts
    const [posts, totalItems] = await Promise.all([
      prisma.post.findMany({
        where: { userId }, // Filter by userId
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
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
      }),
      prisma.post.count({ where: { userId } }), // Count posts for the user
    ]);

    // Format the posts to match the Post interface
    const formattedPosts: Post[] = posts.map((post) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      user: { username: post.user.username },
      likes: post._count.likes,
      comments: post._count.comments,
    }));

    // Build the meta object
    const totalPages = Math.ceil(totalItems / limit);
    const meta = {
      page,
      limit,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };

    // Build the response
    const response: PaginatedResponse<Post> = {
      data: formattedPosts,
      meta,
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

export const GET = authMiddleware(fetchUserPostsHandler);
