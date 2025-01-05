import React from "react";

interface ErrorUIProps {
	message: string;
	onRetry?: () => void;
}

const ErrorUI: React.FC<ErrorUIProps> = ({ message, onRetry }) => {
	return (
		<div className="flex flex-col items-center justify-center w-full h-full bg-red-50 p-4 rounded-md shadow-md">
			<h2 className="text-xl font-bold text-red-600">
				Something Went Wrong
			</h2>
			<p className="text-gray-600 mt-2 text-center">{message}</p>
			{onRetry && (
				<button
					onClick={onRetry}
					className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
				>
					Retry
				</button>
			)}
		</div>
	);
};

export default ErrorUI;
