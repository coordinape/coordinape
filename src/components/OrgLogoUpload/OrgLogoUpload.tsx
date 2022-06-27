import React, { useState } from 'react';

import { fileToBase64 } from 'lib/base64';
import { updateOrgLogo } from 'lib/gql/mutations';

import CloseIcon from '@material-ui/icons/Close';

import { LoadingModal } from 'components';
import { useImageUploader, useApeSnackbar } from 'hooks';
import { DeprecatedUploadIcon, EditIcon } from 'icons';
import { Avatar, Box, Button } from 'ui';
import { getAvatarPathWithFallback } from 'utils/domain';
import { normalizeError } from 'utils/reporting';

const VALID_FILE_TYPES = ['image/jpg', 'image/jpeg', 'image/png'];

export const OrgLogoUpload = ({
  name,
  original,
  id,
  isAdmin,
}: {
  id: number;
  name: string;
  original?: string;
  isAdmin: boolean;
}) => {
  const fileInput = React.createRef<HTMLInputElement>();

  const { imageUrl, formFileUploadProps } = useImageUploader(
    getAvatarPathWithFallback(original, name)
  );

  const [uploadedLogoUrl, setUploadedLogoUrl] = useState<undefined | string>(
    undefined
  );
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

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
    return await updateOrgLogo(orgId, image_data_base64);
  };

  const onSave = async () => {
    setIsUploadingLogo(true);
    if (formFileUploadProps.value === undefined) {
      setIsUploadingLogo(false);
      return;
    }
    let response = undefined;
    try {
      response = await uploadLogo(id, formFileUploadProps.value);
    } catch (e: any) {
      setIsUploadingLogo(false);
      showError(normalizeError(e).message);
      formFileUploadProps.onChange(undefined);
      return;
    }
    setIsUploadingLogo(false);
    setUploadedLogoUrl(response.uploadOrgLogo?.org.logo);
    formFileUploadProps.onChange(undefined);
  };

  return (
    <Box css={{ position: 'relative' }}>
      <Avatar
        path={
          uploadedLogoUrl && !formFileUploadProps.hasChanged
            ? uploadedLogoUrl
            : imageUrl
        }
        name={name}
      />
      <Box css={{ position: 'absolute', bottom: '0', right: '0' }}>
        {isUploadingLogo && (
          <Box>
            <LoadingModal visible />
          </Box>
        )}
        {!isUploadingLogo && (
          <Box css={{ display: 'flex', flexDirection: 'row' }}>
            {formFileUploadProps.hasChanged && (
              <Button onClick={onSave} size="smallIcon">
                {<DeprecatedUploadIcon />}
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
                size="smallIcon"
              >
                {<CloseIcon />}
              </Button>
            )}
            {isAdmin && !formFileUploadProps.hasChanged && (
              <Button
                onClick={
                  !formFileUploadProps.hasChanged
                    ? () => fileInput.current?.click?.()
                    : undefined
                }
                size="smallIcon"
              >
                <EditIcon />
              </Button>
            )}
          </Box>
        )}
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
