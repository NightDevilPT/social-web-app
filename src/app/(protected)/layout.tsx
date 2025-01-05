import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";
import { JWT_SECRET } from "@/config";

const Layout = async ({ children }: { children: ReactNode }) => {
	const cookieStore = await cookies();
	const authToken = cookieStore.get("auth_token")?.value;

	if (!authToken) {
		redirect("/auth/login");
	}

	const tokenValue = jwt.verify(authToken, JWT_SECRET) as {
		id: string;
		username?: string;
	};
	if (!tokenValue?.id) {
		redirect("/auth/login");
	}
	return <>{children}</>;
};

export default Layout;
