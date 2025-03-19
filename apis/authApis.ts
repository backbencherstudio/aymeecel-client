import axiosClient from "@/lip/axiosClient";

// Function to handle login API request
export const loginUser = async (email: string, password: string) => {
    try {
        const response = await axiosClient.post('/users/login', {
            email,
            password,
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
};


// update user with image
export const updateUser = async (id: string, data: FormData) => {
    try {
        const response = await axiosClient.put(`/users/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        // Make sure the backend returns the updated user data
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
};
