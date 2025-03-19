'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { IoCloseCircle } from "react-icons/io5";

import { createPost } from "@/apis/postDataApis";
import Image from 'next/image';

interface PostFormData {
  image: File | null;
  descriptions: {
    AI: string;
    Child: string;
    Teenager: string;
    "Adult Expert": string;
  }
}

// Add loading state at the top of the component with other state declarations
export default function CreatePost() {
  // Add reset to the destructured useForm hook
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<PostFormData>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setValue('image', file); // Set the file value in the form
    }
  };



  // Update the onSubmit function
  const onSubmit = async (data: PostFormData) => {
    try {
      if (!data.image) {
        return;
      }
      setIsSubmitting(true);

      // Call the create post API
      await createPost(data.descriptions, data.image);

      // Reset all form fields
      reset();
      setSelectedImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      console.log('Post created successfully');

    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDeleteImage = () => {
    setSelectedImage(null);
    setValue('image', null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(URL.createObjectURL(file));
      setValue('image', file);
      if (fileInputRef.current) {
        fileInputRef.current.files = e.dataTransfer.files;
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Post</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Image Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Upload Image <span className='text-red-500'>*</span>
          </label>
          <div
            onClick={handleUploadClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-gray-400"
          >
            <div className="space-y-1 text-center">
              {selectedImage ? (
                <div className="relative inline-block">
                  <Image width={200} height={200} src={selectedImage} alt="Preview" className="mx-auto h-64 w-auto" />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteImage();
                    }}
                    className="absolute -top-2 -right-2 text-red-500 hover:text-red-700 transition-colors"
                  >
                    <IoCloseCircle size={24} />
                  </button>
                </div>
              ) : (
                <div className="text-gray-600">
                  <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="text-sm">Click or drag to upload an image</p>
                  <p className="text-sm text-gray-400 flex items-center justify-center gap-2 mt-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Optimal dimensions: 722 × 360 pixels
                  </p>
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
            <label className="block text-sm font-medium text-gray-700">AI Description <span className='text-red-500'>*</span></label>
            <textarea
              {...register('descriptions.AI', { required: 'AI description is required' })}
              rows={3}
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.descriptions?.AI && (
              <p className="text-red-500 text-sm">{errors.descriptions.AI.message}</p>
            )}
          </div>

          {/* Child Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Child Description <span className='text-red-500'>*</span></label>
            <textarea
              {...register('descriptions.Child', { required: 'Child description is required' })}
              rows={3}
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.descriptions?.Child && (
              <p className="text-red-500 text-sm">{errors.descriptions.Child.message}</p>
            )}
          </div>

          {/* Teenager Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Teenager Description <span className='text-red-500'>*</span></label>
            <textarea
              {...register('descriptions.Teenager', { required: 'Teenager description is required' })}
              rows={3}
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.descriptions?.Teenager && (
              <p className="text-red-500 text-sm">{errors.descriptions.Teenager.message}</p>
            )}
          </div>

          {/* Adult Expert Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Adult Expert Description <span className='text-red-500'>*</span></label>
            <textarea
              {...register('descriptions.Adult Expert', { required: 'Adult Expert description is required' })}
              rows={3}
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm border focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.descriptions?.['Adult Expert'] && (
              <p className="text-red-500 text-sm">{errors.descriptions['Adult Expert'].message}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transform duration-300 bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </>
            ) : (
              'Create Post'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
