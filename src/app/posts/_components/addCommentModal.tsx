import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";

type CommentData = {
	content: string;
};

export default function AddCommentDialog() {
	const [formData, setFormData] = useState<CommentData>({
		content: "",
	});

	const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Replace this with the API call to add the comment
		console.log("Comment Data:", formData);
	};

	return (
		<div>
			<Dialog>
				<DialogTrigger asChild>
					<Button>Add Comment</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add Comment</DialogTitle>
						<DialogDescription>
							Enter your comment below to participate in the
							discussion.
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleSubmit}>
						<div className="space-y-4">
							<div>
								<label
									htmlFor="content"
									className="block text-sm font-medium text-gray-700"
								>
									Comment
								</label>
								<Textarea
									id="content"
									name="content"
									placeholder="Write your comment here..."
									value={formData.content}
									onChange={handleInputChange}
									required
								/>
							</div>
						</div>
						<DialogFooter>
							<Button type="button" variant="secondary">
								Cancel
							</Button>
							<Button type="submit">Post Comment</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
