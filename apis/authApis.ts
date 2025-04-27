import axiosClient from "@/lip/axiosClient";

interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export const loginUser = async (email: string, password: string) => {
    try {
        const response = await axiosClient.post('/users/login', {
            email,
            password,
        });
        
        return {
            success: true,
            message: response.data.message || 'Successfully logged in!',
            token: response.data.token,
            user: response.data.user
        };
    } catch (error: any) {
        throw error.response?.data || {
            message: 'An unknown error occurred'
        };
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
        return {
            success: true,
            message: response.data.message || 'Profile updated successfully',
            user: response.data.user
        };
    } catch (error: any) {
        throw error.response?.data || {
            message: 'An unknown error occurred'
        };
    }
};


// change password

export const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
        const response = await axiosClient.patch('/users/change-password', {
            oldPassword,
            newPassword,
        });
        return {
            success: true,
            message: response.data.message || 'Password changed successfully'
        };
    } catch (error: any) {
        throw error.response?.data || {
            message: 'An unknown error occurred'
        };
    }
};