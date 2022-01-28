import { useRef } from 'react';

import { makeStyles, Button, ButtonGroup } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import { UploadIcon, EditIcon } from 'icons';

const useStyles = makeStyles(theme => ({
  smallButton: {
    minWidth: 15,
    padding: theme.spacing(0.25),
    '& .MuiButton-startIcon': {
      margin: theme.spacing(0, 0.2),
    },
  },
  textButton: {
    '& .MuiButton-startIcon': {
      margin: theme.spacing(0, 0.2),
    },
  },
}));

export const FormFileUpload = ({
  value,
  hasChanged,
  onChange,
  commit,
  editText,
  uploadText,
  className,
  ...props
}: {
  value?: File;
  hasChanged: boolean;
  onChange: (f?: File) => void;
  commit?: (file: File) => Promise<any>;
  editText?: string;
  uploadText?: string;
  className?: string;
} & Omit<React.ComponentProps<'input'>, 'value' | 'onChange'>) => {
  const classes = useStyles();
  const fileInput = useRef<HTMLInputElement>(null);

  const buttonClass =
    !!editText || !!uploadText ? classes.textButton : classes.smallButton;

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
    <div className={className}>
      <ButtonGroup>
        {hasChanged && !!commit && (
          <Button
            onClick={onSave}
            startIcon={<UploadIcon />}
            size="small"
            className={buttonClass}
          >
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
            startIcon={<CloseIcon />}
            size="small"
            className={buttonClass}
          />
        )}
        {!hasChanged && (
          <Button
            onClick={() => fileInput.current?.click?.()}
            startIcon={<EditIcon />}
            size="small"
            className={buttonClass}
          >
            {editText}
          </Button>
        )}
      </ButtonGroup>
      <input
        ref={fileInput}
        onChange={onInputChange}
        style={{ display: 'none' }}
        type="file"
        {...props}
      />
    </div>
  );
};
