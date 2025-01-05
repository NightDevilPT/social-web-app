"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { apiService } from "@/service/api-service/api.service";
import { User, UserApiResponse } from "@/interface/user";

// Enum for defining navigation routes and their labels
export const RoutesEnums = {
	"/": "Posts",
	"/my-posts": "My Posts",
};

const NavBar: React.FC = () => {
	const pathname = usePathname(); // Retrieve the current route
	const router = useRouter();
	const [user, setUser] = useState<User | null>(null);

	// Fetch authenticated user data
	const fetchAuthenticatedUser = async () => {
		try {
			const response = await apiService.get<UserApiResponse>("/users");
			setUser(response.data);
			console.log(response.data, "User Data");
		} catch (error) {
			console.error("Failed to fetch user data:", error);
			setUser(null);
		}
	};

	useEffect(() => {
		fetchAuthenticatedUser();
	}, [pathname]);

	return (
		<nav className="container h-full flex justify-between items-center">
			{/* Logo Section */}
			<div className="flex flex-col">
				<span className="text-4xl font-bold text-primary">SWA</span>
				<span className="text-xs text-foreground">Social Web App</span>
			</div>

			{/* Navigation Links */}
			<div className="flex gap-3">
				{Object.entries(RoutesEnums).map(([path, label]) => (
					<Link
						key={path}
						href={path}
						className={`px-3 py-1 text-sm rounded transition ${
							pathname === path
								? "bg-primary text-black"
								: "text-foreground hover:text-primary"
						}`}
					>
						{label}
					</Link>
				))}
			</div>

			{/* User Profile or Auth Buttons */}
			{user ? (
				<div
					className="w-8 h-8 capitalize flex items-center justify-center text-sm text-foreground p-2 rounded-full cursor-pointer bg-card hover:bg-card"
					title="Profile"
				>
					{user.username[0]}
				</div>
			) : (
				<div className="grid grid-cols-2 gap-2">
					<button
						className="px-3 py-1 rounded-md border-2 border-primary text-primary hover:text-black hover:bg-primary transition-all duration-300 text-sm"
						onClick={() => router.push("/auth/signup")}
					>
						Signup
					</button>
					<button
						className="px-3 py-1 rounded-md bg-primary text-black text-sm"
						onClick={() => router.push("/auth/login")}
					>
						Login
					</button>
				</div>
			)}
		</nav>
	);
};

export default NavBar;
