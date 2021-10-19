import { useState, useEffect } from 'react';

export const useImageUploader = (original: string) => {
  const [file, setFile] = useState<File | undefined>();

  useEffect(() => {
    setFile(undefined);
  }, [original]);

  return {
    imageUrl: (file && URL.createObjectURL(file)) ?? original,
    formFileUploadProps: {
      value: file,
      hasChanged: file !== undefined,
      onChange: (file?: File) => setFile(file),
    },
  };
};
