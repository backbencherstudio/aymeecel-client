'use client'
import React, { useState, useRef } from 'react'
import { IoPersonOutline } from 'react-icons/io5'
import { RiLockPasswordLine } from 'react-icons/ri'
import { useUser } from '@/context/UserContext'
import Image from 'next/image'
import { IoCamera } from 'react-icons/io5'
import { updateUser } from '@/apis/authApis'
import { toast } from 'react-hot-toast'
import { FiEdit2 } from 'react-icons/fi' // Add this import at the top

export default function Settings() {
    const [activeTab, setActiveTab] = useState('profile')
    const { user, refreshUser } = useUser()
    const [previewImage, setPreviewImage] = useState<string | null>(user?.image || null)
    const [name, setName] = useState(user?.name || '')
    const [isLoading, setIsLoading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isEditingName, setIsEditingName] = useState(false)

    const handleImageClick = () => {
        fileInputRef.current?.click()
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            const imageUrl = URL.createObjectURL(file)
            setPreviewImage(imageUrl)
        }
    }

    const handleUpdateProfile = async () => {
        if (!user?.id) return

        try {
            setIsLoading(true)
            const formData = new FormData()
            formData.append('name', name)
            if (selectedFile) {
                formData.append('image', selectedFile)
            }

            const response = await updateUser(user?.id, formData)
            
            if (response.success) {
                // Update local storage with new user data
                localStorage.setItem('user', JSON.stringify(response.user))
                // Refresh user context
                await refreshUser()
                toast.success('Profile updated successfully')
            }
        } catch (error) {
            toast.error(typeof error === 'string' ? error : 'Failed to update profile')
        } finally {
            setIsLoading(false)
        }
    }

    // Add new state to track if there are changes
    const hasChanges = React.useMemo(() => {
        const nameChanged = name !== user?.name
        const imageChanged = selectedFile !== null
        return nameChanged || imageChanged
    }, [name, selectedFile, user?.name])

    // Update button component
    const UpdateButton = () => (
        <button 
            className="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={handleUpdateProfile}
            disabled={isLoading || !hasChanges}
        >
            {isLoading ? 'Updating...' : 'Update Profile'}
        </button>
    )

    return (
        <div className="container mx-auto sm:p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Settings</h1>

            <div className="bg-white rounded-lg shadow-md">
                <div className="grid grid-cols-1 lg:grid-cols-4">
                    {/* Settings Navigation - Updated responsive classes */}
                    <div className="border-b lg:border-b-0 lg:border-r border-gray-200">
                        <nav className="p-4">
                            <ul className="flex overflow-auto lg:flex-col space-x-4 lg:space-x-0 lg:space-y-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
                                <li className="flex-shrink-0">
                                    <button
                                        onClick={() => setActiveTab('profile')}
                                        className={`flex cursor-pointer items-center w-full px-4 py-2 rounded-lg transition-colors duration-200 whitespace-nowrap ${
                                            activeTab === 'profile'
                                                ? 'bg-blue-50 text-indigo-600'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        <IoPersonOutline className="h-5 w-5 mr-3 flex-shrink-0" />
                                        Update Profile
                                    </button>
                                </li>
                                <li className="flex-shrink-0">
                                    <button
                                        onClick={() => setActiveTab('password')}
                                        className={`flex cursor-pointer items-center w-full px-4 py-2 rounded-lg transition-colors duration-200 whitespace-nowrap ${
                                            activeTab === 'password'
                                                ? 'bg-blue-50 text-indigo-600'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        <RiLockPasswordLine className="h-5 w-5 mr-3 flex-shrink-0" />
                                        Change Password
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    {/* Settings Content - Updated padding for better spacing */}
                    <div className="lg:col-span-3 p-4 lg:p-6">
                        {activeTab === 'profile' ? (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
                                
                                {/* Profile Image Section */}
                                <div className="flex flex-col items-center sm:items-start space-y-4">
                                    <div className="relative group">
                                        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
                                            {previewImage ? (
                                                <Image
                                                    src={previewImage}
                                                    alt="Profile"
                                                    width={128}
                                                    height={128}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <IoPersonOutline className="w-16 h-16 text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={handleImageClick}
                                            className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full text-white hover:bg-indigo-700 transition-colors"
                                        >
                                            <IoCamera className="w-5 h-5" />
                                        </button>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </div>
                                    <p className="text-sm text-gray-500">Click the camera icon to update your profile picture</p>
                                </div>

                                {/* Update the profile section inputs */}
                                <div className="space-y-4 max-w-2xl">
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Full Name
                                        </label>
                                        <div className="relative">
                                            {isEditingName ? (
                                                <input
                                                    type="text"
                                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-600"
                                                    placeholder="Enter your full name"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    autoFocus
                                                    onBlur={() => setIsEditingName(false)}
                                                />
                                            ) : (
                                                <div className="flex items-center">
                                                    <div className="w-full px-4 py-2 rounded-lg border border-transparent bg-gray-50">
                                                        {name || 'Enter your full name'}
                                                    </div>
                                                    <button 
                                                        onClick={() => setIsEditingName(true)}
                                                        className="absolute right-2 p-2 text-gray-500 hover:text-indigo-600"
                                                    >
                                                        <FiEdit2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed"
                                            placeholder="Enter your email"
                                            disabled
                                            defaultValue={user?.email || ''}
                                        />
                                    </div>
                                    <UpdateButton />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-800">Change Password</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Current Password
                                        </label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-600"
                                            placeholder="Enter current password"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-600"
                                            placeholder="Enter new password"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-600"
                                            placeholder="Confirm new password"
                                        />
                                    </div>
                                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300">
                                        Change Password
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
