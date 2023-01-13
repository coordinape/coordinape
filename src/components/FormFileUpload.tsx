import { useRef } from 'react';

import { CSS } from 'stitches.config';

import { X, Share, Edit3 } from 'icons/__generated';
import { Box, Button, Flex } from 'ui';

export const FormFileUpload = ({
  value,
  hasChanged,
  onChange,
  commit,
  editText,
  uploadText,
  css,
  ...props
}: {
  value?: File;
  hasChanged: boolean;
  onChange: (f?: File) => void;
  commit?: (file: File) => Promise<any>;
  editText?: string;
  uploadText?: string;
  css?: CSS;
} & Omit<React.ComponentProps<'input'>, 'value' | 'onChange'>) => {
  const fileInput = useRef<HTMLInputElement>(null);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      onChange(e.target.files[0]);
    }
  };

  const onSave = async () => {
    if (value === undefined || !commit) {
      return;
    }
    await commit(value);
  };

  return (
    <Box css={css}>
      <Flex>
        {hasChanged && !!commit && (
          <Button onClick={onSave} css={{ borderRadius: '$3 0 0 $3' }}>
            <Share />
            {uploadText}
          </Button>
        )}
        {hasChanged && (
          <Button
            onClick={() => {
              onChange(undefined);
              // This clears the fileInput so that if the user chooses the same file again, onChange still fires
              if (fileInput.current) {
                fileInput.current.value = '';
              }
            }}
            css={{ borderRadius: '0 $3 $3  0', ml: '1px ' }}
          >
            <X />
          </Button>
        )}
        {!hasChanged && (
          <Button onClick={() => fileInput.current?.click?.()} color="primary">
            <Edit3 css={{ mr: '$xs' }} />
            {editText}
          </Button>
        )}
      </Flex>
      <input
        ref={fileInput}
        onChange={onInputChange}
        style={{ display: 'none' }}
        type="file"
        {...props}
      />
    </Box>
  );
};
