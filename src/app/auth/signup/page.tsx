import React from "react";
import { SignupForm } from "./_components/signup-form";

const page = () => {
	return (
		<div className="flex h-full w-full items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm">
				<SignupForm />
			</div>
		</div>
	);
};

export default page;
