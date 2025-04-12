'use client'
import React, { useEffect, useState, useCallback } from 'react';
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
import debounce from 'lodash/debounce';
import CustomImage from '../../../../components/Reusable/CustomImage/CustomImage';
import { useLanguage } from '@/context/LanguageContext';

// Update the type definition
type DescriptionField = 'AI' | 'Child' | 'Teenager' | 'Adult Expert';

interface Descriptions {
  AI: string;
  Child: string;
  Teenager: string;
  "Adult Expert": string;
}

interface Post {
  id: string;
  image: string;
  descriptions_en: string | Descriptions;
  descriptions_de: string | Descriptions;
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
  const { selectedLang } = useLanguage();

  // Update the truncateText function with proper typing
  const truncateText = (text: string, id: string, field: DescriptionField) => {
    const maxLength = 10;

    // Create a temporary div to parse HTML content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = text;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';

    if (plainText.length <= maxLength) {
      return <div dangerouslySetInnerHTML={{ __html: text }} />;
    }

    // Get the first 10 characters of plain text
    const truncatedText = plainText.slice(0, maxLength);

    return (
      <div className="flex items-center space-x-1">
        <div className="truncate">
          {truncatedText}...
        </div>
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

  // Update the DescriptionModal to handle HTML content
  const DescriptionModal = () => {
    return (
      <Dialog 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen}
      >
        <DialogContent 
          className="modal-content-enter  max-h-[80vh] overflow-y-auto fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white rounded-lg shadow-lg px-10 focus:outline-none"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={() => setIsModalOpen(false)}
        >
          <DialogHeader>
            <DialogTitle>{selectedText.field} Description</DialogTitle>
          </DialogHeader>
          <div 
            className="mt-4 prose max-w-none"
            dangerouslySetInnerHTML={{ __html: selectedText.text }}
          />
        </DialogContent>
      </Dialog>
    );
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getAllPost(currentPage, 5, selectedLang as 'en' | 'de');
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
  }, [currentPage, selectedLang]);

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

