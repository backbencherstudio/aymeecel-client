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

        return response.data;
    } catch (error) {
        if (error instanceof Error) {
            throw error.message;
        } else if (typeof error === 'object' && error !== null && 'response' in error) {
            throw (error as any).response?.data || 'An unknown error occurred';
        } else {
            throw 'An unknown error occurred';
        }
    }
}


// get all post 

export const getAllPost = async () => {
    try {
        const response = await axiosClient.get('/posts/get-all-post');
        return response.data;
    } catch (error) {
        if (error instanceof Error) {
            throw error.message;
        } else if (typeof error === 'object' && error !== null && 'response' in error) {
            throw (error as any).response?.data || 'An unknown error occurred';
        } else {
            throw 'An unknown error occurred';
        }
    }
}