import { useState } from 'react';

import copy from 'copy-to-clipboard';
import {
  CloseButtonProps,
  toast,
  ToastContent,
  ToastOptions,
} from 'react-toastify';

import { FlattenedGQLError } from '../common-lib/errorHandling';
import isFeatureEnabled from 'config/features';
import { Bell, Check, CoMark, Copy, Loader, X } from 'icons/__generated';
import { Text, Box, Button, Flex } from 'ui';
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
    <Flex
      css={{
        backgroundColor: '$toastifyIconBackgroundSuccess',
        borderRadius: '$1',
        p: '$xs',
      }}
    >
      <Check boldstroke css={{ color: '$successColor', padding: '1px' }} />
    </Flex>
  );
};
const ErrorIcon = () => {
  return (
    <Flex
      css={{
        backgroundColor: '$toastifyIconBackgroundError',
        borderRadius: '$1',
        p: '$xs',
      }}
    >
      <Bell boldstroke css={{ color: '$errorColor' }} />
    </Flex>
  );
};
const DefaultIcon = () => {
  if (isFeatureEnabled('theme_switcher')) {
    return (
      <Flex
        css={{
          backgroundColor: '$coMarkBackground',
          borderRadius: '999px',
          alignItems: 'center',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        <CoMark
          nostroke
          css={{
            width: '34px',
            height: '34px',
            transform: 'scale(1.35) translate(1.5px, 1px)',
            flexShrink: 0,
          }}
        />
      </Flex>
    );
  } else {
    return (
      <Flex
        css={{
          backgroundColor: '$surface',
          borderRadius: '$1',
          p: '$xs',
          flexShrink: 0,
        }}
      >
        <Loader boldstroke css={{ color: '$text' }} />
      </Flex>
    );
  }
};

const CloseButton = (props: CloseButtonProps) => {
  return (
    <Button
      color="transparent"
      className="toastCloseButton"
      tabIndex={0}
      css={{
        padding: 0,
        minHeight: '0',
      }}
      onClick={(e: React.MouseEvent<HTMLElement>) => {
        props.closeToast(e);
      }}
    >
      <X css={{ mr: '0 !important' }} />
    </Button>
  );
};

const ToastBody = ({ content }: { content: string }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const text = content?.toString() || '';
  const copyContent = () => {
    copy(text);
    setCopied(true);
  };
  return (
    <Box
      css={{ cursor: 'pointer' }}
      className="toastContent"
      onClick={(e: React.MouseEvent<HTMLElement>) => {
        copyContent();
        e.preventDefault();
      }}
    >
      {content}{' '}
      {copied ? (
        <>
          <Check css={{ mx: '$xxs', alignSelf: 'center' }} />
          <Text inline semibold>
            copied
          </Text>
        </>
      ) : (
        <Copy css={{ ml: '$xxs', alignSelf: 'center' }} />
      )}
    </Box>
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
      toast(content, {
        icon: DefaultIcon,
        closeButton: CloseButton,
        autoClose: false,
        ...props,
      }),

    showSuccess: (content: ToastContent, props: ToastOptions = {}) =>
      toast.success(content, {
        icon: SuccessIcon,
        closeButton: CloseButton,
        ...props,
      }),
    showError: (content: ToastContent | unknown, props: ToastOptions = {}) => {
      let toastContent = displayError(content);
      if (typeof toastContent !== 'string') {
        toastContent = JSON.stringify(toastContent);
      }

      const body = <ToastBody content={toastContent as string} />;
      toast.error(body, {
        icon: ErrorIcon,
        closeButton: CloseButton,
        autoClose: false,
        ...props,
      });
    },
  };
};