  // Update the DeleteConfirmationModal component
  const DeleteConfirmationModal = () => {
    const handleClose = useCallback(() => {
      setIsDeleteModalOpen(false);
      setPostToDelete(null);
    }, []);

    const handleDeleteConfirm = async () => {
      if (!postToDelete) return;
      
      try {
        setLoading(true);
        const response = await deletePost(postToDelete);
        
        if (response.success) {
          toast.success('Post deleted successfully');
          handleClose();
          
          // Recalculate current page if it's the last item on the page
          const newCurrentPage = posts.length === 1 && currentPage > 1 
            ? currentPage - 1 
            : currentPage;
          
          // Fetch updated posts
          const updatedResponse = await getAllPost(newCurrentPage, 5, selectedLang as 'en' | 'de');
          if (updatedResponse.success) {
            setPosts(updatedResponse.posts);
            setTotalPages(updatedResponse.totalPages);
            setTotalPosts(updatedResponse.totalPosts);
            setCurrentPage(newCurrentPage);
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete post';
        toast.error(errorMessage);
      } finally {
        setLoading(false);
        handleClose();
      }
    };

    return (
      <Dialog 
        open={isDeleteModalOpen} 
        onOpenChange={handleClose}
      >
        <DialogContent 
          className="sm:max-w-[425px] bg-white"
          onEscapeKeyDown={handleClose}
          onInteractOutside={handleClose}
        >
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <p>Are you sure you want to delete this post? This action cannot be undone.</p>
            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={handleClose}
                type="button"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
                type="button"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </span>
                ) : (
                  'Delete'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const TableActions = ({ post }: { post: Post }) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/create-post?id=${post.id}`)}
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
    );
  };

  // Update the debouncedSearch implementation
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      try {
        setLoading(true);
        const response = await getAllPost(currentPage, 5, selectedLang as 'en' | 'de');

        if (response.success) {
          if (query.trim()) {
            const filteredPosts = response.posts.filter(post => {
              const descriptionsField = selectedLang === 'en' ? 'descriptions_en' : 'descriptions_de';
              let descriptions: Descriptions = {
                AI: '',
                Child: '',
                Teenager: '',
                "Adult Expert": ''
              };

              try {
                const currentDescriptions = post[descriptionsField];
                
                if (currentDescriptions) {
                  if (typeof currentDescriptions === 'string') {
                    descriptions = JSON.parse(currentDescriptions);
                  } else {
                    descriptions = currentDescriptions as Descriptions;
                  }
                } else if (descriptionsField === 'descriptions_de' && post.descriptions_en) {
                  const englishDescriptions = post.descriptions_en;
                  if (typeof englishDescriptions === 'string') {
                    descriptions = JSON.parse(englishDescriptions);
                  } else {
                    descriptions = englishDescriptions as Descriptions;
                  }
                }

                const tempDiv = document.createElement('div');
                const searchLower = query.toLowerCase();
                const fields: DescriptionField[] = ['AI', 'Child', 'Teenager', 'Adult Expert'];

                return fields.some(field => {
                  if (!descriptions[field]) return false;
                  tempDiv.innerHTML = descriptions[field];
                  const plainText = (tempDiv.textContent || tempDiv.innerText || '').toLowerCase();
                  return plainText.includes(searchLower);
                });
              } catch (error) {
                console.error('Error parsing descriptions during search:', error);
                return false;
              }
            });

            setPosts(filteredPosts);
            setTotalPages(1);
            setTotalPosts(filteredPosts.length);
          } else {
            setPosts(response.posts);
            setTotalPages(response.totalPages);
            setTotalPosts(response.totalPosts);
          }
        }
      } catch (error) {
        console.error('Search error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to search posts';
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }, 500),
    [pathname, router, searchParams, currentPage, selectedLang]
  );
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('lang', selectedLang);
    if (searchQuery) {
      params.set('search', searchQuery);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    setLoading(true);

  }, [selectedLang]);

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
                const descriptionsField = selectedLang === 'en' ? 'descriptions_en' : 'descriptions_de';
                let descriptions: Descriptions = {
                  AI: '',
                  Child: '',
                  Teenager: '',
                  "Adult Expert": ''
                };
                
                try {
                  const currentDescriptions = post[descriptionsField];
                  
                  // Check if descriptions exist and handle parsing
                  if (currentDescriptions) {
                    if (typeof currentDescriptions === 'string') {
                      try {
                        descriptions = JSON.parse(currentDescriptions);
                      } catch (parseError) {
                        console.error('Error parsing JSON:', parseError);
                        descriptions = {
                          AI: 'Error loading content',
                          Child: 'Error loading content',
                          Teenager: 'Error loading content',
                          "Adult Expert": 'Error loading content'
                        };
                      }
                    } else {
                      descriptions = currentDescriptions as Descriptions;
                    }
                  } else if (descriptionsField === 'descriptions_de' && post.descriptions_en) {
                    // Fallback to English if German is not available
                    const englishDescriptions = post.descriptions_en;
                    if (typeof englishDescriptions === 'string') {
                      try {
                        descriptions = JSON.parse(englishDescriptions);
                      } catch (parseError) {
                        console.error('Error parsing English fallback:', parseError);
                        descriptions = {
                          AI: 'Error loading content',
                          Child: 'Error loading content',
                          Teenager: 'Error loading content',
                          "Adult Expert": 'Error loading content'
                        };
                      }
                    } else {
                      descriptions = englishDescriptions as Descriptions;
                    }
                  }

                  // Validate that all required fields exist
                  const requiredFields: DescriptionField[] = ['AI', 'Child', 'Teenager', 'Adult Expert'];
                  requiredFields.forEach(field => {
                    if (!descriptions[field]) {
                      descriptions[field] = '';
                    }
                  });

                } catch (error) {
                  console.error('Error processing descriptions:', error);
                  descriptions = {
                    AI: 'Error loading content',
                    Child: 'Error loading content',
                    Teenager: 'Error loading content',
                    "Adult Expert": 'Error loading content'
                  };
                }

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
                          src={post.image}
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
                        {truncateText(descriptions["Adult Expert"], post.id, 'Adult Expert')}
                      </div>
                    </TableCell>
                    <TableCell className="p-4 whitespace-nowrap">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <TableActions post={post} />
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
