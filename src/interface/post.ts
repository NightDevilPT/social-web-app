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
	isAccessable?:boolean;
	likes: number;
	comments: number;
	isLiked?:boolean;
}

// Paginated comments response
export type PostsApiResponse = PaginatedResponse<Post>;
