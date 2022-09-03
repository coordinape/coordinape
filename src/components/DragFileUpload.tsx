import { ChangeEvent, DragEvent, useRef, useState } from 'react';

import { useApeSnackbar } from '../hooks';
import { styled } from '../stitches.config';
import { Box } from '../ui/Box/Box';
import { Button } from '../ui/Button/Button';
import { Flex } from '../ui/Flex/Flex';
import { Text } from '../ui/Text/Text';

const HiddenInput = styled('input', {
  display: 'none',
});

const DragFileUpload = ({
  fileUploaded,
}: {
  fileUploaded: (fileUploaded: File) => void;
}) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { showError } = useApeSnackbar();

  const handleDrag = (
    e: DragEvent<HTMLDivElement> | DragEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // triggers when file is dropped
  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFiles(e.dataTransfer.files);
    }
  };

  // triggers when file is selected with click
  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      await handleFiles(e.target.files);
    }
  };

  // triggers the input when the button is clicked
  const onButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleFiles = async (fl: FileList) => {
    try {
      if (fl.length > 0) {
        const file = fl.item(0);
        if (file && file.name.split('.').pop() === 'csv') {
          fileUploaded(file);
        }
      }
    } catch (e: any) {
      showError('Error processing CSV ' + e.message ?? '');
    } finally {
      if (inputRef.current) {
        // reset the file input so same or different file can be selected
        inputRef.current.value = '';
      }
    }
  };

  return (
    <form onDragEnter={handleDrag} onSubmit={e => e.preventDefault()}>
      <HiddenInput
        ref={inputRef}
        accept=".csv, text/csv"
        type="file"
        id="input-file-upload"
        onChange={handleChange}
      />
      <label id="label-file-upload" htmlFor="input-file-upload">
        <Box
          css={{
            padding: '$xl',
            background: dragActive ? '$info' : 'white',
            borderRadius: '$3',
          }}
        >
          <Box css={{ textAlign: 'center', mb: '$md' }}>
            <Text inline>Drag and Drop your File Here or</Text>
          </Box>
          <Flex css={{ justifyContent: 'center' }}>
            <Button color="primary" onClick={onButtonClick}>
              Choose a File
            </Button>
          </Flex>
        </Box>
      </label>
      {dragActive && (
        <Box
          css={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '1rem',
            top: '0px',
            right: '0px',
            bottom: '0px',
            left: '0px',
          }}
          id="drag-file-element"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        ></Box>
      )}
    </form>
  );
};

export default DragFileUpload;
