import { PaginatedResponse } from "./common";

// Represents a single comment
export interface Comment {
	id: string;
	content: string;
	createdAt: string;
	user: {
		username: string;
	};
}

// Paginated comments response
export type CommentsApiResponse = PaginatedResponse<Comment>;
