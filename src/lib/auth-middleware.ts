import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { JWT_SECRET, COOKIE_NAME } from "@/config";

export const authMiddleware = (handler: any) => async (
  request: NextRequest,
  context: { params: any } // Include context for params
) => {
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Authentication token is missing" },
      { status: 401 }
    );
  }

  try {
    // Verify the JWT token
    const decodedToken = jwt.verify(token, JWT_SECRET) as { id: string };

    // Attach the user ID to the request
    (request as any).userId = decodedToken.id;

    // Pass the request and context (params) to the original handler
    return handler(request, context);
  } catch (err: any) {
    console.error("Invalid Token:", err);
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 401 }
    );
  }
};
