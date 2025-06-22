'use client'
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter, useSearchParams } from 'next/navigation'
import { createPost, updatePost, getPostById } from "@/apis/postDataApis";
import toast from 'react-hot-toast'
import { IoCloseCircle } from 'react-icons/io5';
import CustomImage from '@/components/Reusable/CustomImage/CustomImage';
import { useFormLanguage } from '@/context/FormLanguageContext';
import FormLangSwitcher from '@/components/FormLangSwitcher';
import JoditEditor from 'jodit-react';


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

  // Add local state for each editor field
  const [enAI, setEnAI] = useState("");
  const [enChild, setEnChild] = useState("");
  const [enTeenager, setEnTeenager] = useState("");
  const [enAdultExpert, setEnAdultExpert] = useState("");
  const [deAI, setDeAI] = useState("");
  const [deChild, setDeChild] = useState("");
  const [deTeenager, setDeTeenager] = useState("");
  const [deAdultExpert, setDeAdultExpert] = useState("");

  useEffect(() => {
    if (postId) {
      setStep(2);
    }
  }, [postId]);

  // Sync local state with tempData when language or edit mode changes
  useEffect(() => {
    setEnAI(tempData.descriptions_en.AI);
    setEnChild(tempData.descriptions_en.Child);
    setEnTeenager(tempData.descriptions_en.Teenager);
    setEnAdultExpert(tempData.descriptions_en["Adult Expert"]);
    setDeAI(tempData.descriptions_de.AI);
    setDeChild(tempData.descriptions_de.Child);
    setDeTeenager(tempData.descriptions_de.Teenager);
    setDeAdultExpert(tempData.descriptions_de["Adult Expert"]);
  }, [formLang, isEditMode, tempData]);

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

  // Handle editor changes with debouncing to prevent excessive re-renders
  const handleEditorChange = useCallback((content: string, field: DescriptionField, language: 'en' | 'de') => {
    if (language === 'en') {
      switch (field) {
        case 'AI':
          setEnAI(content);
          break;
        case 'Child':
          setEnChild(content);
          break;
        case 'Teenager':
          setEnTeenager(content);
          break;
        case 'Adult Expert':
          setEnAdultExpert(content);
          break;
      }
    } else {
      switch (field) {
        case 'AI':
          setDeAI(content);
          break;
        case 'Child':
          setDeChild(content);
          break;
        case 'Teenager':
          setDeTeenager(content);
          break;
        case 'Adult Expert':
          setDeAdultExpert(content);
          break;
      }
    }
  }, []);

  // Update tempData only when needed (not on every keystroke)
  // const updateTempData = useCallback(() => {
  //   setTempData(prev => ({
  //     ...prev,
  //     descriptions_en: {
  //       AI: enAI,
  //       Child: enChild,
  //       Teenager: enTeenager,
  //       "Adult Expert": enAdultExpert
  //     },
  //     descriptions_de: {
  //       AI: deAI,
  //       Child: deChild,
  //       Teenager: deTeenager,
  //       "Adult Expert": deAdultExpert
  //     }
  //   }));
  // }, [enAI, enChild, enTeenager, enAdultExpert, deAI, deChild, deTeenager, deAdultExpert]);

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

  // Update tempData and form value on submit
  const syncEditorStates = useCallback(() => {
    const updatedTempData = {
      descriptions_en: {
        AI: enAI,
        Child: enChild,
        Teenager: enTeenager,
        "Adult Expert": enAdultExpert
      },
      descriptions_de: {
        AI: deAI,
        Child: deChild,
        Teenager: deTeenager,
        "Adult Expert": deAdultExpert
      }
    };

    setTempData(updatedTempData);
    
    // Update form values
    setValue('descriptions_en', updatedTempData.descriptions_en);
    setValue('descriptions_de', updatedTempData.descriptions_de);
  }, [enAI, enChild, enTeenager, enAdultExpert, deAI, deChild, deTeenager, deAdultExpert, setValue]);

  const onSubmit = async (data: PostFormData) => {
    // Always sync editor states before submission
    syncEditorStates();
    
    try {
      if (step === 1 && !isEditMode) {
        // Store the current language data
        if (formLang === 'en') {
          setTempData(prev => ({
            ...prev,
            descriptions_en: {
              AI: enAI,
              Child: enChild,
              Teenager: enTeenager,
              "Adult Expert": enAdultExpert
            }
          }));
          setFormLang('de');
        } else {
          setTempData(prev => ({
            ...prev,
            descriptions_de: {
              AI: deAI,
              Child: deChild,
              Teenager: deTeenager,
              "Adult Expert": deAdultExpert
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

      // Use the latest tempData which contains all editor content
      const finalData = {
        descriptions_en: {
          AI: enAI,
          Child: enChild,
          Teenager: enTeenager,
          "Adult Expert": enAdultExpert
        },
        descriptions_de: {
          AI: deAI,
          Child: deChild,
          Teenager: deTeenager,
          "Adult Expert": deAdultExpert
        }
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

  // Create a memoized config object for Jodit to prevent re-renders
  const editorConfig = useMemo(() => ({
    readonly: false,
    height: 300,
    toolbar: true,
    spellcheck: false,
    language: "en",
    toolbarButtonSize: "middle" as const,
    toolbarAdaptive: false,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    defaultActionOnPaste: "insert_clear_html" as const,
    buttons: [
      'source', '|',
      'bold', 'italic', 'underline', 'strikethrough', '|',
      'superscript', 'subscript', '|',
      'ul', 'ol', 'indent', 'outdent', '|',
      'font', 'fontsize', 'brush', 'paragraph', '|',
      'align', '|',
      'table', 'link', '|',
      'undo', 'redo', '|',
      'eraser', 'fullsize'
    ],
    removeButtons: ['about'],
    uploader: {
      insertImageAsBase64URI: true
    },
    enter: 'p' as const,
    enterBlock: 'p' as const,
    list: {
      indent: 20,
      defaultStyle: 'circle',
    },
    controls: {
      ul: {
        list: {
          'default': 'Default',
          'circle': 'Circle',
          'disc': 'Disc',
          'square': 'Square',
        }
      },
      ol: {
        list: {
          'default': 'Default',
          '1': 'Numbered',
          'i': 'Roman',
          'a': 'Alphabetical',
        }
      },
      fontsize: {
        list: [
          '8',
          '10',
          '12',
          '14',
          '16',
          '18',
          '24',
          '36'
        ]
      }
    },
    cleanHTML: {
      fillEmptyParagraph: false,
      removeEmptyElements: false,
      removeSpans: false,
      replaceNBSP: false
    }
  }), []);

  // Memoized editor components to prevent unnecessary re-renders
  const renderEnglishEditors = useMemo(() => (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">English Descriptions</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700">AI Description</label>
        <JoditEditor
          config={editorConfig}
          value={enAI}
          onChange={(content) => handleEditorChange(content, 'AI', 'en')}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Child Description</label>
        <JoditEditor
          config={editorConfig}
          value={enChild}
          onChange={(content) => handleEditorChange(content, 'Child', 'en')}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Teenager Description</label>
        <JoditEditor
          config={editorConfig}
          value={enTeenager}
          onChange={(content) => handleEditorChange(content, 'Teenager', 'en')}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Adult Expert Description</label>
        <JoditEditor
          config={editorConfig}
          value={enAdultExpert}
          onChange={(content) => handleEditorChange(content, 'Adult Expert', 'en')}
        />
      </div>
    </div>
  ), [editorConfig, enAI, enChild, enTeenager, enAdultExpert, handleEditorChange]);

  const renderGermanEditors = useMemo(() => (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Deutsche Beschreibungen</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700">KI-Beschreibung</label>
        <JoditEditor
          config={editorConfig}
          value={deAI}
          onChange={(content) => handleEditorChange(content, 'AI', 'de')}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Kinder-Beschreibung</label>
        <JoditEditor
          config={editorConfig}
          value={deChild}
          onChange={(content) => handleEditorChange(content, 'Child', 'de')}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Jugendlichen-Beschreibung</label>
        <JoditEditor
          config={editorConfig}
          value={deTeenager}
          onChange={(content) => handleEditorChange(content, 'Teenager', 'de')}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Experten-Beschreibung</label>
        <JoditEditor
          config={editorConfig}
          value={deAdultExpert}
          onChange={(content) => handleEditorChange(content, 'Adult Expert', 'de')}
        />
      </div>
    </div>
  ), [editorConfig, deAI, deChild, deTeenager, deAdultExpert, handleEditorChange]);

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
          {formLang === 'en' ? renderEnglishEditors : renderGermanEditors}
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
