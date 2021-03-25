export function resizeImage(
  file: File,
  maxWidth: number,
  maxHeight: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = URL.createObjectURL(file);
    image.onload = () => {
      const width = image.width;
      const height = image.height;

      if (width <= maxWidth && height <= maxHeight) {
        resolve(file);
      }

      let newWidth;
      let newHeight;

      if (width > height) {
        newHeight = height * (maxWidth / width);
        newWidth = maxWidth;
      } else {
        newWidth = width * (maxHeight / height);
        newHeight = maxHeight;
      }

      const canvas = document.createElement('canvas');
      canvas.width = newWidth;
      canvas.height = newHeight;

      const context = canvas.getContext('2d');

      context?.drawImage(image, 0, 0, newWidth, newHeight);

      canvas.toBlob(resolve as any, file.type);
    };
    image.onerror = reject;
  });
}

export const blobToFile = (theBlob: Blob, fileName: string): File => {
  const b: any = theBlob;
  b.lastModifiedDate = new Date();
  b.name = fileName;

  return <File>theBlob;
};
