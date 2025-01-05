import React, { ReactNode } from "react";
import NavBar from "../common/navbar";

const UiLayoutProvider = ({ children }: { children: ReactNode }) => {
	return (
		<main className={`w-full h-screen grid grid-rows-[80px,_1fr]`}>
			<header className={`w-full h-full`}>
				<NavBar />
			</header>
			<div>{children}</div>
		</main>
	);
};

export default UiLayoutProvider;
