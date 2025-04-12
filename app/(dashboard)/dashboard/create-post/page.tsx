'use client'
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter, useSearchParams } from 'next/navigation'
import { createPost, updatePost, getPostById } from "@/apis/postDataApis";
import toast from 'react-hot-toast'
import { IoCloseCircle } from 'react-icons/io5';
import CustomImage from '@/components/Reusable/CustomImage/CustomImage';
import { useFormLanguage } from '@/context/FormLanguageContext';
import FormLangSwitcher from '@/components/FormLangSwitcher';
import { Editor } from '@tinymce/tinymce-react';


interface PostFormData {
  image: File | null;
  descriptions_en: {
    AI: string;
    Child: string;
    Teenager: string;
    "Adult Expert": string;
  } | null;
  descriptions_de: {
    AI: string;
    Child: string;
    Teenager: string;
    "Adult Expert": string;
  } | null;
}

interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
  message?: string;
}

type DescriptionField = 'AI' | 'Child' | 'Teenager' | 'Adult Expert';


export default function CreatePost() {
  const { formLang, setFormLang } = useFormLanguage();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<PostFormData>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [tempData, setTempData] = useState<{
    descriptions_en: {
      AI: string;
      Child: string;
      Teenager: string;
      "Adult Expert": string;
    };
    descriptions_de: {
      AI: string;
      Child: string;
      Teenager: string;
      "Adult Expert": string;
    };
  }>({
    descriptions_en: {
      AI: '',
      Child: '',
      Teenager: '',
      "Adult Expert": ''
    },
    descriptions_de: {
      AI: '',
      Child: '',
      Teenager: '',
      "Adult Expert": ''
    }
  });
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const postId = searchParams.get('id');
  const [isEditMode, setIsEditMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // If we're in edit mode, we should skip the step system
    if (postId) {
      setStep(2); // Skip to final step for editing
    }
  }, [postId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setValue('image', file);
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

  const handleEditorChange = React.useCallback(
    (content: string, editor: unknown, field: DescriptionField) => {
      setTempData(prev => {
        const newData = { ...prev };
        if (formLang === 'en') {
          newData.descriptions_en = {
            ...newData.descriptions_en,
            [field]: content
          };
        } else {
          newData.descriptions_de = {
            ...newData.descriptions_de,
            [field]: content
          };
        }
        return newData;
      });

      // Update the form value
      if (formLang === 'en') {
        setValue(`descriptions_en.${field}`, content, { shouldDirty: true });
      } else {
        setValue(`descriptions_de.${field}`, content, { shouldDirty: true });
      }
    },
    [formLang, setValue]
  );

  useEffect(() => {
    const fetchPost = async () => {
      if (postId) {
        try {
          setIsEditMode(true);
          const response = await getPostById(postId);

          if (response.success) {
            const post = response.post;

            // Parse English descriptions
            let descriptions_en = {
              AI: '',
              Child: '',
              Teenager: '',
              "Adult Expert": ''
            };

            // Parse German descriptions
            let descriptions_de = {
              AI: '',
              Child: '',
              Teenager: '',
              "Adult Expert": ''
            };

            // Handle English descriptions
            if (post.descriptions_en) {
              descriptions_en = typeof post.descriptions_en === 'string'
                ? JSON.parse(post.descriptions_en)
                : post.descriptions_en;
            }

            // Handle German descriptions
            if (post.descriptions_de) {
              descriptions_de = typeof post.descriptions_de === 'string'
                ? JSON.parse(post.descriptions_de)
                : post.descriptions_de;
            }

            // Update the form data and temp data
            setTempData({
              descriptions_en,
              descriptions_de
            });

            // Set image preview if exists
            if (post.image) {
              const imageUrl = post.image.startsWith('http')
                ? post.image
                : `${process.env.NEXT_PUBLIC_API_ENDPOINT}/uploads/${post.image}`;
              setSelectedImage(imageUrl);
            }
          }
        } catch (error) {
          console.error("Error fetching post:", error);
          if (error && typeof error === 'object' && 'message' in error) {
            toast.error(error.message as string || 'Failed to fetch post');
          } else {
            toast.error('Failed to fetch post');
          }
        }
      }
    };

    fetchPost();
  }, [postId]);

  const onSubmit = async (data: PostFormData) => {
    try {
      if (step === 1 && !isEditMode) {
        // Store the current language data
        if (formLang === 'en') {
          setTempData(prev => ({
            ...prev,
            descriptions_en: data.descriptions_en || {
              AI: '',
              Child: '',
              Teenager: '',
              "Adult Expert": ''
            }
          }));
          setFormLang('de');
        } else {
          setTempData(prev => ({
            ...prev,
            descriptions_de: data.descriptions_de || {
              AI: '',
              Child: '',
              Teenager: '',
              "Adult Expert": ''
            }
          }));
          setFormLang('en');
        }
        setStep(2);
        return;
      }

      setIsSubmitting(true);

      // Validate image requirement for new posts
      if (!data.image && !isEditMode && !selectedImage) {
        toast.error('Please select an image');
        setIsSubmitting(false);
        return;
      }

      // Combine data from both languages
      const finalData = {
        descriptions_en: tempData.descriptions_en,
        descriptions_de: tempData.descriptions_de
      };

      if (isEditMode && postId) {
        // For update, only send the image if a new one was selected
        const imageToSend = data.image instanceof File ? data.image : undefined;
        const response = await updatePost(postId, finalData, imageToSend);

        if (response.success) {
          toast.success('Post updated successfully');
          router.push('/dashboard/all-posts');
        }
      } else {
        // For create, image is required
        const response = await createPost(finalData, data.image!);
        if (response.success) {
          toast.success(response.message);
          router.push('/dashboard/all-posts');
        }
      }
    } catch (error: unknown) {
      const err = error as ApiError;
      if (err.response?.status === 401) {
        toast.error('Session expired. Please login again.');
      } else {
        toast.error(err.message || `Failed to ${isEditMode ? 'update' : 'create'} post`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className='flex flex-col md:flex-row  gap-5 mb-10 md:mb-0 justify-between items-center'>
        <h1 className="text-xl md:text-2xl font-bold mb-6">
          {isEditMode
            ? 'Update Post'
            : `Create New Post - Step ${step}: ${formLang === 'en' ? 'English' : 'German'}`}
        </h1>
        <FormLangSwitcher />
      </div>
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
                  <CustomImage width={200} height={200} src={selectedImage} alt="Preview" className="mx-auto h-64 w-auto" />
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
                {...register('image', {
                  required: !isEditMode ? 'Image is required' : false
                })}
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

        {/* Description Fields */}
        <div className="space-y-4">
          {formLang === 'en' ? (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">English Descriptions</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700">AI Description</label>
                <Editor
                  apiKey="87cg1pufq9d14fzlappe5kgmjxsm6u6zsgwvxigogwe80ogu"
                  init={{
                    height: 300,
                    menubar: false,
                    plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                      'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'],
                    toolbar: 'undo redo | blocks | bold italic | ' +
                      'alignleft aligncenter alignright alignjustify | ' +
                      'bullist numlist outdent indent | removeformat | help'
                  }}
                  value={tempData.descriptions_en.AI}
                  onEditorChange={(content, editor) => handleEditorChange(content, editor, 'AI')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Child Description</label>
                <Editor
                  apiKey="87cg1pufq9d14fzlappe5kgmjxsm6u6zsgwvxigogwe80ogu"
                  init={{
                    height: 300,
                    menubar: false,
                    plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                      'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'],
                    toolbar: 'undo redo | blocks | bold italic | ' +
                      'alignleft aligncenter alignright alignjustify | ' +
                      'bullist numlist outdent indent | removeformat | help'
                  }}
                  value={tempData.descriptions_en.Child}
                  onEditorChange={(content, editor) => handleEditorChange(content, editor, 'Child')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Teenager Description</label>
                <Editor
                  apiKey="87cg1pufq9d14fzlappe5kgmjxsm6u6zsgwvxigogwe80ogu"
                  init={{
                    height: 300,
                    menubar: false,
                    plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                      'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'],
                    toolbar: 'undo redo | blocks | bold italic | ' +
                      'alignleft aligncenter alignright alignjustify | ' +
                      'bullist numlist outdent indent | removeformat | help'
                  }}
                  value={tempData.descriptions_en.Teenager}
                  onEditorChange={(content, editor) => handleEditorChange(content, editor, 'Teenager')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Adult Expert Description</label>
                <Editor
                  apiKey="87cg1pufq9d14fzlappe5kgmjxsm6u6zsgwvxigogwe80ogu"
                  init={{
                    height: 300,
                    menubar: false,
                    plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                      'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'],
                    toolbar: 'undo redo | blocks | bold italic | ' +
                      'alignleft aligncenter alignright alignjustify | ' +
                      'bullist numlist outdent indent | removeformat | help'
                  }}
                  value={tempData.descriptions_en["Adult Expert"]}
                  onEditorChange={(content, editor) => handleEditorChange(content, editor, "Adult Expert")}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Deutsche Beschreibungen</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700">KI-Beschreibung</label>
                <Editor
                  apiKey="87cg1pufq9d14fzlappe5kgmjxsm6u6zsgwvxigogwe80ogu"
                  init={{
                    height: 300,
                    menubar: false,
                    plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                      'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'],
                    toolbar: 'undo redo | blocks | bold italic | ' +
                      'alignleft aligncenter alignright alignjustify | ' +
                      'bullist numlist outdent indent | removeformat | help'
                  }}
                  value={tempData.descriptions_de.AI}
                  onEditorChange={(content, editor) => handleEditorChange(content, editor, 'AI')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Kinder-Beschreibung</label>
                <Editor
                  apiKey="87cg1pufq9d14fzlappe5kgmjxsm6u6zsgwvxigogwe80ogu"
                  init={{
                    height: 300,
                    menubar: false,
                    plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                      'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'],
                    toolbar: 'undo redo | blocks | bold italic | ' +
                      'alignleft aligncenter alignright alignjustify | ' +
                      'bullist numlist outdent indent | removeformat | help'
                  }}
                  value={tempData.descriptions_de.Child}
                  onEditorChange={(content, editor) => handleEditorChange(content, editor, 'Child')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Jugendlichen-Beschreibung</label>
                <Editor
                  apiKey="87cg1pufq9d14fzlappe5kgmjxsm6u6zsgwvxigogwe80ogu"
                  init={{
                    height: 300,
                    menubar: false,
                    plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                      'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'],
                    toolbar: 'undo redo | blocks | bold italic | ' +
                      'alignleft aligncenter alignright alignjustify | ' +
                      'bullist numlist outdent indent | removeformat | help'
                  }}
                  value={tempData.descriptions_de.Teenager}
                  onEditorChange={(content, editor) => handleEditorChange(content, editor, 'Teenager')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Experten-Beschreibung</label>
                <Editor
                  apiKey="87cg1pufq9d14fzlappe5kgmjxsm6u6zsgwvxigogwe80ogu"
                  init={{
                    height: 300,
                    menubar: false,
                    plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                      'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'],
                    toolbar: 'undo redo | blocks | bold italic | ' +
                      'alignleft aligncenter alignright alignjustify | ' +
                      'bullist numlist outdent indent | removeformat | help'
                  }}
                  value={tempData.descriptions_de["Adult Expert"]}
                  onEditorChange={(content, editor) => handleEditorChange(content, editor, "Adult Expert")}
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors
              ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : isEditMode ? (
              'Update Post'
            ) : step === 1 ? (
              'Next'
            ) : (
              'Create Post'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
