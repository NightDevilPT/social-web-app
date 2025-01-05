"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

// Enum for defining routes and their labels
export const RoutesEnums = {
	"/": "Posts",
	"/my-posts": "My Posts",
};

const NavBar: React.FC = () => {
	const pathname = usePathname(); // Retrieve the current route

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

			{/* Profile Icon */}
			<div
				className="w-8 h-8 flex items-center justify-center text-sm text-foreground p-2 rounded-full cursor-pointer bg-card hover:bg-card"
				title="Profile"
			>
				N
			</div>
		</nav>
	);
};

export default NavBar;
