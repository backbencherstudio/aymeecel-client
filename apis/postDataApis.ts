import axiosClient from "@/lip/axiosClient";

interface PostDescriptions {
    AI: string;
    Child: string;
    Teenager: string;
    "Adult Expert": string;
}

export const createPost = async (descriptions: PostDescriptions, image: File) => {
    try {
        const formData = new FormData();
        formData.append('image', image);
        formData.append('descriptions', JSON.stringify(descriptions));

        const response = await axiosClient.post('/posts/create', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return {
            success: true,
            message: response.data.message || 'Post created successfully',
            post: response.data.post
        };
    } catch (error: any) {
        throw error.response?.data || {
            message: 'An unknown error occurred'
        };
    }
};


// get all post 

interface PaginatedResponse {
    success: boolean;
    message: string;
    currentPage: number;
    totalPages: number;
    totalPosts: number;
    nextPage: boolean;
    posts: any[];
}

export const getAllPost = async (page: number = 1, limit: number = 5) => {
    try {
        const response = await axiosClient.get(`/posts/get-all-post?page=${page}&limit=${limit}`);
        return response.data as PaginatedResponse;
    } catch (error: any) {
        throw error.response?.data || {
            message: 'An unknown error occurred'
        };
    }
};


// search post
export const searchPosts = async (query: string, page: number = 1, limit: number = 5) => {
    try {
        const response = await axiosClient.get(`/posts/search?query=${query}&page=${page}&limit=${limit}`);
        return response.data as PaginatedResponse;
    } catch (error: any) {
        throw error.response?.data || {
            message: 'An unknown error occurred'
        };
    }
};

// delete data 
export const deletePost = async (postId: string) => {
    try {
        const response = await axiosClient.delete(`/posts/${postId}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || {
            message: 'An unknown error occurred'
        };
    }
};

// update post
export const updatePost = async (postId: string, descriptions: PostDescriptions, image?: File) => {
    try {
        const formData = new FormData();
        if (image) {
            formData.append('image', image);
        }
        formData.append('descriptions', JSON.stringify(descriptions));

        const response = await axiosClient.put(`/posts/${postId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return {
            success: true,
            message: response.data.message || 'Post updated successfully',
            post: response.data.post
        };
    } catch (error: any) {
        throw error.response?.data || {
            message: 'An unknown error occurred'
        };
    }
};


// Add this function to get a single post
export const getPostById = async (postId: string) => {
    try {
        const response = await axiosClient.get(`/posts/${postId}`);
        return {
            success: true,
            post: response.data.post
        };
    } catch (error: any) {
        throw error.response?.data || {
            message: 'An unknown error occurred'
        };
    }
};
