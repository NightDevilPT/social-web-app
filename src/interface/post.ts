import { PaginatedResponse } from "./common";

export interface Post {
	id: string;
	title: string;
	content: string;
	createdAt: string;
	updatedAt: string;
	user: {
		username: string;
	};
	likes: number;
	comments: number;
}

// Paginated comments response
export type PostsApiResponse = PaginatedResponse<Post>;
