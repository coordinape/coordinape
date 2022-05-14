import React, { useEffect } from 'react';

import { fileToBase64 } from 'lib/base64';
import { updateOrgLogo } from 'lib/gql/mutations';

import CloseIcon from '@material-ui/icons/Close';

import { useImageUploader, useApeSnackbar } from 'hooks';
import { UploadIcon } from 'icons';
import { Avatar, Box, Button } from 'ui';
import { getAvatarPathWithFallback } from 'utils/domain';

const VALID_FILE_TYPES = ['image/jp', 'image/jpeg', 'image/png'];

const centerCropImage = (url: string) => {
  return new Promise<HTMLCanvasElement>(resolve => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = url;

    img.onload = () => {
      const aspectRation = img.naturalWidth / img.naturalHeight;
      let cropWidth = img.naturalWidth;
      let cropHeight = img.naturalHeight;
      if (aspectRation > 1) {
        cropWidth = cropHeight;
      } else {
        cropHeight = cropWidth;
      }

      const dX = (cropWidth - img.naturalWidth) / 2;
      const dY = (cropHeight - img.naturalHeight) / 2;

      const canvas = document.createElement('canvas');

      canvas.width = cropWidth;
      canvas.height = cropHeight;

      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, dX, dY);
      resolve(canvas);
    };
  });
};

export const OrgLogoUpload = ({
  commit,
  name,
  original,
  id,
  isAdmin,
}: {
  commit: (isupdated: boolean) => void;
  id: number;
  name: string;
  original?: string;
  isAdmin: boolean;
}) => {
  const fileInput = React.createRef<HTMLInputElement>();

  const { imageUrl, formFileUploadProps } = useImageUploader(
    getAvatarPathWithFallback(original, name)
  );

  const { showError } = useApeSnackbar();

  const onInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      if (!VALID_FILE_TYPES.includes(e.target.files[0].type)) {
        showError(
          e.target.value +
            ' is invalid, allowed files are: ' +
            VALID_FILE_TYPES.join(', ')
        );
        formFileUploadProps.onChange(undefined);
      } else {
        formFileUploadProps.onChange(e.target.files[0]);
      }
    }
  };
  const uploadLogo = async (orgId: number, logo: File) => {
    const image_data_base64 = await fileToBase64(logo);
    await updateOrgLogo(orgId, image_data_base64);
  };

  const onSave = async () => {
    commit(true);
    if (formFileUploadProps.value === undefined || !commit) {
      return;
    }
    await uploadLogo(id, formFileUploadProps.value);
    commit(false);
  };

  useEffect(() => {
    const cropImage = async (imageUrl: string) => {
      if (formFileUploadProps.value) {
        const canvas = await centerCropImage(imageUrl);
        const data = canvas.toDataURL();
        const blobBin = atob(data.split(',')[1]);
        const mimeString = data.split(',')[0].split(':')[1].split(';')[0];
        const array = [];
        for (let i = 0; i < blobBin.length; i++) {
          array.push(blobBin.charCodeAt(i));
        }
        const blob = new Blob([new Uint8Array(array)], { type: mimeString });
        const file = new File([blob], formFileUploadProps.value.name);
        formFileUploadProps.onChange(file);
      }
    };
    if (formFileUploadProps.value) {
      cropImage(imageUrl).catch(console.warn);
    }
  }, [formFileUploadProps.hasChanged]);

  return (
    <Box css={{ position: 'relative' }}>
      <Avatar
        path={imageUrl}
        orgLogo={true}
        name={name}
        onClick={
          isAdmin && !formFileUploadProps.hasChanged
            ? () => fileInput.current?.click?.()
            : undefined
        }
      />
      <Box css={{ position: 'absolute', bottom: '0', right: '0' }}>
        <Box css={{ display: 'flex', flexDirection: 'row' }}>
          {formFileUploadProps.hasChanged && !!commit && (
            <Button onClick={onSave} size="smaller">
              {<UploadIcon />}
            </Button>
          )}
          {formFileUploadProps.hasChanged && (
            <Button
              onClick={() => {
                formFileUploadProps.onChange(undefined);
                // This clears the fileInput so that if the user chooses the same file again, onChange still fires
                if (fileInput.current) {
                  fileInput.current.value = '';
                }
              }}
              size="smaller"
            >
              {<CloseIcon />}
            </Button>
          )}
        </Box>
        <input
          ref={fileInput}
          accept={VALID_FILE_TYPES.join(', ')}
          onChange={onInputChange}
          style={{ display: 'none' }}
          type="file"
        />
      </Box>
    </Box>
  );
};
