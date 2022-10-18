import React, { useState } from 'react';

import { fileToBase64 } from 'lib/base64';
import { updateCircleLogo } from 'lib/gql/mutations';
import { MAX_IMAGE_BYTES_LENGTH_BASE64 } from 'lib/images';
import { useQueryClient } from 'react-query';

import { LoadingModal } from 'components';
import { useApeSnackbar } from 'hooks';
import { Check } from 'icons/__generated';
import { Avatar, Button, Flex, FormLabel, Text } from 'ui';
import { formatBytes } from 'utils/presentationHelpers';

import { QUERY_KEY_CIRCLE_SETTINGS } from './getCircleSettings';

const VALID_FILE_TYPES = ['image/jpg', 'image/jpeg', 'image/png'];

export const CircleLogoUpload = ({
  circleId,
  circleName,
  original,
}: {
  circleId: number;
  circleName: string;
  original?: string;
}) => {
  const [uploadComplete, setUploadComplete] = useState<boolean>(false);
  const [logoFile, setLogoFile] = useState<File | undefined>(undefined);

  const [uploadedLogoUrl, setUploadedLogoUrl] = useState<undefined | string>(
    undefined
  );

  const fileInput = React.createRef<HTMLInputElement>();

  const { showError } = useApeSnackbar();
  const queryClient = useQueryClient();

  const uploadLogo = async (circleId: number, logo: File) => {
    const image_data_base64 = await fileToBase64(logo);
    return await updateCircleLogo(circleId, image_data_base64);
  };

  const onInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      if (!VALID_FILE_TYPES.includes(e.target.files[0].type)) {
        showError(
          e.target.value +
            ' is invalid, allowed files are: ' +
            VALID_FILE_TYPES.join(', ')
        );
        setLogoFile(undefined);
      } else if (e.target.files[0].size > MAX_IMAGE_BYTES_LENGTH_BASE64) {
        showError(
          e.target.value +
            ' is too large, max file size is ' +
            formatBytes(MAX_IMAGE_BYTES_LENGTH_BASE64)
        );
      } else {
        setLogoFile(e.target.files[0]);
        const newLogo = e.target.files[0];
        if (newLogo === undefined) {
          return;
        }
        let response = undefined;
        try {
          response = await uploadLogo(circleId, newLogo);
        } catch (e: any) {
          showError(e);
          setLogoFile(undefined);
          return;
        }
        setUploadedLogoUrl(response.uploadCircleLogo?.circle.logo);

        //to be fixed when profile data is fetched separately
        queryClient.invalidateQueries(QUERY_KEY_CIRCLE_SETTINGS);
        setLogoFile(undefined);
        setUploadComplete(true);
      }
    }
  };

  if (logoFile) return <LoadingModal visible />;

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
          path={uploadedLogoUrl ? uploadedLogoUrl : original}
          name={circleName}
        />
        <FormLabel htmlFor="upload-logo-button" css={{ flexGrow: '1' }}>
          <Flex
            css={{
              alignItems: 'center',
              gap: '$sm',
            }}
          >
            <Button
              id="upload-logo-button"
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
                <Check /> Logo Saved!
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
