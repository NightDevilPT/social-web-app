"use client";

import React, { useState } from "react";
import { ThemeProvider } from "../theme-provider";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "@/lib/query-client";
import { Toaster } from "../ui/toaster";
import UiLayoutProvider from "./layout-provider";

const RootProvider = ({ children }: { children: React.ReactNode }) => {
	const [client] = useState(() => queryClient);
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="dark"
			enableSystem
			disableTransitionOnChange
		>
			<QueryClientProvider client={client}>
				<UiLayoutProvider>{children}</UiLayoutProvider>
			</QueryClientProvider>
			<Toaster />
		</ThemeProvider>
	);
};

export default RootProvider;
