import axiosClient from "@/lip/axiosClient";

interface PostDescriptions {
    descriptions_en: {
        AI: string;
        Child: string;
        Teenager: string;
        "Adult Expert": string;
    };
    descriptions_de?: {
        AI: string;
        Child: string;
        Teenager: string;
        "Adult Expert": string;
    };
}

export const createPost = async (descriptions: PostDescriptions, image: File) => {
    try {
        const formData = new FormData();
        formData.append('image', image);
        
        // Append descriptions for both languages
        formData.append('descriptions_en', JSON.stringify(descriptions.descriptions_en));
        if (descriptions.descriptions_de) {
            formData.append('descriptions_de', JSON.stringify(descriptions.descriptions_de));
        }

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

export const getAllPost = async (page: number = 1, limit: number = 5, language: 'en' | 'de' = 'en') => {
    try {
        const response = await axiosClient.get(`/posts/get-all-post?language=${language}&page=${page}&limit=${limit}`);
        return response.data as PaginatedResponse;
    } catch (error: any) {
        throw error.response?.data || {
            message: 'An unknown error occurred'
        };
    }
};


// search post
export const searchPosts = async (query: string, page: number = 1, limit: number = 5, language: 'en' | 'de' = 'en') => {
    try {
        const response = await axiosClient.get(`/posts/search?query=${query}&page=${page}&limit=${limit}&language=${language}`);
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
        
        // Append descriptions for both languages
        formData.append('descriptions_en', JSON.stringify(descriptions.descriptions_en));
        if (descriptions.descriptions_de) {
            formData.append('descriptions_de', JSON.stringify(descriptions.descriptions_de));
        }

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