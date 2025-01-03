export interface Post {
	id: string;
	title: string;
	content: string;
	createdAt: string;
	updatedAt: string;
	user: {
	  username: string;
	};
	likes: { id: string }[];
	comments: { id: string; content: string }[];
  }
  
  export interface FetchPostsResponse {
	posts: Post[];
	meta: {
	  page: number;
	  limit: number;
	  totalPosts: number;
	  totalPages: number;
	  hasNextPage: boolean;
	  hasPreviousPage: boolean;
	};
  }
  