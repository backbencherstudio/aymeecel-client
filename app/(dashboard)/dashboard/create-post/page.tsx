'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

interface PostFormData {
  image: File | null;
  descriptions: {
    AI: string;
    Child: string;
    Teenager: string;
    "Adult Expert": string;
  }
}

export default function CreatePost() {
  const { register, handleSubmit, formState: { errors } } = useForm<PostFormData>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const onSubmit = async (data: PostFormData) => {
    try {
      // Handle form submission here
      console.log(data);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Image Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Upload Image
          </label>
          <div 
            onClick={handleUploadClick}
            className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-gray-400"
          >
            <div className="space-y-1 text-center">
              {selectedImage ? (
                <img src={selectedImage} alt="Preview" className="mx-auto h-64 w-auto" />
              ) : (
                <div className="text-gray-600">
                  <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="text-sm">Click or drag to upload an image</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                {...register('image', { required: 'Image is required' })}
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>
          {errors.image && (
            <p className="text-red-500 text-sm">{errors.image.message}</p>
          )}
        </div>

        {/* Descriptions */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Descriptions</h2>
          
          {/* AI Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">AI Description</label>
            <textarea
              {...register('descriptions.AI', { required: 'AI description is required' })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {/* Child Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Child Description</label>
            <textarea
              {...register('descriptions.Child', { required: 'Child description is required' })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {/* Teenager Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Teenager Description</label>
            <textarea
              {...register('descriptions.Teenager', { required: 'Teenager description is required' })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {/* Adult Expert Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Adult Expert Description</label>
            <textarea
              {...register('descriptions.Adult Expert', { required: 'Adult Expert description is required' })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Post
          </button>
        </div>
      </form>
    </div>
  )
}
