export function fileToBase64(file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (reader.result) {
        if (typeof reader.result === 'string') {
          // strip the DataURL preamble
          resolve(reader.result.split(',')[1]);
        } else {
          reject('unable to get base64 string from file');
        }
      } else {
        reject("file is empty or couldn't read");
      }
    };
    reader.onerror = error => reject(error);
  });
}
