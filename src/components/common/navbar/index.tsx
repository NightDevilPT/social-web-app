"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

export const RoutesEnums = {
  "/": "Posts",
  "/my-posts": "My Posts",
};

const NavBar = () => {
  const pathname = usePathname(); // Get the current route

  return (
    <nav className="container h-full flex justify-between items-center">
      {/* Logo Section */}
      <div className="w-auto h-auto grid grid-cols-0 relative">
        <div className="w-auto h-auto text-4xl text-primary relative">SWA</div>
        <div className="w-auto h-auto text-xs text-foreground relative bottom-1">
          Social Web App
        </div>
      </div>

      {/* Navigation Links */}
      <div className="w-auto h-auto flex justify-center items-center gap-3">
        {Object.entries(RoutesEnums).map(([path, label]) => (
          <Link
            key={path}
            href={path}
            className={`px-3 text-sm py-1 rounded ${
              pathname === path
                ? "bg-primary text-black"
                : "text-foreground hover:text-primary"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      <div className={`w-8 h-8 text-sm flex justify-center items-center text-foreground p-2 rounded-full cursor-pointer bg-card hover:bg-card`}>
        N
      </div>
    </nav>
  );
};

export default NavBar;
