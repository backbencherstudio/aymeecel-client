'use client'
import React, { useEffect, useState } from 'react';
import { getAllPost } from '@/apis/postDataApis';

interface Post {
  id: string;
  image: string;
  descriptions: string;
  createdAt: string;
  updatedAt: string;
}

interface PostResponse {
  success: boolean;
  message: string;
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  nextPage: boolean;
  posts: Post[];
}

export default function AllPost() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getAllPost();
        setPosts(response.posts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">All Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => {
          const descriptions = JSON.parse(post.descriptions);
          return (
            <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src={`http://192.168.40.10:4000/uploads/${post.image}`} 
                alt="Post" 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">AI Description:</h3>
                  <p className="text-sm text-gray-600">{descriptions.AI}</p>
                  {/* Add more description categories as needed */}
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  Created: {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
