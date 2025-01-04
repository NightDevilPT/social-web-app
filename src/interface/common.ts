export interface Meta {
	page: number;
	limit: number;
	totalItems: number;
	totalPages: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
}

// Generic paginated response
export interface PaginatedResponse<T> {
	data: T[];
	meta: Meta;
}
