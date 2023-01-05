import {
  CloseButtonProps,
  toast,
  ToastContent,
  ToastOptions,
} from 'react-toastify';

import { FlattenedGQLError } from '../common-lib/errorHandling';
import { Bell, Check, Loader, X } from 'icons/__generated';
import { Button, Flex } from 'ui';
import { normalizeError } from 'utils/reporting';

const defaultErrorMessage = 'Something went wrong.';

const displayError = (error: any) => {
  if (!error) return defaultErrorMessage;
  if (typeof error === 'string') return error;
  const data = error.response?.data;
  error = normalizeError(error);

  if (error instanceof FlattenedGQLError) {
    return error.userDisplayableString();
  }

  return data?.message || error.message || defaultErrorMessage;
};

const SuccessIcon = () => {
  return (
    <>
      <Flex
        css={{
          backgroundColor: '$successIconBackground',
          borderRadius: '4px',
          padding: '4px',
        }}
      >
        <Check boldstroke css={{ color: '$successColor' }} />
      </Flex>
    </>
  );
};
const ErrorIcon = () => {
  return (
    <>
      <Flex
        css={{
          backgroundColor: '$errorIconBackground',
          borderRadius: '4px',
          padding: '4px',
        }}
      >
        <Bell boldstroke css={{ color: '$errorColor' }} />
      </Flex>
    </>
  );
};
const InfoIcon = () => {
  return <Loader css={{ color: 'var(--colors-text)' }} />;
};

const CloseButton = (props: CloseButtonProps) => {
  return (
    <Button
      css={{
        background: 'none',
        padding: 0,
      }}
      as="span"
      onClick={(e: React.MouseEvent<HTMLElement>) => props.closeToast(e)}
    >
      <X />
    </Button>
  );
};

/*
Use the approproate method for the type of interaction you need to communicate:
  showSucess: something has succeeded or completed successfully.
  showError: something has failed.
  showDefault: general notifications, including anything that's in-progress.
*/
export const useToast = () => {
  return {
    // rename to showDefault: ...
    showDefault: (content: ToastContent, props: ToastOptions = {}) =>
      toast.info(content, {
        icon: InfoIcon,
        closeButton: CloseButton,
        ...props,
      }),

    showSuccess: (content: ToastContent, props: ToastOptions = {}) =>
      toast.success(content, {
        icon: SuccessIcon,
        closeButton: CloseButton,
        ...props,
      }),
    showError: (content: ToastContent | unknown, props: ToastOptions = {}) =>
      toast.error(displayError(content), {
        icon: ErrorIcon,
        closeButton: CloseButton,
        autoClose: false,
        ...props,
      }),
  };
};
