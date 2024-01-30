import React, { useState } from 'react';

import { uploadImage } from 'features/images/upload';
import { MAX_IMAGE_BYTES_LENGTH_BASE64 } from 'lib/images';
import { useQueryClient } from 'react-query';

import { QUERY_KEY_COLINKS_NAV } from '../features/colinks/useCoLinksNavQuery';
import { QUERY_KEY_NAV } from '../features/nav';
import { LoadingModal } from 'components';
import { useToast } from 'hooks';
import { useFetchManifest } from 'hooks/legacyApi';
import { Check } from 'icons/__generated';
import { Avatar, Button, Flex, Text } from 'ui';
import { formatBytes } from 'utils/presentationHelpers';

const VALID_FILE_TYPES = ['image/jpg', 'image/jpeg', 'image/png'];

export const AvatarUpload = ({ original }: { original?: string }) => {
  const [uploadComplete, setUploadComplete] = useState<boolean>(false);
  const [avatarFile, setAvatarFile] = useState<File | undefined>(undefined);

  const [uploadedAvatarUrl, setUploadedAvatarUrl] = useState<
    undefined | string
  >(undefined);

  const fileInput = React.createRef<HTMLInputElement>();

  const { showError } = useToast();
  const fetchManifest = useFetchManifest();
  const queryClient = useQueryClient();

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
        try {
          await uploadImage({
            file: newAvatar,
            onSuccess: (resp: any) => {
              const newAvatar = resp.result.variants.find((s: string) =>
                s.match(/avatar$/)
              );
              setUploadedAvatarUrl(newAvatar);
            },
          });
        } catch (e: any) {
          showError(e);
          setAvatarFile(undefined);
          return;
        }

        //to be fixed when profile data is fetched separately
        await fetchManifest();
        queryClient.invalidateQueries([QUERY_KEY_NAV]);
        queryClient.invalidateQueries([QUERY_KEY_COLINKS_NAV]);
        setAvatarFile(undefined);
        setUploadComplete(true);
      }
    }
  };

  if (avatarFile) return <LoadingModal visible />;

  return (
    <Flex column alignItems="start" css={{ gap: '$xs' }}>
      <Flex
        alignItems="center"
        css={{
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
        <Flex
          alignItems="center"
          css={{
            gap: '$sm',
          }}
        >
          <Button
            id="upload-avatar-button"
            color="secondary"
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
      </Flex>
    </Flex>
  );
};
