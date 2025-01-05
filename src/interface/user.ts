export interface User {
	id: string; // Unique identifier for the user
	username: string; // User's username
	email: string; // User's email address
	createdAt: string; // ISO string representation of the creation date
	updatedAt: string; // ISO string representation of the last update date
}


export interface UserApiResponse{
	message:string;
	data:User;
}