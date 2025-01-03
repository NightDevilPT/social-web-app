'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { apiService } from "@/service/api-service/api.service";
import { useQuery } from "@tanstack/react-query";

type Post = {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    user: {
        username: string;
    };
    likes: { id: string }[];
    comments: {
        id: string;
        content: string;
        user: { username: string };
    }[];
};

export default function SinglePostPage({ params }: { params: { id: string } }) {
    const { id } = params;

    const fetchPost = async ({ queryKey }: { queryKey: [string, string] }): Promise<Post> => {
        const [, postId] = queryKey;
        const response = await apiService.get<Post>(`/posts/${postId}`);
        if (!response) {
            throw new Error("Post not found");
        }
        return response;
    };

    const { data: postData, isLoading, error } = useQuery({
        queryKey: ['post', id],
        queryFn: fetchPost,
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {(error as Error).message}</div>;
    }

    if (!postData) {
        return <div>No post data available.</div>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{postData.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p>{postData.content}</p>
                <Separator />
                <p>Posted by: {postData.user.username}</p>
                <p>Likes: {postData.likes.length}</p>
                <p>Comments:</p>
                <ul>
                    {postData.comments.map((comment) => (
                        <li key={comment.id}>
                            <strong>{comment.user.username}:</strong> {comment.content}
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
