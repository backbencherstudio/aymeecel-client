import { useEffect } from 'react';

const Editor = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      tinymce.init({
        selector: 'textarea#editor',
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | blocks | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | help',
        // Add your API key here if using the cloud version
        // api_key: 'your-api-key-here',
      });
    }
  }, []);

  return <textarea id="editor"></textarea>;
};

export default Editor; 