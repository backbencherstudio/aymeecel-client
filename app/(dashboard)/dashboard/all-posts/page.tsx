'use client'
import React, { useEffect, useState } from 'react';
import { deletePost, getAllPost } from '@/apis/postDataApis';
import { toast } from 'react-hot-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"

import { Search } from "lucide-react"; 
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { searchPosts } from '@/apis/postDataApis';
import debounce from 'lodash/debounce';
import CustomImage from '../../../../components/Reusable/CustomImage/CustomImage';


interface Post {
  id: string;
  image: string;
  descriptions: string;
  createdAt: string;
  updatedAt: string;
}

export default function AllPost() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedText, setSelectedText] = useState({ text: '', field: '' });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  const truncateText = (text: string, id: string, field: string) => {
    const maxLength = 20;

    if (text.length <= maxLength) return text;

    return (
      <div className="flex items-center space-x-1">
        <span className="truncate">{text.slice(0, maxLength)}...</span>
        <button
          onClick={() => {
            setSelectedText({ text, field });
            setIsModalOpen(true);
          }}
          className="text-blue-600 cursor-pointer hover:text-blue-800 shrink-0"
        >
          see more
        </button>
      </div>
    );
  };


  // In DescriptionModal component
  const DescriptionModal = () => {
    return (
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="modal-content-enter max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedText.field} Description</DialogTitle>
          </DialogHeader>
          <div className="mt-4 whitespace-pre-wrap break-words">
            {selectedText.text}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getAllPost(currentPage);
        if (response.success) {
          setPosts(response.posts);
          setTotalPages(response.totalPages);
          setTotalPosts(response.totalPosts);
        }
      } catch (error) {
        if (error && typeof error === 'object' && 'response' in error && 
            error.response && typeof error.response === 'object' && 
            'status' in error.response && error.response.status === 401) {
          toast.error('Session expired. Please login again.');
          setError('Session expired');
        } else {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch posts';
          toast.error(errorMessage);
          setError(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage]);

  // Add pagination controls
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setLoading(true);
  };

  // Add this before the return statement
  const renderPagination = () => {
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
      <div className="flex flex-col md:flex-row gap-5 items-center justify-between px-2 py-3 mt-4">
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-700">
            Showing page {currentPage} of {totalPages}
          </p>
          <p className="text-sm text-gray-700">
            Total posts: {totalPosts}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            Previous
          </Button>
          {pageNumbers.map((pageNumber) => (
            <Button
              key={pageNumber}
              variant={currentPage === pageNumber ? "default" : "outline"}
              onClick={() => handlePageChange(pageNumber)}
              className="min-w-[40px]"
            >
              {pageNumber}
            </Button>
          ))}
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    );
  };

  // Add this function before the return statement
  const handleEdit = (postId: string) => {
    router.push(`/dashboard/create-post?id=${postId}`);
  };

  // In DeleteConfirmationModal component
  const DeleteConfirmationModal = () => {
    return (
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="modal-content-enter">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <p>Are you sure you want to delete this post? This action cannot be undone.</p>
            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (postToDelete) {
                    handleDelete(postToDelete);
                    setIsDeleteModalOpen(false);
                  }
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // Modify the handleDelete function
  const handleDelete = async (postId: string) => {
    try {
      const response = await deletePost(postId);
      if (response.success) {
        toast.success('Post deleted successfully');
        // Refresh the posts list
        const updatedResponse = await getAllPost(currentPage);
        if (updatedResponse.success) {
          setPosts(updatedResponse.posts);
          setTotalPages(updatedResponse.totalPages);
          setTotalPosts(updatedResponse.totalPosts);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete post';
      toast.error(errorMessage);
    } finally {
      setPostToDelete(null);
    }
  };

  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      try {
        setLoading(true);
        const params = new URLSearchParams(searchParams.toString());
        if (query) {
          params.set('search', query);
        } else {
          params.delete('search');
        }
        router.push(`${pathname}?${params.toString()}`);

        if (query.trim()) {
          const response = await searchPosts(query);
          if (response.success) {
            setPosts(response.posts);
            setTotalPages(response.totalPages || 1);
            setTotalPosts(response.totalPosts || response.posts.length);
          }
        } else {
          const response = await getAllPost(currentPage);
          if (response.success) {
            setPosts(response.posts);
            setTotalPages(response.totalPages);
            setTotalPosts(response.totalPosts);
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to search posts';
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }, 500),
    [pathname, router, searchParams, currentPage]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  return (
    <div className="max-w-8xl mx-auto">
      <DescriptionModal />
      <DeleteConfirmationModal />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Posts</h1>
        <div className="relative w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-indigo-600" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-indigo-600 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      {/* Add error handling */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
          {error}
        </div>
      )}

      {/* Add loading state */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-md border shadow h-[calc(100vh-250px)] flex flex-col items-center justify-center bg-gray-50">
          <Search className="h-12 w-12 mb-4 text-gray-400" />
          <p className="text-xl font-medium text-gray-600">No posts found</p>
          <p className="text-sm text-gray-500 mt-2">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="rounded-md border shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">#</TableHead>
                <TableHead className="w-24">Image</TableHead>
                <TableHead className="w-48">AI Description</TableHead>
                <TableHead className="w-48">Child Description</TableHead>
                <TableHead className="w-48">Teenager Description</TableHead>
                <TableHead className="w-48">Adult Expert Description</TableHead>
                <TableHead className="w-32">Created At</TableHead>
                <TableHead className="w-20 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post, index) => {
                const descriptions = JSON.parse(post.descriptions);
                // Fix the row number calculation for proper sequence across pages
                const rowNumber = index + 1;
                return (
                  <TableRow key={post.id}>
                    <TableCell className="text-center font-medium">
                      {rowNumber}
                    </TableCell>
                    <TableCell className="p-2">
                      <div className="flex items-center justify-center">
                        <CustomImage
                          width={100}
                          height={100}
                          src={`${process.env.NEXT_PUBLIC_API_ENDPOINT}/uploads/${post.image}`}
                          alt="Post"
                          className="h-10 w-16 md:w-20 md:h-14 xl:h-20 xl:w-20 object-cover rounded-lg shadow-sm"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="p-4">
                      <div className="w-full">
                        {truncateText(descriptions.AI, post.id, 'AI')}
                      </div>
                    </TableCell>
                    <TableCell className="p-4">
                      <div className="w-full">
                        {truncateText(descriptions.Child, post.id, 'Child')}
                      </div>
                    </TableCell>
                    <TableCell className="p-4">
                      <div className="w-full">
                        {truncateText(descriptions.Teenager, post.id, 'Teenager')}
                      </div>
                    </TableCell>
                    <TableCell className="p-4">
                      <div className="w-full">
                        {truncateText(descriptions["Adult Expert"], post.id, 'Adult')}
                      </div>
                    </TableCell>
                    <TableCell className="p-4 whitespace-nowrap">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 cursor-pointer w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEdit(post.id)}
                            className="cursor-pointer"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Update
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => {
                              setPostToDelete(post.id);
                              setIsDeleteModalOpen(true);
                            }}
                            className="cursor-pointer text-red-600"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {renderPagination()}
        </div>
      )}
    </div>
  );
}
