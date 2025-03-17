'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5"
import { useRouter } from 'next/navigation'
import { loginUser } from '@/apis/authApis'
import { useUser } from '@/context/UserContext';

interface LoginFormInputs {
    email: string;
    password: string;
}

export default function Login() {
    const { setUser } = useUser();
    const { register, handleSubmit, formState: { errors }, setError } = useForm<LoginFormInputs>()
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const onSubmit = async (data: LoginFormInputs) => {
        try {
            setIsLoading(true);
            const response = await loginUser(data.email, data.password);
            
            // Only store the token
            localStorage.setItem('token', response.token);
            // Set user data from response directly to context
            setUser(response.user);
            
            router.push('/dashboard');
        } catch (error) {
            setError('root', {
                type: 'manual',
                message: typeof error === 'string' ? error : 'Login failed. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-center bg-[linear-gradient(118deg,#9ABFBD_-1.71%,#EEF0EB_55.76%,#B69E93_100%)] min-h-screen">
            <div className="max-w-md py-10 w-full space-y-8 p-8 bg-white rounded-lg shadow">
                <div>
                    <h2 className="text-center text-2xl font-bold text-gray-900">
                        Login to your account
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    {errors.root && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                            {errors.root.message}
                        </div>
                    )}
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="email" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                                type="email"
                                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Email address"
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                        </div>
                        <div className="relative">
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters"
                                    }
                                })}
                                type={showPassword ? "text" : "password"}
                                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Password"
                            />
                            <button
                                type="button"
                                className="absolute right-3 cursor-pointer top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
                            </button>
                            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#213c3a] hover:bg-[#101f1e] transition-all duration-300 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
