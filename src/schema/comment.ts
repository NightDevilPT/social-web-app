import { z } from "zod";

// Validation schema for adding a comment
export const commentSchema = z.object({
	content: z
		.string()
		.min(1, { message: "Comment cannot be empty" })
		.max(500, { message: "Comment cannot exceed 500 characters" }),
});

export type CommentFormData = z.infer<typeof commentSchema>;
