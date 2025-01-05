import { PaginatedResponse } from "./common";

// Represents a single like
export interface Like {
	id: string;
	user: {
		id: string;
		username: string;
	};
	postId: string;
	createdAt: string;
}

// Paginated likes response
export type LikesApiResponse = PaginatedResponse<Like>;

export interface ToggleLikeResponse {
	message: string;
	like: {
		id: string;
		isActive: boolean;
		createdAt: string;
	};
}
