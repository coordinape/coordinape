import React, { useState } from 'react';

import { fileToBase64 } from 'lib/base64';
import { updateOrgLogo } from 'lib/gql/mutations';

import { LoadingModal } from 'components/index';
import { useImageUploader, useApeSnackbar } from 'hooks';
// import { Settings } from 'icons';
import { Settings } from 'icons/__generated';
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
    <Box
      css={{
        position: 'relative',
        '&:hover': {
          '*': {
            visibility: 'visible',
          },
        },
      }}
    >
      <Avatar
        path={
          uploadedLogoUrl && !formFileUploadProps.hasChanged
            ? uploadedLogoUrl
            : imageUrl
        }
        name={name}
      />
      <Box
        css={
          formFileUploadProps.hasChanged
            ? {
                position: 'absolute',
                top: 0,
                left: 0,
                background: '$white',
                boxShadow: '$heavy',
                borderRadius: '$3',
                paddingLeft: 'calc($3xl + $xs)',
                height: 'calc($3xl + $xs)',
                display: 'flex',
                alignItems: 'center',
                pr: '$md',
              }
            : {}
        }
      >
        {isUploadingLogo && (
          <Box>
            <LoadingModal visible />
          </Box>
        )}
        {!isUploadingLogo && (
          <Box css={{ display: 'flex', flexDirection: 'row' }}>
            {formFileUploadProps.hasChanged && (
              <Button
                onClick={onSave}
                size="small"
                color="primary"
                outlined
                css={{ mr: '$xs' }}
              >
                Upload
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
                size="small"
                color="destructive"
                outlined
                css={{ background: '$white' }}
              >
                Cancel
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
                css={{
                  visibility: 'hidden',
                  color: '$secondaryText',
                  background: '$white',
                  position: 'absolute',
                  fontSize: '$large',
                  left: 0,
                  top: 0,
                  zIndex: 2,
                  '&:hover': {
                    color: '$primary',
                    visibility: 'visible',
                  },
                  '@sm': {
                    visibility: 'visible',
                  },
                }}
              >
                <Settings />
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
