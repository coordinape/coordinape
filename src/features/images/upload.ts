import { Dispatch } from 'react';

import { uuidv4 } from 'common-lib/uuid';
import { client } from 'lib/gql/client';

const genUploadLink = async () => {
  // mutation to generate upload link
  const { generateOneTimeUpload } = await client.mutate(
    {
      generateOneTimeUpload: { result: { upload_url: true }, errors: true },
    },
    {
      operationName: 'generateOneTimeUpload',
    }
  );
  const link = generateOneTimeUpload?.result?.upload_url;
  if (link) {
    return link;
  } else
    throw new Error(
      'Error generating upload link: ' + generateOneTimeUpload?.errors
    );
};

export const uploadImage = async ({
  file,
  setUploadProgress,
  onSuccess,
}: {
  file: File;
  setUploadProgress?: Dispatch<React.SetStateAction<number>>;
  onSuccess?: (respJson: any) => void;
}) => {
  const upload_url = await genUploadLink();
  const ending = file.name.split('.').slice(-1);
  const filename = uuidv4() + '.' + ending;

  const formData = new FormData();
  formData.append('file', file, filename);

  const xhr = new XMLHttpRequest();
  xhr.open('POST', upload_url, true);

  xhr.upload.onprogress = event => {
    if (event.lengthComputable) {
      const progress = (event.loaded / event.total) * 100;
      setUploadProgress && setUploadProgress(progress);
    }
  };

  xhr.onload = () => {
    if (xhr.status === 200) {
      const resp: unknown = JSON.parse(xhr.responseText);
      onSuccess && onSuccess(resp);
    } else {
      console.error('Upload failed:', xhr.responseText);
    }
  };

  const promise = new Promise((resolve, reject) => {
    xhr.onloadend = () => resolve(xhr.responseText);
    xhr.onerror = () => reject(xhr.statusText);
  });

  xhr.send(formData);
  await promise;
};
