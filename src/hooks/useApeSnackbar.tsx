import { toast } from 'react-toastify';

import { FlattenedGQLError } from '../common-lib/errorHandling';
import { AlertTriangle, Check, Info, X } from 'icons/__generated';
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
        <AlertTriangle css={{ color: '$errorColor' }} />
      </Flex>
    </>
  );
};
const InfoIcon = () => {
  return <Info css={{ color: 'var(--colors-text)' }} />;
};

// boolean | ((props: CloseButtonProps) => ReactNode) | ReactElement<CloseButtonProps, string | JSXElementConstructor<any>> | undefined'
const CloseButton = (closeToast: any) => {
  return (
    <Button css={{ background: 'none' }} as="span" onClick={() => closeToast()}>
      <X />
    </Button>
  );
};

export const useToast = () => {
  return {
    showInfo: (message: string) => toast.info(message, { icon: InfoIcon }),
    showSuccess: (message: string) =>
      toast.success(message, {
        icon: SuccessIcon,
        closeButton: CloseButton,
      }),
    showError: (error: any) =>
      toast.error(displayError(error), {
        icon: ErrorIcon,
        closeButton: CloseButton,
      }),
  };
};
