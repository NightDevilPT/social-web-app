import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "@/lib/db";

// Environment variable for JWT secret
const JWT_SECRET = process.env.NEXT_JWT_SECRET || "your_jwt_secret_key";
const COOKIE_NAME = "auth_token";

export async function POST(request: NextRequest) {
	const { email, password } = await request.json();

	try {
		// Check if the user exists
		const user = await prisma.user.findUnique({
			where: { email },
		});

		if (!user) {
			return NextResponse.json(
				{ error: "Invalid email or password" },
				{ status: 401 }
			);
		}

		// Compare the password
		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			return NextResponse.json(
				{ error: "Invalid email or password" },
				{ status: 401 }
			);
		}

		// Create a JWT token
		const token = jwt.sign(
			{ id: user.id, email: user.email, username: user.username },
			JWT_SECRET,
			{ expiresIn: "1d" } // Token expiration
		);

		// Set the cookie with the token
		const response = NextResponse.json(
			{
				message: "Login successful",
				user: {
					id: user.id,
					email: user.email,
					username: user.username,
				},
			},
			{ status: 200 }
		);

		response.cookies.set(COOKIE_NAME, token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			path: "/",
			maxAge: 1 * 24 * 60 * 60, // 7 days in seconds
		});

		return response;
	} catch (error: any) {
		return NextResponse.json(
			{ error: error.message || "Login failed" },
			{ status: 500 }
		);
	}
}
