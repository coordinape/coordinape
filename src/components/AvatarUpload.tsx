import React, { useState } from 'react';

import { fileToBase64 } from 'lib/base64';
import { updateProfileAvatar } from 'lib/gql/mutations';
import { MAX_IMAGE_BYTES_LENGTH_BASE64 } from 'lib/images';

import { useApeSnackbar, useApiBase } from 'hooks';
import { Check } from 'icons/__generated';
import { Avatar, Button, Flex, FormLabel, Text } from 'ui';
import { formatBytes } from 'utils/presentationHelpers';

const VALID_FILE_TYPES = ['image/jpg', 'image/jpeg', 'image/png'];

export const AvatarUpload = ({ original }: { original?: string }) => {
  const [uploadComplete, setUploadComplete] = useState<boolean>(false);
  const [, setAvatarFile] = useState<File | undefined>(undefined);

  const [uploadedAvatarUrl, setUploadedAvatarUrl] = useState<
    undefined | string
  >(undefined);

  const fileInput = React.createRef<HTMLInputElement>();

  const { showError } = useApeSnackbar();
  const { fetchManifest } = useApiBase();

  const uploadAvatar = async (avatar: File) => {
    const image_data_base64 = await fileToBase64(avatar);
    return await updateProfileAvatar(image_data_base64);
  };

  const onInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      if (!VALID_FILE_TYPES.includes(e.target.files[0].type)) {
        showError(
          e.target.value +
            ' is invalid, allowed files are: ' +
            VALID_FILE_TYPES.join(', ')
        );
        setAvatarFile(undefined);
      } else if (e.target.files[0].size > MAX_IMAGE_BYTES_LENGTH_BASE64) {
        showError(
          e.target.value +
            ' is too large, max file size is ' +
            formatBytes(MAX_IMAGE_BYTES_LENGTH_BASE64)
        );
      } else {
        setAvatarFile(e.target.files[0]);
        const newAvatar = e.target.files[0];
        if (newAvatar === undefined) {
          return;
        }
        let response = undefined;
        try {
          response = await uploadAvatar(newAvatar);
        } catch (e: any) {
          showError(e);
          setAvatarFile(undefined);
          return;
        }
        setUploadedAvatarUrl(response.uploadProfileAvatar?.profile.avatar);

        //to be fixed when profile data is fetched separately
        await fetchManifest();
        setAvatarFile(undefined);
        setUploadComplete(true);
      }
    }
  };

  return (
    <Flex column css={{ alignItems: 'flex-start', gap: '$xs' }}>
      <Flex
        css={{
          alignItems: 'center',
          gap: '$sm',
          width: '100%',
        }}
      >
        <Avatar
          size="medium"
          margin="none"
          path={uploadedAvatarUrl ? uploadedAvatarUrl : original}
          name={'me'}
        />
        <FormLabel htmlFor="upload-avatar-button" css={{ flexGrow: '1' }}>
          <Flex
            css={{
              alignItems: 'center',
              gap: '$sm',
            }}
          >
            <Button
              id="upload-avatar-button"
              color="primary"
              outlined
              as="span"
              css={{
                display: 'inline-flex',
              }}
              onClick={() => {
                setUploadComplete(false);
                fileInput.current?.click?.();
              }}
            >
              Select File
            </Button>
            {uploadComplete && (
              <Text
                size="small"
                color="neutral"
                css={{
                  gap: '$xs',
                }}
              >
                <Check /> Avatar Saved!
              </Text>
            )}
            <input
              ref={fileInput}
              accept={VALID_FILE_TYPES.join(', ')}
              onChange={onInputChange}
              style={{ display: 'none' }}
              type="file"
            />
          </Flex>
        </FormLabel>
      </Flex>
    </Flex>
  );
};
