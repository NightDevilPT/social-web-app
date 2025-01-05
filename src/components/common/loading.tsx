import React from "react";

const LoadingComponent = () => {
	return (
		<div className={`w-auto h-auto flex justify-center items-center gap-3`}>
			<div
				className={`relative w-10 flex justify-center items-center h-10 rounded-full border-2 border-secondary border-t-primary animate-spin`}
			></div>
			<span className={`text-xl`}>Loading</span>
		</div>
	);
};

export default LoadingComponent;
