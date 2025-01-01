import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

type PostData = {
	title: string;
	content: string;
};

export default function AddPostDialog() {
	const [formData, setFormData] = useState<PostData>({
		title: "",
		content: "",
	});

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Replace this with the API call to add the post
		console.log("Post Data:", formData);
	};

	return (
		<div>
			<Dialog>
				<DialogTrigger asChild>
					<Button>Add New Post</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add New Post</DialogTitle>
						<DialogDescription>
							Fill in the fields below to create a new post.
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleSubmit}>
						<div className="space-y-4">
							<div>
								<label
									htmlFor="title"
									className="block text-sm font-medium text-gray-700"
								>
									Post Title
								</label>
								<Input
									id="title"
									name="title"
									type="text"
									placeholder="Enter post title"
									value={formData.title}
									onChange={handleInputChange}
									required
								/>
							</div>
							<div>
								<label
									htmlFor="content"
									className="block text-sm font-medium text-gray-700"
								>
									Post Content
								</label>
								<Textarea
									id="content"
									name="content"
									placeholder="Enter post content"
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
							<Button type="submit">Add Post</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
