import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/db";
import { authMiddleware } from "@/lib/auth-middleware";

export async function POST(request: NextRequest) {
  const { username, email, password } = await request.json();

  try {
    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = await prisma.user.create({
		data:{
			username,
			email,
			password:hashedPassword
		}
	})

    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error || "Failed to create user" },
      { status: 500 }
    );
  }
}


// Handler function to fetch user data
async function getUserHandler(request: NextRequest) {
  try {
    const userId = (request as any).userId; // Extract userId from middleware

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // Fetch the user data from the database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "User data retrieved successfully",
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Error retrieving user data:", error.message);
    return NextResponse.json(
      {
        message: "An error occurred while retrieving user data",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// Export the handler wrapped with authMiddleware
export const GET = authMiddleware(getUserHandler);
